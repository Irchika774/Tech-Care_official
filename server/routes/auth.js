import express from 'express';
import { supabaseAdmin } from '../lib/supabase.js';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (Supabase Auth + Profile)
 * @access  Public
 */
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Force 'user' role for public registration. 
        // Technicians must be created by Admin or via specific onboarding flow.
        const role = 'user';

        // 1. Create User in Supabase Auth
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // Auto-confirm for now (or false if you want emails)
            user_metadata: { name, role }
        });

        if (authError) {
            console.error('Supabase Auth Create Error:', authError);
            return res.status(400).json({ error: authError.message });
        }

        const user = authData.user;

        // 2. Create Profile in 'profiles' table (and 'customers' if needed)
        // Note: If you have a Trigger on auth.users, this might duplicate or fail.
        // We assume NO Trigger for now, or we handle conflict.

        // Profile
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .insert([{
                id: user.id, // Link to Auth ID
                email: user.email,
                name: name,
                role: role,
                created_at: new Date().toISOString()
            }]);

        if (profileError) {
            // Rollback Auth User if profile fails
            await supabaseAdmin.auth.admin.deleteUser(user.id);
            console.error('Profile Create Error:', profileError);
            throw new Error(`Failed to create profile: ${profileError.message}`);
        }

        // Customer Record (since role is 'user')
        const { error: customerError } = await supabaseAdmin
            .from('customers')
            .insert([{
                user_id: user.id,
                email: user.email,
                name: name,
                created_at: new Date().toISOString()
            }]);

        if (customerError) {
            // Rollback everything
            await supabaseAdmin.from('profiles').delete().eq('id', user.id);
            await supabaseAdmin.auth.admin.deleteUser(user.id);
            console.error('Customer Create Error:', customerError);
            throw new Error(`Failed to create customer record: ${customerError.message}`);
        }

        res.status(201).json({
            success: true,
            message: 'User registered successfully. Please login.',
            user: { id: user.id, email: user.email, name, role }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
