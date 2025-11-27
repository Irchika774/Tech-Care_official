import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'technician', 'admin'], default: 'user' },
    phone: { type: String },
    profileImage: { type: String },

    // Technician-specific fields
    description: { type: String },
    specialization: [{ type: String }], // e.g., ['Screen Repair', 'Battery Replacement']
    brands: [{ type: String }], // e.g., ['Apple', 'Samsung', 'Google']
    experience: { type: Number, default: 0 }, // years
    priceRange: {
        min: { type: Number, default: 0 }, // in USD
        max: { type: Number, default: 0 }
    },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },

    // Location with address (optional - mainly for technicians)
    location: {
        type: { type: String, enum: ['Point'] },
        coordinates: [Number], // [longitude, latitude]
        address: { type: String }
    },

    createdAt: { type: Date, default: Date.now },
});

import bcrypt from 'bcryptjs';

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.index({ location: '2dsphere' }, { sparse: true });

export default mongoose.model('User', userSchema);
