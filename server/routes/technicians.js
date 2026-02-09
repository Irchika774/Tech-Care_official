import express from 'express';
import { supabaseAdmin } from '../lib/supabase.js';
import { supabaseAuth } from '../middleware/supabaseAuth.js';
import { successResponse, errorResponse } from '../lib/response.js';

const router = express.Router();

const verifyTechnician = (req, res, next) => {
    if (!req.user || req.user.role !== 'technician') {
        return res.status(403).json({ error: 'Access denied. Technician role required.' });
    }
    next();
};

// Public Routes (Mounted at /api/technicians)
router.get('/nearby', async (req, res) => {
    const { lng, lat, dist } = req.query;

    try {
        const { data: technicians, error } = await supabaseAdmin
            .from('technicians')
            .select('*')
            .eq('status', 'active');

        if (error) throw error;

        if (lng && lat) {
            const longitude = parseFloat(lng);
            const latitude = parseFloat(lat);
            const maxDistanceKm = (parseInt(dist) || 5000) / 1000;

            const filtered = technicians.filter(t => {
                if (!t.latitude || !t.longitude) return true;
                const dlat = t.latitude - latitude;
                const dlng = t.longitude - longitude;
                const distance = Math.sqrt(dlat * dlat + dlng * dlng) * 111;
                return distance <= maxDistanceKm;
            });

            return res.json(filtered);
        }

        res.json(technicians || []);
    } catch (err) {
        console.error('Nearby technicians error:', err.message);
        res.status(500).json({ message: err.message });
    }
});

router.get('/all', async (req, res) => {
    try {
        const { data: technicians, error } = await supabaseAdmin
            .from('technicians')
            .select('*');

        if (error) throw error;
        res.json(technicians || []);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', async (req, res, next) => {
    // Check if ID is a special keyword to avoid conflict with other routes
    if (['dashboard', 'jobs', 'bookings', 'bids', 'earnings', 'analytics', 'profile'].includes(req.params.id)) {
        return next();
    }
    try {
        const { data: technician, error } = await supabaseAdmin
            .from('technicians')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error) throw error;
        if (!technician) return res.status(404).json({ message: 'Technician not found' });

        res.json(technician);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const { data: technicians, error } = await supabaseAdmin
            .from('technicians')
            .select('*')
            .order('rating', { ascending: false });

        if (error) throw error;
        res.json(technicians || []);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Protected Routes
router.get('/dashboard', supabaseAuth, verifyTechnician, async (req, res) => {
    try {
        const userId = req.user.id;

        const { data: technician, error: techError } = await supabaseAdmin
            .from('technicians')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (techError || !technician) {
            return res.json({
                technician: { name: req.user.name || 'Technician', email: req.user.email },
                stats: { totalJobs: 0, completedJobs: 0, activeJobs: 0, activeBids: 0, rating: 0, reviewCount: 0, totalEarnings: 0, availableBalance: 0, todayEarnings: 0, completionRate: 0, responseTime: '0 mins' },
                activeJobs: [],
                activeBids: []
            });
        }

        const { data: activeJobs } = await supabaseAdmin
            .from('bookings')
            .select('*, customer:customers(id, name, email)')
            .eq('technician_id', technician.id)
            .in('status', ['pending', 'confirmed', 'scheduled', 'in_progress'])
            .order('scheduled_date', { ascending: true })
            .limit(5);

        const { data: activeBids } = await supabaseAdmin
            .from('bids')
            .select('*, booking:bookings(*)')
            .eq('technician_id', technician.id)
            .eq('status', 'pending')
            .order('created_at', { ascending: false })
            .limit(5);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const { data: todayBookings } = await supabaseAdmin
            .from('bookings')
            .select('price')
            .eq('technician_id', technician.id)
            .eq('status', 'completed')
            .gte('completed_date', today.toISOString());

        const todayEarnings = (todayBookings || []).reduce((sum, b) => sum + (parseFloat(b.price) || 0), 0);

        res.json({
            success: true,
            data: {
                technician: {
                    name: technician.name,
                    email: technician.email,
                    phone: technician.phone,
                    profileImage: technician.profile_image,
                    isVerified: technician.is_verified
                },
                stats: {
                    totalJobs: technician.total_jobs || 0,
                    completedJobs: technician.completed_jobs || 0,
                    activeJobs: technician.active_jobs || 0,
                    activeBids: technician.active_bids || 0,
                    rating: technician.rating || 0,
                    reviewCount: technician.review_count || 0,
                    totalEarnings: technician.total_earnings || 0,
                    availableBalance: technician.available_balance || 0,
                    todayEarnings: todayEarnings,
                    completionRate: technician.completion_rate || 0,
                    responseTime: `${technician.avg_response_time || 0} mins`
                },
                activeJobs: activeJobs || [],
                activeBids: activeBids || []
            }
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch dashboard data' });
    }
});

router.get('/jobs', supabaseAuth, verifyTechnician, async (req, res) => {
    try {
        const { data: jobs, error } = await supabaseAdmin
            .from('bookings')
            .select('*, customer:customers(id, name, email)')
            .in('status', ['pending', 'bidding'])
            .is('technician_id', null)
            .order('created_at', { ascending: false })
            .limit(50);

        return successResponse(res, { jobs: jobs || [] });
    } catch (error) {
        console.error('Jobs fetch error:', error);
        return errorResponse(res, 'Failed to fetch jobs');
    }
});

router.get('/bookings', supabaseAuth, verifyTechnician, async (req, res) => {
    try {
        const userId = req.user.id;
        const { status, limit = 20, skip = 0 } = req.query;

        const { data: technician } = await supabaseAdmin
            .from('technicians')
            .select('id')
            .eq('user_id', userId)
            .single();

        if (!technician) {
            return res.json({ bookings: [], total: 0, hasMore: false });
        }

        let query = supabaseAdmin
            .from('bookings')
            .select('*, customer:customers(id, name, email, phone)', { count: 'exact' })
            .eq('technician_id', technician.id);

        if (status) query = query.eq('status', status);

        const { data: bookings, count, error } = await query
            .order('scheduled_date', { ascending: true })
            .range(parseInt(skip), parseInt(skip) + parseInt(limit) - 1);

        if (error) throw error;

        res.json({
            success: true,
            data: {
                bookings: bookings || [],
                total: count || 0,
                hasMore: (count || 0) > parseInt(skip) + parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Bookings fetch error:', error);
        return errorResponse(res, 'Failed to fetch bookings');
    }
});

router.patch('/bookings/:id/accept', supabaseAuth, verifyTechnician, async (req, res) => {
    try {
        const userId = req.user.id;
        const bookingId = req.params.id;

        const { data: technician } = await supabaseAdmin
            .from('technicians')
            .select('id')
            .eq('user_id', userId)
            .single();

        if (!technician) {
            return res.status(404).json({ error: 'Technician profile not found' });
        }

        const { data: booking, error } = await supabaseAdmin
            .from('bookings')
            .update({ technician_id: technician.id, status: 'confirmed', updated_at: new Date().toISOString() })
            .eq('id', bookingId)
            .select()
            .single();

        if (error) throw error;

        await supabaseAdmin.from('technicians').update({
            active_jobs: (technician.active_jobs || 0) + 1,
            total_jobs: (technician.total_jobs || 0) + 1
        }).eq('id', technician.id);

        return successResponse(res, booking, 'Job accepted successfully');
    } catch (error) {
        console.error('Accept job error:', error);
        return errorResponse(res, 'Failed to accept job');
    }
});

router.patch('/bookings/:id/complete', supabaseAuth, verifyTechnician, async (req, res) => {
    try {
        const userId = req.user.id;
        const bookingId = req.params.id;
        const { actualCost, notes } = req.body;

        const { data: technician } = await supabaseAdmin
            .from('technicians')
            .select('id, active_jobs, completed_jobs, total_earnings')
            .eq('user_id', userId)
            .single();

        if (!technician) {
            return res.status(404).json({ error: 'Technician profile not found' });
        }

        const { data: booking, error } = await supabaseAdmin
            .from('bookings')
            .update({
                status: 'completed',
                completed_date: new Date().toISOString(),
                price: actualCost,
                notes: notes,
                updated_at: new Date().toISOString()
            })
            .eq('id', bookingId)
            .eq('technician_id', technician.id)
            .select()
            .single();

        if (error) throw error;

        await supabaseAdmin.from('technicians').update({
            active_jobs: Math.max(0, (technician.active_jobs || 1) - 1),
            completed_jobs: (technician.completed_jobs || 0) + 1,
            total_earnings: (technician.total_earnings || 0) + (actualCost || 0)
        }).eq('id', technician.id);

        return successResponse(res, booking, 'Job marked as complete');
    } catch (error) {
        console.error('Complete job error:', error);
        return errorResponse(res, 'Failed to complete job');
    }
});

router.post('/bids', supabaseAuth, verifyTechnician, async (req, res) => {
    try {
        const userId = req.user.id;
        const { bookingId, amount, message, estimatedDuration } = req.body;

        const { data: technician } = await supabaseAdmin
            .from('technicians')
            .select('id, active_bids')
            .eq('user_id', userId)
            .single();

        if (!technician) {
            return res.status(404).json({ error: 'Technician profile not found' });
        }

        const { data: existingBid } = await supabaseAdmin
            .from('bids')
            .select('id')
            .eq('booking_id', bookingId)
            .eq('technician_id', technician.id)
            .single();

        if (existingBid) {
            return res.status(400).json({ error: 'You have already bid on this job' });
        }

        const { data: bid, error } = await supabaseAdmin
            .from('bids')
            .insert([{
                booking_id: bookingId,
                technician_id: technician.id,
                amount,
                message,
                estimated_duration: estimatedDuration,
                status: 'pending'
            }])
            .select()
            .single();

        if (error) throw error;

        await supabaseAdmin.from('technicians').update({
            active_bids: (technician.active_bids || 0) + 1
        }).eq('id', technician.id);

        return successResponse(res, bid, 'Bid submitted successfully', 201);
    } catch (error) {
        console.error('Bid submission error:', error);
        return errorResponse(res, 'Failed to submit bid');
    }
});

router.get('/bids', supabaseAuth, verifyTechnician, async (req, res) => {
    try {
        const userId = req.user.id;
        const { status } = req.query;

        const { data: technician } = await supabaseAdmin
            .from('technicians')
            .select('id')
            .eq('user_id', userId)
            .single();

        if (!technician) {
            return successResponse(res, { bids: [] });
        }

        let query = supabaseAdmin
            .from('bids')
            .select('*, booking:bookings!bids_booking_id_fkey(*)')
            .eq('technician_id', technician.id);

        if (status) query = query.eq('status', status);

        const { data: bids, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;
        return successResponse(res, { bids: bids || [] });
    } catch (error) {
        console.error('Bids fetch error:', error);
        return errorResponse(res, 'Failed to fetch bids');
    }
});

router.get('/earnings', supabaseAuth, verifyTechnician, async (req, res) => {
    try {
        const userId = req.user.id;

        const { data: technician } = await supabaseAdmin
            .from('technicians')
            .select('id, total_earnings, pending_earnings, available_balance')
            .eq('user_id', userId)
            .single();

        if (!technician) {
            return successResponse(res, { earnings: [], summary: { totalEarnings: 0, pendingEarnings: 0, availableBalance: 0 } });
        }

        const { data: earnings } = await supabaseAdmin
            .from('bookings')
            .select('id, completed_date, price, payment_status')
            .eq('technician_id', technician.id)
            .eq('status', 'completed')
            .order('completed_date', { ascending: false });

        return successResponse(res, {
            earnings: earnings || [],
            summary: {
                totalEarnings: technician.total_earnings || 0,
                pendingEarnings: technician.pending_earnings || 0,
                availableBalance: technician.available_balance || 0
            }
        });
    } catch (error) {
        console.error('Earnings fetch error:', error);
        return errorResponse(res, 'Failed to fetch earnings');
    }
});

router.get('/analytics', supabaseAuth, verifyTechnician, async (req, res) => {
    try {
        const userId = req.user.id;

        const { data: technician } = await supabaseAdmin
            .from('technicians')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (!technician) {
            return successResponse(res, {
                metrics: { averageResponseTime: 0, completionRate: 0, customerSatisfaction: 0, onTimeCompletion: 0 },
                ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
                monthlyEarnings: [],
                stats: { totalJobs: 0, completedJobs: 0, cancelledJobs: 0, rating: 0, reviewCount: 0 }
            });
        }

        return successResponse(res, {
            metrics: {
                averageResponseTime: technician.avg_response_time || 0,
                completionRate: technician.completion_rate || 0,
                customerSatisfaction: technician.customer_satisfaction || 0,
                onTimeCompletion: technician.on_time_completion || 0
            },
            ratingBreakdown: {
                5: technician.rating_5 || 0,
                4: technician.rating_4 || 0,
                3: technician.rating_3 || 0,
                2: technician.rating_2 || 0,
                1: technician.rating_1 || 0
            },
            monthlyEarnings: [],
            stats: {
                totalJobs: technician.total_jobs || 0,
                completedJobs: technician.completed_jobs || 0,
                cancelledJobs: technician.cancelled_jobs || 0,
                rating: technician.rating || 0,
                reviewCount: technician.review_count || 0
            }
        });
    } catch (error) {
        console.error('Analytics fetch error:', error);
        return errorResponse(res, 'Failed to fetch analytics');
    }
});

router.get('/profile', supabaseAuth, verifyTechnician, async (req, res) => {
    try {
        const userId = req.user.id;
        const { data: technician, error } = await supabaseAdmin
            .from('technicians')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) throw error;
        return successResponse(res, technician);
    } catch (error) {
        console.error('Profile fetch error:', error);
        return errorResponse(res, 'Failed to fetch profile');
    }
});

router.patch('/profile', supabaseAuth, verifyTechnician, async (req, res) => {
    try {
        const userId = req.user.id;

        // First, find the technician record by user_id
        const { data: existingTech, error: findError } = await supabaseAdmin
            .from('technicians')
            .select('id')
            .eq('user_id', userId)
            .order('id', { ascending: true })
            .limit(1);

        if (findError) throw findError;

        if (!existingTech || existingTech.length === 0) {
            return res.status(404).json({ error: 'Technician profile not found' });
        }

        const technicianId = existingTech[0].id;

        // Filter out fields that shouldn't be updated directly
        const allowedFields = ['name', 'email', 'phone', 'address', 'bio', 'profile_image',
            'description', 'experience', 'district', 'profile_image', 'avatar'];
        const updates = {};

        Object.keys(req.body).forEach(key => {
            if (allowedFields.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        updates.updated_at = new Date().toISOString();

        const { data: technician, error } = await supabaseAdmin
            .from('technicians')
            .update(updates)
            .eq('id', technicianId)
            .select()
            .single();

        if (error) {
            // Handle duplicate key error gracefully
            if (error.code === '23505') {
                return res.status(409).json({ error: 'A profile with this information already exists' });
            }
            throw error;
        }
        return successResponse(res, technician, 'Profile updated successfully');
    } catch (error) {
        console.error('Profile update error:', error);
        return errorResponse(res, 'Failed to update profile: ' + error.message);
    }
});

// Technician Services Management
router.get('/services', supabaseAuth, verifyTechnician, async (req, res) => {
    try {
        const userId = req.user.id;

        // Get technician ID
        const { data: technician } = await supabaseAdmin
            .from('technicians')
            .select('id')
            .eq('user_id', userId)
            .single();

        if (!technician) {
            return res.status(404).json({ error: 'Technician profile not found' });
        }

        // Fetch services for this technician
        const { data: services, error } = await supabaseAdmin
            .from('technician_services')
            .select('*')
            .eq('technician_id', technician.id)
            .order('name');

        if (error) throw error;
        res.json({ services: services || [] });
    } catch (error) {
        console.error('Fetch services error:', error);
        res.status(500).json({ error: 'Failed to fetch services' });
    }
});

router.post('/services', supabaseAuth, verifyTechnician, async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, description, price, category, estimated_time } = req.body;

        // Get technician ID
        const { data: technician } = await supabaseAdmin
            .from('technicians')
            .select('id')
            .eq('user_id', userId)
            .single();

        if (!technician) {
            return res.status(404).json({ error: 'Technician profile not found' });
        }

        const { data: service, error } = await supabaseAdmin
            .from('technician_services')
            .insert([{
                technician_id: technician.id,
                name,
                description,
                price: price || 0,
                category,
                estimated_time,
                is_active: true
            }])
            .select()
            .single();

        if (error) throw error;
        return successResponse(res, service, 'Service added successfully', 201);
    } catch (error) {
        console.error('Add service error:', error);
        return errorResponse(res, 'Failed to add service');
    }
});

router.patch('/services/:serviceId', supabaseAuth, verifyTechnician, async (req, res) => {
    try {
        const userId = req.user.id;
        const { serviceId } = req.params;
        const updates = req.body;

        // Get technician ID
        const { data: technician } = await supabaseAdmin
            .from('technicians')
            .select('id')
            .eq('user_id', userId)
            .single();

        if (!technician) {
            return res.status(404).json({ error: 'Technician profile not found' });
        }

        const { data: service, error } = await supabaseAdmin
            .from('technician_services')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', serviceId)
            .eq('technician_id', technician.id)
            .select()
            .single();

        if (error) throw error;
        if (!service) return res.status(404).json({ error: 'Service not found' });

        return successResponse(res, service, 'Service updated successfully');
    } catch (error) {
        console.error('Update service error:', error);
        return errorResponse(res, 'Failed to update service');
    }
});

router.delete('/services/:serviceId', supabaseAuth, verifyTechnician, async (req, res) => {
    try {
        const userId = req.user.id;
        const { serviceId } = req.params;

        // Get technician ID
        const { data: technician } = await supabaseAdmin
            .from('technicians')
            .select('id')
            .eq('user_id', userId)
            .single();

        if (!technician) {
            return res.status(404).json({ error: 'Technician profile not found' });
        }

        const { error } = await supabaseAdmin
            .from('technician_services')
            .delete()
            .eq('id', serviceId)
            .eq('technician_id', technician.id);

        if (error) throw error;
        return successResponse(res, null, 'Service deleted successfully');
    } catch (error) {
        console.error('Delete service error:', error);
        return errorResponse(res, 'Failed to delete service');
    }
});

// Technician Availability Management
router.get('/availability', supabaseAuth, verifyTechnician, async (req, res) => {
    try {
        const userId = req.user.id;

        // Get technician ID
        const { data: technician } = await supabaseAdmin
            .from('technicians')
            .select('id')
            .eq('user_id', userId)
            .single();

        if (!technician) {
            return res.status(404).json({ error: 'Technician profile not found' });
        }

        const { data: availability, error } = await supabaseAdmin
            .from('technician_availability')
            .select('*')
            .eq('technician_id', technician.id)
            .order('day_of_week');

        if (error) throw error;
        res.json({ availability: availability || [] });
    } catch (error) {
        console.error('Fetch availability error:', error);
        res.status(500).json({ error: 'Failed to fetch availability' });
    }
});

router.post('/availability', supabaseAuth, verifyTechnician, async (req, res) => {
    try {
        const userId = req.user.id;
        const { day_of_week, start_time, end_time, is_available } = req.body;

        // Get technician ID
        const { data: technician } = await supabaseAdmin
            .from('technicians')
            .select('id')
            .eq('user_id', userId)
            .single();

        if (!technician) {
            return res.status(404).json({ error: 'Technician profile not found' });
        }

        const { data: availability, error } = await supabaseAdmin
            .from('technician_availability')
            .upsert([{
                technician_id: technician.id,
                day_of_week,
                start_time,
                end_time,
                is_available: is_available !== false
            }], { onConflict: 'technician_id_day_of_week' })
            .select()
            .single();

        return successResponse(res, availability, 'Availability updated successfully', 201);
    } catch (error) {
        console.error('Update availability error:', error);
        return errorResponse(res, 'Failed to update availability');
    }
});

export default router;