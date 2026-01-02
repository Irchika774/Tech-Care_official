import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, signIn, signUp, signOut, getProfile, getCustomerProfile, getTechnicianProfile } from '../lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const loadUserProfile = async (authUser) => {
        try {
            const profileData = await getProfile(authUser.id);
            setProfile(profileData);

            let extendedProfile = null;
            if (profileData.role === 'technician') {
                extendedProfile = await getTechnicianProfile(authUser.id);
            } else if (profileData.role === 'user' || profileData.role === 'customer') {
                extendedProfile = await getCustomerProfile(authUser.id);
            }

            setUser({
                ...authUser,
                ...profileData,
                extendedProfile,
                _id: authUser.id
            });
        } catch (error) {
            console.error('Error loading profile:', error);
            setUser({
                ...authUser,
                _id: authUser.id,
                role: authUser.user_metadata?.role || 'user',
                name: authUser.user_metadata?.name || authUser.email
            });
        }
    };

    useEffect(() => {
        let isMounted = true;

        const initializeAuth = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) {
                    console.error('Session error:', error);
                    if (isMounted) setLoading(false);
                    return;
                }

                if (session?.user && isMounted) {
                    await loadUserProfile(session.user);
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        // Set a timeout fallback to ensure loading never gets stuck
        const timeout = setTimeout(() => {
            if (isMounted) {
                console.warn('Auth initialization timeout - forcing loading state to false');
                setLoading(false);
            }
        }, 5000);

        initializeAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth event:', event);

            if (event === 'SIGNED_IN' && session?.user) {
                // Set user immediately for faster UI update
                setUser({
                    ...session.user,
                    _id: session.user.id,
                    role: session.user.user_metadata?.role || 'user',
                    name: session.user.user_metadata?.name || session.user.email
                });
                // Then load full profile
                loadUserProfile(session.user);
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
                setProfile(null);
            } else if (event === 'TOKEN_REFRESHED' && session?.user) {
                // Update user on token refresh
                if (!user) {
                    await loadUserProfile(session.user);
                }
            } else if (event === 'USER_UPDATED' && session?.user) {
                // Handle email confirmation or profile updates
                await loadUserProfile(session.user);
            }
        });

        return () => {
            isMounted = false;
            clearTimeout(timeout);
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
            await signUp(email, password, name, role);
            navigate('/login');
            return { success: true, message: 'Registration successful! Please login with your credentials.' };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Registration failed. Please try again.'
            };
        }
    };

    const logout = async () => {
        try {
            await signOut();
            setUser(null);
            setProfile(null);
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
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