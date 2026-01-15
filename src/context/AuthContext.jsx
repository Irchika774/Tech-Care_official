import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, signIn, signUp, signOut, getProfile, getCustomerProfile, getTechnicianProfile } from '../lib/supabase';
import realtimeService from '../utils/realtimeService';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);
    const navigate = useNavigate();

    const isMounted = useRef(true);
    const isFetchingProfile = useRef(false);

    const loadUserProfile = async (authUser) => {
        if (!authUser) return;

        // Prevent redundant loads if we already have the profile and it's for this user
        if (profile?.id === authUser.id && user?.extendedProfile && !isFetchingProfile.current) {
            // Check if we really need to update. If it's a "fresh" load but data is there, maybe skip?
            // But if it's a USER_UPDATED event, we SHOULD reload. 
            // We rely on the caller to know.
            // However, to stop loops, we can check a timestamp or similar.
            // For now, let's just log and proceed if we are not fetching.
        }

        // Prevent concurrent fetches
        if (isFetchingProfile.current) {
            console.log('[DEBUG] loadUserProfile skipped: Already fetching');
            return;
        }

        try {
            isFetchingProfile.current = true;
            console.log('[DEBUG] loadUserProfile started for:', authUser.id);

            // Fetch profile and extended profile in parallel for performance
            const role = authUser.user_metadata?.role || 'user';
            const profilePromise = getProfile(authUser.id);

            let extendedProfilePromise = Promise.resolve(null);
            if (role === 'technician') {
                extendedProfilePromise = getTechnicianProfile(authUser.id);
            } else if (role === 'user' || role === 'customer') {
                extendedProfilePromise = getCustomerProfile(authUser.id);
            }

            const [profileData, extendedProfile] = await Promise.all([
                profilePromise,
                extendedProfilePromise
            ]);

            const finalProfile = profileData || {
                id: authUser.id,
                role: role,
                name: authUser.user_metadata?.name || authUser.email
            };

            if (isMounted.current) {
                setProfile(finalProfile);

                // Cache profile
                localStorage.setItem(`user_profile_${authUser.id}`, JSON.stringify({
                    profile: finalProfile,
                    extendedProfile,
                    timestamp: Date.now()
                }));

                // Only update user state if it actually changed to prevent re-renders
                setUser(prev => {
                    const newUser = {
                        ...authUser,
                        ...finalProfile,
                        extendedProfile,
                        _id: authUser.id
                    };
                    // Simple check to avoid object identity change if possible (optimization)
                    if (prev && prev._id === newUser._id && JSON.stringify(prev) === JSON.stringify(newUser)) {
                        return prev;
                    }
                    return newUser;
                });
            }
            console.log('[DEBUG] loadUserProfile finished successfully');
        } catch (error) {
            console.error('Error loading profile:', error);
            // ... (keep existing cache fallback logic)
            const cached = localStorage.getItem(`user_profile_${authUser.id}`);
            if (cached) {
                try {
                    const { profile: cachedProfile, extendedProfile: cachedExtended } = JSON.parse(cached);
                    if (isMounted.current) {
                        setProfile(cachedProfile);
                        setUser(prev => ({
                            ...authUser,
                            ...cachedProfile,
                            extendedProfile: cachedExtended,
                            _id: authUser.id
                        }));
                        return;
                    }
                } catch (e) { /* ignore */ }
            }

            if (isMounted.current) {
                const fallbackRole = authUser.user_metadata?.role || 'user';
                setUser(prev => ({
                    ...authUser,
                    _id: authUser.id,
                    role: fallbackRole,
                    name: authUser.user_metadata?.name || authUser.email
                }));
            }
        } finally {
            isFetchingProfile.current = false;
        }
    };

    useEffect(() => {
        isMounted.current = true;

        const initializeAuth = async () => {
            // Reduced timeout to 5s to prevent long waits on slow connections
            const timeoutId = setTimeout(() => {
                if (isMounted && loading) {
                    console.warn('[AUTH] Initialization hanging, showing UI with best-effort data');
                    setLoading(false);
                }
            }, 5000);

            try {
                // Get session immediately
                const { data: { session: currentSession }, error } = await supabase.auth.getSession();

                if (error) {
                    console.error('Session error:', error);
                    if (isMounted) setLoading(false);
                    return;
                }

                if (currentSession && isMounted) {
                    setSession(currentSession);

                    // OPTIMIZATION: Try to load profile from cache IMMEDIATELY for instant UI
                    const cached = localStorage.getItem(`user_profile_${currentSession.user.id}`);
                    if (cached) {
                        try {
                            const { profile: cachedProfile, extendedProfile: cachedExtended } = JSON.parse(cached);
                            console.log('[DEBUG] Loaded profile from cache (Instant UI)');
                            setProfile(cachedProfile);
                            setUser({
                                ...currentSession.user,
                                ...cachedProfile,
                                extendedProfile: cachedExtended,
                                _id: currentSession.user.id
                            });
                        } catch (e) { /* ignore invalid cache */ }
                    } else {
                        // Set basic user info if no cache
                        const authUser = currentSession.user;
                        setUser({
                            ...authUser,
                            _id: authUser.id,
                            role: authUser.user_metadata?.role || 'user',
                            name: authUser.user_metadata?.name || authUser.email
                        });
                    }

                    // Load fresh profile in background
                    loadUserProfile(currentSession.user);
                } else {
                    console.log('[DEBUG] No session found in getSession');
                }
            } catch (error) {
                console.error('Auth initialization error:', error.message);
            } finally {
                clearTimeout(timeoutId);
                if (isMounted) {
                    console.log('[DEBUG] initializeAuth finished');
                    setLoading(false);
                }
            }
        };

        initializeAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
            console.log('Auth event:', event);
            if (isMounted.current) setSession(currentSession);

            if (event === 'SIGNED_IN' && currentSession?.user) {
                // Set user immediately for faster UI update
                setUser(prev => prev || {
                    ...currentSession.user,
                    _id: currentSession.user.id,
                    role: currentSession.user.user_metadata?.role || 'user',
                    name: currentSession.user.user_metadata?.name || currentSession.user.email
                });
                await loadUserProfile(currentSession.user);
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
                setProfile(null);
                setSession(null);
                try { realtimeService.unsubscribeAll(); } catch (e) { console.error(e); }
            } else if (event === 'TOKEN_REFRESHED' && currentSession?.user) {
                // Update session first
                if (isMounted.current) {
                    setSession(currentSession);
                }
                console.log('[AUTH] Token refreshed');
                // We typically don't need to reload profile on token refresh unless claims changed
                // await loadUserProfile(currentSession.user); 
                realtimeService.refreshAllConnections();
            } else if (event === 'USER_UPDATED' && currentSession?.user) {
                await loadUserProfile(currentSession.user);
            }
        });

        return () => {
            isMounted.current = false;
            subscription.unsubscribe();
        };

    }, []);

    const login = async (email, password) => {
        try {
            setLoading(true);
            const { user: authUser } = await signIn(email, password);

            // Set basic user info immediately for faster UI response
            setUser({
                ...authUser,
                _id: authUser.id,
                role: authUser.user_metadata?.role || 'user',
                name: authUser.user_metadata?.name || authUser.email
            });

            // Load full profile in background
            loadUserProfile(authUser).finally(() => setLoading(false));

            // Navigate based on role from metadata (immediate, no wait)
            const role = authUser.user_metadata?.role || 'user';
            if (role === 'admin') {
                navigate('/admin');
            } else if (role === 'technician') {
                navigate('/technician-dashboard');
            } else {
                navigate('/customer-dashboard');
            }

            return { success: true };
        } catch (error) {
            setLoading(false);
            return {
                success: false,
                error: error.message || 'Login failed. Please try again.'
            };
        }
    };

    const register = async (name, email, password, role = 'user') => {
        try {
            // Use Supabase Client SDK for registration (Bypasses potential backend network issues)
            const result = await signUp(email, password, name, role);

            // Supabase signUp might not return a session immediately if email confirmation is enabled.
            // But if it succeeds without error, we consider it a success.
            return {
                success: true,
                message: 'Registration successful! ' + (result?.session ? 'You are now logged in.' : 'Please check your email to confirm your account.')
            };
        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                error: error.message || 'Registration failed. Please try again.'
            };
        }
    };

    const logout = async () => {
        try {
            console.log('[DEBUG] Logging out...');
            await signOut();
            setUser(null);
            setProfile(null);
            setSession(null);
            // Clear any local storage if needed
            localStorage.removeItem('supabase.auth.token');
            console.log('[DEBUG] Logout successful, redirecting...');
            // Force reload to clear all state and redirect to home
            window.location.assign('/');
        } catch (error) {
            console.error('Logout error:', error);
            window.location.assign('/');
        }
    };

    const refreshUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            await loadUserProfile(session.user);
        }
    };

    const hasRole = (requiredRole) => {
        if (!user) return false;
        if (Array.isArray(requiredRole)) {
            return requiredRole.includes(user.role);
        }
        return user.role === requiredRole;
    };

    const isAdmin = () => hasRole('admin');
    const isTechnician = () => hasRole('technician');
    const isCustomer = () => hasRole(['user', 'customer']);
    const isAuthenticated = () => !!user;

    return (
        <AuthContext.Provider value={{
            user,
            profile,
            login,
            register,
            logout,
            loading,
            session,
            hasRole,
            isAdmin,
            isTechnician,
            isCustomer,
            isAuthenticated,
            supabase
        }}>
            {loading ? (
                <div className="min-h-screen flex items-center justify-center bg-background">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        <p className="mt-4 text-muted-foreground">Loading...</p>
                    </div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};