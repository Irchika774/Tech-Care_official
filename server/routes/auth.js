import express from 'express';
import { supabaseAdmin } from '../lib/supabase.js';
import { logAuditTrail } from '../middleware/auditLogger.js';
import { successResponse, errorResponse } from '../lib/response.js';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (Supabase Auth + Profile)
 * @access  Public
 */
router.post('/register', logAuditTrail('USER_REGISTER'), async (req, res) => {
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
            return errorResponse(res, authError.message, 400);
        }

        const user = authData.user;

        // 2. Create Profile in 'profiles' table (and 'customers' if needed)
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
            return errorResponse(res, `Failed to create profile: ${profileError.message}`);
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
            return errorResponse(res, `Failed to create customer record: ${customerError.message}`);
        }

        return successResponse(res, { id: user.id, email: user.email, name, role }, 'User registered successfully. Please login.', 201);

    } catch (error) {
        console.error('Registration error:', error);
        return errorResponse(res, error.message);
    }
});

export default router;
