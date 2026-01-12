import express from 'express';
import { supabaseAdmin } from '../lib/supabase.js';
import { supabaseAuth } from '../middleware/supabaseAuth.js';

const router = express.Router();

const verifyCustomer = (req, res, next) => {
    if (!req.user || !['user', 'customer'].includes(req.user.role)) {
        return res.status(403).json({ error: 'Access denied. Customer role required.' });
    }
    next();
};

router.get('/dashboard', supabaseAuth, verifyCustomer, async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch profile and customer record in parallel
        const [profileRes, customerRes] = await Promise.all([
            supabaseAdmin.from('profiles').select('*').eq('id', userId).single(),
            supabaseAdmin.from('customers').select('id').eq('user_id', userId).single()
        ]);

        const profile = profileRes.data;
        let customerId = customerRes.data?.id;

        // If customer record doesn't exist, create it on the fly (robustness)
        if (!customerId) {
            const { data: newCustomer } = await supabaseAdmin
                .from('customers')
                .insert([{ user_id: userId, name: profile?.name || req.user.name, email: profile?.email || req.user.email }])
                .select()
                .single();
            customerId = newCustomer?.id;
        }

        // Run independent queries in parallel with a timeout safety
        const results = await Promise.allSettled([
            supabaseAdmin
                .from('bookings')
                .select('*, technician:technicians(id, name, email, phone, rating)')
                .eq('customer_id', customerId)
                .in('status', ['pending', 'confirmed', 'scheduled', 'in_progress'])
                .order('created_at', { ascending: false })
                .limit(5),
            supabaseAdmin
                .from('bookings')
                .select('*, technician:technicians(id, name, email, phone, rating)')
                .eq('customer_id', customerId)
                .order('created_at', { ascending: false })
                .limit(10),
            supabaseAdmin
                .from('bookings')
                .select('status')
                .eq('customer_id', customerId),
            supabaseAdmin
                .from('payments')
                .select('amount')
                .eq('customer_id', customerId)
                .eq('status', 'completed'),
            supabaseAdmin
                .from('favorites')
                .select('*', { count: 'exact', head: true })
                .eq('customer_id', customerId)
        ]);

        const [
            activeBookingsRes,
            recentBookingsRes,
            bookingStatsRes,
            paymentsRes,
            favoritesCountRes
        ] = results.map(r => r.status === 'fulfilled' ? r.value : { data: [], count: 0 });

        const formatBooking = (b) => {
            if (!b) return null;
            return {
                ...b,
                device: {
                    brand: b.device_brand,
                    model: b.device_model,
                    type: b.device_type
                },
                issue: {
                    description: b.issue_description,
                    type: b.issue_type
                }
            };
        };

        const activeBookings = (activeBookingsRes.data || []).map(formatBooking).filter(Boolean);
        const recentBookings = (recentBookingsRes.data || []).map(formatBooking).filter(Boolean);

        // Process stats in memory
        const allBookings = bookingStatsRes.data || [];
        const stats = {
            totalBookings: allBookings.length || 0,
            activeBookings: allBookings.filter(b => ['pending', 'confirmed', 'scheduled', 'in_progress'].includes(b.status)).length || 0,
            completedBookings: allBookings.filter(b => b.status === 'completed').length || 0,
            cancelledBookings: allBookings.filter(b => b.status === 'cancelled').length || 0,
            totalSpent: (paymentsRes.data || []).reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0) || 0,
            favoriteTechniciansCount: favoritesCountRes.count || 0
        };

        res.json({
            customer: {
                name: profile?.name || req.user.name,
                email: profile?.email || req.user.email,
                phone: profile?.phone,
                profileImage: profile?.profile_image
            },
            stats,
            activeBookings,
            recentBookings
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
});

router.get('/bookings', supabaseAuth, verifyCustomer, async (req, res) => {
    try {
        const userId = req.user.id;
        const { status, limit = 20, skip = 0 } = req.query;

        const { data: customer } = await supabaseAdmin
            .from('customers')
            .select('id')
            .eq('user_id', userId)
            .single();

        const customerId = customer?.id;

        let query = supabaseAdmin
            .from('bookings')
            .select('*, technician:technicians(id, name, email, phone, rating)', { count: 'exact' })
            .eq('customer_id', customerId);

        if (status) query = query.eq('status', status);

        const { data: bookings, count, error } = await query
            .order('created_at', { ascending: false })
            .range(parseInt(skip), parseInt(skip) + parseInt(limit) - 1);

        if (error) throw error;

        res.json({
            bookings: bookings || [],
            total: count || 0,
            hasMore: (count || 0) > parseInt(skip) + parseInt(limit)
        });
    } catch (error) {
        console.error('Bookings fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

router.post('/bookings', supabaseAuth, verifyCustomer, async (req, res) => {
    try {
        const userId = req.user.id;

        // Correct Logical Error: Get customers.id instead of using auth.users.id
        const { data: customer } = await supabaseAdmin
            .from('customers')
            .select('id')
            .eq('user_id', userId)
            .single();

        if (!customer) {
            return res.status(404).json({ error: 'Customer profile not found' });
        }

        const bookingData = {
            customer_id: customer.id,
            device_type: req.body.deviceType,
            device_brand: req.body.deviceBrand,
            device_model: req.body.deviceModel,
            issue_description: req.body.issueDescription,
            status: 'pending',
            scheduled_date: req.body.scheduledDate,
            address: req.body.address,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            notes: req.body.notes
        };

        const { data: booking, error } = await supabaseAdmin
            .from('bookings')
            .insert([bookingData])
            .select()
            .single();

        if (error) throw error;

        await supabaseAdmin.from('notifications').insert([{
            user_id: userId,
            title: 'Booking Created',
            message: 'Your service booking has been created successfully.',
            type: 'booking_created',
            data: { booking_id: booking.id }
        }]);

        res.status(201).json({ booking, message: 'Booking created successfully' });
    } catch (error) {
        console.error('Booking creation error:', error);
        res.status(500).json({ error: 'Failed to create booking' });
    }
});

router.patch('/bookings/:id', supabaseAuth, verifyCustomer, async (req, res) => {
    try {
        const userId = req.user.id;
        const bookingId = req.params.id;
        const { action, ...updateData } = req.body;

        const { data: customer } = await supabaseAdmin
            .from('customers')
            .select('id')
            .eq('user_id', userId)
            .single();

        const { data: existingBooking } = await supabaseAdmin
            .from('bookings')
            .select('*')
            .eq('id', bookingId)
            .eq('customer_id', customer?.id)
            .single();

        if (!existingBooking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        let updates = { updated_at: new Date().toISOString() };

        if (action === 'cancel') {
            if (['in_progress', 'completed'].includes(existingBooking.status)) {
                return res.status(400).json({ error: 'Cannot cancel a booking that is in progress or completed' });
            }
            updates.status = 'cancelled';

            if (existingBooking.technician_id) {
                await supabaseAdmin.from('notifications').insert([{
                    user_id: existingBooking.technician_id,
                    title: 'Booking Cancelled',
                    message: 'A customer has cancelled their booking.',
                    type: 'booking_cancelled',
                    data: { booking_id: bookingId }
                }]);
            }
        } else if (action === 'reschedule') {
            const newDate = new Date(updateData.scheduledDate);
            const minDate = new Date();
            minDate.setHours(minDate.getHours() + 24); // Enforce 24-hour notice

            if (newDate < new Date()) {
                return res.status(400).json({ error: 'Cannot reschedule to a past date' });
            }
            // Optional: Uncomment to strict enforce 24h rule
            // if (newDate < minDate) {
            //    return res.status(400).json({ error: 'Rescheduling requires at least 24 hours notice' });
            // }

            updates.scheduled_date = updateData.scheduledDate;
            updates.status = 'scheduled';
        } else {
            Object.assign(updates, updateData);
        }

        const { data: booking, error } = await supabaseAdmin
            .from('bookings')
            .update(updates)
            .eq('id', bookingId)
            .select()
            .single();

        if (error) throw error;

        res.json({ booking, message: 'Booking updated successfully' });
    } catch (error) {
        console.error('Booking update error:', error);
        res.status(500).json({ error: 'Failed to update booking' });
    }
});

router.get('/notifications', supabaseAuth, verifyCustomer, async (req, res) => {
    try {
        const userId = req.user.id;
        const { limit = 20, skip = 0, unreadOnly = false } = req.query;

        let query = supabaseAdmin
            .from('notifications')
            .select('*', { count: 'exact' })
            .eq('user_id', userId);

        if (unreadOnly === 'true') query = query.eq('read', false);

        const { data: notifications, count, error } = await query
            .order('created_at', { ascending: false })
            .range(parseInt(skip), parseInt(skip) + parseInt(limit) - 1);

        if (error) throw error;

        const { count: unreadCount } = await supabaseAdmin
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('read', false);

        res.json({ notifications: notifications || [], unreadCount: unreadCount || 0 });
    } catch (error) {
        console.error('Notifications fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

router.patch('/notifications/:id', supabaseAuth, verifyCustomer, async (req, res) => {
    try {
        const { error } = await supabaseAdmin
            .from('notifications')
            .update({ read: true })
            .eq('id', req.params.id);

        if (error) throw error;
        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error('Notification update error:', error);
        res.status(500).json({ error: 'Failed to update notification' });
    }
});

router.get('/profile', supabaseAuth, verifyCustomer, async (req, res) => {
    try {
        const userId = req.user.id;

        const { data: profile, error } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        res.json({ customer: profile });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

router.patch('/profile', supabaseAuth, verifyCustomer, async (req, res) => {
    try {
        const userId = req.user.id;
        const updates = { ...req.body, updated_at: new Date().toISOString() };

        // Sync name and email to customers table as well if they are being updated
        const syncUpdates = {};
        if (updates.name) syncUpdates.name = updates.name;
        if (updates.email) syncUpdates.email = updates.email;
        if (updates.phone) syncUpdates.phone = updates.phone;

        const [profileRes, customerRes] = await Promise.all([
            supabaseAdmin
                .from('profiles')
                .update(updates)
                .eq('id', userId)
                .select()
                .single(),
            Object.keys(syncUpdates).length > 0 ?
                supabaseAdmin
                    .from('customers')
                    .update(syncUpdates)
                    .eq('user_id', userId) :
                Promise.resolve({ data: null })
        ]);

        if (profileRes.error) throw profileRes.error;
        res.json({ customer: profileRes.data, message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

router.get('/favorites', supabaseAuth, verifyCustomer, async (req, res) => {
    try {
        const userId = req.user.id;

        const { data: customer } = await supabaseAdmin
            .from('customers')
            .select('id')
            .eq('user_id', userId)
            .single();

        if (!customer) {
            return res.json({ favorites: [] });
        }

        const { data: favorites, error } = await supabaseAdmin
            .from('favorites')
            .select('*, technician:technicians(*)')
            .eq('customer_id', customer.id);

        if (error) throw error;

        res.json({
            favorites: (favorites || []).map(f => ({
                _id: f.technician?.id,
                ...f.technician,
                name: f.technician?.name,
                rating: f.technician?.rating || 0,
                reviewCount: f.technician?.review_count || 0,
                profileImage: f.technician?.profile_image
            }))
        });
    } catch (error) {
        console.error('Favorites fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch favorites' });
    }
});

router.post('/favorites/:techId', supabaseAuth, verifyCustomer, async (req, res) => {
    try {
        const userId = req.user.id;
        const techId = req.params.techId;

        const { data: customer } = await supabaseAdmin
            .from('customers')
            .select('id')
            .eq('user_id', userId)
            .single();

        if (!customer) {
            const { data: newCustomer, error: createError } = await supabaseAdmin
                .from('customers')
                .insert([{ user_id: userId, name: req.user.name, email: req.user.email }])
                .select()
                .single();

            if (createError) throw createError;

            const { error } = await supabaseAdmin
                .from('favorites')
                .insert([{ customer_id: newCustomer.id, technician_id: techId }]);

            if (error && error.code !== '23505') throw error;
        } else {
            const { error } = await supabaseAdmin
                .from('favorites')
                .insert([{ customer_id: customer.id, technician_id: techId }]);

            if (error && error.code !== '23505') throw error;
        }

        res.json({ message: 'Added to favorites' });
    } catch (error) {
        console.error('Add favorite error:', error);
        res.status(500).json({ error: 'Failed to add favorite' });
    }
});

router.delete('/favorites/:techId', supabaseAuth, verifyCustomer, async (req, res) => {
    try {
        const userId = req.user.id;
        const techId = req.params.techId;

        const { data: customer } = await supabaseAdmin
            .from('customers')
            .select('id')
            .eq('user_id', userId)
            .single();

        if (!customer) {
            return res.json({ message: 'Removed from favorites' });
        }

        const { error } = await supabaseAdmin
            .from('favorites')
            .delete()
            .eq('customer_id', customer.id)
            .eq('technician_id', techId);

        if (error) throw error;
        res.json({ message: 'Removed from favorites' });
    } catch (error) {
        console.error('Remove favorite error:', error);
        res.status(500).json({ error: 'Failed to remove favorite' });
    }
});

router.post('/reviews', supabaseAuth, verifyCustomer, async (req, res) => {
    try {
        const userId = req.user.id;
        const { technicianId, bookingId, rating, comment } = req.body;

        const { data: customer } = await supabaseAdmin
            .from('customers')
            .select('id')
            .eq('user_id', userId)
            .single();

        if (!customer) {
            return res.status(400).json({ error: 'Customer not found' });
        }

        const { data: review, error } = await supabaseAdmin
            .from('reviews')
            .insert([{
                customer_id: customer.id,
                technician_id: technicianId,
                booking_id: bookingId,
                rating,
                comment
            }])
            .select()
            .single();

        if (error) throw error;

        const { data: allReviews } = await supabaseAdmin
            .from('reviews')
            .select('rating')
            .eq('technician_id', technicianId);

        if (allReviews && allReviews.length > 0) {
            const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
            await supabaseAdmin
                .from('technicians')
                .update({ rating: Math.round(avgRating * 10) / 10, review_count: allReviews.length })
                .eq('id', technicianId);
        }

        res.status(201).json({ review, message: 'Review submitted successfully' });
    } catch (error) {
        console.error('Review submission error:', error);
        res.status(500).json({ error: 'Failed to submit review' });
    }
});

router.post('/bookings/:id/select-bid', supabaseAuth, verifyCustomer, async (req, res) => {
    try {
        const userId = req.user.id;
        const bookingId = req.params.id;
        const { bidId } = req.body;

        const { data: customer } = await supabaseAdmin
            .from('customers')
            .select('id')
            .eq('user_id', userId)
            .single();

        const { data: booking } = await supabaseAdmin
            .from('bookings')
            .select('*')
            .eq('id', bookingId)
            .eq('customer_id', customer?.id)
            .single();

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        const { data: bid } = await supabaseAdmin
            .from('bids')
            .select('*')
            .eq('id', bidId)
            .eq('booking_id', bookingId)
            .single();

        if (!bid) {
            return res.status(404).json({ error: 'Bid not found' });
        }

        await supabaseAdmin
            .from('bids')
            .update({ status: 'accepted' })
            .eq('id', bidId);

        await supabaseAdmin
            .from('bids')
            .update({ status: 'rejected' })
            .eq('booking_id', bookingId)
            .neq('id', bidId);

        const { data: updatedBooking, error } = await supabaseAdmin
            .from('bookings')
            .update({
                technician_id: bid.technician_id,
                estimated_cost: bid.amount,
                status: 'confirmed'
            })
            .eq('id', bookingId)
            .select()
            .single();

        if (error) throw error;

        await supabaseAdmin.from('notifications').insert([{
            user_id: bid.technician_id,
            title: 'Bid Accepted',
            message: 'Your bid has been accepted by the customer!',
            type: 'bid_accepted',
            data: { booking_id: bookingId, bid_id: bidId }
        }]);

        res.json({ booking: updatedBooking, message: 'Bid accepted successfully' });
    } catch (error) {
        console.error('Bid selection error:', error);
        res.status(500).json({ error: 'Failed to select bid' });
    }
});

router.get('/bookings/:id/bids', supabaseAuth, verifyCustomer, async (req, res) => {
    try {
        const bookingId = req.params.id;

        const { data: bids, error } = await supabaseAdmin
            .from('bids')
            .select('*, technician:technicians(id, name, email, phone, rating, review_count, profile_image)')
            .eq('booking_id', bookingId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json({ bids: bids || [] });
    } catch (error) {
        console.error('Bids fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch bids' });
    }
});

export default router;