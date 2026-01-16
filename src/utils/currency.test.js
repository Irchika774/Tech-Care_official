/**
 * Currency Utility Tests
 * @fileoverview Unit tests for src/utils/currency.js
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    formatCurrency,
    formatCurrencyShort,
    parseCurrency,
    getCurrencyFromCountry,
    getUserCurrency,
    setUserCurrency,
    clearCurrencyCache,
    getSupportedCurrencies,
    usdToLkr,
    lkrToUsd,
    formatPriceRange,
    CURRENCY_SYMBOLS,
    COUNTRY_CURRENCY_MAP
} from '../utils/currency';

describe('Currency Utility', () => {
    beforeEach(() => {
        // Clear localStorage mock before each test
        vi.mocked(localStorage.getItem).mockReturnValue(null);
        vi.mocked(localStorage.setItem).mockClear();
        vi.mocked(localStorage.removeItem).mockClear();
    });

    describe('formatCurrency', () => {
        it('should format LKR currency with correct symbol and spacing', () => {
            expect(formatCurrency(1000, 'LKR')).toBe('Rs. 1,000.00');
        });

        it('should format USD currency without space after symbol', () => {
            expect(formatCurrency(1000, 'USD')).toBe('$1,000.00');
        });

        it('should format EUR currency without space after symbol', () => {
            expect(formatCurrency(1500.50, 'EUR')).toBe('€1,500.50');
        });

        it('should format INR currency with space after symbol', () => {
            expect(formatCurrency(2500, 'INR')).toBe('₹ 2,500.00');
        });

        it('should handle zero amount', () => {
            expect(formatCurrency(0, 'LKR')).toBe('Rs. 0.00');
        });

        it('should handle negative amounts by using absolute value', () => {
            expect(formatCurrency(-1000, 'LKR')).toBe('Rs. 1,000.00');
        });

        it('should parse string amounts correctly', () => {
            expect(formatCurrency('5000', 'LKR')).toBe('Rs. 5,000.00');
        });

        it('should handle invalid string amounts as zero', () => {
            expect(formatCurrency('invalid', 'LKR')).toBe('Rs. 0.00');
        });

        it('should respect custom decimal places', () => {
            expect(formatCurrency(1000.567, 'LKR', 0)).toBe('Rs. 1,001');
            expect(formatCurrency(1000.567, 'LKR', 3)).toBe('Rs. 1,000.567');
        });

        it('should default to currency code if symbol not found', () => {
            expect(formatCurrency(100, 'XYZ')).toBe('XYZ100.00');
        });

        it('should handle large numbers with proper comma formatting', () => {
            expect(formatCurrency(1000000, 'USD')).toBe('$1,000,000.00');
        });
    });

    describe('formatCurrencyShort', () => {
        it('should format to LKR with symbol by default', () => {
            expect(formatCurrencyShort(1000)).toBe('LKR 1,000');
        });

        it('should format without symbol when showSymbol is false', () => {
            expect(formatCurrencyShort(1000, false)).toBe('1,000');
        });

        it('should handle string amounts', () => {
            expect(formatCurrencyShort('5000')).toBe('LKR 5,000');
        });

        it('should handle negative amounts by using absolute value', () => {
            expect(formatCurrencyShort(-2500)).toBe('LKR 2,500');
        });

        it('should handle invalid amounts as zero', () => {
            expect(formatCurrencyShort('invalid')).toBe('LKR 0');
        });
    });

    describe('parseCurrency', () => {
        it('should return number if already a number', () => {
            expect(parseCurrency(1000)).toBe(1000);
        });

        it('should parse LKR string', () => {
            expect(parseCurrency('LKR 1,000')).toBe(1000);
        });

        it('should parse Rs. format', () => {
            expect(parseCurrency('Rs. 5,000')).toBe(5000);
        });

        it('should parse Rs format without dot', () => {
            expect(parseCurrency('Rs 2,500')).toBe(2500);
        });

        it('should parse USD format', () => {
            expect(parseCurrency('$100')).toBe(100);
        });

        it('should parse EUR format', () => {
            expect(parseCurrency('€50')).toBe(50);
        });

        it('should parse GBP format', () => {
            expect(parseCurrency('£75')).toBe(75);
        });

        it('should parse INR format', () => {
            expect(parseCurrency('₹1,000')).toBe(1000);
        });

        it('should handle invalid strings as zero', () => {
            expect(parseCurrency('invalid')).toBe(0);
        });

        it('should handle decimal values', () => {
            expect(parseCurrency('$100.50')).toBe(100.50);
        });
    });

    describe('getCurrencyFromCountry', () => {
        it('should return LKR for Sri Lanka', () => {
            expect(getCurrencyFromCountry('Sri Lanka')).toBe('LKR');
        });

        it('should return USD for United States', () => {
            expect(getCurrencyFromCountry('United States')).toBe('USD');
        });

        it('should return GBP for United Kingdom', () => {
            expect(getCurrencyFromCountry('United Kingdom')).toBe('GBP');
        });

        it('should return INR for India', () => {
            expect(getCurrencyFromCountry('India')).toBe('INR');
        });

        it('should return LKR for unknown countries', () => {
            expect(getCurrencyFromCountry('Unknown Country')).toBe('LKR');
        });

        it('should return LKR for null/undefined', () => {
            expect(getCurrencyFromCountry(null)).toBe('LKR');
            expect(getCurrencyFromCountry(undefined)).toBe('LKR');
        });
    });

    describe('getUserCurrency and setUserCurrency', () => {
        it('should return LKR when nothing is stored', () => {
            vi.mocked(localStorage.getItem).mockReturnValue(null);
            expect(getUserCurrency()).toBe('LKR');
        });

        it('should return stored currency', () => {
            vi.mocked(localStorage.getItem).mockReturnValue('USD');
            expect(getUserCurrency()).toBe('USD');
        });

        it('should store currency in localStorage', () => {
            setUserCurrency('EUR');
            expect(localStorage.setItem).toHaveBeenCalledWith('userCurrency', 'EUR');
        });

        it('should store country when provided', () => {
            setUserCurrency('GBP', 'United Kingdom');
            expect(localStorage.setItem).toHaveBeenCalledWith('userCurrency', 'GBP');
            expect(localStorage.setItem).toHaveBeenCalledWith('userCountry', 'United Kingdom');
        });
    });

    describe('clearCurrencyCache', () => {
        it('should remove currency and country from localStorage', () => {
            clearCurrencyCache();
            expect(localStorage.removeItem).toHaveBeenCalledWith('userCurrency');
            expect(localStorage.removeItem).toHaveBeenCalledWith('userCountry');
        });
    });

    describe('getSupportedCurrencies', () => {
        it('should return array of supported currencies', () => {
            const currencies = getSupportedCurrencies();
            expect(Array.isArray(currencies)).toBe(true);
            expect(currencies.length).toBe(12);
        });

        it('should include LKR as first currency', () => {
            const currencies = getSupportedCurrencies();
            expect(currencies[0].code).toBe('LKR');
        });

        it('should have correct structure for each currency', () => {
            const currencies = getSupportedCurrencies();
            currencies.forEach(currency => {
                expect(currency).toHaveProperty('code');
                expect(currency).toHaveProperty('symbol');
                expect(currency).toHaveProperty('name');
            });
        });
    });

    describe('usdToLkr and lkrToUsd', () => {
        it('should convert USD to LKR with default rate', () => {
            expect(usdToLkr(1)).toBe(325);
            expect(usdToLkr(10)).toBe(3250);
        });

        it('should convert USD to LKR with custom rate', () => {
            expect(usdToLkr(1, 300)).toBe(300);
            expect(usdToLkr(10, 350)).toBe(3500);
        });

        it('should convert LKR to USD with default rate', () => {
            expect(lkrToUsd(325)).toBe(1);
            expect(lkrToUsd(3250)).toBe(10);
        });

        it('should convert LKR to USD with custom rate', () => {
            expect(lkrToUsd(300, 300)).toBe(1);
            expect(lkrToUsd(3500, 350)).toBe(10);
        });
    });

    describe('formatPriceRange', () => {
        beforeEach(() => {
            vi.mocked(localStorage.getItem).mockReturnValue('LKR');
        });

        it('should format price range correctly', () => {
            const result = formatPriceRange(1000, 5000);
            expect(result).toContain('Rs.');
            expect(result).toContain(' - ');
        });
    });

    describe('CURRENCY_SYMBOLS constant', () => {
        it('should have correct LKR symbol', () => {
            expect(CURRENCY_SYMBOLS.LKR).toBe('Rs.');
        });

        it('should have correct USD symbol', () => {
            expect(CURRENCY_SYMBOLS.USD).toBe('$');
        });

        it('should have all expected currencies', () => {
            const expectedCurrencies = ['LKR', 'USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD', 'SGD', 'MYR', 'JPY', 'CNY', 'AED'];
            expectedCurrencies.forEach(currency => {
                expect(CURRENCY_SYMBOLS).toHaveProperty(currency);
            });
        });
    });

    describe('COUNTRY_CURRENCY_MAP constant', () => {
        it('should map Sri Lanka to LKR', () => {
            expect(COUNTRY_CURRENCY_MAP['Sri Lanka']).toBe('LKR');
        });

        it('should map United States to USD', () => {
            expect(COUNTRY_CURRENCY_MAP['United States']).toBe('USD');
        });
    });
});
