import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import { validateEnv } from './lib/validateEnv.js';
validateEnv();

import apiRoutes from './routes/index.js';
import paymentRoutes from './routes/payment.js';
import authRoutes from './routes/auth.js';
import supabaseAuthRoutes from './routes/supabaseAuth.js';
import adminRoutes from './routes/admin.js';
import customerRoutes from './routes/customers.js';
import technicianRoutes from './routes/technicians.js';
import bookingRoutes from './routes/bookings.js';
import notificationRoutes from './routes/notifications.js';
import searchRoutes from './routes/search.js';
import { supabaseAdmin } from './lib/supabase.js';

import {
    securityHeaders,
    apiLimiter,
    authLimiter,
    corsOptions,
    requestLogger,
    securityErrorHandler
} from './middleware/security.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(securityHeaders);
app.use(cors(corsOptions));
app.use(requestLogger);
app.use(express.json());

app.use('/api/technicians', apiLimiter, technicianRoutes);
app.use('/api', apiLimiter, apiRoutes);
app.use('/api/payment', apiLimiter, paymentRoutes);
app.use('/api/bookings', apiLimiter, bookingRoutes);
app.use('/api/notifications', apiLimiter, notificationRoutes);
app.use('/api/search', apiLimiter, searchRoutes);

app.get('/api/health', async (req, res) => {
    let dbStatus = 'disconnected';
    try {
        if (supabaseAdmin) {
            const { data, error } = await supabaseAdmin.from('profiles').select('count').limit(1);
            dbStatus = error ? 'error' : 'connected';
        }
    } catch (e) {
        dbStatus = 'error';
    }

    res.json({
        status: 'running',
        timestamp: new Date().toISOString(),
        database: dbStatus,
        port: PORT,
        uptime: process.uptime()
    });
});

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

app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.path
    });
});

app.use(securityErrorHandler);

app.use((err, req, res, next) => {
    console.error('Server Error:', err.message);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 TechCare Server running on port ${PORT}`);
    console.log(`📍 API: http://localhost:${PORT}`);
    console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
});

process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down gracefully...');
    process.exit(0);
});