import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const signUp = async (email, password, name, role = 'user') => {
    // Determine redirect URL based on environment
    const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
    const redirectUrl = role === 'technician'
        ? `${siteUrl}/technician-dashboard`
        : `${siteUrl}/customer-dashboard`;

    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { name, role },
            emailRedirectTo: redirectUrl
        }
    });

    if (authError) throw authError;

    if (authData.user) {
        const { error: profileError } = await supabase
            .from('profiles')
            .insert({
                id: authData.user.id,
                email,
                name,
                role
            });

        if (profileError) throw profileError;

        if (role === 'technician') {
            const { error: techError } = await supabase
                .from('technicians')
                .insert({
                    user_id: authData.user.id,
                    name,
                    email,
                    phone: 'Not provided'
                });
            if (techError) throw techError;
        } else {
            const { error: custError } = await supabase
                .from('customers')
                .insert({
                    user_id: authData.user.id,
                    name,
                    email
                });
            if (custError) throw custError;
        }
    }

    return authData;
};

export const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) throw error;

    // Return immediately - let AuthContext handle profile loading
    return data;
};

export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};

export const getCurrentUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
};

// Helper to wrap Supabase calls with a timeout
const withTimeout = (promise, timeoutMs = 30000) => {
    return Promise.race([
        promise,
        new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Database request timed out')), timeoutMs)
        )
    ]);
};

export const getProfile = async (userId) => {
    try {
        const { data, error } = await withTimeout(
            supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single()
        );

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    } catch (err) {
        console.error('getProfile error:', err.message);
        return null;
    }
};

export const getCustomerProfile = async (userId) => {
    try {
        const { data, error } = await withTimeout(
            supabase
                .from('customers')
                .select('*')
                .eq('user_id', userId)
                .single()
        );

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    } catch (err) {
        console.error('getCustomerProfile error:', err.message);
        return null;
    }
};

export const getTechnicianProfile = async (userId) => {
    try {
        const { data, error } = await withTimeout(
            supabase
                .from('technicians')
                .select('*')
                .eq('user_id', userId)
                .single()
        );

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    } catch (err) {
        console.error('getTechnicianProfile error:', err.message);
        return null;
    }
};

export const updateProfile = async (userId, updates) => {
    const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const updateCustomerProfile = async (userId, updates) => {
    const { data, error } = await supabase
        .from('customers')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const updateTechnicianProfile = async (userId, updates) => {
    const { data, error } = await supabase
        .from('technicians')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .select()
        .single();

    if (error) throw error;
    return data;
};
