import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    deviceBrand: { type: String, required: true },
    deviceModel: { type: String, required: true },
    issue: { type: String },
    location: { type: String, required: true },
    budgetMin: { type: Number, required: true },
    budgetMax: { type: Number, required: true },
    urgency: { type: String, enum: ['urgent', 'normal', 'flexible'], default: 'normal' },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['open', 'assigned', 'completed', 'cancelled'], default: 'open' },
    photos: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Job', jobSchema);
