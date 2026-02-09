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

    // Check if user already exists in profiles
    const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', email.toLowerCase())
        .single();

    if (existingProfile) {
        throw new Error('An account with this email already exists');
    }

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
        // Use upsert to prevent duplicates on concurrent registrations
        const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
                id: authData.user.id,
                email: email.toLowerCase(),
                name,
                role,
                created_at: new Date().toISOString()
            }, { onConflict: 'id', ignoreDuplicates: false });

        if (profileError && !profileError.message.includes('duplicate key')) {
            throw profileError;
        }

        if (role === 'technician') {
            // Check if technician record already exists
            const { data: existingTech } = await supabase
                .from('technicians')
                .select('id')
                .eq('user_id', authData.user.id)
                .single();

            if (!existingTech) {
                const { error: techError } = await supabase
                    .from('technicians')
                    .upsert({
                        user_id: authData.user.id,
                        name,
                        email: email.toLowerCase(),
                        phone: 'Not provided',
                        created_at: new Date().toISOString()
                    }, { onConflict: 'user_id', ignoreDuplicates: false });

                if (techError && !techError.message.includes('duplicate key')) {
                    throw techError;
                }
            }
        } else {
            // Check if customer record already exists
            const { data: existingCust } = await supabase
                .from('customers')
                .select('id')
                .eq('user_id', authData.user.id)
                .single();

            if (!existingCust) {
                const { error: custError } = await supabase
                    .from('customers')
                    .upsert({
                        user_id: authData.user.id,
                        name,
                        email: email.toLowerCase(),
                        created_at: new Date().toISOString()
                    }, { onConflict: 'user_id', ignoreDuplicates: false });

                if (custError && !custError.message.includes('duplicate key')) {
                    throw custError;
                }
            }
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

// Helper to wrap Supabase calls with a timeout for better UI control
// Reduced to 12s for better UX - fallbacks should trigger faster on slow networks
const withTimeout = (promise, name = 'Request', timeoutMs = 12000) => {
    return Promise.race([
        promise,
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error(`${name} timed out after ${timeoutMs}ms`)), timeoutMs)
        )
    ]);
};

export const getProfile = async (userId) => {
    try {
        console.log(`[DB] Fetching profile for ${userId}...`);
        const { data, error } = await withTimeout(
            supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single(),
            'getProfile'
        );

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    } catch (err) {
        // Only log critical errors, not timeouts
        if (err.message && !err.message.includes('timed out')) {
            console.error('getProfile error:', err.message);
        } else {
            console.log(`[DEBUG] Profile fetch timed out for user ${userId} - using fallback`);
        }
        return null;
    }
};

export const getCustomerProfile = async (userId) => {
    try {
        console.log(`[DB] Fetching customer profile for ${userId}...`);
        const { data, error } = await withTimeout(
            supabase
                .from('customers')
                .select('*')
                .eq('user_id', userId)
                .single(),
            'getCustomerProfile'
        );

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    } catch (err) {
        if (err.message && !err.message.includes('timed out')) {
            console.error('getCustomerProfile error:', err.message);
        } else {
            console.log(`[DEBUG] Customer profile fetch timed out for user ${userId} - using fallback`);
        }
        return null;
    }
};

export const getTechnicianProfile = async (userId) => {
    try {
        console.log(`[DB] Fetching technician profile for ${userId}...`);
        const { data, error } = await withTimeout(
            supabase
                .from('technicians')
                .select('*')
                .eq('user_id', userId)
                .single(),
            'getTechnicianProfile'
        );

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    } catch (err) {
        if (err.message && !err.message.includes('timed out')) {
            console.error('getTechnicianProfile error:', err.message);
        } else {
            // Debug log only for timeout
            // console.warn('Technician profile fetch timed out');
        }
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
