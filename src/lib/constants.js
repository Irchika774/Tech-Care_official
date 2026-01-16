/**
 * Application Constants
 * @fileoverview Centralized constants for the TechCare application
 * @module constants
 */

/**
 * Booking status constants
 * @constant {Object}
 */
export const BOOKING_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    SCHEDULED: 'scheduled',
    DIAGNOSING: 'diagnosing',
    WAITING_FOR_PARTS: 'waiting_for_parts',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
};

/**
 * Active booking statuses (for filtering)
 * @constant {string[]}
 */
export const ACTIVE_BOOKING_STATUSES = [
    BOOKING_STATUS.PENDING,
    BOOKING_STATUS.CONFIRMED,
    BOOKING_STATUS.SCHEDULED,
    BOOKING_STATUS.DIAGNOSING,
    BOOKING_STATUS.WAITING_FOR_PARTS,
    BOOKING_STATUS.IN_PROGRESS
];

/**
 * Progress percentage mapping for booking status
 * @constant {Object}
 */
export const BOOKING_PROGRESS = {
    [BOOKING_STATUS.PENDING]: 20,
    [BOOKING_STATUS.CONFIRMED]: 40,
    [BOOKING_STATUS.SCHEDULED]: 50,
    [BOOKING_STATUS.DIAGNOSING]: 60,
    [BOOKING_STATUS.WAITING_FOR_PARTS]: 65,
    [BOOKING_STATUS.IN_PROGRESS]: 70,
    [BOOKING_STATUS.COMPLETED]: 100,
    [BOOKING_STATUS.CANCELLED]: 0
};

/**
 * User roles
 * @constant {Object}
 */
export const USER_ROLES = {
    USER: 'user',
    CUSTOMER: 'customer',
    TECHNICIAN: 'technician',
    ADMIN: 'admin'
};

/**
 * Device types
 * @constant {Object}
 */
export const DEVICE_TYPES = {
    SMARTPHONE: 'smartphone',
    LAPTOP: 'laptop',
    TABLET: 'tablet',
    DESKTOP: 'desktop',
    OTHER: 'other'
};

/**
 * API timeout configurations (in milliseconds)
 * @constant {Object}
 */
export const API_TIMEOUTS = {
    DEFAULT: 12000,
    AUTH: 5000,
    PROFILE: 12000,
    REALTIME: 30000
};

/**
 * Polling intervals (in milliseconds)
 * @constant {Object}
 */
export const POLLING_INTERVALS = {
    DASHBOARD: 30000,
    NOTIFICATIONS: 15000,
    JOBS: 10000
};

/**
 * Local storage keys
 * @constant {Object}
 */
export const STORAGE_KEYS = {
    USER_CURRENCY: 'userCurrency',
    USER_COUNTRY: 'userCountry',
    THEME: 'theme',
    USER_PROFILE_PREFIX: 'user_profile_'
};

/**
 * Get progress value for a booking status
 * @param {string} status - The booking status
 * @returns {number} Progress percentage (0-100)
 */
export const getBookingProgress = (status) => {
    return BOOKING_PROGRESS[status] ?? 0;
};

/**
 * Check if a booking status is considered active
 * @param {string} status - The booking status
 * @returns {boolean} True if the status is active
 */
export const isActiveBookingStatus = (status) => {
    return ACTIVE_BOOKING_STATUSES.includes(status);
};

export default {
    BOOKING_STATUS,
    ACTIVE_BOOKING_STATUSES,
    BOOKING_PROGRESS,
    USER_ROLES,
    DEVICE_TYPES,
    API_TIMEOUTS,
    POLLING_INTERVALS,
    STORAGE_KEYS,
    getBookingProgress,
    isActiveBookingStatus
};
