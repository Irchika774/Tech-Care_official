import express from 'express';
import Technician from '../models/Technician.js';
import Booking from '../models/Booking.js';
import Bid from '../models/Bid.js';
import Notification from '../models/Notification.js';

const router = express.Router();

// Middleware to verify technician access
const verifyTechnician = (req, res, next) => {
    if (!req.user || req.user.role !== 'technician') {
        return res.status(403).json({ error: 'Access denied. Technician role required.' });
    }
    next();
};

// GET /api/technicians/dashboard - Get technician dashboard statistics
router.get('/dashboard', verifyTechnician, async (req, res) => {
    try {
        const technicianId = req.user.technicianId;

        const technician = await Technician.findById(technicianId);
        if (!technician) {
            return res.status(404).json({ error: 'Technician not found' });
        }

        // Get active jobs
        const activeJobs = await Booking.find({
            technician: technicianId,
            status: { $in: ['confirmed', 'scheduled', 'in_progress'] }
        }).populate('customer').limit(5).sort({ scheduledDate: 1 });

        // Get active bids
        const activeBids = await Bid.find({
            technician: technicianId,
            status: 'pending'
        }).populate('booking').limit(5).sort({ createdAt: -1 });

        // Calculate today's earnings
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayEarnings = await Booking.aggregate([
            {
                $match: {
                    technician: technician._id,
                    status: 'completed',
                    completedDate: { $gte: today }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$actualCost' }
                }
            }
        ]);

        const stats = {
            totalJobs: technician.totalJobs,
            completedJobs: technician.completedJobs,
            activeJobs: technician.activeJobs,
            activeBids: technician.activeBids,
            rating: technician.rating,
            reviewCount: technician.reviewCount,
            totalEarnings: technician.totalEarnings,
            availableBalance: technician.availableBalance,
            todayEarnings: todayEarnings[0]?.total || 0,
            completionRate: technician.metrics.completionRate,
            responseTime: technician.metrics.averageResponseTime
        };

        res.json({
            technician: {
                name: technician.name,
                email: technician.email,
                phone: technician.phone,
                profileImage: technician.profileImage,
                isVerified: technician.isVerified
            },
            stats,
            activeJobs,
            activeBids
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
});

// GET /api/technicians/jobs - Get available jobs for bidding
router.get('/jobs', verifyTechnician, async (req, res) => {
    try {
        const technicianId = req.user.technicianId;
        const technician = await Technician.findById(technicianId);

        // Find jobs that match technician's specialization and are open for bidding
        // Matches bookings that are pending or in bidding phase, and not yet assigned to a technician
        const jobs = await Booking.find({
            status: { $in: ['pending', 'bidding'] },
            technician: { $exists: false },
            // Optional: Filter by service type if needed, but let's keep it broad for now or use the guide's logic if strict
            // serviceType: { $in: technician.expertise.map(e => e.toLowerCase().replace(' ', '_')) } 
        })
            .populate('customer', 'name location')
            .sort({ createdAt: -1 })
            .limit(50);

        res.json({ jobs });
    } catch (error) {
        console.error('Jobs fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
});

// GET /api/technicians/bookings - Get accepted/assigned bookings
router.get('/bookings', verifyTechnician, async (req, res) => {
    try {
        const technicianId = req.user.technicianId;
        const { status, limit = 20, skip = 0 } = req.query;

        const query = { technician: technicianId };
        if (status) {
            query.status = status;
        }

        const bookings = await Booking.find(query)
            .populate('customer')
            .sort({ scheduledDate: 1 })
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

// PATCH /api/technicians/bookings/:id/accept - Accept a job
router.patch('/bookings/:id/accept', verifyTechnician, async (req, res) => {
    try {
        const technicianId = req.user.technicianId;
        const bookingId = req.params.id;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        if (booking.technician && booking.technician.toString() !== technicianId) {
            return res.status(403).json({ error: 'This booking is assigned to another technician' });
        }

        booking.technician = technicianId;
        booking.status = 'confirmed';
        await booking.save();

        // Update technician statistics
        await Technician.findByIdAndUpdate(technicianId, {
            $inc: { activeJobs: 1, totalJobs: 1 }
        });

        // Notify customer
        await Notification.create({
            recipient: booking.customer,
            recipientRole: 'customer',
            type: 'booking_confirmed',
            title: 'Booking Confirmed',
            message: 'A technician has accepted your booking.',
            booking: booking._id
        });

        res.json({ booking, message: 'Job accepted successfully' });
    } catch (error) {
        console.error('Accept job error:', error);
        res.status(500).json({ error: 'Failed to accept job' });
    }
});

// PATCH /api/technicians/bookings/:id/complete - Mark job as complete
router.patch('/bookings/:id/complete', verifyTechnician, async (req, res) => {
    try {
        const technicianId = req.user.technicianId;
        const bookingId = req.params.id;
        const { actualCost, notes } = req.body;

        const booking = await Booking.findOne({
            _id: bookingId,
            technician: technicianId
        });

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        booking.status = 'completed';
        booking.completedDate = new Date();
        booking.actualCost = actualCost || booking.estimatedCost;
        if (notes) {
            booking.technicianNotes = notes;
        }

        await booking.save();

        // Update technician statistics
        await Technician.findByIdAndUpdate(technicianId, {
            $inc: {
                activeJobs: -1,
                completedJobs: 1,
                totalEarnings: booking.actualCost,
                pendingEarnings: booking.actualCost
            }
        });

        // Notify customer
        await Notification.create({
            recipient: booking.customer,
            recipientRole: 'customer',
            type: 'booking_completed',
            title: 'Service Completed',
            message: 'Your service has been completed. Please review the technician.',
            booking: booking._id
        });

        res.json({ booking, message: 'Job marked as complete' });
    } catch (error) {
        console.error('Complete job error:', error);
        res.status(500).json({ error: 'Failed to complete job' });
    }
});

// POST /api/technicians/bids - Submit a bid
router.post('/bids', verifyTechnician, async (req, res) => {
    try {
        const technicianId = req.user.technicianId;
        const { bookingId, amount, message, estimatedDuration } = req.body;

        // Check if booking exists and is open for bidding
        const booking = await Booking.findById(bookingId);
        if (!booking || booking.status !== 'bidding') {
            return res.status(400).json({ error: 'Booking not available for bidding' });
        }

        // Check if technician already bid
        const existingBid = await Bid.findOne({ booking: bookingId, technician: technicianId });
        if (existingBid) {
            return res.status(400).json({ error: 'You have already bid on this job' });
        }

        const bid = new Bid({
            booking: bookingId,
            technician: technicianId,
            amount,
            message,
            estimatedDuration
        });

        await bid.save();

        // Update technician statistics
        await Technician.findByIdAndUpdate(technicianId, {
            $inc: { activeBids: 1 }
        });

        // Notify customer
        await Notification.create({
            recipient: booking.customer,
            recipientRole: 'customer',
            type: 'bid_submitted',
            title: 'New Bid Received',
            message: 'A technician has submitted a bid for your service request.',
            booking: bookingId,
            bid: bid._id
        });

        res.status(201).json({ bid, message: 'Bid submitted successfully' });
    } catch (error) {
        console.error('Bid submission error:', error);
        res.status(500).json({ error: 'Failed to submit bid' });
    }
});

// GET /api/technicians/bids - Get all bids
router.get('/bids', verifyTechnician, async (req, res) => {
    try {
        const technicianId = req.user.technicianId;
        const { status } = req.query;

        const query = { technician: technicianId };
        if (status) {
            query.status = status;
        }

        const bids = await Bid.find(query)
            .populate('booking')
            .sort({ createdAt: -1 });

        res.json({ bids });
    } catch (error) {
        console.error('Bids fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch bids' });
    }
});

// PATCH /api/technicians/bids/:id - Update bid
router.patch('/bids/:id', verifyTechnician, async (req, res) => {
    try {
        const technicianId = req.user.technicianId;
        const bidId = req.params.id;
        const { amount, message, estimatedDuration } = req.body;

        const bid = await Bid.findOne({ _id: bidId, technician: technicianId });
        if (!bid) {
            return res.status(404).json({ error: 'Bid not found' });
        }

        if (bid.status !== 'pending') {
            return res.status(400).json({ error: 'Cannot update accepted or rejected bid' });
        }

        if (amount) bid.amount = amount;
        if (message) bid.message = message;
        if (estimatedDuration) bid.estimatedDuration = estimatedDuration;

        await bid.save();

        res.json({ bid, message: 'Bid updated successfully' });
    } catch (error) {
        console.error('Bid update error:', error);
        res.status(500).json({ error: 'Failed to update bid' });
    }
});

// GET /api/technicians/earnings - Get earnings history
router.get('/earnings', verifyTechnician, async (req, res) => {
    try {
        const technicianId = req.user.technicianId;
        const { startDate, endDate } = req.query;

        const query = {
            technician: technicianId,
            status: 'completed',
            'payment.status': 'paid'
        };

        if (startDate && endDate) {
            query.completedDate = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const earnings = await Booking.find(query)
            .select('completedDate actualCost payment')
            .sort({ completedDate: -1 });

        const technician = await Technician.findById(technicianId);

        res.json({
            earnings,
            summary: {
                totalEarnings: technician.totalEarnings,
                pendingEarnings: technician.pendingEarnings,
                availableBalance: technician.availableBalance
            }
        });
    } catch (error) {
        console.error('Earnings fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch earnings' });
    }
});

// GET /api/technicians/analytics - Get performance analytics
router.get('/analytics', verifyTechnician, async (req, res) => {
    try {
        const technicianId = req.user.technicianId;
        const technician = await Technician.findById(technicianId);

        // Get monthly earnings for the last 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyEarnings = await Booking.aggregate([
            {
                $match: {
                    technician: technician._id,
                    status: 'completed',
                    completedDate: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$completedDate' },
                        month: { $month: '$completedDate' }
                    },
                    total: { $sum: '$actualCost' },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 }
            }
        ]);

        res.json({
            metrics: technician.metrics,
            ratingBreakdown: technician.ratingBreakdown,
            monthlyEarnings,
            stats: {
                totalJobs: technician.totalJobs,
                completedJobs: technician.completedJobs,
                cancelledJobs: technician.cancelledJobs,
                rating: technician.rating,
                reviewCount: technician.reviewCount
            }
        });
    } catch (error) {
        console.error('Analytics fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

// GET /api/technicians/profile - Get technician profile
router.get('/profile', verifyTechnician, async (req, res) => {
    try {
        const technicianId = req.user.technicianId;
        const technician = await Technician.findById(technicianId);

        if (!technician) {
            return res.status(404).json({ error: 'Technician not found' });
        }

        res.json({ technician });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// PATCH /api/technicians/profile - Update technician profile
router.patch('/profile', verifyTechnician, async (req, res) => {
    try {
        const technicianId = req.user.technicianId;
        const allowedUpdates = [
            'name', 'phone', 'description', 'specialization', 'expertise',
            'brands', 'experience', 'certifications', 'priceRange', 'hourlyRate',
            'location', 'serviceArea', 'availability', 'preferences', 'profileImage',
            'bankDetails'
        ];

        const updates = {};
        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        const technician = await Technician.findByIdAndUpdate(
            technicianId,
            { $set: updates },
            { new: true, runValidators: true }
        );

        res.json({ technician, message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

export default router;
