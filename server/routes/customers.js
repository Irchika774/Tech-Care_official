import express from 'express';
import Customer from '../models/Customer.js';
import Booking from '../models/Booking.js';
import Notification from '../models/Notification.js';

const router = express.Router();

// Middleware to verify customer access (placeholder - implement proper auth)
const verifyCustomer = (req, res, next) => {
    // TODO: Implement JWT verification
    // For now, we'll assume req.user is set by auth middleware
    if (!req.user || req.user.role !== 'customer') {
        return res.status(403).json({ error: 'Access denied. Customer role required.' });
    }
    next();
};

// GET /api/customers/dashboard - Get customer dashboard statistics
router.get('/dashboard', verifyCustomer, async (req, res) => {
    try {
        const customerId = req.user.customerId;

        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        // Get active bookings
        const activeBookings = await Booking.find({
            customer: customerId,
            status: { $in: ['pending', 'confirmed', 'scheduled', 'in_progress'] }
        }).populate('technician').limit(5).sort({ createdAt: -1 });

        // Get recent bookings
        const recentBookings = await Booking.find({
            customer: customerId
        }).populate('technician').limit(10).sort({ createdAt: -1 });

        // Calculate statistics
        const stats = {
            totalBookings: customer.totalBookings,
            activeBookings: customer.activeBookings,
            completedBookings: customer.completedBookings,
            cancelledBookings: customer.cancelledBookings,
            totalSpent: customer.totalSpent,
            favoriteTechniciansCount: customer.favoriteTechnicians.length
        };

        res.json({
            customer: {
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                profileImage: customer.profileImage
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

// GET /api/customers/bookings - Get all customer bookings
router.get('/bookings', verifyCustomer, async (req, res) => {
    try {
        const customerId = req.user.customerId;
        const { status, limit = 20, skip = 0 } = req.query;

        const query = { customer: customerId };
        if (status) {
            query.status = status;
        }

        const bookings = await Booking.find(query)
            .populate('technician')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        const total = await Booking.countDocuments(query);

        res.json({
            bookings,
            total,
            hasMore: total > parseInt(skip) + parseInt(limit)
        });
    } catch (error) {
        console.error('Bookings fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

// POST /api/customers/bookings - Create new booking
router.post('/bookings', verifyCustomer, async (req, res) => {
    try {
        const customerId = req.user.customerId;
        const bookingData = {
            customer: customerId,
            ...req.body
        };

        const booking = new Booking(bookingData);
        await booking.save();

        // Update customer statistics
        await Customer.findByIdAndUpdate(customerId, {
            $inc: { totalBookings: 1, activeBookings: 1 }
        });

        // Create notification for customer
        await Notification.create({
            recipient: req.user.userId,
            recipientRole: 'customer',
            type: 'booking_created',
            title: 'Booking Created',
            message: 'Your service booking has been created successfully.',
            booking: booking._id,
            actionUrl: `/bookings/${booking._id}`
        });

        res.status(201).json({ booking, message: 'Booking created successfully' });
    } catch (error) {
        console.error('Booking creation error:', error);
        res.status(500).json({ error: 'Failed to create booking' });
    }
});

// PATCH /api/customers/bookings/:id - Update booking (reschedule/cancel)
router.patch('/bookings/:id', verifyCustomer, async (req, res) => {
    try {
        const customerId = req.user.customerId;
        const bookingId = req.params.id;
        const { action, ...updateData } = req.body;

        const booking = await Booking.findOne({ _id: bookingId, customer: customerId });
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        if (action === 'cancel') {
            booking.status = 'cancelled';
            booking.cancellation = {
                cancelledBy: 'customer',
                reason: updateData.reason || 'No reason provided',
                cancelledAt: new Date()
            };

            await Customer.findByIdAndUpdate(customerId, {
                $inc: { activeBookings: -1, cancelledBookings: 1 }
            });

            // Notify technician if assigned
            if (booking.technician) {
                await Notification.create({
                    recipient: booking.technician,
                    recipientRole: 'technician',
                    type: 'booking_cancelled',
                    title: 'Booking Cancelled',
                    message: 'A customer has cancelled their booking.',
                    booking: booking._id
                });
            }
        } else if (action === 'reschedule') {
            booking.scheduledDate = updateData.scheduledDate;
            booking.status = 'scheduled';

            // Notify technician
            if (booking.technician) {
                await Notification.create({
                    recipient: booking.technician,
                    recipientRole: 'technician',
                    type: 'booking_rescheduled',
                    title: 'Booking Rescheduled',
                    message: 'A booking has been rescheduled.',
                    booking: booking._id
                });
            }
        } else {
            // General update
            Object.assign(booking, updateData);
        }

        await booking.save();

        res.json({ booking, message: 'Booking updated successfully' });
    } catch (error) {
        console.error('Booking update error:', error);
        res.status(500).json({ error: 'Failed to update booking' });
    }
});

// GET /api/customers/favorites - Get favorite technicians
router.get('/favorites', verifyCustomer, async (req, res) => {
    try {
        const customerId = req.user.customerId;

        const customer = await Customer.findById(customerId)
            .populate('favoriteTechnicians');

        res.json({ favorites: customer.favoriteTechnicians });
    } catch (error) {
        console.error('Favorites fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch favorites' });
    }
});

// POST /api/customers/favorites/:techId - Add to favorites
router.post('/favorites/:techId', verifyCustomer, async (req, res) => {
    try {
        const customerId = req.user.customerId;
        const technicianId = req.params.techId;

        const customer = await Customer.findById(customerId);

        if (customer.favoriteTechnicians.includes(technicianId)) {
            return res.status(400).json({ error: 'Technician already in favorites' });
        }

        customer.favoriteTechnicians.push(technicianId);
        await customer.save();

        res.json({ message: 'Added to favorites' });
    } catch (error) {
        console.error('Add favorite error:', error);
        res.status(500).json({ error: 'Failed to add favorite' });
    }
});

// DELETE /api/customers/favorites/:techId - Remove from favorites
router.delete('/favorites/:techId', verifyCustomer, async (req, res) => {
    try {
        const customerId = req.user.customerId;
        const technicianId = req.params.techId;

        const customer = await Customer.findById(customerId);
        customer.favoriteTechnicians = customer.favoriteTechnicians.filter(
            id => id.toString() !== technicianId
        );
        await customer.save();

        res.json({ message: 'Removed from favorites' });
    } catch (error) {
        console.error('Remove favorite error:', error);
        res.status(500).json({ error: 'Failed to remove favorite' });
    }
});

// GET /api/customers/notifications - Get notifications
router.get('/notifications', verifyCustomer, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { limit = 20, skip = 0, unreadOnly = false } = req.query;

        const query = { recipient: userId, recipientRole: 'customer' };
        if (unreadOnly === 'true') {
            query.isRead = false;
        }

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        const unreadCount = await Notification.countDocuments({
            recipient: userId,
            recipientRole: 'customer',
            isRead: false
        });

        res.json({ notifications, unreadCount });
    } catch (error) {
        console.error('Notifications fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

// PATCH /api/customers/notifications/:id - Mark as read
router.patch('/notifications/:id', verifyCustomer, async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        await notification.markAsRead();
        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error('Notification update error:', error);
        res.status(500).json({ error: 'Failed to update notification' });
    }
});

// GET /api/customers/profile - Get customer profile
router.get('/profile', verifyCustomer, async (req, res) => {
    try {
        const customerId = req.user.customerId;
        const customer = await Customer.findById(customerId);

        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        res.json({ customer });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// PATCH /api/customers/profile - Update customer profile
router.patch('/profile', verifyCustomer, async (req, res) => {
    try {
        const customerId = req.user.customerId;
        const allowedUpdates = ['name', 'phone', 'address', 'preferences', 'profileImage'];

        const updates = {};
        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        const customer = await Customer.findByIdAndUpdate(
            customerId,
            { $set: updates },
            { new: true, runValidators: true }
        );

        res.json({ customer, message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

export default router;
