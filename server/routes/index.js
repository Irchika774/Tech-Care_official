import express from 'express';
import User from '../models/User.js';
import Service from '../models/Service.js';
import Bid from '../models/Bid.js';
import Job from '../models/Job.js';
import Appointment from '../models/Appointment.js';
import Review from '../models/Review.js';

const router = express.Router();

// --- Services ---
router.get('/services', async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/services', async (req, res) => {
    const service = new Service(req.body);
    try {
        const newService = await service.save();
        res.status(201).json(newService);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/services/:id', async (req, res) => {
    try {
        const updatedService = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedService);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/services/:id', async (req, res) => {
    try {
        await Service.findByIdAndDelete(req.params.id);
        res.json({ message: 'Service deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- Jobs (User Requests) ---
router.get('/jobs', async (req, res) => {
    try {
        const jobs = await Job.find().populate('postedBy', 'name email').populate({
            path: 'bids', // This is a virtual if we set it up, or we fetch separately. 
            // For now, let's fetch bids separately or aggregate.
            // Actually, let's just populate postedBy.
        }).sort({ createdAt: -1 });

        // To include bids, we might want to do a second query or use aggregate.
        // For simplicity, let's just return jobs. Frontend can fetch bids for a job.
        // Or we can lean on Mongoose virtuals if we add them.
        // Let's manually attach bids count for now if needed, but frontend fetches details.
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/jobs', async (req, res) => {
    const job = new Job(req.body);
    try {
        const newJob = await job.save();
        res.status(201).json(newJob);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// --- Bids ---
router.post('/bids', async (req, res) => {
    const bid = new Bid(req.body);
    try {
        const newBid = await bid.save();
        res.status(201).json(newBid);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.get('/bids', async (req, res) => {
    // Get all bids or filter by jobId
    const { jobId } = req.query;
    try {
        const query = jobId ? { jobId } : {};
        const bids = await Bid.find(query).populate('technicianId', 'name rating');
        res.json(bids);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- Users & Technicians ---
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/users/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/technicians', async (req, res) => {
    try {
        const technicians = await User.find({ role: 'technician' });
        res.json(technicians);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- Appointments ---
router.get('/appointments', async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate('customerId', 'name')
            .populate('technicianId', 'name')
            .populate('serviceId', 'title');
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/appointments', async (req, res) => {
    const appointment = new Appointment(req.body);
    try {
        const newAppointment = await appointment.save();
        res.status(201).json(newAppointment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/appointments/:id', async (req, res) => {
    try {
        const updatedAppointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedAppointment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// --- Reviews ---
router.get('/reviews', async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('customerId', 'name')
            .populate('technicianId', 'name');
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- Nearby Technicians ---
router.get('/technicians/nearby', async (req, res) => {
    const { lng, lat, dist } = req.query;
    try {
        const technicians = await User.find({
            role: 'technician',
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)],
                    },
                    $maxDistance: parseInt(dist) || 5000, // meters
                },
            },
        });
        res.json(technicians);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
