import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

// Rate limiting middleware with localhost bypass for testing
export const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 100, options = {}) => {
    return rateLimit({
        windowMs, // 15 minutes by default
        max, // limit each IP to max requests per windowMs
        message: {
            error: 'Too many requests from this IP, please try again later.',
            retryAfter: Math.ceil(windowMs / 1000 / 60) + ' minutes'
        },
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        skip: (req) => {
            // Skip rate limiting for localhost (for testing)
            const ip = req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress;
            const isLocalhost = ip === '127.0.0.1' ||
                ip === '::1' ||
                ip === '::ffff:127.0.0.1' ||
                ip?.includes('127.0.0.1') ||
                ip === 'localhost';

            if (isLocalhost && process.env.NODE_ENV === 'development') {
                // Silently skip for localhost in development
                return true;
            }

            // Use custom skip function if provided
            return options.skip ? options.skip(req) : false;
        }
    });
};

// Strict rate limiter for authentication endpoints
export const authLimiter = createRateLimiter(15 * 60 * 1000, 5); // 5 requests per 15 minutes

// General API rate limiter
export const apiLimiter = createRateLimiter(15 * 60 * 1000, 100); // 100 requests per 15 minutes

// Security headers middleware
export const securityHeaders = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://maps.googleapis.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:", "http:"],
            connectSrc: ["'self'", "https://maps.googleapis.com"],
            frameSrc: ["'self'"],
        },
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    },
    noSniff: true,
    xssFilter: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
});

// Input validation helper
export const validateInput = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            return res.status(400).json({
                error: 'Validation failed',
                details: errors
            });
        }

        next();
    };
};

// CORS configuration
export const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173', 'http://localhost:3000', 'https://techcareofficial.netlify.app', 'https://techcare-flax.vercel.app'];

        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.warn(`Blocked request from origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};

// Request logging middleware
export const requestLogger = (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        const logLevel = res.statusCode >= 400 ? 'error' : 'info';

        console.log(`[${logLevel.toUpperCase()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
    });

    next();
};

// Error handler for security issues
export const securityErrorHandler = (err, req, res, next) => {
    // Rate limit error
    if (err.status === 429) {
        return res.status(429).json({
            error: 'Too many requests',
            message: 'Please slow down and try again later'
        });
    }

    // CORS error
    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({
            error: 'CORS policy violation',
            message: 'Origin not allowed'
        });
    }

    // MongoDB injection attempt
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Invalid data',
            message: 'The data you submitted is invalid'
        });
    }

    next(err);
};