import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Customer from '../models/Customer.js';
import Technician from '../models/Technician.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ error: 'User already exists' });

        // Create User
        user = new User({ name, email, password, role });
        await user.save();

        let profileId = null;

        try {
            // Create specific profile based on role
            if (role === 'technician') {
                const technician = new Technician({
                    userId: user._id,
                    name: user.name,
                    email: user.email,
                    phone: 'Not provided', // Required field
                    location: {
                        type: 'Point',
                        coordinates: [0, 0]
                    }
                    // Initialize other required fields if any
                });
                await technician.save();
                profileId = technician._id;
            } else {
                // Default to customer for 'user' or 'customer' role
                const customer = new Customer({
                    userId: user._id,
                    name: user.name,
                    email: user.email,
                    location: {
                        type: 'Point',
                        coordinates: [0, 0]
                    }
                });
                await customer.save();
                profileId = customer._id;
            }
        } catch (profileError) {
            // Rollback user creation if profile creation fails
            await User.findByIdAndDelete(user._id);
            throw new Error(`Failed to create user profile: ${profileError.message}`);
        }

        // Generate Token
        const payload = {
            _id: user._id,
            role: user.role,
            userId: user._id // Redundant but useful
        };

        if (role === 'technician') {
            payload.technicianId = profileId;
        } else {
            payload.customerId = profileId;
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1d' });

        res.status(201).json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profileId // Return profile ID for frontend convenience
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Demo accounts (work without database)
        const demoAccounts = {
            'demo@techcare.com': {
                _id: 'demo-user-001',
                name: 'Demo User',
                email: 'demo@techcare.com',
                password: 'demo123',
                role: 'user',
                customerId: 'demo-customer-001'
            },
            'admin@techcare.com': {
                _id: 'demo-admin-001',
                name: 'Admin User',
                email: 'admin@techcare.com',
                password: 'admin123',
                role: 'admin'
            },
            'customer@techcare.com': {
                _id: 'demo-customer-001',
                name: 'Customer User',
                email: 'customer@techcare.com',
                password: 'customer123',
                role: 'user',
                customerId: 'demo-customer-001'
            },
            'tech@techcare.com': {
                _id: 'demo-tech-001',
                name: 'Technician User',
                email: 'tech@techcare.com',
                password: 'tech123',
                role: 'technician',
                technicianId: 'demo-tech-001'
            }
        };

        // Check demo accounts first
        if (demoAccounts[email]) {
            const demoUser = demoAccounts[email];
            if (password === demoUser.password) {
                const payload = {
                    _id: demoUser._id,
                    role: demoUser.role,
                    userId: demoUser._id
                };

                if (demoUser.customerId) payload.customerId = demoUser.customerId;
                if (demoUser.technicianId) payload.technicianId = demoUser.technicianId;

                const token = jwt.sign(
                    payload,
                    process.env.JWT_SECRET || 'your_jwt_secret',
                    { expiresIn: '1d' }
                );

                return res.status(200).json({
                    token,
                    user: {
                        _id: demoUser._id,
                        name: demoUser.name,
                        email: demoUser.email,
                        role: demoUser.role
                    }
                });
            }
        }

        // Database Authentication
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Invalid email or password' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });

        // Find associated profile
        let profileId = null;
        if (user.role === 'technician') {
            const tech = await Technician.findOne({ userId: user._id });
            if (tech) {
                profileId = tech._id;
            } else {
                // Auto-create if missing (migration/fallback)
                const newTech = new Technician({
                    userId: user._id,
                    name: user.name,
                    email: user.email,
                    phone: 'Not provided',
                    location: {
                        type: 'Point',
                        coordinates: [0, 0]
                    }
                });
                await newTech.save();
                profileId = newTech._id;
            }
        } else if (user.role === 'user' || user.role === 'customer') {
            const cust = await Customer.findOne({ userId: user._id });
            if (cust) {
                profileId = cust._id;
            } else {
                // Auto-create if missing (migration/fallback)
                const newCust = new Customer({
                    userId: user._id,
                    name: user.name,
                    email: user.email,
                    location: {
                        type: 'Point',
                        coordinates: [0, 0]
                    }
                });
                await newCust.save();
                profileId = newCust._id;
            }
        }

        const payload = {
            _id: user._id,
            role: user.role,
            userId: user._id
        };

        if (user.role === 'technician') {
            payload.technicianId = profileId;
        } else if (user.role === 'user' || user.role === 'customer') {
            payload.customerId = profileId;
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1d' });

        res.status(200).json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get Current User
router.get('/me', auth, async (req, res) => {
    try {
        // Check for demo users first
        const demoAccounts = [
            { _id: 'demo-user-001', name: 'Demo User', email: 'demo@techcare.com', role: 'user' },
            { _id: 'demo-admin-001', name: 'Admin User', email: 'admin@techcare.com', role: 'admin' },
            { _id: 'demo-customer-001', name: 'Customer User', email: 'customer@techcare.com', role: 'user' },
            { _id: 'demo-tech-001', name: 'Technician User', email: 'tech@techcare.com', role: 'technician' }
        ];

        const demoUser = demoAccounts.find(u => u._id === req.user._id);
        if (demoUser) {
            return res.json(demoUser);
        }

        // Try database if not a demo user
        if (User.db.readyState === 1) {
            const user = await User.findById(req.user._id).select('-password');
            if (user) return res.json(user);
        }

        res.status(404).json({ error: 'User not found' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
