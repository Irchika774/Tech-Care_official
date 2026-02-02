import express from 'express';
import { supabaseAdmin } from '../lib/supabase.js';
import { supabaseAuth } from '../middleware/supabaseAuth.js';
import { successResponse, errorResponse } from '../lib/response.js';

const router = express.Router();

router.get('/', supabaseAuth, async (req, res) => {
    try {
        const { limit = 20, skip = 0, unreadOnly = false, userId: requestedUserId } = req.query;

        // Determine the target User ID from the token context
        let targetUserId = requestedUserId;

        // Validation: Ensure the requestedUserId belongs to the authenticated user
        const allowedIds = [req.user.id, req.user.customerId, req.user.technicianId].filter(id => id);

        if (targetUserId && !allowedIds.includes(targetUserId)) {
            return errorResponse(res, 'Access denied. You can only view your own notifications.', 403);
        }

        // If no userId provided, default to best guess (Customer or Technician ID, then Auth ID)
        if (!targetUserId) {
            targetUserId = req.user.technicianId || req.user.customerId || req.user.id;
        }

        if (!targetUserId) {
            return successResponse(res, { notifications: [], unreadCount: 0, total: 0, hasMore: false });
        }

        let query = supabaseAdmin
            .from('notifications')
            .select('*', { count: 'exact' })
            .eq('user_id', targetUserId);

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
            .eq('user_id', targetUserId)
            .eq('read', false);

        return successResponse(res, {
            notifications: notifications || [],
            unreadCount: unreadCount || 0,
            total: count || 0,
            hasMore: (count || 0) > parseInt(skip) + parseInt(limit)
        });
    } catch (error) {
        console.error('Notifications fetch error:', error);
        return errorResponse(res, 'Failed to fetch notifications');
    }
});

router.patch('/:id/read', supabaseAuth, async (req, res) => {
    try {
        const allowedIds = [req.user.id, req.user.customerId, req.user.technicianId].filter(id => id);

        // Security check: verify the notification belongs to one of the user's IDs
        const { data: notificationCheck } = await supabaseAdmin
            .from('notifications')
            .select('user_id')
            .eq('id', req.params.id)
            .single();

        if (notificationCheck && !allowedIds.includes(notificationCheck.user_id)) {
            return errorResponse(res, 'Access denied', 403);
        }

        const { data: notification, error } = await supabaseAdmin
            .from('notifications')
            .update({ read: true })
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;
        return successResponse(res, notification, 'Notification marked as read');
    } catch (error) {
        console.error('Notification update error:', error);
        return errorResponse(res, 'Failed to update notification');
    }
});

router.patch('/read-all', supabaseAuth, async (req, res) => {
    try {
        const { userId } = req.body;

        let targetUserId = userId;
        const allowedIds = [req.user.id, req.user.customerId, req.user.technicianId].filter(id => id);

        if (targetUserId && !allowedIds.includes(targetUserId)) {
            return errorResponse(res, 'Access denied.', 403);
        }

        if (!targetUserId) {
            targetUserId = req.user.technicianId || req.user.customerId || req.user.id;
        }

        const { error } = await supabaseAdmin
            .from('notifications')
            .update({ read: true })
            .eq('user_id', targetUserId)
            .eq('read', false);

        if (error) throw error;
        return successResponse(res, null, 'All notifications marked as read');
    } catch (error) {
        console.error('Mark all read error:', error);
        return errorResponse(res, 'Failed to mark all as read');
    }
});

router.delete('/:id', supabaseAuth, async (req, res) => {
    try {
        const allowedIds = [req.user.id, req.user.customerId, req.user.technicianId].filter(id => id);

        // Security check
        const { data: notificationCheck } = await supabaseAdmin
            .from('notifications')
            .select('user_id')
            .eq('id', req.params.id)
            .single();

        if (notificationCheck && !allowedIds.includes(notificationCheck.user_id)) {
            return errorResponse(res, 'Access denied', 403);
        }

        const { error } = await supabaseAdmin
            .from('notifications')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;
        return successResponse(res, null, 'Notification deleted');
    } catch (error) {
        console.error('Notification deletion error:', error);
        return errorResponse(res, 'Failed to delete notification');
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
