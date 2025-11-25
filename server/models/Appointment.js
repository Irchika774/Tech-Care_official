import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    technicianId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
    },
    deviceType: {
        type: String,
        required: true
    },
    deviceModel: {
        type: String
    },
    issueDescription: {
        type: String,
        required: true
    },
    appointmentDate: {
        type: Date,
        required: true
    },
    appointmentTime: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
        default: 'pending'
    },
    price: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'LKR'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'refunded'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['credit-card', 'bank-transfer', 'mobile-wallet', 'cash'],
        default: 'cash'
    },
    location: {
        address: String,
        city: String,
        coordinates: {
            type: { type: String, default: 'Point' },
            coordinates: [Number] // [longitude, latitude]
        }
    },
    notes: {
        type: String
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    review: {
        type: String
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

// Index for geospatial queries
appointmentSchema.index({ 'location.coordinates': '2dsphere' });

// Update the updatedAt timestamp before saving
appointmentSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.model('Appointment', appointmentSchema);
