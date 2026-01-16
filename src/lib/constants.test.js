/**
 * Constants Tests
 * @fileoverview Unit tests for src/lib/constants.js
 */

import { describe, it, expect } from 'vitest';
import {
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
} from '../lib/constants';

describe('Constants', () => {
    describe('BOOKING_STATUS', () => {
        it('should have all expected status values', () => {
            expect(BOOKING_STATUS.PENDING).toBe('pending');
            expect(BOOKING_STATUS.CONFIRMED).toBe('confirmed');
            expect(BOOKING_STATUS.SCHEDULED).toBe('scheduled');
            expect(BOOKING_STATUS.DIAGNOSING).toBe('diagnosing');
            expect(BOOKING_STATUS.WAITING_FOR_PARTS).toBe('waiting_for_parts');
            expect(BOOKING_STATUS.IN_PROGRESS).toBe('in_progress');
            expect(BOOKING_STATUS.COMPLETED).toBe('completed');
            expect(BOOKING_STATUS.CANCELLED).toBe('cancelled');
        });

        it('should have 8 status values', () => {
            expect(Object.keys(BOOKING_STATUS).length).toBe(8);
        });
    });

    describe('ACTIVE_BOOKING_STATUSES', () => {
        it('should include pending, confirmed, scheduled, diagnosing, waiting_for_parts, and in_progress', () => {
            expect(ACTIVE_BOOKING_STATUSES).toContain('pending');
            expect(ACTIVE_BOOKING_STATUSES).toContain('confirmed');
            expect(ACTIVE_BOOKING_STATUSES).toContain('scheduled');
            expect(ACTIVE_BOOKING_STATUSES).toContain('diagnosing');
            expect(ACTIVE_BOOKING_STATUSES).toContain('waiting_for_parts');
            expect(ACTIVE_BOOKING_STATUSES).toContain('in_progress');
        });

        it('should not include completed or cancelled', () => {
            expect(ACTIVE_BOOKING_STATUSES).not.toContain('completed');
            expect(ACTIVE_BOOKING_STATUSES).not.toContain('cancelled');
        });
    });

    describe('BOOKING_PROGRESS', () => {
        it('should return correct progress for each status', () => {
            expect(BOOKING_PROGRESS.pending).toBe(20);
            expect(BOOKING_PROGRESS.confirmed).toBe(40);
            expect(BOOKING_PROGRESS.scheduled).toBe(50);
            expect(BOOKING_PROGRESS.in_progress).toBe(70);
            expect(BOOKING_PROGRESS.completed).toBe(100);
            expect(BOOKING_PROGRESS.cancelled).toBe(0);
        });
    });

    describe('USER_ROLES', () => {
        it('should have all expected role values', () => {
            expect(USER_ROLES.USER).toBe('user');
            expect(USER_ROLES.CUSTOMER).toBe('customer');
            expect(USER_ROLES.TECHNICIAN).toBe('technician');
            expect(USER_ROLES.ADMIN).toBe('admin');
        });
    });

    describe('DEVICE_TYPES', () => {
        it('should have all expected device types', () => {
            expect(DEVICE_TYPES.SMARTPHONE).toBe('smartphone');
            expect(DEVICE_TYPES.LAPTOP).toBe('laptop');
            expect(DEVICE_TYPES.TABLET).toBe('tablet');
            expect(DEVICE_TYPES.DESKTOP).toBe('desktop');
            expect(DEVICE_TYPES.OTHER).toBe('other');
        });
    });

    describe('API_TIMEOUTS', () => {
        it('should have reasonable timeout values', () => {
            expect(API_TIMEOUTS.DEFAULT).toBeGreaterThanOrEqual(5000);
            expect(API_TIMEOUTS.AUTH).toBeGreaterThanOrEqual(3000);
            expect(API_TIMEOUTS.PROFILE).toBeGreaterThanOrEqual(5000);
        });

        it('should have all expected timeout keys', () => {
            expect(API_TIMEOUTS).toHaveProperty('DEFAULT');
            expect(API_TIMEOUTS).toHaveProperty('AUTH');
            expect(API_TIMEOUTS).toHaveProperty('PROFILE');
            expect(API_TIMEOUTS).toHaveProperty('REALTIME');
        });
    });

    describe('POLLING_INTERVALS', () => {
        it('should have reasonable polling intervals', () => {
            expect(POLLING_INTERVALS.DASHBOARD).toBeGreaterThanOrEqual(10000);
            expect(POLLING_INTERVALS.NOTIFICATIONS).toBeGreaterThanOrEqual(5000);
            expect(POLLING_INTERVALS.JOBS).toBeGreaterThanOrEqual(5000);
        });
    });

    describe('STORAGE_KEYS', () => {
        it('should have all expected storage keys', () => {
            expect(STORAGE_KEYS.USER_CURRENCY).toBe('userCurrency');
            expect(STORAGE_KEYS.USER_COUNTRY).toBe('userCountry');
            expect(STORAGE_KEYS.THEME).toBe('theme');
            expect(STORAGE_KEYS.USER_PROFILE_PREFIX).toBe('user_profile_');
        });
    });

    describe('getBookingProgress', () => {
        it('should return correct progress for known statuses', () => {
            expect(getBookingProgress('pending')).toBe(20);
            expect(getBookingProgress('confirmed')).toBe(40);
            expect(getBookingProgress('in_progress')).toBe(70);
            expect(getBookingProgress('completed')).toBe(100);
        });

        it('should return 0 for unknown status', () => {
            expect(getBookingProgress('unknown')).toBe(0);
            expect(getBookingProgress(null)).toBe(0);
            expect(getBookingProgress(undefined)).toBe(0);
        });
    });

    describe('isActiveBookingStatus', () => {
        it('should return true for active statuses', () => {
            expect(isActiveBookingStatus('pending')).toBe(true);
            expect(isActiveBookingStatus('confirmed')).toBe(true);
            expect(isActiveBookingStatus('scheduled')).toBe(true);
            expect(isActiveBookingStatus('in_progress')).toBe(true);
        });

        it('should return false for inactive statuses', () => {
            expect(isActiveBookingStatus('completed')).toBe(false);
            expect(isActiveBookingStatus('cancelled')).toBe(false);
            expect(isActiveBookingStatus('unknown')).toBe(false);
        });
    });
});
