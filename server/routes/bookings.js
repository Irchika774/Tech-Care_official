import express from 'express';
import Booking from '../models/Booking.js';
import Bid from '../models/Bid.js';
import Notification from '../models/Notification.js';

const router = express.Router();

// GET /api/bookings/:id - Get booking details
router.get('/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('customer')
            .populate('technician')
            .populate('selectedBid');

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Get all bids for this booking if it's in bidding status
        let bids = [];
        if (booking.hasBids) {
            bids = await Bid.find({ booking: booking._id })
                .populate('technician')
                .sort({ amount: 1 });
        }

        res.json({ booking, bids });
    } catch (error) {
        console.error('Booking fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch booking' });
    }
});

// POST /api/bookings/:id/select-bid - Select a bid (customer action)
router.post('/:id/select-bid', async (req, res) => {
    try {
        const { bidId } = req.body;
        const bookingId = req.params.id;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        const bid = await Bid.findById(bidId);
        if (!bid || bid.booking.toString() !== bookingId) {
            return res.status(404).json({ error: 'Bid not found' });
        }

        // Update booking
        booking.selectedBid = bidId;
        booking.technician = bid.technician;
        booking.estimatedCost = bid.amount;
        booking.status = 'bid_accepted';
        await booking.save();

        // Update bid status
        bid.status = 'accepted';
        await bid.save();

        // Reject other bids
        await Bid.updateMany(
            { booking: bookingId, _id: { $ne: bidId } },
            { status: 'rejected' }
        );

        // Notify winning technician
        await Notification.create({
            recipient: bid.technician,
            recipientRole: 'technician',
            type: 'bid_accepted',
            title: 'Bid Accepted!',
            message: 'Your bid has been accepted by the customer.',
            booking: bookingId,
            bid: bidId,
            priority: 'high'
        });

        res.json({ booking, message: 'Bid selected successfully' });
    } catch (error) {
        console.error('Select bid error:', error);
        res.status(500).json({ error: 'Failed to select bid' });
    }
});

// POST /api/bookings/:id/review - Submit review for booking
router.post('/:id/review', async (req, res) => {
    try {
        const bookingId = req.params.id;
        const { rating, comment } = req.body;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        if (booking.status !== 'completed') {
            return res.status(400).json({ error: 'Can only review completed bookings' });
        }

        // Create review (assuming Review model exists or will be created)
        const Review = (await import('../models/Review.js')).default;
        const review = new Review({
            booking: bookingId,
            customer: booking.customer,
            technician: booking.technician,
            rating,
            comment
        });
        await review.save();

        // Update booking
        booking.hasReview = true;
        booking.review = review._id;
        await booking.save();

        // Update technician rating
        const Technician = (await import('../models/Technician.js')).default;
        const technician = await Technician.findById(booking.technician);

        if (technician) {
            technician.reviewCount += 1;
            technician.ratingBreakdown[rating] = (technician.ratingBreakdown[rating] || 0) + 1;
            technician.rating = technician.calculateRating();
            await technician.save();

            // Notify technician
            await Notification.create({
                recipient: booking.technician,
                recipientRole: 'technician',
                type: 'review_received',
                title: 'New Review',
                message: `You received a ${rating}-star review.`,
                booking: bookingId
            });
        }

        res.status(201).json({ review, message: 'Review submitted successfully' });
    } catch (error) {
        console.error('Review submission error:', error);
        res.status(500).json({ error: 'Failed to submit review' });
    }
});

export default router;
