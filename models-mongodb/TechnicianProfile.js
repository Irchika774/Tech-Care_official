import mongoose from 'mongoose';

const technicianProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    businessName: {
        type: String
    },
    bio: {
        type: String
    },
    specializations: [{
        type: String
    }],
    certifications: [{
        name: String,
        issuedBy: String,
        issuedDate: Date,
        expiryDate: Date,
        certificateUrl: String
    }],
    experience: {
        type: Number, // years of experience
        default: 0
    },
    hourlyRate: {
        type: Number
    },
    currency: {
        type: String,
        default: 'LKR'
    },
    availability: {
        monday: { available: Boolean, hours: String },
        tuesday: { available: Boolean, hours: String },
        wednesday: { available: Boolean, hours: String },
        thursday: { available: Boolean, hours: String },
        friday: { available: Boolean, hours: String },
        saturday: { available: Boolean, hours: String },
        sunday: { available: Boolean, hours: String }
    },
    serviceArea: {
        radius: { type: Number, default: 10 }, // in kilometers
        cities: [String]
    },
    stats: {
        totalJobs: { type: Number, default: 0 },
        completedJobs: { type: Number, default: 0 },
        cancelledJobs: { type: Number, default: 0 },
        averageRating: { type: Number, default: 0 },
        totalReviews: { type: Number, default: 0 },
        totalEarnings: { type: Number, default: 0 },
        responseTime: { type: Number, default: 0 }, // in minutes
        acceptanceRate: { type: Number, default: 0 } // percentage
    },
    portfolio: [{
        title: String,
        description: String,
        images: [String],
        completedDate: Date
    }],
    documents: {
        idProof: String,
        businessLicense: String,
        insurance: String
    },
    verified: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
technicianProfileSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.model('TechnicianProfile', technicianProfileSchema);
