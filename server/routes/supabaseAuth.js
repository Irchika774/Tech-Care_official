import express from 'express';
import { supabaseAdmin, getProfileByUserId, getCustomerByUserId, getTechnicianByUserId } from '../lib/supabase.js';
import { supabaseAuth } from '../middleware/supabaseAuth.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role = 'user' } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required.' });
        }

        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { name, role }
        });

        if (authError) {
            return res.status(400).json({ error: authError.message });
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
            return res.status(500).json({ error: 'Failed to create profile.' });
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

        const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
            type: 'magiclink',
            email
        });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: authData.user.id,
                email: authData.user.email,
                name,
                role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: error.message });
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

        res.json({
            ...profile,
            _id: profile.id,
            extendedProfile
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: error.message });
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

        res.json(data);
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/role', supabaseAuth, (req, res) => {
    res.json({ role: req.user.role });
});

export default router;
