/**
 * Currency Utility Functions
 * Handles Sri Lankan Rupee (LKR) formatting throughout the application
 */

/**
 * Format amount to LKR currency
 * @param {number} amount - The amount to format
 * @param {boolean} showSymbol - Whether to show the currency symbol
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, showSymbol = true) => {
    if (typeof amount !== 'number') {
        amount = parseFloat(amount) || 0;
    }

    const formatted = amount.toLocaleString('en-LK', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    return showSymbol ? `LKR ${formatted}` : formatted;
};

/**
 * Format amount to LKR currency without decimals
 * @param {number} amount - The amount to format
 * @param {boolean} showSymbol - Whether to show the currency symbol
 * @returns {string} Formatted currency string
 */
export const formatCurrencyShort = (amount, showSymbol = true) => {
    if (typeof amount !== 'number') {
        amount = parseFloat(amount) || 0;
    }

    const formatted = amount.toLocaleString('en-LK');

    return showSymbol ? `LKR ${formatted}` : formatted;
};

/**
 * Parse currency string to number
 * @param {string} currencyString - The currency string to parse
 * @returns {number} Parsed number
 */
export const parseCurrency = (currencyString) => {
    if (typeof currencyString === 'number') {
        return currencyString;
    }

    // Remove currency symbol and commas
    const cleaned = currencyString.replace(/LKR|Rs\.?|,/g, '').trim();
    return parseFloat(cleaned) || 0;
};

/**
 * Convert USD to LKR (approximate rate)
 * @param {number} usdAmount - Amount in USD
 * @param {number} rate - Exchange rate (default: 325)
 * @returns {number} Amount in LKR
 */
export const usdToLkr = (usdAmount, rate = 325) => {
    return usdAmount * rate;
};

/**
 * Convert LKR to USD (approximate rate)
 * @param {number} lkrAmount - Amount in LKR
 * @param {number} rate - Exchange rate (default: 325)
 * @returns {number} Amount in USD
 */
export const lkrToUsd = (lkrAmount, rate = 325) => {
    return lkrAmount / rate;
};

/**
 * Get currency symbol
 * @returns {string} Currency symbol
 */
export const getCurrencySymbol = () => 'LKR';

/**
 * Get currency code
 * @returns {string} Currency code
 */
export const getCurrencyCode = () => 'LKR';

/**
 * Format price range
 * @param {number} min - Minimum price
 * @param {number} max - Maximum price
 * @returns {string} Formatted price range
 */
export const formatPriceRange = (min, max) => {
    return `${formatCurrencyShort(min)} - ${formatCurrencyShort(max)}`;
};

export default {
    formatCurrency,
    formatCurrencyShort,
    parseCurrency,
    usdToLkr,
    lkrToUsd,
    getCurrencySymbol,
    getCurrencyCode,
    formatPriceRange
};
