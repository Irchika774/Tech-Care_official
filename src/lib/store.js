import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Mock data toggle store
export const useDataStore = create(
    persist(
        (set) => ({
            useMockData: true,
            toggleMockData: () => set((state) => ({ useMockData: !state.useMockData })),
            setUseMockData: (value) => set({ useMockData: value }),
        }),
        {
            name: 'data-settings',
        }
    )
);

// User store
export const useUserStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    setUser: (user) => set({ user, isAuthenticated: !!user }),
    logout: () => set({ user: null, isAuthenticated: false }),
}));

// Cart/Booking store
export const useBookingStore = create((set) => ({
    currentBooking: null,
    setBooking: (booking) => set({ currentBooking: booking }),
    clearBooking: () => set({ currentBooking: null }),
}));
