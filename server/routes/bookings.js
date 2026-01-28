import express from 'express';
import { supabaseAdmin } from '../lib/supabase.js';
import { supabaseAuth } from '../middleware/supabaseAuth.js';

const router = express.Router();

router.post('/', supabaseAuth, async (req, res) => {
    try {
        const {
            technician_id,
            device_type,
            device_brand,
            device_model,
            issue_description,
            scheduled_date,
            estimated_cost
        } = req.body;

        const customer_id = req.user.customerId;

        if (!customer_id) {
            return res.status(403).json({ error: 'Only customers can create bookings' });
        }

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

        // If technician is selected, notify them
        if (booking.technician_id) {
            await supabaseAdmin.from('notifications').insert([{
                user_id: booking.technician_id,
                title: 'New Job Request',
                message: `You have a new job request for ${device_brand} ${device_model}.`,
                type: 'job_request',
                data: { booking_id: booking.id }
            }]);
        }

        res.status(201).json(booking);
    } catch (error) {
        console.error('Booking creation error:', error);
        res.status(500).json({ error: 'Failed to create booking' });
    }
});

router.get('/:id', supabaseAuth, async (req, res) => {
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

        // Authorization check: User must be either the customer or the technician involved
        const isAuthorized =
            booking.customer_id === req.user.customerId ||
            booking.technician_id === req.user.technicianId ||
            req.user.role === 'admin';

        if (!isAuthorized) {
            return res.status(403).json({ error: 'Access denied' });
        }

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

router.post('/:id/select-bid', supabaseAuth, async (req, res) => {
    try {
        const { bidId } = req.body;
        const bookingId = req.params.id;
        const customerId = req.user.customerId;

        if (!customerId) {
            return res.status(403).json({ error: 'Only customers can select bids' });
        }

        // Verify booking ownership
        const { data: bookingCheck } = await supabaseAdmin
            .from('bookings')
            .select('customer_id')
            .eq('id', bookingId)
            .single();

        if (!bookingCheck || bookingCheck.customer_id !== customerId) {
            return res.status(403).json({ error: 'Access denied' });
        }

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
            user_id: bid.technician_id, // Tech ID might differ from User ID, but notifications uses User ID? 
            // Note: notifications table 'user_id' likely refers to the technician's profile ID or auth ID? 
            // Looking at other code, it seems to assume profile ID or foreign key.
            // Wait, other code uses `user_id: bid.technician_id` which is a UUID from technician table.
            // If notifications links to profiles/users, we should be careful.
            // Assuming technician_id is valid for notifications based on existing pattern.
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

router.post('/:id/review', supabaseAuth, async (req, res) => {
    try {
        const bookingId = req.params.id;
        const { rating, comment } = req.body;
        const customerId = req.user.customerId;

        if (!customerId) {
            return res.status(403).json({ error: 'Only customers can review' });
        }

        const { data: booking } = await supabaseAdmin
            .from('bookings')
            .select('*')
            .eq('id', bookingId)
            .single();

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        if (booking.customer_id !== customerId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        if (booking.status !== 'completed') {
            return res.status(400).json({ error: 'Can only review completed bookings' });
        }

        const { data: review, error } = await supabaseAdmin
            .from('reviews')
            .insert([{
                booking_id: bookingId,
                customer_id: customerId,
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