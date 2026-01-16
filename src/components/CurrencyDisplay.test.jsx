/**
 * CurrencyDisplay Component Tests
 * @fileoverview Unit tests for src/components/CurrencyDisplay.jsx
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import CurrencyDisplay from '../components/CurrencyDisplay';

// Mock the CurrencyContext
const mockConvertPrice = vi.fn((amount) => Promise.resolve(amount));
const mockFormatPrice = vi.fn((amount, decimals = 2) => `Rs. ${amount.toFixed(decimals)}`);

vi.mock('../context/CurrencyContext', () => ({
    useCurrency: () => ({
        convertPrice: mockConvertPrice,
        formatPrice: mockFormatPrice,
        currency: 'LKR'
    })
}));

describe('CurrencyDisplay', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockConvertPrice.mockImplementation((amount) => Promise.resolve(amount));
        mockFormatPrice.mockImplementation((amount, decimals = 2) => `Rs. ${amount.toFixed(decimals)}`);
    });

    it('should render formatted currency amount', async () => {
        render(<CurrencyDisplay amount={1000} />);

        await waitFor(() => {
            expect(screen.getByText(/Rs\./)).toBeInTheDocument();
        });
    });

    it('should handle string amounts', async () => {
        render(<CurrencyDisplay amount="500" />);

        await waitFor(() => {
            expect(mockConvertPrice).toHaveBeenCalledWith(500);
        });
    });

    it('should handle negative amounts by using absolute value', async () => {
        render(<CurrencyDisplay amount={-1000} />);

        await waitFor(() => {
            expect(mockConvertPrice).toHaveBeenCalledWith(1000);
        });
    });

    it('should handle invalid amounts as zero', async () => {
        render(<CurrencyDisplay amount="invalid" />);

        await waitFor(() => {
            expect(mockConvertPrice).toHaveBeenCalledWith(0);
        });
    });

    it('should handle undefined amount as zero', async () => {
        render(<CurrencyDisplay amount={undefined} />);

        await waitFor(() => {
            expect(mockConvertPrice).toHaveBeenCalledWith(0);
        });
    });

    it('should handle null amount as zero', async () => {
        render(<CurrencyDisplay amount={null} />);

        await waitFor(() => {
            expect(mockConvertPrice).toHaveBeenCalledWith(0);
        });
    });

    it('should respect custom decimals prop', async () => {
        render(<CurrencyDisplay amount={1000} decimals={0} />);

        await waitFor(() => {
            expect(mockFormatPrice).toHaveBeenCalledWith(expect.any(Number), 0);
        });
    });

    it('should call formatPrice with converted amount', async () => {
        mockConvertPrice.mockResolvedValue(500);

        render(<CurrencyDisplay amount={1000} />);

        await waitFor(() => {
            expect(mockFormatPrice).toHaveBeenCalledWith(500, 2);
        });
    });

    it('should update when amount changes', async () => {
        const { rerender } = render(<CurrencyDisplay amount={1000} />);

        await waitFor(() => {
            expect(mockConvertPrice).toHaveBeenCalledWith(1000);
        });

        rerender(<CurrencyDisplay amount={2000} />);

        await waitFor(() => {
            expect(mockConvertPrice).toHaveBeenCalledWith(2000);
        });
    });
});
