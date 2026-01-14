import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../.env') });

import { validateEnv } from './lib/validateEnv.js';
validateEnv();

import { supabaseAdmin } from './lib/supabase.js';
import {
    requestLogger,
    securityErrorHandler,
    permissionsPolicy,
    securityHeaders,
    corsOptions,
    apiLimiter,
    authLimiter
} from './middleware/security.js';

// Import Routes
import apiRoutes from './routes/index.js';
import servicesRoutes from './routes/services.js';
import paymentRoutes from './routes/payment.js';
import authRoutes from './routes/auth.js';
import supabaseAuthRoutes from './routes/supabaseAuth.js';
import adminRoutes from './routes/admin.js';
import customerRoutes from './routes/customers.js';
import technicianRoutes from './routes/technicians.js';
import gigRoutes from './routes/gigs.js';
import bookingRoutes from './routes/bookings.js';
import notificationRoutes from './routes/notifications.js';
import searchRoutes from './routes/search.js';
import reviewRoutes from './routes/reviews.js';
import loyaltyRoutes from './routes/loyalty.js';
import emailRoutes from './routes/emails.js';
import jobRoutes from './routes/jobs.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
// Global Middleware
app.use(cors({
    origin: function (origin, callback) {
        // Allow all origins for now to fix CORS issues, or a specific whitelist
        if (!origin) return callback(null, true);
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:3000',
            'https://techcareofficial.netlify.app',
            'https://techcare-flax.vercel.app',
            'https://techcare-official-new.netlify.app'
        ];
        const isAllowed = allowedOrigins.includes(origin) ||
            origin?.endsWith('.netlify.app') ||
            origin?.endsWith('.vercel.app') ||
            origin?.includes('localhost');

        if (isAllowed) {
            callback(null, true);
        } else {
            console.warn(`Blocked request from origin: ${origin}`);
            callback(null, true); // Still allow during debugging, or change to callback(new Error('Not allowed by CORS')) for strict mode
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    optionsSuccessStatus: 200
}));

app.options('*', cors()); // Enable pre-flight for all routes

app.use(securityHeaders);
app.use(permissionsPolicy);
app.use(express.json({ limit: '10mb' }));
app.use(requestLogger);

// API Routes
app.use('/api/technicians', apiLimiter, technicianRoutes);
app.use('/api/gigs', apiLimiter, gigRoutes);
app.use('/api/customers', apiLimiter, customerRoutes);
app.use('/api/admin', apiLimiter, adminRoutes);
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/supabase-auth', authLimiter, supabaseAuthRoutes);
app.use('/api/payment', apiLimiter, paymentRoutes);
app.use('/api/bookings', apiLimiter, bookingRoutes);
app.use('/api/notifications', apiLimiter, notificationRoutes);
app.use('/api/search', apiLimiter, searchRoutes);
app.use('/api/reviews', apiLimiter, reviewRoutes);
app.use('/api/loyalty', apiLimiter, loyaltyRoutes);
app.use('/api/emails', apiLimiter, emailRoutes);
app.use('/api/jobs', apiLimiter, jobRoutes);
app.use('/api/services', apiLimiter, servicesRoutes);
app.use('/api', apiLimiter, apiRoutes);

// Health Check
app.get('/api/health', async (req, res) => {
    let dbStatus = 'disconnected';
    const start = Date.now();
    try {
        if (supabaseAdmin) {
            const { error } = await Promise.race([
                supabaseAdmin.from('profiles').select('id').limit(1),
                new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 5000))
            ]);
            dbStatus = error ? 'error' : 'connected';
        }
    } catch (e) {
        dbStatus = 'error';
    }

    res.json({
        status: 'running',
        timestamp: new Date().toISOString(),
        supabase: dbStatus,
        latency: `${Date.now() - start}ms`,
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
            api: '/api/*'
        }
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.path
    });
});

// Error Handling
app.use(securityErrorHandler);

app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    res.status(err.status || 500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// Only start the server if we're not in a Vercel environment (where it exports the app)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`🚀 TechCare Server running on port ${PORT}`);
        console.log(`📍 API: http://localhost:${PORT}`);
        console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
    });
}

export default app;

process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down gracefully...');
    process.exit(0);
});
