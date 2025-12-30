import express from 'express';
import { supabaseAdmin } from '../lib/supabase.js';

const router = express.Router();

router.get('/bookings', async (req, res) => {
    try {
        const { data: bookings, error } = await supabaseAdmin
            .from('bookings')
            .select(`
                *,
                customer:customers(id, name, email),
                technician:technicians(id, name, email, phone, rating)
            `)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        res.json(bookings || []);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/bookings', async (req, res) => {
    try {
        const { data: booking, error } = await supabaseAdmin
            .from('bookings')
            .insert([req.body])
            .select()
            .single();
        
        if (error) throw error;
        res.status(201).json(booking);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/bookings/:id', async (req, res) => {
    try {
        const { data: booking, error } = await supabaseAdmin
            .from('bookings')
            .update(req.body)
            .eq('id', req.params.id)
            .select()
            .single();
        
        if (error) throw error;
        res.json(booking);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.get('/users', async (req, res) => {
    try {
        const { data: users, error } = await supabaseAdmin
            .from('profiles')
            .select('*');
        
        if (error) throw error;
        res.json(users || []);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/reviews', async (req, res) => {
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

router.put('/reviews/:id', async (req, res) => {
    try {
        const { data: review, error } = await supabaseAdmin
            .from('reviews')
            .update(req.body)
            .eq('id', req.params.id)
            .select()
            .single();
        
        if (error) throw error;
        res.json(review);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;