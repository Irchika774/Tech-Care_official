// Tech-Care Application Constants

// Polling Intervals (in milliseconds)
export const POLLING_INTERVALS = {
    DASHBOARD: 30000,
    DASHBOARD_REFRESH: 30000, // 30 seconds
    BOOKINGS_REFRESH: 30000,  // 30 seconds
    NOTIFICATIONS_REFRESH: 60000 // 60 seconds
};

// Platform Fees
export const PLATFORM_FEES = {
    BOOKING_FEE: 500, // LKR
    MINIMUM_AMOUNT: 0 // LKR
};

// Loyalty Points
export const LOYALTY_POINTS = {
    REVIEW_BONUS: 50,
    BOOKING_COMPLETION: 100,
    REFERRAL_BONUS: 200
};

// Rating System
export const RATINGS = {
    MIN: 1,
    MAX: 5,
    DEFAULT_MIN_FILTER: 0
};

// Date Formats
export const DATE_FORMATS = {
    DISPLAY: 'PPP', // e.g., Jan 1, 2024
    TIME: 'p',      // e.g., 10:00 AM
    ISO: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
};

// Booking Statuses
export const BOOKING_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    SCHEDULED: 'scheduled',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
};

export const BOOKING_PROGRESS = {
    [BOOKING_STATUS.PENDING]: 20,
    [BOOKING_STATUS.CONFIRMED]: 40,
    [BOOKING_STATUS.SCHEDULED]: 50,
    [BOOKING_STATUS.IN_PROGRESS]: 70,
    [BOOKING_STATUS.COMPLETED]: 100,
    [BOOKING_STATUS.CANCELLED]: 0
};

export const ACTIVE_BOOKING_STATUSES = [
    BOOKING_STATUS.PENDING,
    BOOKING_STATUS.CONFIRMED,
    BOOKING_STATUS.SCHEDULED,
    BOOKING_STATUS.IN_PROGRESS
];

export const isActiveBookingStatus = (status) => ACTIVE_BOOKING_STATUSES.includes(status);

// Payment Statuses
export const PAYMENT_STATUS = {
    PENDING: 'pending',
    PAID: 'paid',
    FAILED: 'failed',
    REFUNDED: 'refunded'
};

// User Roles
export const USER_ROLES = {
    ADMIN: 'admin',
    TECHNICIAN: 'technician',
    CUSTOMER: 'customer',
    USER: 'user'
};

// API Endpoints
export const API_TIMEOUTS = {
    DEFAULT: 10000, // 10 seconds
    LONG: 30000    // 30 seconds
};

// Pagination
export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100
};

// Validation Rules
export const VALIDATION = {
    MIN_PASSWORD_LENGTH: 8,
    MAX_NAME_LENGTH: 100,
    MAX_DESCRIPTION_LENGTH: 1000,
    PHONE_REGEX: /^[+]?[0-9]{10,15}$/,
    EMAIL_REGEX: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/
};
