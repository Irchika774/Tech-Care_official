import express from 'express';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Middleware to check if user is admin
const adminCheck = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admin only.' });
    }
};

// Get all users (Admin only)
router.get('/users', auth, adminCheck, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update user (Admin only)
router.put('/users/:id', auth, adminCheck, async (req, res) => {
    try {
        const { password, ...updateData } = req.body;

        // If password is provided, we need to handle it separately because of pre-save hook
        // However, findByIdAndUpdate doesn't trigger pre-save hooks.
        // So if updating password, we should find, update, and save.

        if (password) {
            const user = await User.findById(req.params.id);
            if (!user) return res.status(404).json({ message: 'User not found' });

            // Update fields
            Object.keys(updateData).forEach(key => {
                user[key] = updateData[key];
            });
            user.password = password; // This will trigger hashing in pre-save
            await user.save();

            const userResponse = user.toObject();
            delete userResponse.password;
            return res.json(userResponse);
        }

        // If no password update, use findByIdAndUpdate for efficiency
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete user (Admin only)
router.delete('/users/:id', auth, adminCheck, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
