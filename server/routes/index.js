import express from 'express';
import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import Review from '../models/Review.js';

const router = express.Router();

// --- Technicians ---

// Get nearby technicians
router.get('/technicians/nearby', async (req, res) => {
    const { lng, lat, dist } = req.query;
    console.log(`📡 GET /api/technicians/nearby - lng: ${lng}, lat: ${lat}, dist: ${dist}`);

    try {
        // Validate input
        if (!lng || !lat) {
            return res.status(400).json({
                message: 'Missing required parameters: lng and lat'
            });
        }

        const longitude = parseFloat(lng);
        const latitude = parseFloat(lat);
        const maxDistance = parseInt(dist) || 5000; // meters

        console.log(`🔍 Searching for technicians near [${longitude}, ${latitude}] within ${maxDistance}m`);

        // Check if any technicians exist first
        const allTechnicians = await User.find({ role: 'technician' });
        console.log(`📊 Total technicians in database: ${allTechnicians.length}`);

        // If no technicians have location data, return all technicians
        const techniciansWithLocation = allTechnicians.filter(t =>
            t.location && t.location.coordinates && t.location.coordinates.length === 2
        );
        console.log(`📍 Technicians with location data: ${techniciansWithLocation.length}`);

        if (techniciansWithLocation.length === 0) {
            console.log('⚠️  No technicians have location data. Returning all technicians.');
            return res.json(allTechnicians);
        }

        // Try geospatial query
        try {
            const technicians = await User.find({
                role: 'technician',
                'location.coordinates': { $exists: true, $ne: [] },
                location: {
                    $near: {
                        $geometry: {
                            type: 'Point',
                            coordinates: [longitude, latitude],
                        },
                        $maxDistance: maxDistance,
                    },
                },
            });

            console.log(`✅ Found ${technicians.length} nearby technicians`);

            // If no technicians found within radius, return all technicians
            if (technicians.length === 0) {
                console.log('⚠️  No technicians found nearby. Returning all technicians as fallback.');
                return res.json(allTechnicians);
            }

            res.json(technicians);
        } catch (geoError) {
            console.error('⚠️  Geospatial query failed (might need index):', geoError.message);
            console.log('📝 Falling back to returning all technicians');
            // Fallback: return all technicians
            res.json(allTechnicians);
        }
    } catch (err) {
        console.error('❌ Error in nearby technicians endpoint:', err.message);
        res.status(500).json({
            message: err.message,
            error: 'Failed to fetch nearby technicians',
            hint: 'Check server logs for details'
        });
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

// Get all technicians (admin/directory use)
router.get('/technicians/all', async (req, res) => {
    try {
        const technicians = await User.find({ role: 'technician' });
        res.json(technicians);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all users (fallback for admin)
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
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

router.put('/reviews/:id', async (req, res) => {
    try {
        const updatedReview = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedReview);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;
