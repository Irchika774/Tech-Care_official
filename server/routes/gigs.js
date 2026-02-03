import express from 'express';
import { supabaseAdmin } from '../lib/supabase.js';
import { supabaseAuth } from '../middleware/supabaseAuth.js';
import { successResponse, errorResponse } from '../lib/response.js';

const router = express.Router();

// Get all approved gigs for marketplace
router.get('/approved', async (req, res) => {
    try {
        const { data: gigs, error } = await supabaseAdmin
            .from('gigs')
            .select(`
                *,
                technician:technicians(id, name, profile_image, rating, review_count, district)
            `)
            .eq('status', 'approved')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return successResponse(res, gigs || []);
    } catch (error) {
        console.error('Fetch approved gigs error:', error);
        return errorResponse(res, 'Failed to fetch marketplace services');
    }
});

// Place a bid on a gig
router.post('/:id/bid', supabaseAuth, async (req, res) => {
    try {
        const { amount, message } = req.body;
        const gigId = req.params.id;
        const userId = req.user.id;

        const { data: bid, error } = await supabaseAdmin
            .from('service_bids')
            .insert([{
                gig_id: gigId,
                user_id: userId,
                bid_amount: parseFloat(amount),
                message,
                status: 'pending',
                created_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) throw error;
        return successResponse(res, bid, 'Bid placed successfully', 201);
    } catch (error) {
        console.error('Place bid error:', error);
        return errorResponse(res, 'Failed to place bid');
    }
});

export default router;
