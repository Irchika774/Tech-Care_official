import express from 'express';
import Job from '../models/Job.js';
import Bid from '../models/Bid.js';
import { supabaseAuth } from '../middleware/supabaseAuth.js';
import { successResponse, errorResponse } from '../lib/response.js';

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

        return successResponse(res, {
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
        return errorResponse(res, 'Failed to fetch jobs');
    }
});

// GET single job by ID
router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('postedBy', 'name email phone');

        if (!job) {
            return errorResponse(res, 'Job not found', 404);
        }

        // Get bids for this job
        const bids = await Bid.find({ jobId: job._id })
            .populate('technicianId', 'name email rating reviewCount')
            .sort('-createdAt');

        return successResponse(res, { job, bids });
    } catch (error) {
        console.error('Error fetching job:', error);
        return errorResponse(res, 'Failed to fetch job');
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

        return successResponse(res, populatedJob, 'Job posted successfully', 201);
    } catch (error) {
        console.error('Error creating job:', error);
        return errorResponse(res, 'Failed to create job');
    }
});

// PUT update job status
router.put('/:id', supabaseAuth, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return errorResponse(res, 'Job not found', 404);
        }

        // Check if user owns this job or is an admin
        if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return errorResponse(res, 'Not authorized to update this job', 403);
        }

        const { status } = req.body;
        if (status) job.status = status;

        await job.save();

        return successResponse(res, job, 'Job updated successfully');
    } catch (error) {
        console.error('Error updating job:', error);
        return errorResponse(res, 'Failed to update job');
    }
});

// DELETE job
router.delete('/:id', supabaseAuth, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return errorResponse(res, 'Job not found', 404);
        }

        // Check if user owns this job or is an admin
        if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return errorResponse(res, 'Not authorized to delete this job', 403);
        }

        await Job.findByIdAndDelete(req.params.id);
        // Also delete all bids for this job
        await Bid.deleteMany({ jobId: req.params.id });

        return successResponse(res, null, 'Job deleted successfully');
    } catch (error) {
        console.error('Error deleting job:', error);
        return errorResponse(res, 'Failed to delete job');
    }
});

// ==================== BIDS ====================

// GET all bids for a job
router.get('/:jobId/bids', async (req, res) => {
    try {
        const bids = await Bid.find({ jobId: req.params.jobId })
            .populate('technicianId', 'name email rating reviewCount specialization experience')
            .sort('-createdAt');

        return successResponse(res, { bids });
    } catch (error) {
        console.error('Error fetching bids:', error);
        return errorResponse(res, 'Failed to fetch bids');
    }
});

// GET bids by technician (protected)
router.get('/my-bids', supabaseAuth, async (req, res) => {
    try {
        const bids = await Bid.find({ technicianId: req.user.id })
            .populate('jobId')
            .sort('-createdAt');

        return successResponse(res, { bids });
    } catch (error) {
        console.error('Error fetching technician bids:', error);
        return errorResponse(res, 'Failed to fetch bids');
    }
});

// POST create new bid (protected - technicians only)
router.post('/bids', supabaseAuth, async (req, res) => {
    try {
        const { jobId, amount, estimatedTime, message, warranty } = req.body;

        // Check if job exists and is open
        const job = await Job.findById(jobId);
        if (!job) {
            return errorResponse(res, 'Job not found', 404);
        }

        if (job.status !== 'open') {
            return errorResponse(res, 'Job is no longer open for bidding', 400);
        }

        // Check if technician already bid on this job
        const existingBid = await Bid.findOne({
            jobId,
            technicianId: req.user.id
        });

        if (existingBid) {
            return errorResponse(res, 'You have already bid on this job', 400);
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

        return successResponse(res, populatedBid, 'Bid placed successfully', 201);
    } catch (error) {
        console.error('Error creating bid:', error);
        return errorResponse(res, 'Failed to place bid');
    }
});

// PUT update bid status (accept/reject)
router.put('/bids/:id', supabaseAuth, async (req, res) => {
    try {
        const bid = await Bid.findById(req.params.id).populate('jobId');

        if (!bid) {
            return errorResponse(res, 'Bid not found', 404);
        }

        // Check if user owns the job this bid is for
        if (bid.jobId.postedBy.toString() !== req.user.id) {
            return errorResponse(res, 'Not authorized to update this bid', 403);
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

        return successResponse(res, bid, 'Bid updated successfully');
    } catch (error) {
        console.error('Error updating bid:', error);
        return errorResponse(res, 'Failed to update bid');
    }
});

// DELETE bid (technician can delete their own bid if still pending)
router.delete('/bids/:id', supabaseAuth, async (req, res) => {
    try {
        const bid = await Bid.findById(req.params.id);

        if (!bid) {
            return errorResponse(res, 'Bid not found', 404);
        }

        // Check if user owns this bid
        if (bid.technicianId.toString() !== req.user.id) {
            return errorResponse(res, 'Not authorized to delete this bid', 403);
        }

        if (bid.status !== 'pending') {
            return errorResponse(res, 'Can only delete pending bids', 400);
        }

        await Bid.findByIdAndDelete(req.params.id);

        return successResponse(res, null, 'Bid deleted successfully');
    } catch (error) {
        console.error('Error deleting bid:', error);
        return errorResponse(res, 'Failed to delete bid');
    }
});

export default router;
