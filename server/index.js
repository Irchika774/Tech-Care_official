import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/index.js';
import paymentRoutes from './routes/payment.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection with better error handling
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/techcare';
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        });
        console.log('✅ MongoDB Connected Successfully');
    } catch (err) {
        console.log('⚠️  MongoDB Connection Failed:', err.message);
        console.log('📝 Note: App will continue running without database. Install MongoDB or use MongoDB Atlas for full functionality.');
    }
};

// Connect to database
connectDB();

// Handle MongoDB connection errors after initial connection
mongoose.connection.on('error', err => {
    console.log('⚠️  MongoDB Error:', err.message);
});

mongoose.connection.on('disconnected', () => {
    console.log('⚠️  MongoDB Disconnected');
});

// API Routes
app.use('/api', apiRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

    res.json({
        status: 'running',
        timestamp: new Date().toISOString(),
        database: dbStatus,
        port: PORT,
        uptime: process.uptime()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'TechCare API is running',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            payment: '/api/create-payment-intent',
            api: '/api/*'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.path
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err.message);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 TechCare Server running on port ${PORT}`);
    console.log(`📍 API: http://localhost:${PORT}`);
    console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    await mongoose.connection.close();
    process.exit(0);
});
