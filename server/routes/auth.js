import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ error: 'User already exists' });

        user = new User({ name, email, password, role });
        await user.save();

        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1d' });

        res.status(201).json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Demo accounts (work without database)
        const demoAccounts = {
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
                role: 'user'
            },
            'tech@techcare.com': {
                _id: 'demo-tech-001',
                name: 'Technician User',
                email: 'tech@techcare.com',
                password: 'tech123',
                role: 'technician'
            }
        };

        // Check demo accounts first
        if (demoAccounts[email]) {
            const demoUser = demoAccounts[email];
            if (password === demoUser.password) {
                const token = jwt.sign(
                    { _id: demoUser._id, role: demoUser.role },
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

        // Try database authentication if MongoDB is connected
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Invalid email or password' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });

        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1d' });

        res.status(200).json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Current User
router.get('/me', auth, async (req, res) => {
    try {
        // Check for demo users first
        const demoAccounts = [
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
