import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    profileImage: { type: String },

    // Customer-specific fields
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: { type: String, default: 'Sri Lanka' }
    },

    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: [Number], // [longitude, latitude]
    },

    preferences: {
        currency: { type: String, default: 'LKR' },
        language: { type: String, default: 'en' },
        notifications: {
            email: { type: Boolean, default: true },
            sms: { type: Boolean, default: false },
            push: { type: Boolean, default: true }
        }
    },

    // Favorites
    favoriteTechnicians: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Technician'
    }],

    // Statistics
    totalBookings: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 }, // in LKR
    activeBookings: { type: Number, default: 0 },
    completedBookings: { type: Number, default: 0 },
    cancelledBookings: { type: Number, default: 0 },

    // Payment methods
    paymentMethods: [{
        type: { type: String, enum: ['card', 'bank', 'mobile'] },
        details: mongoose.Schema.Types.Mixed,
        isDefault: { type: Boolean, default: false }
    }],

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Indexes (userId index is created automatically by unique: true)
customerSchema.index({ email: 1 });
customerSchema.index({ location: '2dsphere' });

// Update timestamp on save
customerSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

export default mongoose.model('Customer', customerSchema);
