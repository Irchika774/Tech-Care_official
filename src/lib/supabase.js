import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const signUp = async (email, password, name, role = 'user') => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { name, role }
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

export const getProfile = async (userId) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) throw error;
    return data;
};

export const getCustomerProfile = async (userId) => {
    const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
};

export const getTechnicianProfile = async (userId) => {
    const { data, error } = await supabase
        .from('technicians')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
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
