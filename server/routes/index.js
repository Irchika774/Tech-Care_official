import express from 'express';
import { supabaseAdmin } from '../lib/supabase.js';
import { supabaseAuth } from '../middleware/supabaseAuth.js';

const router = express.Router();

router.get('/bookings', async (req, res) => {
    try {
        const { data: bookings, error } = await supabaseAdmin
            .from('bookings')
            .select(`
                *,
                customer:customers(id, name, email),
                technician:technicians(id, name, email, phone, rating)
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(bookings || []);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/bookings', async (req, res) => {
    try {
        const { data: booking, error } = await supabaseAdmin
            .from('bookings')
            .insert([req.body])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(booking);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/bookings/:id', async (req, res) => {
    try {
        const { data: booking, error } = await supabaseAdmin
            .from('bookings')
            .update(req.body)
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;
        res.json(booking);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.get('/users', supabaseAuth, async (req, res) => {
    // Only admins should see all users
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }
    try {
        const { data: users, error } = await supabaseAdmin
            .from('profiles')
            .select('*');

        if (error) throw error;
        res.json(users || []);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * @route   DELETE /api/users/me
 * @desc    Delete current user's account and all associated data
 * @access  Private
 */
router.delete('/users/me', supabaseAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        console.log(`[AUTH] Deleting account for user: ${userId}`);

        // 1. Delete technician record if exists (cascade should handle related items, but let's be safe)
        const { error: techError } = await supabaseAdmin.from('technicians').delete().eq('user_id', userId);
        if (techError) console.warn('Tech delete error:', techError);

        // 2. Delete customer record if exists
        const { error: custError } = await supabaseAdmin.from('customers').delete().eq('user_id', userId);
        if (custError) console.warn('Customer delete error:', custError);

        // 3. Delete profile
        const { error: profileError } = await supabaseAdmin.from('profiles').delete().eq('id', userId);
        if (profileError) console.warn('Profile delete error:', profileError);

        // 4. Delete Auth user via Admin API
        const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);

        if (authError) throw authError;

        res.json({ success: true, message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({ error: 'Failed to delete account from system' });
    }
});

router.get('/reviews', async (req, res) => {
    try {
        const { data: reviews, error } = await supabaseAdmin
            .from('reviews')
            .select(`
                *,
                customer:customers(id, name),
                technician:technicians(id, name)
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(reviews || []);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/reviews/:id', async (req, res) => {
    try {
        const { data: review, error } = await supabaseAdmin
            .from('reviews')
            .update(req.body)
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;
        res.json(review);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;