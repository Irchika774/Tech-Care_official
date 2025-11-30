/**
 * Currency Utility Functions
 * Handles multi-currency with IP-based detection and conversion
 * Default currency: Sri Lankan Rupee (LKR)
 */

// Exchange rates cache
let exchangeRatesCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

/**
 * Currency symbols map
 */
export const CURRENCY_SYMBOLS = {
    LKR: 'Rs.',
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    AUD: 'A$',
    CAD: 'C$',
    SGD: 'S$',
    MYR: 'RM',
    JPY: '¥',
    CNY: '¥',
    AED: 'د.إ'
};

/**
 * Country to currency mapping
 */
export const COUNTRY_CURRENCY_MAP = {
    'Sri Lanka': 'LKR',
    'United States': 'USD',
    'United Kingdom': 'GBP',
    'India': 'INR',
    'Australia': 'AUD',
    'Canada': 'CAD',
    'Singapore': 'SGD',
    'Malaysia': 'MYR',
    'Japan': 'JPY',
    'China': 'CNY',
    'United Arab Emirates': 'AED',
};

/**
 * Fetch exchange rates from API
 */
export async function fetchExchangeRates() {
    try {
        if (exchangeRatesCache && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
            return exchangeRatesCache;
        }

        const response = await fetch('https://api.exchangerate-api.com/v4/latest/LKR');

        if (!response.ok) {
            throw new Error('Failed to fetch exchange rates');
        }

        const data = await response.json();
        exchangeRatesCache = data.rates;
        cacheTimestamp = Date.now();

        return data.rates;
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        return {
            LKR: 1,
            USD: 0.0031,
            EUR: 0.0028,
            GBP: 0.0024,
            INR: 0.26,
            AUD: 0.0047,
            CAD: 0.0042,
            SGD: 0.0041,
            MYR: 0.0138,
            JPY: 0.47,
            CNY: 0.022,
            AED: 0.011
        };
    }
}

/**
 * Convert amount from LKR to target currency
 */
export async function convertFromLKR(amount, targetCurrency) {
    if (targetCurrency === 'LKR') return amount;

    try {
        const rates = await fetchExchangeRates();
        const rate = rates[targetCurrency];
        return rate ? amount * rate : amount;
    } catch (error) {
        console.error('Conversion error:', error);
        return amount;
    }
}

/**
 * Convert amount from any currency to LKR
 */
export async function convertToLKR(amount, sourceCurrency) {
    if (sourceCurrency === 'LKR') return amount;

    try {
        const rates = await fetchExchangeRates();
        const rate = rates[sourceCurrency];
        return rate ? amount / rate : amount;
    } catch (error) {
        console.error('Conversion error:', error);
        return amount;
    }
}

/**
 * Format currency amount with symbol
 */
export function formatCurrency(amount, currency = 'LKR', decimals = 2) {
    if (typeof amount !== 'number') {
        amount = parseFloat(amount) || 0;
    }

    const symbol = CURRENCY_SYMBOLS[currency] || currency;
    const formatted = amount.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    if (['LKR', 'INR'].includes(currency)) {
        return `${symbol} ${formatted}`;
    }

    return `${symbol}${formatted}`;
}

/**
 * Format amount to LKR currency (backward compatibility)
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
 */
export const parseCurrency = (currencyString) => {
    if (typeof currencyString === 'number') {
        return currencyString;
    }

    const cleaned = currencyString.replace(/LKR|Rs\.?|,|\$|€|£|₹/g, '').trim();
    return parseFloat(cleaned) || 0;
};

/**
 * Get currency from country name
 */
export function getCurrencyFromCountry(country) {
    return COUNTRY_CURRENCY_MAP[country] || 'LKR';
}

/**
 * Detect user location from IP and get currency
 */
export async function detectUserCurrency() {
    try {
        const savedCurrency = localStorage.getItem('userCurrency');
        const savedCountry = localStorage.getItem('userCountry');

        if (savedCurrency && savedCountry) {
            return {
                country: savedCountry,
                currency: savedCurrency,
                detected: true
            };
        }

        const response = await fetch('https://ipapi.co/json/');

        if (!response.ok) {
            throw new Error('Failed to detect location');
        }

        const data = await response.json();
        const country = data.country_name;
        const currency = data.currency || getCurrencyFromCountry(country);

        localStorage.setItem('userCountry', country);
        localStorage.setItem('userCurrency', currency);

        return {
            country,
            currency,
            detected: true
        };
    } catch (error) {
        console.error('Location detection error:', error);
        return {
            country: 'Sri Lanka',
            currency: 'LKR',
            detected: false
        };
    }
}

/**
 * Initialize currency (returns LKR by default)
 */
export async function initializeCurrency() {
    try {
        const location = await detectUserCurrency();
        return location.currency;
    } catch (error) {
        return 'LKR';
    }
}

/**
 * Manual currency change
 */
export function setUserCurrency(currency, country = null) {
    localStorage.setItem('userCurrency', currency);
    if (country) {
        localStorage.setItem('userCountry', country);
    }
}

/**
 * Get current user currency from localStorage
 */
export function getUserCurrency() {
    return localStorage.getItem('userCurrency') || 'LKR';
}

/**
 * Clear currency cache
 */
export function clearCurrencyCache() {
    exchangeRatesCache = null;
    cacheTimestamp = null;
    localStorage.removeItem('userCurrency');
    localStorage.removeItem('userCountry');
}

/**
 * Get all supported currencies
 */
export function getSupportedCurrencies() {
    return [
        { code: 'LKR', symbol: CURRENCY_SYMBOLS.LKR, name: 'Sri Lankan Rupee' },
        { code: 'USD', symbol: CURRENCY_SYMBOLS.USD, name: 'US Dollar' },
        { code: 'EUR', symbol: CURRENCY_SYMBOLS.EUR, name: 'Euro' },
        { code: 'GBP', symbol: CURRENCY_SYMBOLS.GBP, name: 'British Pound' },
        { code: 'INR', symbol: CURRENCY_SYMBOLS.INR, name: 'Indian Rupee' },
        { code: 'AUD', symbol: CURRENCY_SYMBOLS.AUD, name: 'Australian Dollar' },
        { code: 'CAD', symbol: CURRENCY_SYMBOLS.CAD, name: 'Canadian Dollar' },
        { code: 'SGD', symbol: CURRENCY_SYMBOLS.SGD, name: 'Singapore Dollar' },
        { code: 'MYR', symbol: CURRENCY_SYMBOLS.MYR, name: 'Malaysian Ringgit' },
        { code: 'JPY', symbol: CURRENCY_SYMBOLS.JPY, name: 'Japanese Yen' },
        { code: 'CNY', symbol: CURRENCY_SYMBOLS.CNY, name: 'Chinese Yuan' },
        { code: 'AED', symbol: CURRENCY_SYMBOLS.AED, name: 'UAE Dirham' }
    ];
}

// Backward compatibility
export const usdToLkr = (usdAmount, rate = 325) => usdAmount * rate;
export const lkrToUsd = (lkrAmount, rate = 325) => lkrAmount / rate;
export const getCurrencySymbol = () => CURRENCY_SYMBOLS[getUserCurrency()] || 'LKR';
export const getCurrencyCode = () => getUserCurrency();
export const formatPriceRange = (min, max) => {
    const currency = getUserCurrency();
    return `${formatCurrency(min, currency, 0)} - ${formatCurrency(max, currency, 0)}`;
};

export default {
    formatCurrency,
    formatCurrencyShort,
    parseCurrency,
    usdToLkr,
    lkrToUsd,
    getCurrencySymbol,
    getCurrencyCode,
    formatPriceRange,
    fetchExchangeRates,
    convertFromLKR,
    convertToLKR,
    getCurrencyFromCountry,
    detectUserCurrency,
    initializeCurrency,
    setUserCurrency,
    getUserCurrency,
    clearCurrencyCache,
    getSupportedCurrencies,
    CURRENCY_SYMBOLS,
    COUNTRY_CURRENCY_MAP
};
