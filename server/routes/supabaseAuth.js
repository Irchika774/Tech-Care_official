import express from 'express';
import { supabaseAdmin, getProfileByUserId, getCustomerByUserId, getTechnicianByUserId } from '../lib/supabase.js';
import { supabaseAuth } from '../middleware/supabaseAuth.js';
import { successResponse, errorResponse } from '../lib/response.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role = 'user' } = req.body;

        if (!name || !email || !password) {
            return errorResponse(res, 'Name, email, and password are required.', 400);
        }

        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { name, role }
        });

        if (authError) {
            return errorResponse(res, authError.message, 400);
        }

        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .insert({
                id: authData.user.id,
                email,
                name,
                role
            });

        if (profileError) {
            await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
            return errorResponse(res, 'Failed to create profile.', 500);
        }

        if (role === 'technician') {
            const { error: techError } = await supabaseAdmin
                .from('technicians')
                .insert({
                    user_id: authData.user.id,
                    name,
                    email,
                    phone: 'Not provided'
                });

            if (techError) {
                console.error('Technician profile creation error:', techError);
            }
        } else {
            const { error: custError } = await supabaseAdmin
                .from('customers')
                .insert({
                    user_id: authData.user.id,
                    name,
                    email
                });

            if (custError) {
                console.error('Customer profile creation error:', custError);
            }
        }

        // Generate magic link is optional here, we just confirmation-auto
        // res.status(201).json
        return successResponse(res, {
            user: {
                id: authData.user.id,
                email: authData.user.email,
                name,
                role
            }
        }, 'User registered successfully', 201);
    } catch (error) {
        console.error('Registration error:', error);
        return errorResponse(res, error.message);
    }
});

router.get('/me', supabaseAuth, async (req, res) => {
    try {
        const profile = await getProfileByUserId(req.user.id);

        let extendedProfile = null;
        if (profile.role === 'technician') {
            extendedProfile = await getTechnicianByUserId(req.user.id);
        } else if (profile.role === 'user' || profile.role === 'customer') {
            extendedProfile = await getCustomerByUserId(req.user.id);
        }

        return successResponse(res, {
            ...profile,
            _id: profile.id,
            extendedProfile
        });
    } catch (error) {
        console.error('Get user error:', error);
        return errorResponse(res, error.message);
    }
});

router.put('/profile', supabaseAuth, async (req, res) => {
    try {
        const updates = req.body;
        delete updates.id;
        delete updates.email;
        delete updates.role;

        const { data, error } = await supabaseAdmin
            .from('profiles')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', req.user.id)
            .select()
            .single();

        if (error) throw error;

        // Sync with role-specific tables
        if (req.user.role === 'technician') {
            await supabaseAdmin
                .from('technicians')
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('user_id', req.user.id);
        } else if (['user', 'customer'].includes(req.user.role)) {
            await supabaseAdmin
                .from('customers')
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('user_id', req.user.id);
        }

        return successResponse(res, data, 'Profile updated successfully');
    } catch (error) {
        console.error('Update profile error:', error);
        return errorResponse(res, error.message);
    }
});

router.get('/role', supabaseAuth, (req, res) => {
    return successResponse(res, { role: req.user.role });
});

export default router;
