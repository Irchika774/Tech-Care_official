import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'https://techcare-official-new.netlify.app',
    'https://techcareofficial.netlify.app',
    'https://techcare-flax.vercel.app'
];

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && (allowedOrigins.includes(origin) || origin.endsWith('.netlify.app') || origin.endsWith('.vercel.app'))) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, sentry-trace, baggage');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'sentry-trace', 'baggage'],
    optionsSuccessStatus: 200
}));

app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (req, res) => {
    res.json({
        status: 'running',
        timestamp: new Date().toISOString(),
        port: PORT,
        uptime: process.uptime()
    });
});

app.get('/api/debug-env', (req, res) => {
    res.json({
        SUPABASE_URL: process.env.SUPABASE_URL ? 'SET' : 'NOT SET',
        VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL ? 'SET' : 'NOT SET',
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET',
        NODE_ENV: process.env.NODE_ENV
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

let routesLoaded = false;
let loadingPromise = null;

async function loadRoutes() {
    if (routesLoaded) return;
    if (loadingPromise) return loadingPromise;
    
    loadingPromise = (async () => {
        try {
            const { 
                requestLogger, 
                securityErrorHandler, 
                permissionsPolicy, 
                securityHeaders,
                apiLimiter,
                authLimiter
            } = await import('./middleware/security.js');
            
            app.use(securityHeaders);
            app.use(permissionsPolicy);
            app.use(requestLogger);

            const [
                apiRoutes,
                servicesRoutes,
                paymentRoutes,
                authRoutes,
                supabaseAuthRoutes,
                adminRoutes,
                customerRoutes,
                technicianRoutes,
                gigRoutes,
                bookingRoutes,
                notificationRoutes,
                searchRoutes,
                reviewRoutes,
                loyaltyRoutes,
                emailRoutes,
                jobRoutes,
                blogRoutes,
                commonRoutes
            ] = await Promise.all([
                import('./routes/index.js'),
                import('./routes/services.js'),
                import('./routes/payment.js'),
                import('./routes/auth.js'),
                import('./routes/supabaseAuth.js'),
                import('./routes/admin.js'),
                import('./routes/customers.js'),
                import('./routes/technicians.js'),
                import('./routes/gigs.js'),
                import('./routes/bookings.js'),
                import('./routes/notifications.js'),
                import('./routes/search.js'),
                import('./routes/reviews.js'),
                import('./routes/loyalty.js'),
                import('./routes/emails.js'),
                import('./routes/jobs.js'),
                import('./routes/blog.js'),
                import('./routes/common.js')
            ]);

            app.use('/api/technicians', apiLimiter, technicianRoutes.default);
            app.use('/api/gigs', apiLimiter, gigRoutes.default);
            app.use('/api/customers', apiLimiter, customerRoutes.default);
            app.use('/api/admin', apiLimiter, adminRoutes.default);
            app.use('/api/auth', authLimiter, authRoutes.default);
            app.use('/api/supabase-auth', authLimiter, supabaseAuthRoutes.default);
            app.use('/api/payment', apiLimiter, paymentRoutes.default);
            app.use('/api/bookings', apiLimiter, bookingRoutes.default);
            app.use('/api/notifications', apiLimiter, notificationRoutes.default);
            app.use('/api/search', apiLimiter, searchRoutes.default);
            app.use('/api/reviews', apiLimiter, reviewRoutes.default);
            app.use('/api/loyalty', apiLimiter, loyaltyRoutes.default);
            app.use('/api/emails', apiLimiter, emailRoutes.default);
            app.use('/api/jobs', apiLimiter, jobRoutes.default);
            app.use('/api/services', apiLimiter, servicesRoutes.default);
            app.use('/api/blog', apiLimiter, blogRoutes.default);
            app.use('/api/common', apiLimiter, commonRoutes.default);
            app.use('/api', apiLimiter, apiRoutes.default);

            app.use((req, res) => {
                res.status(404).json({
                    error: 'Route not found',
                    path: req.path
                });
            });

            app.use(securityErrorHandler);

            app.use((err, req, res, next) => {
                console.error('Server Error:', err.stack);
                res.status(err.status || 500).json({
                    error: 'Internal server error',
                    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
                });
            });

            routesLoaded = true;
            console.log('✅ All routes loaded successfully');
        } catch (error) {
            console.error('❌ Failed to load routes:', error.message, error.stack);
            throw error;
        }
    })();
    
    return loadingPromise;
}

const handler = async (req, res) => {
    try {
        await loadRoutes();
        app(req, res);
    } catch (error) {
        console.error('Handler error:', error);
        res.status(500).json({ error: 'Server initialization failed', message: error.message });
    }
};

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    loadRoutes().then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 TechCare Server running on port ${PORT}`);
            console.log(`📍 API: http://localhost:${PORT}`);
            console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
        });
    });
}

export default handler;

process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down gracefully...');
    process.exit(0);
});
