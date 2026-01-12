import express from 'express';
import Job from '../models/Job.js';
import Bid from '../models/Bid.js';
import { supabaseAuth } from '../middleware/supabaseAuth.js';

const router = express.Router();

// ==================== JOBS ====================

// GET all jobs (with filters)
router.get('/', async (req, res) => {
    try {
        const {
            category,
            status,
            urgency,
            minBudget,
            maxBudget,
            sort = '-createdAt',
            limit = 50,
            page = 1
        } = req.query;

        const filter = {};
        if (category) filter.category = category;
        if (status) filter.status = status;
        if (urgency) filter.urgency = urgency;
        if (minBudget || maxBudget) {
            filter.budgetMin = {};
            if (minBudget) filter.budgetMin.$gte = Number(minBudget);
            if (maxBudget) filter.budgetMax = { $lte: Number(maxBudget) };
        }

        const skip = (Number(page) - 1) * Number(limit);

        const jobs = await Job.find(filter)
            .populate('postedBy', 'name email')
            .sort(sort)
            .limit(Number(limit))
            .skip(skip);

        const total = await Job.countDocuments(filter);

        res.json({
            jobs,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit)),
                limit: Number(limit)
            }
        });
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ error: 'Failed to fetch jobs', message: error.message });
    }
});

// GET single job by ID
router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('postedBy', 'name email phone');

        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        // Get bids for this job
        const bids = await Bid.find({ jobId: job._id })
            .populate('technicianId', 'name email rating reviewCount')
            .sort('-createdAt');

        res.json({ job, bids });
    } catch (error) {
        console.error('Error fetching job:', error);
        res.status(500).json({ error: 'Failed to fetch job', message: error.message });
    }
});

// POST create new job (protected - customers only)
router.post('/', supabaseAuth, async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            deviceBrand,
            deviceModel,
            issue,
            location,
            budgetMin,
            budgetMax,
            urgency,
            photos
        } = req.body;

        const job = new Job({
            title,
            description,
            category,
            deviceBrand,
            deviceModel,
            issue,
            location,
            budgetMin,
            budgetMax,
            urgency: urgency || 'normal',
            postedBy: req.user.id, // Use Supabase ID
            photos: photos || [],
            status: 'open'
        });

        await job.save();

        const populatedJob = await Job.findById(job._id).populate('postedBy', 'name email');

        res.status(201).json({
            message: 'Job posted successfully',
            job: populatedJob
        });
    } catch (error) {
        console.error('Error creating job:', error);
        res.status(500).json({ error: 'Failed to create job', message: error.message });
    }
});

// PUT update job status
router.put('/:id', supabaseAuth, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        // Check if user owns this job or is an admin
        if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized to update this job' });
        }

        const { status } = req.body;
        if (status) job.status = status;

        await job.save();

        res.json({ message: 'Job updated successfully', job });
    } catch (error) {
        console.error('Error updating job:', error);
        res.status(500).json({ error: 'Failed to update job', message: error.message });
    }
});

// DELETE job
router.delete('/:id', supabaseAuth, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        // Check if user owns this job or is an admin
        if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized to delete this job' });
        }

        await Job.findByIdAndDelete(req.params.id);
        // Also delete all bids for this job
        await Bid.deleteMany({ jobId: req.params.id });

        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        console.error('Error deleting job:', error);
        res.status(500).json({ error: 'Failed to delete job', message: error.message });
    }
});

// ==================== BIDS ====================

// GET all bids for a job
router.get('/:jobId/bids', async (req, res) => {
    try {
        const bids = await Bid.find({ jobId: req.params.jobId })
            .populate('technicianId', 'name email rating reviewCount specialization experience')
            .sort('-createdAt');

        res.json({ bids });
    } catch (error) {
        console.error('Error fetching bids:', error);
        res.status(500).json({ error: 'Failed to fetch bids', message: error.message });
    }
});

// GET bids by technician (protected)
router.get('/my-bids', supabaseAuth, async (req, res) => {
    try {
        const bids = await Bid.find({ technicianId: req.user.id })
            .populate('jobId')
            .sort('-createdAt');

        res.json({ bids });
    } catch (error) {
        console.error('Error fetching technician bids:', error);
        res.status(500).json({ error: 'Failed to fetch bids', message: error.message });
    }
});

// POST create new bid (protected - technicians only)
router.post('/bids', supabaseAuth, async (req, res) => {
    try {
        const { jobId, amount, estimatedTime, message, warranty } = req.body;

        // Check if job exists and is open
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        if (job.status !== 'open') {
            return res.status(400).json({ error: 'Job is no longer open for bidding' });
        }

        // Check if technician already bid on this job
        const existingBid = await Bid.findOne({
            jobId,
            technicianId: req.user.id
        });

        if (existingBid) {
            return res.status(400).json({ error: 'You have already bid on this job' });
        }

        const bid = new Bid({
            jobId,
            technicianId: req.user.id,
            amount,
            estimatedTime,
            message: message || '',
            warranty: warranty || '',
            status: 'pending'
        });

        await bid.save();

        const populatedBid = await Bid.findById(bid._id)
            .populate('technicianId', 'name email rating')
            .populate('jobId');

        res.status(201).json({
            message: 'Bid placed successfully',
            bid: populatedBid
        });
    } catch (error) {
        console.error('Error creating bid:', error);
        res.status(500).json({ error: 'Failed to place bid', message: error.message });
    }
});

// PUT update bid status (accept/reject)
router.put('/bids/:id', supabaseAuth, async (req, res) => {
    try {
        const bid = await Bid.findById(req.params.id).populate('jobId');

        if (!bid) {
            return res.status(404).json({ error: 'Bid not found' });
        }

        // Check if user owns the job this bid is for
        if (bid.jobId.postedBy.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to update this bid' });
        }

        const { status } = req.body;

        if (status === 'accepted') {
            bid.status = 'accepted';
            // Update job status to assigned
            await Job.findByIdAndUpdate(bid.jobId._id, { status: 'assigned' });
            // Reject all other bids for this job
            await Bid.updateMany(
                { jobId: bid.jobId._id, _id: { $ne: bid._id } },
                { status: 'rejected' }
            );
        } else if (status === 'rejected') {
            bid.status = 'rejected';
        }

        await bid.save();

        res.json({ message: 'Bid updated successfully', bid });
    } catch (error) {
        console.error('Error updating bid:', error);
        res.status(500).json({ error: 'Failed to update bid', message: error.message });
    }
});

// DELETE bid (technician can delete their own bid if still pending)
router.delete('/bids/:id', supabaseAuth, async (req, res) => {
    try {
        const bid = await Bid.findById(req.params.id);

        if (!bid) {
            return res.status(404).json({ error: 'Bid not found' });
        }

        // Check if user owns this bid
        if (bid.technicianId.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to delete this bid' });
        }

        if (bid.status !== 'pending') {
            return res.status(400).json({ error: 'Can only delete pending bids' });
        }

        await Bid.findByIdAndDelete(req.params.id);

        res.json({ message: 'Bid deleted successfully' });
    } catch (error) {
        console.error('Error deleting bid:', error);
        res.status(500).json({ error: 'Failed to delete bid', message: error.message });
    }
});

export default router;
