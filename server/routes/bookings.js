import express from 'express';
import { supabaseAdmin } from '../lib/supabase.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const {
            customer_id,
            technician_id,
            device_type,
            device_brand,
            device_model,
            issue_description,
            scheduled_date,
            estimated_cost
        } = req.body;

        const { data: booking, error } = await supabaseAdmin
            .from('bookings')
            .insert([{
                customer_id,
                technician_id: technician_id === 'pending' ? null : technician_id,
                device_type,
                device_brand,
                device_model,
                issue_description,
                scheduled_date,
                estimated_cost,
                status: 'pending',
                payment_status: 'pending'
            }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json(booking);
    } catch (error) {
        console.error('Booking creation error:', error);
        res.status(500).json({ error: 'Failed to create booking' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { data: booking, error } = await supabaseAdmin
            .from('bookings')
            .select(`
                *,
                customer:customers(id, name, email, phone),
                technician:technicians(id, name, email, phone, rating)
            `)
            .eq('id', req.params.id)
            .single();
        
        if (error) throw error;
        if (!booking) return res.status(404).json({ error: 'Booking not found' });
        
        const { data: bids } = await supabaseAdmin
            .from('bids')
            .select('*, technician:technicians!bids_technician_id_fkey(id, name, rating, review_count)')
            .eq('booking_id', req.params.id)
            .order('amount', { ascending: true });
        
        res.json({ booking, bids: bids || [] });
    } catch (error) {
        console.error('Booking fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch booking' });
    }
});

router.post('/:id/select-bid', async (req, res) => {
    try {
        const { bidId } = req.body;
        const bookingId = req.params.id;
        
        const { data: bid, error: bidError } = await supabaseAdmin
            .from('bids')
            .select('*')
            .eq('id', bidId)
            .single();
        
        if (bidError || !bid) {
            return res.status(404).json({ error: 'Bid not found' });
        }
        
        const { data: booking, error } = await supabaseAdmin
            .from('bookings')
            .update({
                technician_id: bid.technician_id,
                price: bid.amount,
                status: 'bid_accepted',
                updated_at: new Date().toISOString()
            })
            .eq('id', bookingId)
            .select()
            .single();
        
        if (error) throw error;
        
        await supabaseAdmin
            .from('bids')
            .update({ status: 'accepted' })
            .eq('id', bidId);
        
        await supabaseAdmin
            .from('bids')
            .update({ status: 'rejected' })
            .eq('booking_id', bookingId)
            .neq('id', bidId);
        
        await supabaseAdmin.from('notifications').insert([{
            user_id: bid.technician_id,
            title: 'Bid Accepted!',
            message: 'Your bid has been accepted by the customer.',
            type: 'bid_accepted',
            data: { booking_id: bookingId, bid_id: bidId }
        }]);
        
        res.json({ booking, message: 'Bid selected successfully' });
    } catch (error) {
        console.error('Select bid error:', error);
        res.status(500).json({ error: 'Failed to select bid' });
    }
});

router.post('/:id/review', async (req, res) => {
    try {
        const bookingId = req.params.id;
        const { rating, comment } = req.body;
        
        const { data: booking } = await supabaseAdmin
            .from('bookings')
            .select('*')
            .eq('id', bookingId)
            .single();
        
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        
        if (booking.status !== 'completed') {
            return res.status(400).json({ error: 'Can only review completed bookings' });
        }
        
        const { data: review, error } = await supabaseAdmin
            .from('reviews')
            .insert([{
                booking_id: bookingId,
                customer_id: booking.customer_id,
                technician_id: booking.technician_id,
                rating,
                comment
            }])
            .select()
            .single();
        
        if (error) throw error;
        
        if (booking.technician_id) {
            const { data: technician } = await supabaseAdmin
                .from('technicians')
                .select('review_count, rating, rating_5, rating_4, rating_3, rating_2, rating_1')
                .eq('id', booking.technician_id)
                .single();
            
            if (technician) {
                const ratingKey = `rating_${rating}`;
                const newReviewCount = (technician.review_count || 0) + 1;
                const newRatingCount = (technician[ratingKey] || 0) + 1;
                
                const total = 
                    ((technician.rating_5 || 0) + (rating === 5 ? 1 : 0)) * 5 +
                    ((technician.rating_4 || 0) + (rating === 4 ? 1 : 0)) * 4 +
                    ((technician.rating_3 || 0) + (rating === 3 ? 1 : 0)) * 3 +
                    ((technician.rating_2 || 0) + (rating === 2 ? 1 : 0)) * 2 +
                    ((technician.rating_1 || 0) + (rating === 1 ? 1 : 0)) * 1;
                
                const newRating = total / newReviewCount;
                
                await supabaseAdmin
                    .from('technicians')
                    .update({
                        review_count: newReviewCount,
                        rating: newRating.toFixed(1),
                        [ratingKey]: newRatingCount
                    })
                    .eq('id', booking.technician_id);
                
                await supabaseAdmin.from('notifications').insert([{
                    user_id: booking.technician_id,
                    title: 'New Review',
                    message: `You received a ${rating}-star review.`,
                    type: 'review_received',
                    data: { booking_id: bookingId }
                }]);
            }
        }
        
        res.status(201).json({ review, message: 'Review submitted successfully' });
    } catch (error) {
        console.error('Review submission error:', error);
        res.status(500).json({ error: 'Failed to submit review' });
    }
});

export default router;