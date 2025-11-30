/**
 * Date Utility Functions
 * Handles date formatting and automatic year updates
 */

/**
 * Get current year (for auto-updating copyright)
 * @returns {number} Current year
 */
export const getCurrentYear = () => {
    return new Date().getFullYear();
};

/**
 * Format date in readable format
 * @param {Date|string} date - Date to format
 * @param {string} format - Format type: 'short', 'long', 'time', 'datetime'
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'short') => {
    if (!date) return '';

    const d = new Date(date);
    if (isNaN(d.getTime())) return '';

    const options = {
        short: {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        },
        long: {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        },
        time: {
            hour: '2-digit',
            minute: '2-digit'
        },
        datetime: {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }
    };

    return d.toLocaleString('en-US', options[format] || options.short);
};

/**
 * Format time only
 * @param {Date|string} date - Date to extract time from
 * @returns {string} Formatted time string (e.g., "2:30 PM")
 */
export const formatTime = (date) => {
    return formatDate(date, 'time');
};

/**
 * Format date and time
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted datetime string
 */
export const formatDateTime = (date) => {
    return formatDate(date, 'datetime');
};

/**
 * Get relative time (e.g., "2 hours ago", "3 days ago")
 * @param {Date|string} date - Date to compare
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date) => {
    if (!date) return '';

    const d = new Date(date);
    if (isNaN(d.getTime())) return '';

    const now = new Date();
    const diffMs = now - d;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffSecs < 60) return 'just now';
    if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    if (diffWeeks < 4) return `${diffWeeks} ${diffWeeks === 1 ? 'week' : 'weeks'} ago`;
    if (diffMonths < 12) return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
    return `${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`;
};

/**
 * Check if date is today
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is today
 */
export const isToday = (date) => {
    if (!date) return false;

    const d = new Date(date);
    if (isNaN(d.getTime())) return false;

    const today = new Date();
    return d.toDateString() === today.toDateString();
};

/**
 * Check if date is this week
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is in current week
 */
export const isThisWeek = (date) => {
    if (!date) return false;

    const d = new Date(date);
    if (isNaN(d.getTime())) return false;

    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return d >= weekAgo && d <= today;
};

/**
 * Check if date is this month
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is in current month
 */
export const isThisMonth = (date) => {
    if (!date) return false;

    const d = new Date(date);
    if (isNaN(d.getTime())) return false;

    const today = new Date();
    return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
};

/**
 * Get start and end dates for periods
 * @param {string} period - 'today', 'week', 'month', 'year'
 * @returns {Object} Object with start and end dates
 */
export const getPeriodDates = (period = 'today') => {
    const now = new Date();
    const start = new Date(now);
    const end = new Date(now);

    switch (period) {
        case 'today':
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            break;
        case 'week':
            const dayOfWeek = now.getDay();
            start.setDate(now.getDate() - dayOfWeek);
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            break;
        case 'month':
            start.setDate(1);
            start.setHours(0, 0, 0, 0);
            end.setMonth(end.getMonth() + 1, 0);
            end.setHours(23, 59, 59, 999);
            break;
        case 'year':
            start.setMonth(0, 1);
            start.setHours(0, 0, 0, 0);
            end.setMonth(11, 31);
            end.setHours(23, 59, 59, 999);
            break;
        default:
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
    }

    return { start, end };
};

/**
 * Generate array of dates between two dates
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date
 * @returns {Array<Date>} Array of dates
 */
export const getDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dates = [];

    const current = new Date(start);
    while (current <= end) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }

    return dates;
};

/**
 * Format date for input fields (YYYY-MM-DD)
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date for input value
 */
export const formatDateForInput = (date) => {
    if (!date) return '';

    const d = new Date(date);
    if (isNaN(d.getTime())) return '';

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

/**
 * Format time for input fields (HH:mm)
 * @param {Date|string} date - Date to extract time from
 * @returns {string} Formatted time for input value
 */
export const formatTimeForInput = (date) => {
    if (!date) return '';

    const d = new Date(date);
    if (isNaN(d.getTime())) return '';

    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
};

/**
 * Parse date from input value
 * @param {string} dateString - Date string (YYYY-MM-DD)
 * @param {string} timeString - Time string (HH:mm)
 * @returns {Date} Parsed date object
 */
export const parseDateTimeFromInput = (dateString, timeString = '00:00') => {
    if (!dateString) return null;

    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date(dateString);
    date.setHours(hours, minutes, 0, 0);

    return date;
};

export default {
    getCurrentYear,
    formatDate,
    formatTime,
    formatDateTime,
    getRelativeTime,
    isToday,
    isThisWeek,
    isThisMonth,
    getPeriodDates,
    getDateRange,
    formatDateForInput,
    formatTimeForInput,
    parseDateTimeFromInput
};
