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
        this.configs = new Map(); // Stores the configuration for re-subscription
        this.heartbeatInterval = null;
        this.startHeartbeat();
    }

    startHeartbeat() {
        if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
        this.retryBackoff = new Map(); // Track retry attempts per channel

        this.heartbeatInterval = setInterval(() => {
            this.channels.forEach((channel, key) => {
                // Supabase channel states: 'joined', 'joining', 'leaving', 'left', 'errored'
                // Note: 'closed' isn't a standard state in some versions, but 'left' or 'errored' are.
                const state = channel.state;
                if (state === 'errored' || state === 'left') {
                    const backoff = this.retryBackoff.get(key) || 0;
                    const maxBackoff = 5; // Max 5 retry cycles before slowing way down

                    if (backoff < maxBackoff) {
                        console.warn(`[Realtime] Channel ${key} is ${state}. Re-subscribing (attempt ${backoff + 1})...`);
                        this.retryBackoff.set(key, backoff + 1);
                        this.reSubscribe(key);
                    } else {
                        // After max retries, only try once per 5 heartbeat cycles
                        if (backoff % 5 === 0) {
                            console.warn(`[Realtime] Channel ${key} still errored, periodic retry...`);
                            this.reSubscribe(key);
                        }
                        this.retryBackoff.set(key, backoff + 1);
                    }
                } else if (state === 'joined') {
                    // Reset backoff on successful connection
                    this.retryBackoff.set(key, 0);
                }
            });
        }, 45000); // 45 seconds between checks
    }

    reSubscribe(channelKey) {
        const config = this.configs.get(channelKey);
        if (!config) return;

        // Cleanup old channel without clearing config
        const oldChannel = this.channels.get(channelKey);
        if (oldChannel) {
            try {
                supabase.removeChannel(oldChannel);
            } catch (e) { }
            this.channels.delete(channelKey);
        }

        // Re-call the original subscription method
        const { methodName, args } = config;
        // The original method will populate this.channels with the new one
        this[methodName](...args, true);
    }

    refreshAllConnections() {
        console.log('[Realtime] Refreshing connections...');
        const keys = Array.from(this.configs.keys());
        keys.forEach(key => this.reSubscribe(key));
    }

    _subscribe(channelKey, options, callback, methodName, args, isInternal = false) {
        // External call to existing channel: just add callback
        if (this.channels.has(channelKey) && !isInternal) {
            const callbacks = this.callbacks.get(channelKey) || [];
            if (!callbacks.includes(callback)) {
                callbacks.push(callback);
                this.callbacks.set(channelKey, callbacks);
            }
            return () => this.removeCallback(channelKey, callback);
        }

        // Always update config on fresh subscription
        if (!isInternal) {
            this.configs.set(channelKey, { methodName, args });
            const callbacks = this.callbacks.get(channelKey) || [];
            if (!callbacks.includes(callback)) {
                callbacks.push(callback);
                this.callbacks.set(channelKey, callbacks);
            }
        }

        const channel = supabase
            .channel(`rt-${channelKey}`)
            .on(
                'postgres_changes',
                options,
                (payload) => {
                    const callbacks = this.callbacks.get(channelKey) || [];
                    callbacks.forEach(cb => {
                        try { cb(payload); } catch (e) { console.error('Realtime callback error:', e); }
                    });
                }
            )
            .subscribe((status) => {
                // Only log if not a standard success
                if (status !== 'SUBSCRIBED' && status !== 'CHANNEL_ERROR') {
                    // console.log(`[Realtime] ${channelKey} status:`, status);
                }
            });

        this.channels.set(channelKey, channel);
        return () => this.removeCallback(channelKey, callback);
    }

    subscribeToTechnicians(callback, isInternal = false) {
        return this._subscribe('technicians', { event: '*', schema: 'public', table: 'technicians' }, callback, 'subscribeToTechnicians', [callback], isInternal);
    }

    subscribeToBookings(callback, userId = null, isInternal = false) {
        const channelKey = userId ? `bookings-${userId}` : 'bookings-all';
        return this._subscribe(channelKey, { event: '*', schema: 'public', table: 'bookings' }, callback, 'subscribeToBookings', [callback, userId], isInternal);
    }

    subscribeToReviews(callback, isInternal = false) {
        return this._subscribe('reviews', { event: '*', schema: 'public', table: 'reviews' }, callback, 'subscribeToReviews', [callback], isInternal);
    }

    subscribeToServices(callback, isInternal = false) {
        return this._subscribe('services', { event: '*', schema: 'public', table: 'services' }, callback, 'subscribeToServices', [callback], isInternal);
    }

    subscribeToGigs(callback, isInternal = false) {
        return this._subscribe('gigs', { event: '*', schema: 'public', table: 'gigs' }, callback, 'subscribeToGigs', [callback], isInternal);
    }

    subscribeToNotifications(userId, callback, isInternal = false) {
        const channelKey = `notifications-${userId}`;
        return this._subscribe(channelKey, {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${userId}`
        }, callback, 'subscribeToNotifications', [userId, callback], isInternal);
    }

    subscribeToBids(callback, isInternal = false) {
        return this._subscribe('bids', { event: '*', schema: 'public', table: 'bids' }, callback, 'subscribeToBids', [callback], isInternal);
    }

    subscribeToMessages(bookingId, callback, isInternal = false) {
        const channelKey = `messages-${bookingId}`;
        return this._subscribe(channelKey, {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `booking_id=eq.${bookingId}`
        }, callback, 'subscribeToMessages', [bookingId, callback], isInternal);
    }

    removeCallback(channelKey, callback) {
        const callbacks = this.callbacks.get(channelKey) || [];
        const index = callbacks.indexOf(callback);
        if (index > -1) {
            callbacks.splice(index, 1);
        }

        if (callbacks.length === 0) {
            this.unsubscribe(channelKey);
            this.configs.delete(channelKey);
        }
    }

    unsubscribe(channelKey) {
        const channel = this.channels.get(channelKey);
        if (channel) {
            try {
                supabase.removeChannel(channel);
            } catch (e) { }
            this.channels.delete(channelKey);
        }
    }

    unsubscribeAll() {
        this.channels.forEach((c) => { try { supabase.removeChannel(c); } catch (e) { } });
        this.channels.clear();
        this.callbacks.clear();
        this.configs.clear();
    }
}

const realtimeService = new RealtimeService();
export default realtimeService;
