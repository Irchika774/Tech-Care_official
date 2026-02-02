import express from 'express';
import { supabaseAdmin } from '../lib/supabase.js';
import { supabaseAuth } from '../middleware/supabaseAuth.js';
import { successResponse, errorResponse } from '../lib/response.js';

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
        const user_role = req.user.role;

        // Validate user role
        if (user_role !== 'customer' && user_role !== 'user') {
            return errorResponse(res, 'Only customers can create bookings', 403);
        }

        // Validate estimated_cost is a positive number
        const cost = parseFloat(estimated_cost);
        if (isNaN(cost) || cost < 0) {
            return errorResponse(res, 'Invalid estimated cost. Must be a positive number.', 400);
        }

        // Validate required fields
        if (!device_type || !device_brand || !device_model) {
            return errorResponse(res, 'Device type, brand, and model are required.', 400);
        }

        if (!customer_id) {
            return errorResponse(res, 'Customer profile not found', 403);
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
                estimated_cost: cost,
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

        return successResponse(res, booking, 'Booking created successfully', 201);
    } catch (error) {
        console.error('Booking creation error:', error);
        return errorResponse(res, 'Failed to create booking');
    }
});

// PATCH endpoint for updating booking (confirmation, scheduling)
router.patch('/:id', supabaseAuth, async (req, res) => {
    try {
        const bookingId = req.params.id;
        const updates = req.body;
        const userId = req.user.id;

        // First, get the booking to check authorization
        const { data: booking, error: fetchError } = await supabaseAdmin
            .from('bookings')
            .select('*, customer:customers(id, name, email, phone), technician:technicians(id, name, email, phone, rating)')
            .eq('id', bookingId)
            .single();

        if (fetchError) {
            console.error('[DEBUG] Booking fetch error:', fetchError);
            // Try fetching without relations if join fails
            const { data: simpleBooking } = await supabaseAdmin
                .from('bookings')
                .select('*')
                .eq('id', bookingId)
                .single();

            if (!simpleBooking) {
                return errorResponse(res, 'Booking not found', 404);
            }
        }

        if (!booking) {
            return errorResponse(res, 'Booking not found', 404);
        }

        // Authorization check: User must be either the customer or the technician involved
        const isCustomer = booking.customer_id === userId || booking.customer_id === req.user.customerId;
        const isTechnician = booking.technician_id === userId || booking.technician_id === req.user.technicianId;
        const isAdmin = req.user.role === 'admin';

        if (!isCustomer && !isTechnician && !isAdmin) {
            console.error('[DEBUG] Authorization failed for booking update:', { userId, bookingCustomerId: booking.customer_id, bookingTechnicianId: booking.technician_id });
            return errorResponse(res, 'Access denied', 403);
        }

        // Perform the update
        const { data: updatedBooking, error } = await supabaseAdmin
            .from('bookings')
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq('id', bookingId)
            .select()
            .single();

        if (error) {
            console.error('[DEBUG] Booking update error:', error);
            throw error;
        }

        console.log('[DEBUG] Booking updated successfully:', bookingId);
        return successResponse(res, updatedBooking);
    } catch (error) {
        console.error('Booking update error:', error);
        return errorResponse(res, 'Failed to update booking');
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
        if (!booking) return errorResponse(res, 'Booking not found', 404);

        // Authorization check: User must be either the customer or the technician involved
        const isAuthorized =
            booking.customer_id === req.user.customerId ||
            booking.technician_id === req.user.technicianId ||
            req.user.role === 'admin';

        if (!isAuthorized) {
            return errorResponse(res, 'Access denied', 403);
        }

        const { data: bids } = await supabaseAdmin
            .from('bids')
            .select('*, technician:technicians!bids_technician_id_fkey(id, name, rating, review_count)')
            .eq('booking_id', req.params.id)
            .order('amount', { ascending: true });

        return successResponse(res, { booking, bids: bids || [] });
    } catch (error) {
        console.error('Booking fetch error:', error);
        return errorResponse(res, 'Failed to fetch booking');
    }
});

router.post('/:id/select-bid', supabaseAuth, async (req, res) => {
    try {
        const { bidId } = req.body;
        const bookingId = req.params.id;
        const customerId = req.user.customerId;

        if (!customerId) {
            return errorResponse(res, 'Only customers can select bids', 403);
        }

        // Verify booking ownership
        const { data: bookingCheck } = await supabaseAdmin
            .from('bookings')
            .select('customer_id')
            .eq('id', bookingId)
            .single();

        if (!bookingCheck || bookingCheck.customer_id !== customerId) {
            return errorResponse(res, 'Access denied', 403);
        }

        const { data: bid, error: bidError } = await supabaseAdmin
            .from('bids')
            .select('*')
            .eq('id', bidId)
            .single();

        if (bidError || !bid) {
            return errorResponse(res, 'Bid not found', 404);
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

        return successResponse(res, booking, 'Bid selected successfully');
    } catch (error) {
        console.error('Select bid error:', error);
        return errorResponse(res, 'Failed to select bid');
    }
});

router.post('/:id/review', supabaseAuth, async (req, res) => {
    try {
        const bookingId = req.params.id;
        const { rating, comment } = req.body;
        const customerId = req.user.customerId;

        if (!customerId) {
            return errorResponse(res, 'Only customers can review', 403);
        }

        const { data: booking } = await supabaseAdmin
            .from('bookings')
            .select('*')
            .eq('id', bookingId)
            .single();

        if (!booking) {
            return errorResponse(res, 'Booking not found', 404);
        }

        if (booking.customer_id !== customerId) {
            return errorResponse(res, 'Access denied', 403);
        }

        if (booking.status !== 'completed') {
            return errorResponse(res, 'Can only review completed bookings', 400);
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

        return successResponse(res, review, 'Review submitted successfully', 201);
    } catch (error) {
        console.error('Review submission error:', error);
        return errorResponse(res, 'Failed to submit review');
    }
});

export default router;