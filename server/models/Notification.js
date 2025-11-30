import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipientRole: {
        type: String,
        enum: ['customer', 'technician', 'admin'],
        required: true
    },

    type: {
        type: String,
        enum: [
            'booking_created',
            'booking_confirmed',
            'booking_cancelled',
            'booking_rescheduled',
            'booking_completed',
            'bid_submitted',
            'bid_accepted',
            'bid_rejected',
            'payment_received',
            'payment_pending',
            'review_received',
            'message_received',
            'system_announcement'
        ],
        required: true
    },

    title: { type: String, required: true },
    message: { type: String, required: true },

    // Related entities
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    },
    bid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bid'
    },

    // Notification data
    data: mongoose.Schema.Types.Mixed,

    // Status
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },

    // Priority
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },

    // Action link
    actionUrl: { type: String },
    actionText: { type: String },

    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date } // Auto-delete after this date
});

// Indexes
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Mark as read
notificationSchema.methods.markAsRead = function () {
    this.isRead = true;
    this.readAt = new Date();
    return this.save();
};

export default mongoose.model('Notification', notificationSchema);
