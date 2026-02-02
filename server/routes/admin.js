import express from 'express';
import { supabaseAdmin } from '../lib/supabase.js';
import { supabaseAuth } from '../middleware/supabaseAuth.js';
import { logAuditTrail } from '../middleware/auditLogger.js';
import { successResponse, errorResponse } from '../lib/response.js';

const router = express.Router();

const adminCheck = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return errorResponse(res, 'Access denied. Admin only.', 403);
    }
};

router.get('/dashboard', supabaseAuth, adminCheck, async (req, res) => {
    try {
        const [
            totalUsersRes,
            totalTechniciansRes,
            totalBookingsRes,
            pendingBookingsRes,
            completedBookingsRes,
            recentBookingsRes,
            recentUsersRes
        ] = await Promise.all([
            supabaseAdmin
                .from('profiles')
                .select('*', { count: 'exact', head: true }),
            supabaseAdmin
                .from('technicians')
                .select('*', { count: 'exact', head: true }),
            supabaseAdmin
                .from('bookings')
                .select('*', { count: 'exact', head: true }),
            supabaseAdmin
                .from('bookings')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'pending'),
            supabaseAdmin
                .from('bookings')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'completed'),
            supabaseAdmin
                .from('bookings')
                .select(`
                    *,
                    customer:profiles!bookings_customer_id_fkey(id, name, email),
                    technician:technicians!bookings_technician_id_fkey(id, name, email)
                `)
                .order('created_at', { ascending: false })
                .limit(10),
            supabaseAdmin
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(10)
        ]);

        const formatBooking = (b) => ({
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
        });

        return successResponse(res, {
            stats: {
                totalUsers: totalUsersRes.count || 0,
                totalTechnicians: totalTechniciansRes.count || 0,
                totalBookings: totalBookingsRes.count || 0,
                pendingBookings: pendingBookingsRes.count || 0,
                completedBookings: completedBookingsRes.count || 0,
                revenue: 0
            },
            recentBookings: (recentBookingsRes.data || []).map(formatBooking),
            recentUsers: recentUsersRes.data || []
        });
    } catch (error) {
        console.error('Admin dashboard error:', error);
        return errorResponse(res, 'Failed to fetch dashboard data');
    }
});

router.get('/users', supabaseAuth, adminCheck, async (req, res) => {
    try {
        const { data: users, error } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        return successResponse(res, users || []);
    } catch (err) {
        return errorResponse(res, err.message);
    }
});

router.put('/users/:id', supabaseAuth, adminCheck, async (req, res) => {
    try {
        const { data: user, error } = await supabaseAdmin
            .from('profiles')
            .update({ ...req.body, updated_at: new Date().toISOString() })
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;
        if (!user) return errorResponse(res, 'User not found', 404);

        return successResponse(res, user);
    } catch (err) {
        return errorResponse(res, err.message, 400);
    }
});

router.delete('/users/:id', supabaseAuth, adminCheck, logAuditTrail('ADMIN_DELETE_USER'), async (req, res) => {
    try {
        const { error } = await supabaseAdmin
            .from('profiles')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;
        return successResponse(res, null, 'User deleted successfully');
    } catch (err) {
        return errorResponse(res, err.message);
    }
});

router.get('/technicians', supabaseAuth, adminCheck, async (req, res) => {
    try {
        const { data: technicians, error } = await supabaseAdmin
            .from('technicians')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return successResponse(res, technicians || []);
    } catch (err) {
        return errorResponse(res, err.message);
    }
});

router.put('/technicians/:id', supabaseAuth, adminCheck, async (req, res) => {
    try {
        const { data: technician, error } = await supabaseAdmin
            .from('technicians')
            .update({ ...req.body, updated_at: new Date().toISOString() })
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;
        return successResponse(res, technician);
    } catch (err) {
        return errorResponse(res, err.message, 400);
    }
});

// Verify technician
router.patch('/technicians/:id/verify', supabaseAuth, adminCheck, logAuditTrail('ADMIN_VERIFY_TECH'), async (req, res) => {
    try {
        const { verified } = req.body;
        // If verified is provided, use it, otherwise default to true (legacy behavior)
        const isVerified = verified !== undefined ? verified : true;

        const { data: technician, error } = await supabaseAdmin
            .from('technicians')
            .update({ is_verified: isVerified, updated_at: new Date().toISOString() })
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;

        // Notify technician about verification status change
        if (technician?.user_id) {
            if (isVerified) {
                await supabaseAdmin.from('notifications').insert([{
                    user_id: technician.user_id,
                    title: 'Account Verified! 🎉',
                    message: 'Congratulations! Your technician account has been verified. You can now receive more jobs.',
                    type: 'account_verified',
                    data: { technician_id: technician.id }
                }]);
            } else {
                await supabaseAdmin.from('notifications').insert([{
                    user_id: technician.user_id,
                    title: 'Verification Revoked',
                    message: 'Your technician account verification has been revoked. Please contact support.',
                    type: 'account_verification_revoked',
                    data: { technician_id: technician.id }
                }]);
            }
        }

        return successResponse(res, technician, `Technician ${isVerified ? 'verified' : 'unverified'} successfully`);
    } catch (err) {
        return errorResponse(res, err.message, 400);
    }
});

router.delete('/technicians/:id', supabaseAuth, adminCheck, async (req, res) => {
    try {
        const { error } = await supabaseAdmin
            .from('technicians')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;
        return successResponse(res, null, 'Technician deleted successfully');
    } catch (err) {
        return errorResponse(res, err.message);
    }
});

router.get('/bookings', supabaseAuth, adminCheck, async (req, res) => {
    try {
        const { status, limit = 50 } = req.query;

        let query = supabaseAdmin
            .from('bookings')
            .select(`
                *,
                customer:customers(id, name, email),
                technician:technicians(id, name, email)
            `);

        if (status) query = query.eq('status', status);

        const { data: bookings, error } = await query
            .order('created_at', { ascending: false })
            .limit(parseInt(limit));

        if (error) throw error;
        return successResponse(res, bookings || []);
    } catch (err) {
        return errorResponse(res, err.message);
    }
});

router.put('/bookings/:id', supabaseAuth, adminCheck, logAuditTrail('ADMIN_UPDATE_BOOKING'), async (req, res) => {
    try {
        // Get existing booking first for notification purposes
        const { data: existingBooking } = await supabaseAdmin
            .from('bookings')
            .select('customer_id, technician_id, status')
            .eq('id', req.params.id)
            .single();

        const { data: booking, error } = await supabaseAdmin
            .from('bookings')
            .update({ ...req.body, updated_at: new Date().toISOString() })
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;

        // Notify both customer and technician about status change
        const notifications = [];
        const statusMessage = `Your booking status has been updated to: ${booking.status}`;

        if (existingBooking?.customer_id) {
            // Fetch customer's user_id
            const { data: customerData } = await supabaseAdmin
                .from('customers')
                .select('user_id')
                .eq('id', existingBooking.customer_id)
                .single();

            if (customerData?.user_id) {
                notifications.push({
                    user_id: customerData.user_id,
                    title: 'Booking Updated',
                    message: statusMessage,
                    type: 'booking_status_change',
                    data: { booking_id: req.params.id, new_status: booking.status }
                });
            }
        }

        if (existingBooking?.technician_id) {
            // Fetch technician's user_id
            const { data: techData } = await supabaseAdmin
                .from('technicians')
                .select('user_id')
                .eq('id', existingBooking.technician_id)
                .single();

            if (techData?.user_id) {
                notifications.push({
                    user_id: techData.user_id,
                    title: 'Booking Updated',
                    message: statusMessage,
                    type: 'booking_status_change',
                    data: { booking_id: req.params.id, new_status: booking.status }
                });
            }
        }

        if (notifications.length > 0) {
            await supabaseAdmin.from('notifications').insert(notifications);
        }

        return successResponse(res, booking);
    } catch (err) {
        return errorResponse(res, err.message, 400);
    }
});

router.get('/reviews', supabaseAuth, adminCheck, async (req, res) => {
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
        return errorResponse(res, err.message);
    }
});

router.delete('/reviews/:id', supabaseAuth, adminCheck, async (req, res) => {
    try {
        const { error } = await supabaseAdmin
            .from('reviews')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;
        return successResponse(res, null, 'Review deleted successfully');
    } catch (err) {
        return errorResponse(res, err.message);
    }
});

// ==================== GIG MANAGEMENT ====================

// Get all pending gigs for approval
router.get('/gigs/pending', supabaseAuth, adminCheck, async (req, res) => {
    try {
        const { data: gigs, error } = await supabaseAdmin
            .from('gigs')
            .select(`
                *,
                technician:technicians(id, name, email, rating, is_verified)
            `)
            .eq('status', 'pending')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return successResponse(res, gigs || []);
    } catch (err) {
        return errorResponse(res, err.message);
    }
});

// Get all gigs
router.get('/gigs', supabaseAuth, adminCheck, async (req, res) => {
    try {
        const { status } = req.query;
        let query = supabaseAdmin
            .from('gigs')
            .select(`
                *,
                technician:technicians(id, name, email, rating)
            `)
            .order('created_at', { ascending: false });

        if (status) {
            query = query.eq('status', status);
        }

        const { data: gigs, error } = await query;
        if (error) throw error;
        return successResponse(res, gigs || []);
    } catch (err) {
        return errorResponse(res, err.message);
    }
});

// Approve a gig
router.patch('/gigs/:id/approve', supabaseAuth, adminCheck, async (req, res) => {
    try {
        // Get gig details first for notification
        const { data: existingGig } = await supabaseAdmin
            .from('gigs')
            .select('technician_id, title')
            .eq('id', req.params.id)
            .single();

        const { data: gig, error } = await supabaseAdmin
            .from('gigs')
            .update({
                status: 'approved',
                approved_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;

        // Notify technician about gig approval
        if (existingGig?.technician_id) {
            // Fetch technician's user_id
            const { data: techData } = await supabaseAdmin
                .from('technicians')
                .select('user_id')
                .eq('id', existingGig.technician_id)
                .single();

            if (techData?.user_id) {
                await supabaseAdmin.from('notifications').insert([{
                    user_id: techData.user_id,
                    title: 'Gig Approved! ✅',
                    message: `Your gig "${existingGig.title}" has been approved and is now visible to customers.`,
                    type: 'gig_approved',
                    data: { gig_id: req.params.id }
                }]);
            }
        }

        return successResponse(res, gig, 'Gig approved successfully');
    } catch (err) {
        return errorResponse(res, err.message, 400);
    }
});

// Reject a gig
router.patch('/gigs/:id/reject', supabaseAuth, adminCheck, async (req, res) => {
    try {
        const { reason } = req.body;

        // Get gig details first for notification
        const { data: existingGig } = await supabaseAdmin
            .from('gigs')
            .select('technician_id, title')
            .eq('id', req.params.id)
            .single();

        const { data: gig, error } = await supabaseAdmin
            .from('gigs')
            .update({
                status: 'rejected',
                rejection_reason: reason || 'Does not meet platform guidelines',
                updated_at: new Date().toISOString()
            })
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;

        // Notify technician about gig rejection
        if (existingGig?.technician_id) {
            // Fetch technician's user_id
            const { data: techData } = await supabaseAdmin
                .from('technicians')
                .select('user_id')
                .eq('id', existingGig.technician_id)
                .single();

            if (techData?.user_id) {
                await supabaseAdmin.from('notifications').insert([{
                    user_id: techData.user_id,
                    title: 'Gig Not Approved',
                    message: `Your gig "${existingGig.title}" was not approved. Reason: ${reason || 'Does not meet platform guidelines'}`,
                    type: 'gig_rejected',
                    data: { gig_id: req.params.id, reason: reason || 'Does not meet platform guidelines' }
                }]);
            }
        }

        return successResponse(res, gig, 'Gig rejected');
    } catch (err) {
        return errorResponse(res, err.message, 400);
    }
});

// Delete a gig
router.delete('/gigs/:id', supabaseAuth, adminCheck, async (req, res) => {
    try {
        const { error } = await supabaseAdmin
            .from('gigs')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;
        return successResponse(res, null, 'Gig deleted successfully');
    } catch (err) {
        return errorResponse(res, err.message);
    }
});

// ==================== STATS & ANALYTICS ====================

// Get detailed statistics
router.get('/stats', supabaseAuth, adminCheck, async (req, res) => {
    try {
        const [
            usersCount,
            techsCount,
            bookingsCount,
            reviewsCount,
            paymentsSum
        ] = await Promise.all([
            supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }),
            supabaseAdmin.from('technicians').select('*', { count: 'exact', head: true }),
            supabaseAdmin.from('bookings').select('*', { count: 'exact', head: true }),
            supabaseAdmin.from('reviews').select('*', { count: 'exact', head: true }),
            supabaseAdmin.from('payments').select('amount').eq('status', 'succeeded')
        ]);

        const totalRevenue = (paymentsSum.data || []).reduce((sum, p) => sum + (p.amount || 0), 0);

        return successResponse(res, {
            totalUsers: usersCount.count || 0,
            totalTechnicians: techsCount.count || 0,
            totalBookings: bookingsCount.count || 0,
            totalReviews: reviewsCount.count || 0,
            totalRevenue
        });
    } catch (err) {
        return errorResponse(res, err.message);
    }
});

// Get system logs (recent activity)
router.get('/logs', supabaseAuth, adminCheck, async (req, res) => {
    try {
        const [
            recentUsers,
            recentBookings,
            recentPayments
        ] = await Promise.all([
            supabaseAdmin.from('profiles').select('id, name, created_at').order('created_at', { ascending: false }).limit(20),
            supabaseAdmin.from('bookings').select('id, status, created_at').order('created_at', { ascending: false }).limit(20),
            supabaseAdmin.from('payments').select('id, amount, status, created_at').order('created_at', { ascending: false }).limit(20)
        ]);

        const logs = [
            ...(recentUsers.data || []).map(u => ({
                id: `user-${u.id}`,
                type: 'USER_SIGNUP',
                message: `New user registered: ${u.name || 'Anonymous'}`,
                timestamp: u.created_at,
                severity: 'info'
            })),
            ...(recentBookings.data || []).map(b => ({
                id: `booking-${b.id}`,
                type: 'BOOKING_UPDATE',
                message: `Booking #${b.id.substring(0, 8)} status changed to ${b.status}`,
                timestamp: b.created_at,
                severity: b.status === 'cancelled' ? 'warning' : 'info'
            })),
            ...(recentPayments.data || []).map(p => ({
                id: `payment-${p.id}`,
                type: 'PAYMENT_RECEIVED',
                message: `Payment received: ${p.status}`,
                timestamp: p.created_at,
                severity: p.status === 'succeeded' ? 'success' : 'warning'
            }))
        ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        return successResponse(res, logs);
    } catch (err) {
        return errorResponse(res, err.message);
    }
});

export default router;