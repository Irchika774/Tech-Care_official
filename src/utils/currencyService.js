/**
 * Currency Conversion Service
 * Handles automatic currency conversion based on user's IP location
 * Default currency: LKR (Sri Lankan Rupee)
 */

class CurrencyService {
    constructor() {
        this.defaultCurrency = import.meta.env.VITE_DEFAULT_CURRENCY || 'LKR';
        this.currentCurrency = this.defaultCurrency;
        this.exchangeRates = {};
        this.lastUpdate = null;
        this.userLocation = null;
        this.cacheKey = 'techcare_currency_cache';
    }

    /**
     * Initialize currency service - detect location and get exchange rates
     */
    async initialize() {
        try {
            // Try to load from cache first
            this.loadFromCache();

            // Detect user location
            await this.detectUserLocation();

            // Fetch latest exchange rates
            await this.fetchExchangeRates();

            return true;
        } catch (error) {
            console.warn('Currency service initialization failed:', error);
            return false;
        }
    }

    /**
     * Detect user's location using IP geolocation
     */
    async detectUserLocation() {
        try {
            // Try ipapi.co (free, no API key required)
            const response = await fetch('https://ipapi.co/json/');

            if (!response.ok) {
                throw new Error('Failed to fetch location');
            }

            const data = await response.json();

            this.userLocation = {
                country: data.country_name,
                countryCode: data.country_code,
                currency: data.currency,
                city: data.city,
                region: data.region,
                latitude: data.latitude,
                longitude: data.longitude,
            };

            // Set current currency based on user location
            if (data.currency && data.currency !== 'undefined') {
                this.currentCurrency = data.currency;
            }

            return this.userLocation;
        } catch (error) {
            console.warn('IP geolocation failed, using default currency:', error);
            // Fallback to browser language
            this.detectFromBrowser();
            return null;
        }
    }

    /**
     * Fallback: Detect currency from browser language
     */
    detectFromBrowser() {
        const language = navigator.language || navigator.userLanguage;
        const currencyMap = {
            'en-US': 'USD',
            'en-GB': 'GBP',
            'en-IN': 'INR',
            'en-AU': 'AUD',
            'en-CA': 'CAD',
            'si-LK': 'LKR',
            'ta-LK': 'LKR',
        };

        this.currentCurrency = currencyMap[language] || this.defaultCurrency;
    }

    /**
     * Fetch exchange rates from API
     */
    async fetchExchangeRates() {
        try {
            // Using exchangerate-api.com (free tier available)
            const baseCurrency = this.defaultCurrency;
            const apiKey = import.meta.env.VITE_CURRENCY_API_KEY;

            let url;
            if (apiKey && apiKey !== 'your_currency_api_key_here') {
                url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${baseCurrency}`;
            } else {
                // Fallback to open exchange rates API
                url = `https://open.er-api.com/v6/latest/${baseCurrency}`;
            }

            const response = await fetch(url);
            const data = await response.json();

            if (data.result === 'success' || data.conversion_rates) {
                this.exchangeRates = data.conversion_rates;
                this.lastUpdate = new Date();
                this.saveToCache();
                return true;
            }

            throw new Error('Invalid API response');
        } catch (error) {
            console.warn('Exchange rates fetch failed, using fallback rates:', error);
            this.useFallbackRates();
            return false;
        }
    }

    /**
     * Fallback exchange rates (approximate values)
     */
    useFallbackRates() {
        this.exchangeRates = {
            'LKR': 1,
            'USD': 0.0033,
            'EUR': 0.0030,
            'GBP': 0.0026,
            'INR': 0.27,
            'AUD': 0.0050,
            'CAD': 0.0045,
            'JPY': 0.48,
            'CNY': 0.023,
            'SGD': 0.0044,
            'AED': 0.012,
            'SAR': 0.012,
            'MYR': 0.015,
        };
        this.lastUpdate = new Date();
    }

    /**
     * Convert price from LKR to target currency
     */
    convert(amountInLKR, toCurrency = null) {
        const targetCurrency = toCurrency || this.currentCurrency;

        if (targetCurrency === this.defaultCurrency) {
            return amountInLKR;
        }

        const rate = this.exchangeRates[targetCurrency];

        if (!rate) {
            console.warn(`Exchange rate not found for ${targetCurrency}`);
            return amountInLKR;
        }

        return amountInLKR * rate;
    }

    /**
     * Format price with currency symbol
     */
    format(amountInLKR, toCurrency = null, includeSymbol = true) {
        const targetCurrency = toCurrency || this.currentCurrency;
        const convertedAmount = this.convert(amountInLKR, targetCurrency);

        const formatted = new Intl.NumberFormat(this.getLocale(targetCurrency), {
            style: includeSymbol ? 'currency' : 'decimal',
            currency: targetCurrency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(convertedAmount);

        return formatted;
    }

    /**
     * Get locale for currency formatting
     */
    getLocale(currency) {
        const localeMap = {
            'USD': 'en-US',
            'EUR': 'de-DE',
            'GBP': 'en-GB',
            'INR': 'en-IN',
            'LKR': 'si-LK',
            'AUD': 'en-AU',
            'CAD': 'en-CA',
            'JPY': 'ja-JP',
            'CNY': 'zh-CN',
        };

        return localeMap[currency] || 'en-US';
    }

    /**
     * Get currency symbol
     */
    getSymbol(currency = null) {
        const targetCurrency = currency || this.currentCurrency;
        const symbols = {
            'LKR': 'Rs.',
            'USD': '$',
            'EUR': '€',
            'GBP': '£',
            'INR': '₹',
            'AUD': 'A$',
            'CAD': 'C$',
            'JPY': '¥',
            'CNY': '¥',
            'SGD': 'S$',
            'AED': 'د.إ',
            'SAR': '﷼',
            'MYR': 'RM',
        };

        return symbols[targetCurrency] || targetCurrency;
    }

    /**
     * Get list of supported currencies
     */
    getSupportedCurrencies() {
        return Object.keys(this.exchangeRates).sort();
    }

    /**
     * Manually set currency
     */
    setCurrency(currency) {
        if (this.exchangeRates[currency]) {
            this.currentCurrency = currency;
            this.saveToCache();
            return true;
        }
        return false;
    }

    /**
     * Get current currency
     */
    getCurrentCurrency() {
        return this.currentCurrency;
    }

    /**
     * Get user location data
     */
    getUserLocation() {
        return this.userLocation;
    }

    /**
     * Save to localStorage
     */
    saveToCache() {
        try {
            const cacheData = {
                currency: this.currentCurrency,
                exchangeRates: this.exchangeRates,
                lastUpdate: this.lastUpdate,
                userLocation: this.userLocation,
            };
            localStorage.setItem(this.cacheKey, JSON.stringify(cacheData));
        } catch (error) {
            console.warn('Failed to save currency cache:', error);
        }
    }

    /**
     * Load from localStorage
     */
    loadFromCache() {
        try {
            const cached = localStorage.getItem(this.cacheKey);
            if (!cached) return false;

            const cacheData = JSON.parse(cached);
            const cacheAge = new Date() - new Date(cacheData.lastUpdate);
            const maxAge = 24 * 60 * 60 * 1000; // 24 hours

            // Use cache if less than 24 hours old
            if (cacheAge < maxAge) {
                this.currentCurrency = cacheData.currency;
                this.exchangeRates = cacheData.exchangeRates;
                this.lastUpdate = new Date(cacheData.lastUpdate);
                this.userLocation = cacheData.userLocation;
                return true;
            }

            return false;
        } catch (error) {
            console.warn('Failed to load currency cache:', error);
            return false;
        }
    }

    /**
     * Clear cache
     */
    clearCache() {
        localStorage.removeItem(this.cacheKey);
    }
}

// Create singleton instance
const currencyService = new CurrencyService();

export default currencyService;
