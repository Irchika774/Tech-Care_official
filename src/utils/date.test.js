/**
 * Date Utility Tests
 * @fileoverview Unit tests for src/utils/date.js
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
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
} from '../utils/date';

describe('Date Utility', () => {
    describe('getCurrentYear', () => {
        it('should return current year as number', () => {
            const year = getCurrentYear();
            expect(typeof year).toBe('number');
            expect(year).toBeGreaterThanOrEqual(2024);
        });

        it('should match Date object year', () => {
            expect(getCurrentYear()).toBe(new Date().getFullYear());
        });
    });

    describe('formatDate', () => {
        const testDate = new Date('2024-06-15T14:30:00');

        it('should return empty string for null/undefined', () => {
            expect(formatDate(null)).toBe('');
            expect(formatDate(undefined)).toBe('');
        });

        it('should return empty string for invalid date', () => {
            expect(formatDate('invalid')).toBe('');
        });

        it('should format date in short format by default', () => {
            const result = formatDate(testDate, 'short');
            expect(result).toContain('2024');
            expect(result).toContain('Jun');
            expect(result).toContain('15');
        });

        it('should format date in long format', () => {
            const result = formatDate(testDate, 'long');
            expect(result).toContain('2024');
            expect(result).toContain('June');
            expect(result).toContain('15');
        });

        it('should format time only', () => {
            const result = formatDate(testDate, 'time');
            // Time format will be like "2:30 PM" or "14:30"
            expect(result).toMatch(/\d{1,2}:\d{2}/);
        });

        it('should format datetime', () => {
            const result = formatDate(testDate, 'datetime');
            expect(result).toContain('2024');
            expect(result).toContain('Jun');
        });

        it('should handle string dates', () => {
            const result = formatDate('2024-06-15');
            expect(result).toContain('Jun');
            expect(result).toContain('15');
        });
    });

    describe('formatTime', () => {
        it('should return formatted time', () => {
            const testDate = new Date('2024-06-15T14:30:00');
            const result = formatTime(testDate);
            expect(result).toMatch(/\d{1,2}:\d{2}/);
        });

        it('should return empty string for invalid date', () => {
            expect(formatTime('invalid')).toBe('');
        });
    });

    describe('formatDateTime', () => {
        it('should return formatted datetime', () => {
            const testDate = new Date('2024-06-15T14:30:00');
            const result = formatDateTime(testDate);
            expect(result).toContain('Jun');
            expect(result).toContain('15');
            expect(result).toMatch(/\d{1,2}:\d{2}/);
        });
    });

    describe('getRelativeTime', () => {
        beforeEach(() => {
            vi.useFakeTimers();
            vi.setSystemTime(new Date('2024-06-15T12:00:00'));
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        it('should return empty string for null/undefined', () => {
            expect(getRelativeTime(null)).toBe('');
            expect(getRelativeTime(undefined)).toBe('');
        });

        it('should return empty string for invalid date', () => {
            expect(getRelativeTime('invalid')).toBe('');
        });

        it('should return "just now" for recent times', () => {
            const recentDate = new Date('2024-06-15T11:59:30');
            expect(getRelativeTime(recentDate)).toBe('just now');
        });

        it('should return minutes ago', () => {
            const minutesAgo = new Date('2024-06-15T11:55:00');
            expect(getRelativeTime(minutesAgo)).toBe('5 minutes ago');
        });

        it('should return singular minute', () => {
            const oneMinuteAgo = new Date('2024-06-15T11:59:00');
            expect(getRelativeTime(oneMinuteAgo)).toBe('1 minute ago');
        });

        it('should return hours ago', () => {
            const hoursAgo = new Date('2024-06-15T09:00:00');
            expect(getRelativeTime(hoursAgo)).toBe('3 hours ago');
        });

        it('should return days ago', () => {
            const daysAgo = new Date('2024-06-12T12:00:00');
            expect(getRelativeTime(daysAgo)).toBe('3 days ago');
        });

        it('should return weeks ago', () => {
            const weeksAgo = new Date('2024-05-25T12:00:00');
            expect(getRelativeTime(weeksAgo)).toBe('3 weeks ago');
        });

        it('should return months ago', () => {
            const monthsAgo = new Date('2024-03-15T12:00:00');
            expect(getRelativeTime(monthsAgo)).toBe('3 months ago');
        });

        it('should return years ago', () => {
            const yearsAgo = new Date('2022-06-15T12:00:00');
            expect(getRelativeTime(yearsAgo)).toBe('2 years ago');
        });
    });

    describe('isToday', () => {
        it('should return false for null/undefined', () => {
            expect(isToday(null)).toBe(false);
            expect(isToday(undefined)).toBe(false);
        });

        it('should return false for invalid date', () => {
            expect(isToday('invalid')).toBe(false);
        });

        it('should return true for today', () => {
            expect(isToday(new Date())).toBe(true);
        });

        it('should return false for yesterday', () => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            expect(isToday(yesterday)).toBe(false);
        });
    });

    describe('isThisWeek', () => {
        it('should return false for null/undefined', () => {
            expect(isThisWeek(null)).toBe(false);
            expect(isThisWeek(undefined)).toBe(false);
        });

        it('should return false for invalid date', () => {
            expect(isThisWeek('invalid')).toBe(false);
        });

        it('should return true for today', () => {
            expect(isThisWeek(new Date())).toBe(true);
        });

        it('should return true for date 3 days ago', () => {
            const threeDaysAgo = new Date();
            threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
            expect(isThisWeek(threeDaysAgo)).toBe(true);
        });

        it('should return false for date 10 days ago', () => {
            const tenDaysAgo = new Date();
            tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
            expect(isThisWeek(tenDaysAgo)).toBe(false);
        });
    });

    describe('isThisMonth', () => {
        it('should return false for null/undefined', () => {
            expect(isThisMonth(null)).toBe(false);
            expect(isThisMonth(undefined)).toBe(false);
        });

        it('should return false for invalid date', () => {
            expect(isThisMonth('invalid')).toBe(false);
        });

        it('should return true for today', () => {
            expect(isThisMonth(new Date())).toBe(true);
        });

        it('should return false for last month', () => {
            const lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth() - 1);
            expect(isThisMonth(lastMonth)).toBe(false);
        });
    });

    describe('getPeriodDates', () => {
        beforeEach(() => {
            vi.useFakeTimers();
            vi.setSystemTime(new Date('2024-06-15T12:00:00'));
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        it('should return today period by default', () => {
            const { start, end } = getPeriodDates();
            // Use local date methods to avoid timezone issues with toISOString()
            expect(start.getFullYear()).toBe(2024);
            expect(start.getMonth()).toBe(5); // June is month 5 (0-indexed)
            expect(start.getDate()).toBe(15);
            expect(end.getDate()).toBe(15);
        });

        it('should return week period', () => {
            const { start, end } = getPeriodDates('week');
            expect(start.getDate()).toBeLessThanOrEqual(15);
        });

        it('should return month period', () => {
            const { start, end } = getPeriodDates('month');
            expect(start.getDate()).toBe(1);
        });

        it('should return year period', () => {
            const { start, end } = getPeriodDates('year');
            expect(start.getMonth()).toBe(0);
            expect(start.getDate()).toBe(1);
        });
    });

    describe('getDateRange', () => {
        it('should return array of dates between start and end', () => {
            const dates = getDateRange('2024-06-10', '2024-06-15');
            expect(dates.length).toBe(6);
        });

        it('should return single date if start equals end', () => {
            const dates = getDateRange('2024-06-15', '2024-06-15');
            expect(dates.length).toBe(1);
        });

        it('should return all dates in order', () => {
            const dates = getDateRange('2024-06-10', '2024-06-12');
            expect(dates[0].getDate()).toBe(10);
            expect(dates[1].getDate()).toBe(11);
            expect(dates[2].getDate()).toBe(12);
        });
    });

    describe('formatDateForInput', () => {
        it('should return empty string for null/undefined', () => {
            expect(formatDateForInput(null)).toBe('');
            expect(formatDateForInput(undefined)).toBe('');
        });

        it('should return empty string for invalid date', () => {
            expect(formatDateForInput('invalid')).toBe('');
        });

        it('should format date as YYYY-MM-DD', () => {
            // Use a specific date/time that won't shift across timezones
            const date = new Date(2024, 5, 15); // June 15, 2024 in local time
            const result = formatDateForInput(date);
            expect(result).toBe('2024-06-15');
        });
        it('should pad month and day with zeros', () => {
            // Use local date constructor to avoid timezone issues
            const date = new Date(2024, 0, 5); // January 5, 2024 in local time
            const result = formatDateForInput(date);
            expect(result).toBe('2024-01-05');
        });
    });

    describe('formatTimeForInput', () => {
        it('should return empty string for null/undefined', () => {
            expect(formatTimeForInput(null)).toBe('');
            expect(formatTimeForInput(undefined)).toBe('');
        });

        it('should return empty string for invalid date', () => {
            expect(formatTimeForInput('invalid')).toBe('');
        });

        it('should format time as HH:mm', () => {
            const result = formatTimeForInput(new Date('2024-06-15T14:30:00'));
            expect(result).toBe('14:30');
        });

        it('should pad hours and minutes with zeros', () => {
            const result = formatTimeForInput(new Date('2024-06-15T09:05:00'));
            expect(result).toBe('09:05');
        });
    });

    describe('parseDateTimeFromInput', () => {
        it('should return null for null date string', () => {
            expect(parseDateTimeFromInput(null)).toBeNull();
        });

        it('should parse date with default time', () => {
            const result = parseDateTimeFromInput('2024-06-15');
            expect(result.getHours()).toBe(0);
            expect(result.getMinutes()).toBe(0);
        });

        it('should parse date with custom time', () => {
            const result = parseDateTimeFromInput('2024-06-15', '14:30');
            expect(result.getHours()).toBe(14);
            expect(result.getMinutes()).toBe(30);
        });
    });
});
