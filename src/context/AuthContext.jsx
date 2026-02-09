import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
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
    const lastFetchedUserId = useRef(null);
    const lastFetchTime = useRef(0);
    const initialLoadStarted = useRef(false);
    const authInitialized = useRef(false);

    const loadUserProfile = useCallback(async (authUser, forceRefresh = false, source = 'unknown') => {
        if (!authUser) return;

        const now = Date.now();
        const timeSinceLastFetch = now - lastFetchTime.current;

        if (!forceRefresh && lastFetchedUserId.current === authUser.id && timeSinceLastFetch < 10000) {
            console.log(`[DEBUG] loadUserProfile skipped (${source}): Recent fetch for ${authUser.id}`);
            return;
        }

        if (isFetchingProfile.current) {
            console.log(`[DEBUG] loadUserProfile skipped (${source}): Already fetching`);
            return;
        }

        try {
            isFetchingProfile.current = true;
            lastFetchedUserId.current = authUser.id;
            lastFetchTime.current = now;
            console.log(`[DEBUG] loadUserProfile started (${source}) for:`, authUser.id);

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

                localStorage.setItem(`user_profile_${authUser.id}`, JSON.stringify({
                    profile: finalProfile,
                    extendedProfile,
                    timestamp: Date.now()
                }));

                setUser(prev => {
                    const newUser = {
                        ...authUser,
                        ...finalProfile,
                        extendedProfile,
                        _id: authUser.id
                    };

                    // Stabilize user object to prevent unnecessary re-renders
                    if (prev && prev.id === newUser.id &&
                        prev.role === newUser.role &&
                        JSON.stringify(prev.extendedProfile) === JSON.stringify(newUser.extendedProfile)) {
                        return prev;
                    }
                    return newUser;
                });
            }
            console.log(`[DEBUG] loadUserProfile finished successfully (${source})`);
        } catch (error) {
            console.error(`[AUTH] Profile load error (${source}):`, error);
            // ... fallback logic remains similar but encapsulated ...
            if (isMounted.current) {
                const cached = localStorage.getItem(`user_profile_${authUser.id}`);
                if (cached) {
                    try {
                        const { profile: cachedProfile, extendedProfile: cachedExtended } = JSON.parse(cached);
                        setProfile(cachedProfile);
                        setUser(prev => ({
                            ...authUser,
                            ...cachedProfile,
                            extendedProfile: cachedExtended,
                            _id: authUser.id
                        }));
                        return;
                    } catch (e) { }
                }

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
    }, []);

    useEffect(() => {
        isMounted.current = true;

        const initializeAuth = async () => {
            if (initialLoadStarted.current) return;
            initialLoadStarted.current = true;

            const perfTimer = setTimeout(() => {
                if (isMounted.current && loading) {
                    console.warn('[PERF] Auth initialization is taking longer than expected.');
                }
            }, 5000);

            try {
                console.log('[DEBUG] initializeAuth started');
                const { data: { session: currentSession }, error } = await supabase.auth.getSession();

                if (error) {
                    // Handle 400 errors and other auth errors gracefully
                    if (error.status === 400) {
                        console.warn('[AUTH] Token refresh failed (400), but continuing with existing session if available');
                        // Don't throw - allow the app to continue with cached session or proceed to login
                    } else {
                        throw error;
                    }
                }

                if (currentSession && isMounted.current) {
                    console.log('[DEBUG] Session found on init:', currentSession.user.id);
                    setSession(currentSession);

                    const cached = localStorage.getItem(`user_profile_${currentSession.user.id}`);
                    if (cached) {
                        try {
                            const { profile: cachedProfile, extendedProfile: cachedExtended } = JSON.parse(cached);
                            console.log('[DEBUG] Using cached profile for instant UI');
                            setProfile(cachedProfile);
                            setUser({
                                ...currentSession.user,
                                ...cachedProfile,
                                extendedProfile: cachedExtended,
                                _id: currentSession.user.id
                            });
                        } catch (e) { }
                    } else {
                        // Set basic info if no cache
                        setUser({
                            ...currentSession.user,
                            _id: currentSession.user.id,
                            role: currentSession.user.user_metadata?.role || 'user'
                        });
                    }

                    // Background fetch
                    loadUserProfile(currentSession.user, false, 'init');
                }
            } catch (error) {
                console.error('[AUTH] Init error:', error.message);
                // Don't set loading to false on error - let the auth state change handler handle it
                // This ensures the app doesn't get stuck in a loading state
            } finally {
                clearTimeout(perfTimer);
                if (isMounted.current) {
                    setLoading(false);
                    authInitialized.current = true;
                    console.log('[DEBUG] initializeAuth finished');
                }
            }
        };

        initializeAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
            console.log('Auth event:', event);
            if (isMounted.current) setSession(currentSession);

            if (event === 'INITIAL_SESSION') {
                return;
            }

            if (event === 'SIGNED_IN' && currentSession?.user) {
                console.log('[AUTH] SIGNED_IN event for:', currentSession.user.id);

                // If we're already initialized and it's the same user, skip redundant fetch
                if (authInitialized.current && lastFetchedUserId.current === currentSession.user.id) {
                    console.debug('[AUTH] Skipping redundant signed_in event during/after init');
                    return;
                }

                if (isMounted.current) {
                    setUser(prev => {
                        if (prev && prev.id === currentSession.user.id) return prev;
                        return {
                            ...currentSession.user,
                            _id: currentSession.user.id,
                            role: currentSession.user.user_metadata?.role || 'user',
                            name: currentSession.user.user_metadata?.name || currentSession.user.email
                        };
                    });
                    loadUserProfile(currentSession.user, false, 'event');
                }
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
                setProfile(null);
                setSession(null);
                lastFetchedUserId.current = null;
                lastFetchTime.current = 0;
                localStorage.removeItem('user_profile_cache_v1'); // Clear any legacy cache
                try { realtimeService.unsubscribeAll(); } catch (e) { }
            } else if (event === 'TOKEN_REFRESHED' && currentSession?.user) {
                if (isMounted.current) {
                    setSession(currentSession);
                }
                console.log('[AUTH] Token refreshed');
                realtimeService.refreshAllConnections();
            } else if (event === 'USER_UPDATED' && currentSession?.user) {
                await loadUserProfile(currentSession.user, true, 'update');
            }
        });

        return () => {
            isMounted.current = false;
            subscription.unsubscribe();
        };

    }, [loadUserProfile]);

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
            // Handle 400 errors specifically - these are often token refresh issues that don't block login
            if (error.status === 400) {
                console.warn('[AUTH] Login encountered 400 error (token refresh issue), but login may still succeed');
                return {
                    success: false,
                    error: 'Authentication error. Please try again.'
                };
            }
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
            refreshUser,
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