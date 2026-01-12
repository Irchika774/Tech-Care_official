import express from 'express';
import { supabaseAdmin } from '../lib/supabase.js';
import { supabaseAuth } from '../middleware/supabaseAuth.js';

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
        res.json(gigs || []);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch marketplace services' });
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
        res.status(201).json(bid);
    } catch (error) {
        res.status(500).json({ error: 'Failed to place bid' });
    }
});

export default router;
