import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    technicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    estimatedTime: { type: String, required: true },
    message: { type: String },
    warranty: { type: String },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Bid', bidSchema);
