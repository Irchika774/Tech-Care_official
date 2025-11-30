import mongoose from 'mongoose';

const technicianSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    profileImage: { type: String },

    // Professional details
    description: { type: String },
    specialization: [{ type: String }], // e.g., ['Screen Repair', 'Battery Replacement', 'Water Damage']
    expertise: [{ type: String }], // e.g., ['Mobile', 'PC', 'Tablet', 'Laptop']
    brands: [{ type: String }], // e.g., ['Apple', 'Samsung', 'Google', 'OnePlus']

    // Experience and certification
    experience: { type: Number, default: 0 }, // years
    certifications: [{ type: String }],
    education: { type: String },

    // Pricing
    priceRange: {
        min: { type: Number, default: 0 }, // in LKR
        max: { type: Number, default: 0 }
    },
    hourlyRate: { type: Number, default: 0 }, // in LKR

    // Location and service area
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: [Number], // [longitude, latitude]
        address: { type: String }
    },
    serviceArea: {
        radius: { type: Number, default: 10 }, // km
        cities: [{ type: String }]
    },

    // Availability
    availability: {
        status: { type: String, enum: ['available', 'busy', 'offline'], default: 'available' },
        schedule: {
            monday: { available: { type: Boolean, default: true }, hours: { from: String, to: String } },
            tuesday: { available: { type: Boolean, default: true }, hours: { from: String, to: String } },
            wednesday: { available: { type: Boolean, default: true }, hours: { from: String, to: String } },
            thursday: { available: { type: Boolean, default: true }, hours: { from: String, to: String } },
            friday: { available: { type: Boolean, default: true }, hours: { from: String, to: String } },
            saturday: { available: { type: Boolean, default: true }, hours: { from: String, to: String } },
            sunday: { available: { type: Boolean, default: false }, hours: { from: String, to: String } }
        }
    },

    // Ratings and reviews
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    ratingBreakdown: {
        5: { type: Number, default: 0 },
        4: { type: Number, default: 0 },
        3: { type: Number, default: 0 },
        2: { type: Number, default: 0 },
        1: { type: Number, default: 0 }
    },

    // Statistics
    totalJobs: { type: Number, default: 0 },
    completedJobs: { type: Number, default: 0 },
    cancelledJobs: { type: Number, default: 0 },
    activeJobs: { type: Number, default: 0 },
    activeBids: { type: Number, default: 0 },

    // Earnings
    totalEarnings: { type: Number, default: 0 }, // in LKR
    pendingEarnings: { type: Number, default: 0 },
    availableBalance: { type: Number, default: 0 },

    // Performance metrics
    metrics: {
        averageResponseTime: { type: Number, default: 0 }, // in minutes
        completionRate: { type: Number, default: 0 }, // percentage
        customerSatisfaction: { type: Number, default: 0 }, // percentage
        onTimeCompletion: { type: Number, default: 0 } // percentage
    },

    // Verification
    isVerified: { type: Boolean, default: false },
    verificationDocuments: [{
        type: { type: String },
        url: { type: String },
        status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
    }],

    // Bank details for payments
    bankDetails: {
        accountName: String,
        accountNumber: String,
        bankName: String,
        branchCode: String,
        accountType: { type: String, enum: ['savings', 'current'] }
    },

    // Preferences
    preferences: {
        currency: { type: String, default: 'LKR' },
        language: { type: String, default: 'en' },
        notifications: {
            newJobs: { type: Boolean, default: true },
            bidAccepted: { type: Boolean, default: true },
            paymentReceived: { type: Boolean, default: true },
            customerMessage: { type: Boolean, default: true }
        }
    },

    // Account status
    status: { type: String, enum: ['active', 'suspended', 'deactivated'], default: 'active' },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Indexes (userId index is created automatically by unique: true)
technicianSchema.index({ email: 1 });
technicianSchema.index({ location: '2dsphere' });
technicianSchema.index({ rating: -1 });
technicianSchema.index({ 'availability.status': 1 });
technicianSchema.index({ specialization: 1 });
technicianSchema.index({ brands: 1 });

// Update timestamp on save
technicianSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

// Calculate average rating from breakdown
technicianSchema.methods.calculateRating = function () {
    const breakdown = this.ratingBreakdown;
    const total = breakdown[5] + breakdown[4] + breakdown[3] + breakdown[2] + breakdown[1];
    if (total === 0) return 0;

    const sum = (breakdown[5] * 5) + (breakdown[4] * 4) + (breakdown[3] * 3) + (breakdown[2] * 2) + (breakdown[1] * 1);
    return (sum / total).toFixed(1);
};

export default mongoose.model('Technician', technicianSchema);
