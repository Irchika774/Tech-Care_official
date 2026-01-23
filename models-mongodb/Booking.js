import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    technician: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Technician'
    },

    // Service details
    serviceType: {
        type: String,
        enum: ['mobile_repair', 'pc_repair', 'tablet_repair', 'laptop_repair', 'other'],
        required: true
    },
    device: {
        brand: String,
        model: String,
        type: String
    },
    issue: {
        category: String,
        description: { type: String, required: true },
        urgency: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' }
    },

    // Scheduling
    scheduledDate: { type: Date, required: true },
    estimatedDuration: { type: Number }, // in minutes
    completedDate: { type: Date },

    // Location
    location: {
        type: { type: String, enum: ['on-site', 'technician-location'], default: 'on-site' },
        address: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: { type: String, default: 'Sri Lanka' }
        },
        coordinates: {
            type: { type: String, enum: ['Point'], default: 'Point' },
            coordinates: [Number]
        }
    },

    // Pricing
    estimatedCost: { type: Number }, // in LKR
    actualCost: { type: Number },
    currency: { type: String, default: 'LKR' },

    // Bids (if technician not directly assigned)
    hasBids: { type: Boolean, default: false },
    selectedBid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bid'
    },

    // Status tracking
    status: {
        type: String,
        enum: [
            'pending',           // Just created, waiting for technician
            'bidding',          // Open for bids
            'bid_accepted',     // Bid accepted, waiting confirmation
            'confirmed',        // Confirmed by both parties
            'scheduled',        // Scheduled for specific date/time
            'in_progress',      // Technician is working
            'completed',        // Work completed
            'cancelled',        // Cancelled by customer or technician
            'disputed'          // Issue raised
        ],
        default: 'pending'
    },

    statusHistory: [{
        status: String,
        timestamp: { type: Date, default: Date.now },
        note: String,
        updatedBy: { type: String, enum: ['customer', 'technician', 'system'] }
    }],

    // Communication
    notes: { type: String },
    customerNotes: { type: String },
    technicianNotes: { type: String },

    // Images
    images: [{
        url: String,
        caption: String,
        uploadedBy: { type: String, enum: ['customer', 'technician'] },
        uploadedAt: { type: Date, default: Date.now }
    }],

    // Payment
    payment: {
        status: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
        method: String,
        transactionId: String,
        paidAt: Date
    },

    // Review
    hasReview: { type: Boolean, default: false },
    review: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    },

    // Cancellation
    cancellation: {
        cancelledBy: { type: String, enum: ['customer', 'technician', 'admin'] },
        reason: String,
        cancelledAt: Date
    },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Indexes
bookingSchema.index({ customer: 1, status: 1 });
bookingSchema.index({ technician: 1, status: 1 });
bookingSchema.index({ scheduledDate: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ 'location.coordinates': '2dsphere' });

// Update timestamp on save
bookingSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

// Add status to history when status changes
bookingSchema.pre('save', function (next) {
    if (this.isModified('status')) {
        this.statusHistory.push({
            status: this.status,
            timestamp: new Date(),
            updatedBy: 'system'
        });
    }
    next();
});

export default mongoose.model('Booking', bookingSchema);
