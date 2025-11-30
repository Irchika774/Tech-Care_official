import express from 'express';
import Notification from '../models/Notification.js';

const router = express.Router();

// GET /api/notifications - Get user notifications
router.get('/', async (req, res) => {
    try {
        const { userId, role, limit = 20, skip = 0, unreadOnly = false } = req.query;

        if (!userId || !role) {
            return res.status(400).json({ error: 'userId and role are required' });
        }

        const query = { recipient: userId, recipientRole: role };
        if (unreadOnly === 'true') {
            query.isRead = false;
        }

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        const unreadCount = await Notification.countDocuments({
            recipient: userId,
            recipientRole: role,
            isRead: false
        });

        const total = await Notification.countDocuments(query);

        res.json({
            notifications,
            unreadCount,
            total,
            hasMore: total > parseInt(skip) + parseInt(limit)
        });
    } catch (error) {
        console.error('Notifications fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

// PATCH /api/notifications/:id/read - Mark notification as read
router.patch('/:id/read', async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        await notification.markAsRead();
        res.json({ message: 'Notification marked as read', notification });
    } catch (error) {
        console.error('Notification update error:', error);
        res.status(500).json({ error: 'Failed to update notification' });
    }
});

// PATCH /api/notifications/read-all - Mark all as read
router.patch('/read-all', async (req, res) => {
    try {
        const { userId, role } = req.body;

        if (!userId || !role) {
            return res.status(400).json({ error: 'userId and role are required' });
        }

        await Notification.updateMany(
            { recipient: userId, recipientRole: role, isRead: false },
            { $set: { isRead: true, readAt: new Date() } }
        );

        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        console.error('Mark all read error:', error);
        res.status(500).json({ error: 'Failed to mark all as read' });
    }
});

// DELETE /api/notifications/:id - Delete notification
router.delete('/:id', async (req, res) => {
    try {
        const notification = await Notification.findByIdAndDelete(req.params.id);

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        res.json({ message: 'Notification deleted' });
    } catch (error) {
        console.error('Notification deletion error:', error);
        res.status(500).json({ error: 'Failed to delete notification' });
    }
});

// Helper function to create notification (can be called from other routes)
export const createNotification = async (data) => {
    try {
        const notification = new Notification(data);
        await notification.save();
        return notification;
    } catch (error) {
        console.error('Create notification error:', error);
        throw error;
    }
};

export default router;
