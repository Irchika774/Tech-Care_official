import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../../.env') });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabaseAdmin = null;

if (supabaseUrl && supabaseServiceKey) {
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
    console.log('✅ Supabase admin client initialized');
} else {
    console.warn('⚠️ Supabase credentials not found. Supabase features will be disabled.');
}

export { supabaseAdmin };

export const verifySupabaseToken = async (token) => {
    if (!supabaseAdmin) throw new Error('Supabase not configured');
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error) throw error;
    return user;
};

export const getProfileByUserId = async (userId) => {
    if (!supabaseAdmin) throw new Error('Supabase not configured');
    const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) throw error;
    return data;
};

export const getCustomerByUserId = async (userId) => {
    if (!supabaseAdmin) throw new Error('Supabase not configured');
    const { data, error } = await supabaseAdmin
        .from('customers')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
};

export const getTechnicianByUserId = async (userId) => {
    if (!supabaseAdmin) throw new Error('Supabase not configured');
    const { data, error } = await supabaseAdmin
        .from('technicians')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
};