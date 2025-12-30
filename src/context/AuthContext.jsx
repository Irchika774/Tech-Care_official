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
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                loadUserProfile(session.user);
            }
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                await loadUserProfile(session.user);
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
                setProfile(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email, password) => {
        try {
            const { user: authUser } = await signIn(email, password);
            await loadUserProfile(authUser);

            const profileData = await getProfile(authUser.id);
            if (profileData.role === 'admin') {
                navigate('/admin');
            } else if (profileData.role === 'technician') {
                navigate('/technician-dashboard');
            } else {
                navigate('/customer-dashboard');
            }

            return { success: true };
        } catch (error) {
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
            supabase
        }}>
            {!loading && children}
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