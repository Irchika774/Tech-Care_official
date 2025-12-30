import express from 'express';
import { supabaseAdmin } from '../lib/supabase.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { userId, role, limit = 20, skip = 0, unreadOnly = false } = req.query;
        
        if (!userId) {
            return res.json({ notifications: [], unreadCount: 0, total: 0, hasMore: false });
        }
        
        let query = supabaseAdmin
            .from('notifications')
            .select('*', { count: 'exact' })
            .eq('user_id', userId);
        
        if (unreadOnly === 'true') {
            query = query.eq('read', false);
        }
        
        const { data: notifications, count, error } = await query
            .order('created_at', { ascending: false })
            .range(parseInt(skip), parseInt(skip) + parseInt(limit) - 1);
        
        if (error) throw error;
        
        const { count: unreadCount } = await supabaseAdmin
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('read', false);
        
        res.json({
            notifications: notifications || [],
            unreadCount: unreadCount || 0,
            total: count || 0,
            hasMore: (count || 0) > parseInt(skip) + parseInt(limit)
        });
    } catch (error) {
        console.error('Notifications fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

router.patch('/:id/read', async (req, res) => {
    try {
        const { data: notification, error } = await supabaseAdmin
            .from('notifications')
            .update({ read: true })
            .eq('id', req.params.id)
            .select()
            .single();
        
        if (error) throw error;
        res.json({ message: 'Notification marked as read', notification });
    } catch (error) {
        console.error('Notification update error:', error);
        res.status(500).json({ error: 'Failed to update notification' });
    }
});

router.patch('/read-all', async (req, res) => {
    try {
        const { userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }
        
        const { error } = await supabaseAdmin
            .from('notifications')
            .update({ read: true })
            .eq('user_id', userId)
            .eq('read', false);
        
        if (error) throw error;
        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        console.error('Mark all read error:', error);
        res.status(500).json({ error: 'Failed to mark all as read' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { error } = await supabaseAdmin
            .from('notifications')
            .delete()
            .eq('id', req.params.id);
        
        if (error) throw error;
        res.json({ message: 'Notification deleted' });
    } catch (error) {
        console.error('Notification deletion error:', error);
        res.status(500).json({ error: 'Failed to delete notification' });
    }
});

export const createNotification = async (data) => {
    try {
        const { data: notification, error } = await supabaseAdmin
            .from('notifications')
            .insert([{
                user_id: data.userId || data.recipient,
                title: data.title,
                message: data.message,
                type: data.type,
                data: data.data || {}
            }])
            .select()
            .single();
        
        if (error) throw error;
        return notification;
    } catch (error) {
        console.error('Create notification error:', error);
        throw error;
    }
};

export default router;
