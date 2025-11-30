import express from 'express';
import Technician from '../models/Technician.js';

const router = express.Router();

// POST /api/search/technicians - Search and filter technicians
router.post('/technicians', async (req, res) => {
    try {
        const {
            searchTerm,
            serviceType,
            brands,
            specializations,
            minRating,
            maxPrice,
            latitude,
            longitude,
            maxDistance, // in kilometers
            availability,
            sortBy = 'rating', // rating, price, distance
            limit = 20,
            skip = 0
        } = req.body;

        // Build query
        const query = { status: 'active', isVerified: true };

        // Text search
        if (searchTerm) {
            query.$or = [
                { name: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } },
                { 'location.address': { $regex: searchTerm, $options: 'i' } }
            ];
        }

        // Service type/expertise filter
        if (serviceType) {
            query.expertise = { $in: [serviceType] };
        }

        // Brand filter
        if (brands && brands.length > 0) {
            query.brands = { $in: brands };
        }

        // Specialization filter
        if (specializations && specializations.length > 0) {
            query.specialization = { $in: specializations };
        }

        // Rating filter
        if (minRating) {
            query.rating = { $gte: parseFloat(minRating) };
        }

        // Price filter
        if (maxPrice) {
            query['priceRange.min'] = { $lte: parseFloat(maxPrice) };
        }

        // Availability filter
        if (availability) {
            query['availability.status'] = availability;
        }

        // Location-based search
        let technicians;
        if (latitude && longitude) {
            const maxDistanceMeters = (maxDistance || 50) * 1000; // Convert km to meters

            technicians = await Technician.aggregate([
                {
                    $geoNear: {
                        near: {
                            type: 'Point',
                            coordinates: [parseFloat(longitude), parseFloat(latitude)]
                        },
                        distanceField: 'distance',
                        maxDistance: maxDistanceMeters,
                        spherical: true,
                        query: query
                    }
                },
                {
                    $addFields: {
                        distanceKm: { $divide: ['$distance', 1000] }
                    }
                },
                {
                    $skip: parseInt(skip)
                },
                {
                    $limit: parseInt(limit)
                }
            ]);

            // Sort by specified criteria
            if (sortBy === 'rating') {
                technicians.sort((a, b) => b.rating - a.rating);
            } else if (sortBy === 'price') {
                technicians.sort((a, b) => a.priceRange.min - b.priceRange.min);
            }
            // distance is already sorted by geoNear
        } else {
            // No location provided, regular search
            let sortOptions = {};
            if (sortBy === 'rating') {
                sortOptions.rating = -1;
            } else if (sortBy === 'price') {
                sortOptions['priceRange.min'] = 1;
            } else {
                sortOptions.createdAt = -1;
            }

            technicians = await Technician.find(query)
                .sort(sortOptions)
                .limit(parseInt(limit))
                .skip(parseInt(skip))
                .lean();
        }

        // Get total count for pagination
        const total = await Technician.countDocuments(query);

        res.json({
            technicians,
            total,
            hasMore: total > parseInt(skip) + parseInt(limit),
            filters: {
                searchTerm,
                serviceType,
                brands,
                specializations,
                minRating,
                maxPrice,
                location: latitude && longitude ? { latitude, longitude, maxDistance } : null,
                sortBy
            }
        });
    } catch (error) {
        console.error('Technician search error:', error);
        res.status(500).json({ error: 'Failed to search technicians' });
    }
});

// GET /api/search/nearby - Get nearby technicians (simpler endpoint)
router.get('/nearby', async (req, res) => {
    try {
        const { lat, lng, maxDistance = 10, serviceType, limit = 20 } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({ error: 'Latitude and longitude are required' });
        }

        const maxDistanceMeters = parseFloat(maxDistance) * 1000;
        const query = { status: 'active', isVerified: true };

        if (serviceType) {
            query.expertise = { $in: [serviceType] };
        }

        const technicians = await Technician.aggregate([
            {
                $geoNear: {
                    near: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    distanceField: 'distance',
                    maxDistance: maxDistanceMeters,
                    spherical: true,
                    query: query
                }
            },
            {
                $addFields: {
                    distanceKm: { $divide: ['$distance', 1000] }
                }
            },
            {
                $limit: parseInt(limit)
            },
            {
                $project: {
                    name: 1,
                    rating: 1,
                    reviewCount: 1,
                    priceRange: 1,
                    specialization: 1,
                    expertise: 1,
                    profileImage: 1,
                    'location.address': 1,
                    'location.coordinates': 1,
                    distanceKm: 1,
                    'availability.status': 1
                }
            }
        ]);

        res.json({ technicians, count: technicians.length });
    } catch (error) {
        console.error('Nearby search error:', error);
        res.status(500).json({ error: 'Failed to find nearby technicians' });
    }
});

// GET /api/search/filters - Get available filter options
router.get('/filters', async (req, res) => {
    try {
        // Get unique values for filters
        const brands = await Technician.distinct('brands', { status: 'active' });
        const specializations = await Technician.distinct('specialization', { status: 'active' });
        const expertise = await Technician.distinct('expertise', { status: 'active' });

        // Get price range
        const priceStats = await Technician.aggregate([
            { $match: { status: 'active' } },
            {
                $group: {
                    _id: null,
                    minPrice: { $min: '$priceRange.min' },
                    maxPrice: { $max: '$priceRange.max' },
                    avgPrice: { $avg: '$priceRange.min' }
                }
            }
        ]);

        res.json({
            brands: brands.sort(),
            specializations: specializations.sort(),
            expertise: expertise.sort(),
            priceRange: priceStats[0] || { minPrice: 0, maxPrice: 10000, avgPrice: 2000 }
        });
    } catch (error) {
        console.error('Get filters error:', error);
        res.status(500).json({ error: 'Failed to get filter options' });
    }
});

// POST /api/search/geocode - Convert address to coordinates
router.post('/geocode', async (req, res) => {
    try {
        const { address } = req.body;

        if (!address) {
            return res.status(400).json({ error: 'Address is required' });
        }

        // This is a placeholder - in production, you would use Google Geocoding API
        // For now, return a sample response
        // const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

        res.json({
            message: 'Geocoding endpoint - integrate with Google Maps Geocoding API',
            address,
            // coordinates: { lat: 6.9271, lng: 79.8612 } // Colombo, Sri Lanka (sample)
        });
    } catch (error) {
        console.error('Geocode error:', error);
        res.status(500).json({ error: 'Failed to geocode address' });
    }
});

export default router;
