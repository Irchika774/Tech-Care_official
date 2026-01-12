import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, signIn, signOut, getProfile, getCustomerProfile, getTechnicianProfile } from '../lib/supabase';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);
    const navigate = useNavigate();

    const isMounted = useRef(true);

    const loadUserProfile = async (authUser) => {
        if (!authUser) return;

        // Prevent redundant loads if we already have the profile and it's for this user
        if (profile?.id === authUser.id && user?.extendedProfile) {
            console.log('[DEBUG] loadUserProfile skipped: Profile already fresh');
            return;
        }

        try {
            console.log('[DEBUG] loadUserProfile started for:', authUser.id);

            // Fetch profile and extended profile in parallel for performance
            // Use a shorter timeout for profile loading to avoid blocking UI
            const profilePromise = getProfile(authUser.id);
            const role = authUser.user_metadata?.role || 'user';

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

            // If profile is null (race condition or new user), try to construct from metadata
            const finalProfile = profileData || {
                id: authUser.id,
                role: role,
                name: authUser.user_metadata?.name || authUser.email
            };

            if (isMounted.current) {
                setProfile(finalProfile);

                setUser({
                    ...authUser,
                    ...finalProfile,
                    extendedProfile,
                    _id: authUser.id
                });
            }
            console.log('[DEBUG] loadUserProfile finished successfully');
        } catch (error) {
            console.error('Error loading profile:', error);
            // Fallback to basic info from metadata
            if (isMounted.current) {
                const fallbackRole = authUser.user_metadata?.role || 'user';
                setUser({
                    ...authUser,
                    _id: authUser.id,
                    role: fallbackRole,
                    name: authUser.user_metadata?.name || authUser.email
                });
            }
        }
    };

    useEffect(() => {
        isMounted.current = true;

        const initializeAuth = async () => {
            // Reduced timeout to 3s to prevent long waits on slow connections, but show UI sooner
            const timeoutId = setTimeout(() => {
                if (isMounted && loading) {
                    console.warn('[AUTH] Initialization timed out, forcing loading to false to show UI');
                    setLoading(false);
                }
            }, 3000);

            try {
                console.log('[DEBUG] initializeAuth started');

                // Get session immediately from local storage if possible
                const { data: { session: currentSession }, error } = await supabase.auth.getSession();

                if (error) {
                    console.error('Session error:', error);
                    if (isMounted) setLoading(false);
                    return;
                }

                if (currentSession && isMounted) {
                    console.log('[DEBUG] Session found, user:', currentSession.user.id);
                    setSession(currentSession);

                    // Set basic user info immediately for faster UI
                    const authUser = currentSession.user;
                    setUser({
                        ...authUser,
                        _id: authUser.id,
                        role: authUser.user_metadata?.role || 'user',
                        name: authUser.user_metadata?.name || authUser.email
                    });

                    // Load full profile in background without blocking
                    loadUserProfile(authUser);
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
            if (isMounted) setSession(currentSession);

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
            } else if ((event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED' || event === 'INITIAL_SESSION') && currentSession?.user) {
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