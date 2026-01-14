/**
 * Supabase Real-time Service
 * Handles real-time subscriptions for CRUD operations across all roles
 * Enables instant updates when admin/technician/user makes changes
 */

import { supabase } from '../lib/supabase';

class RealtimeService {
    constructor() {
        this.channels = new Map();
        this.callbacks = new Map();
    }

    /**
     * Subscribe to technicians table changes
     * Used by: MobileRepair, PCRepair, Technicians pages
     */
    subscribeToTechnicians(callback) {
        const channelKey = 'technicians';

        if (this.channels.has(channelKey)) {
            // Add additional callback to existing channel
            const callbacks = this.callbacks.get(channelKey) || [];
            callbacks.push(callback);
            this.callbacks.set(channelKey, callbacks);
            return () => this.removeCallback(channelKey, callback);
        }

        const channel = supabase
            .channel('technicians-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'technicians'
                },
                (payload) => {
                    console.log('[Realtime] Technician change:', payload.eventType);
                    const callbacks = this.callbacks.get(channelKey) || [];
                    callbacks.forEach(cb => cb(payload));
                }
            )
            .subscribe((status) => {
                console.log('[Realtime] Technicians subscription status:', status);
            });

        this.channels.set(channelKey, channel);
        this.callbacks.set(channelKey, [callback]);

        return () => this.removeCallback(channelKey, callback);
    }

    /**
     * Subscribe to bookings table changes
     * Used by: CustomerDashboard, TechnicianDashboard, Admin
     */
    subscribeToBookings(callback, userId = null) {
        const channelKey = userId ? `bookings-${userId}` : 'bookings-all';

        if (this.channels.has(channelKey)) {
            const callbacks = this.callbacks.get(channelKey) || [];
            callbacks.push(callback);
            this.callbacks.set(channelKey, callbacks);
            return () => this.removeCallback(channelKey, callback);
        }

        const channel = supabase
            .channel(channelKey)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'bookings'
                },
                (payload) => {
                    console.log('[Realtime] Booking change:', payload.eventType);
                    const callbacks = this.callbacks.get(channelKey) || [];
                    callbacks.forEach(cb => cb(payload));
                }
            )
            .subscribe((status) => {
                console.log('[Realtime] Bookings subscription status:', status);
            });

        this.channels.set(channelKey, channel);
        this.callbacks.set(channelKey, [callback]);

        return () => this.removeCallback(channelKey, callback);
    }

    /**
     * Subscribe to reviews table changes
     * Used by: Reviews page, TechnicianDashboard, Admin
     */
    subscribeToReviews(callback) {
        const channelKey = 'reviews';

        if (this.channels.has(channelKey)) {
            const callbacks = this.callbacks.get(channelKey) || [];
            callbacks.push(callback);
            this.callbacks.set(channelKey, callbacks);
            return () => this.removeCallback(channelKey, callback);
        }

        const channel = supabase
            .channel('reviews-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'reviews'
                },
                (payload) => {
                    console.log('[Realtime] Review change:', payload.eventType);
                    const callbacks = this.callbacks.get(channelKey) || [];
                    callbacks.forEach(cb => cb(payload));
                }
            )
            .subscribe();

        this.channels.set(channelKey, channel);
        this.callbacks.set(channelKey, [callback]);

        return () => this.removeCallback(channelKey, callback);
    }

    /**
     * Subscribe to services table changes
     * Used by: Schedule, Services pages
     */
    subscribeToServices(callback) {
        const channelKey = 'services';

        if (this.channels.has(channelKey)) {
            const callbacks = this.callbacks.get(channelKey) || [];
            callbacks.push(callback);
            this.callbacks.set(channelKey, callbacks);
            return () => this.removeCallback(channelKey, callback);
        }

        const channel = supabase
            .channel('services-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'services'
                },
                (payload) => {
                    console.log('[Realtime] Service change:', payload.eventType);
                    const callbacks = this.callbacks.get(channelKey) || [];
                    callbacks.forEach(cb => cb(payload));
                }
            )
            .subscribe();

        this.channels.set(channelKey, channel);
        this.callbacks.set(channelKey, [callback]);

        return () => this.removeCallback(channelKey, callback);
    }

    /**
     * Subscribe to gigs table changes
     * Used by: TechnicianDashboard, Services pages
     */
    subscribeToGigs(callback) {
        const channelKey = 'gigs';

        if (this.channels.has(channelKey)) {
            const callbacks = this.callbacks.get(channelKey) || [];
            callbacks.push(callback);
            this.callbacks.set(channelKey, callbacks);
            return () => this.removeCallback(channelKey, callback);
        }

        const channel = supabase
            .channel('gigs-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'gigs'
                },
                (payload) => {
                    console.log('[Realtime] Gig change:', payload.eventType);
                    const callbacks = this.callbacks.get(channelKey) || [];
                    callbacks.forEach(cb => cb(payload));
                }
            )
            .subscribe();

        this.channels.set(channelKey, channel);
        this.callbacks.set(channelKey, [callback]);

        return () => this.removeCallback(channelKey, callback);
    }

    /**
     * Subscribe to notifications
     */
    subscribeToNotifications(userId, callback) {
        const channelKey = `notifications-${userId}`;

        if (this.channels.has(channelKey)) {
            const callbacks = this.callbacks.get(channelKey) || [];
            callbacks.push(callback);
            this.callbacks.set(channelKey, callbacks);
            return () => this.removeCallback(channelKey, callback);
        }

        const channel = supabase
            .channel(channelKey)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${userId}`
                },
                (payload) => {
                    console.log('[Realtime] New notification:', payload.new);
                    const callbacks = this.callbacks.get(channelKey) || [];
                    callbacks.forEach(cb => cb(payload));
                }
            )
            .subscribe();

        this.channels.set(channelKey, channel);
        this.callbacks.set(channelKey, [callback]);

        return () => this.removeCallback(channelKey, callback);
    }

    /**
     * Subscribe to bids table changes
     */
    subscribeToBids(callback) {
        const channelKey = 'bids';

        if (this.channels.has(channelKey)) {
            const callbacks = this.callbacks.get(channelKey) || [];
            callbacks.push(callback);
            this.callbacks.set(channelKey, callbacks);
            return () => this.removeCallback(channelKey, callback);
        }

        const channel = supabase
            .channel('bids-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'bids'
                },
                (payload) => {
                    console.log('[Realtime] Bid change:', payload.eventType);
                    const callbacks = this.callbacks.get(channelKey) || [];
                    callbacks.forEach(cb => cb(payload));
                }
            )
            .subscribe();

        this.channels.set(channelKey, channel);
        this.callbacks.set(channelKey, [callback]);

        return () => this.removeCallback(channelKey, callback);
    }

    /**
     * Subscribe to messages for a specific booking
     */
    subscribeToMessages(bookingId, callback) {
        const channelKey = `messages-${bookingId}`;

        if (this.channels.has(channelKey)) {
            const callbacks = this.callbacks.get(channelKey) || [];
            callbacks.push(callback);
            this.callbacks.set(channelKey, callbacks);
            return () => this.removeCallback(channelKey, callback);
        }

        const channel = supabase
            .channel(channelKey)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `booking_id=eq.${bookingId}`
                },
                (payload) => {
                    console.log('[Realtime] New message:', payload.new);
                    const callbacks = this.callbacks.get(channelKey) || [];
                    callbacks.forEach(cb => cb(payload));
                }
            )
            .subscribe();

        this.channels.set(channelKey, channel);
        this.callbacks.set(channelKey, [callback]);

        return () => this.removeCallback(channelKey, callback);
    }

    /**
     * Remove a specific callback from a channel
     */
    removeCallback(channelKey, callback) {
        const callbacks = this.callbacks.get(channelKey) || [];
        const index = callbacks.indexOf(callback);
        if (index > -1) {
            callbacks.splice(index, 1);
            this.callbacks.set(channelKey, callbacks);
        }

        // If no more callbacks, unsubscribe from channel
        if (callbacks.length === 0) {
            this.unsubscribe(channelKey);
        }
    }

    /**
     * Unsubscribe from a specific channel
     */
    unsubscribe(channelKey) {
        const channel = this.channels.get(channelKey);
        if (channel) {
            supabase.removeChannel(channel);
            this.channels.delete(channelKey);
            this.callbacks.delete(channelKey);
            console.log(`[Realtime] Unsubscribed from ${channelKey}`);
        }
    }

    /**
     * Unsubscribe from all channels
     */
    unsubscribeAll() {
        this.channels.forEach((channel, key) => {
            supabase.removeChannel(channel);
            console.log(`[Realtime] Unsubscribed from ${key}`);
        });
        this.channels.clear();
        this.callbacks.clear();
    }
}

// Create singleton instance
const realtimeService = new RealtimeService();

export default realtimeService;
