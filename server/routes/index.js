import express from 'express';
import { supabaseAdmin } from '../lib/supabase.js';
import { supabaseAuth } from '../middleware/supabaseAuth.js';
import { successResponse, errorResponse } from '../lib/response.js';

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
        return successResponse(res, bookings || []);
    } catch (err) {
        console.error('Fetch bookings error:', err);
        return errorResponse(res, err.message);
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
        return successResponse(res, booking, 'Booking created successfully', 201);
    } catch (err) {
        console.error('Create booking error:', err);
        return errorResponse(res, err.message, 400);
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
        return successResponse(res, booking, 'Booking updated successfully');
    } catch (err) {
        console.error('Update booking error:', err);
        return errorResponse(res, err.message, 400);
    }
});

router.get('/users', supabaseAuth, async (req, res) => {
    // Only admins should see all users
    if (req.user.role !== 'admin') {
        return errorResponse(res, 'Access denied', 403);
    }
    try {
        const { data: users, error } = await supabaseAdmin
            .from('profiles')
            .select('*');

        if (error) throw error;
        return successResponse(res, users || []);
    } catch (err) {
        console.error('Fetch users error:', err);
        return errorResponse(res, err.message);
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

        return successResponse(res, null, 'Account deleted successfully');
    } catch (error) {
        console.error('Delete account error:', error);
        return errorResponse(res, 'Failed to delete account from system');
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
        return successResponse(res, reviews || []);
    } catch (err) {
        console.error('Fetch reviews error:', err);
        return errorResponse(res, err.message);
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
        return successResponse(res, review, 'Review updated successfully');
    } catch (err) {
        console.error('Update review error:', err);
        return errorResponse(res, err.message, 400);
    }
});

export default router;