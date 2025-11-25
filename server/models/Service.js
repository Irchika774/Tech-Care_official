import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    basePrice: { type: Number, required: true },
    image: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Admin or Technician
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Service', serviceSchema);
