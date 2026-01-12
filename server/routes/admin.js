import express from 'express';
import { supabaseAdmin } from '../lib/supabase.js';
import { supabaseAuth } from '../middleware/supabaseAuth.js';

const router = express.Router();

const adminCheck = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admin only.' });
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

        res.json({
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
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
});

router.get('/users', supabaseAuth, adminCheck, async (req, res) => {
    try {
        const { data: users, error } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        res.json(users || []);
    } catch (err) {
        res.status(500).json({ message: err.message });
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
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        res.json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/users/:id', supabaseAuth, adminCheck, async (req, res) => {
    try {
        const { error } = await supabaseAdmin
            .from('profiles')
            .delete()
            .eq('id', req.params.id);
        
        if (error) throw error;
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/technicians', supabaseAuth, adminCheck, async (req, res) => {
    try {
        const { data: technicians, error } = await supabaseAdmin
            .from('technicians')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        res.json(technicians || []);
    } catch (err) {
        res.status(500).json({ message: err.message });
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
        res.json(technician);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.patch('/technicians/:id/verify', supabaseAuth, adminCheck, async (req, res) => {
    try {
        const { data: technician, error } = await supabaseAdmin
            .from('technicians')
            .update({ is_verified: true, updated_at: new Date().toISOString() })
            .eq('id', req.params.id)
            .select()
            .single();
        
        if (error) throw error;
        res.json({ technician, message: 'Technician verified successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/technicians/:id', supabaseAuth, adminCheck, async (req, res) => {
    try {
        const { error } = await supabaseAdmin
            .from('technicians')
            .delete()
            .eq('id', req.params.id);
        
        if (error) throw error;
        res.json({ message: 'Technician deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
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
        res.json(bookings || []);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/bookings/:id', supabaseAuth, adminCheck, async (req, res) => {
    try {
        const { data: booking, error } = await supabaseAdmin
            .from('bookings')
            .update({ ...req.body, updated_at: new Date().toISOString() })
            .eq('id', req.params.id)
            .select()
            .single();
        
        if (error) throw error;
        res.json(booking);
    } catch (err) {
        res.status(400).json({ message: err.message });
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
        res.json(reviews || []);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/reviews/:id', supabaseAuth, adminCheck, async (req, res) => {
    try {
        const { error } = await supabaseAdmin
            .from('reviews')
            .delete()
            .eq('id', req.params.id);
        
        if (error) throw error;
        res.json({ message: 'Review deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;