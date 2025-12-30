import express from 'express';
import { supabaseAdmin } from '../lib/supabase.js';
import { supabaseAuth } from '../middleware/supabaseAuth.js';

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
            .in('status', ['confirmed', 'scheduled', 'in_progress'])
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
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
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
        
        if (error) throw error;
        res.json({ jobs: jobs || [] });
    } catch (error) {
        console.error('Jobs fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch jobs' });
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
            bookings: bookings || [],
            total: count || 0,
            hasMore: (count || 0) > parseInt(skip) + parseInt(limit)
        });
    } catch (error) {
        console.error('Bookings fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
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
        
        res.json({ booking, message: 'Job accepted successfully' });
    } catch (error) {
        console.error('Accept job error:', error);
        res.status(500).json({ error: 'Failed to accept job' });
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
        
        res.json({ booking, message: 'Job marked as complete' });
    } catch (error) {
        console.error('Complete job error:', error);
        res.status(500).json({ error: 'Failed to complete job' });
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
        
        res.status(201).json({ bid, message: 'Bid submitted successfully' });
    } catch (error) {
        console.error('Bid submission error:', error);
        res.status(500).json({ error: 'Failed to submit bid' });
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
            return res.json({ bids: [] });
        }
        
        let query = supabaseAdmin
            .from('bids')
            .select('*, booking:bookings!bids_booking_id_fkey(*)')
            .eq('technician_id', technician.id);
        
        if (status) query = query.eq('status', status);
        
        const { data: bids, error } = await query.order('created_at', { ascending: false });
        
        if (error) throw error;
        res.json({ bids: bids || [] });
    } catch (error) {
        console.error('Bids fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch bids' });
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
            return res.json({ earnings: [], summary: { totalEarnings: 0, pendingEarnings: 0, availableBalance: 0 } });
        }
        
        const { data: earnings } = await supabaseAdmin
            .from('bookings')
            .select('id, completed_date, price, payment_status')
            .eq('technician_id', technician.id)
            .eq('status', 'completed')
            .order('completed_date', { ascending: false });
        
        res.json({
            earnings: earnings || [],
            summary: {
                totalEarnings: technician.total_earnings || 0,
                pendingEarnings: technician.pending_earnings || 0,
                availableBalance: technician.available_balance || 0
            }
        });
    } catch (error) {
        console.error('Earnings fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch earnings' });
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
            return res.json({
                metrics: { averageResponseTime: 0, completionRate: 0, customerSatisfaction: 0, onTimeCompletion: 0 },
                ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
                monthlyEarnings: [],
                stats: { totalJobs: 0, completedJobs: 0, cancelledJobs: 0, rating: 0, reviewCount: 0 }
            });
        }
        
        res.json({
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
        res.status(500).json({ error: 'Failed to fetch analytics' });
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
        
        if (error || !technician) {
            return res.status(404).json({ error: 'Technician not found' });
        }
        
        res.json({ technician });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

router.patch('/profile', supabaseAuth, verifyTechnician, async (req, res) => {
    try {
        const userId = req.user.id;
        const updates = { ...req.body, updated_at: new Date().toISOString() };
        
        const { data: technician, error } = await supabaseAdmin
            .from('technicians')
            .update(updates)
            .eq('user_id', userId)
            .select()
            .single();
        
        if (error) throw error;
        res.json({ technician, message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

export default router;