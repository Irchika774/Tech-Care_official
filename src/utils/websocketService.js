/**
 * Real-time WebSocket Service using Socket.IO
 * Handles real-time updates for notifications, jobs, bookings, etc.
 */

import { io } from 'socket.io-client';

class WebSocketService {
    constructor() {
        this.socket = null;
        this.connected = false;
        this.listeners = new Map();
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
    }

    /**
     * Initialize WebSocket connection
     */
    connect(token = null) {
        const wsUrl = import.meta.env.VITE_WS_URL || 'http://localhost:5000';

        const options = {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: this.maxReconnectAttempts,
            transports: ['websocket', 'polling'],
        };

        // Add authentication token if provided
        if (token) {
            options.auth = { token };
        }

        this.socket = io(wsUrl, options);

        // Setup event handlers
        this.setupEventHandlers();

        return this.socket;
    }

    /**
     * Setup socket event handlers
     */
    setupEventHandlers() {
        if (!this.socket) return;

        this.socket.on('connect', () => {
            console.log('✅ WebSocket connected');
            this.connected = true;
            this.reconnectAttempts = 0;
            this.emit('connection_status', { connected: true });
        });

        this.socket.on('disconnect', (reason) => {
            console.log('⚠️ WebSocket disconnected:', reason);
            this.connected = false;
            this.emit('connection_status', { connected: false, reason });
        });

        this.socket.on('connect_error', (error) => {
            console.error('❌ WebSocket connection error:', error.message);
            this.reconnectAttempts++;

            if (this.reconnectAttempts >= this.maxReconnectAttempts) {
                console.error('Max reconnection attempts reached');
                this.emit('connection_error', { error: 'Failed to connect after multiple attempts' });
            }
        });

        this.socket.on('error', (error) => {
            console.error('❌ WebSocket error:', error);
            this.emit('error', { error });
        });

        // Handle reconnection
        this.socket.on('reconnect', (attemptNumber) => {
            console.log(`✅ WebSocket reconnected after ${attemptNumber} attempts`);
            this.reconnectAttempts = 0;
        });
    }

    /**
     * Subscribe to an event
     */
    on(event, callback) {
        if (!this.socket) {
            console.warn('WebSocket not initialized. Call connect() first.');
            return;
        }

        // Store callback for later removal
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);

        // Subscribe to socket event
        this.socket.on(event, callback);
    }

    /**
     * Unsubscribe from an event
     */
    off(event, callback) {
        if (!this.socket) return;

        if (callback) {
            this.socket.off(event, callback);

            // Remove from listeners
            const callbacks = this.listeners.get(event);
            if (callbacks) {
                const index = callbacks.indexOf(callback);
                if (index > -1) {
                    callbacks.splice(index, 1);
                }
            }
        } else {
            // Remove all listeners for this event
            this.socket.off(event);
            this.listeners.delete(event);
        }
    }

    /**
     * Emit an event to server
     */
    emit(event, data) {
        if (!this.socket) {
            console.warn('WebSocket not initialized. Call connect() first.');
            return;
        }

        this.socket.emit(event, data);
    }

    /**
     * Emit and wait for acknowledgment
     */
    emitWithAck(event, data) {
        return new Promise((resolve, reject) => {
            if (!this.socket) {
                reject(new Error('WebSocket not initialized'));
                return;
            }

            this.socket.emit(event, data, (response) => {
                if (response.error) {
                    reject(new Error(response.error));
                } else {
                    resolve(response);
                }
            });
        });
    }

    /**
     * Join a room
     */
    joinRoom(room) {
        this.emit('join_room', { room });
    }

    /**
     * Leave a room
     */
    leaveRoom(room) {
        this.emit('leave_room', { room });
    }

    /**
     * Subscribe to notifications
     */
    subscribeToNotifications(userId, callback) {
        this.joinRoom(`user_${userId}`);
        this.on('notification', callback);
    }

    /**
     * Subscribe to job updates (for technicians)
     */
    subscribeToJobs(technicianId, callback) {
        this.joinRoom(`technician_${technicianId}`);
        this.on('job_update', callback);
        this.on('new_job', callback);
    }

    /**
     * Subscribe to booking updates (for customers)
     */
    subscribeToBookings(userId, callback) {
        this.joinRoom(`customer_${userId}`);
        this.on('booking_update', callback);
    }

    /**
     * Subscribe to admin updates
     */
    subscribeToAdmin(callback) {
        this.joinRoom('admin');
        this.on('admin_update', callback);
    }

    /**
     * Send notification
     */
    sendNotification(userId, notification) {
        this.emit('send_notification', { userId, notification });
    }

    /**
     * Update job status
     */
    updateJobStatus(jobId, status) {
        this.emit('update_job_status', { jobId, status });
    }

    /**
     * Update booking status
     */
    updateBookingStatus(bookingId, status) {
        this.emit('update_booking_status', { bookingId, status });
    }

    /**
     * Check if connected
     */
    isConnected() {
        return this.connected && this.socket?.connected;
    }

    /**
     * Disconnect WebSocket
     */
    disconnect() {
        if (this.socket) {
            // Remove all listeners
            this.listeners.forEach((callbacks, event) => {
                this.socket.off(event);
            });
            this.listeners.clear();

            // Disconnect
            this.socket.disconnect();
            this.socket = null;
            this.connected = false;
            console.log('🔌 WebSocket disconnected');
        }
    }

    /**
     * Reconnect WebSocket
     */
    reconnect() {
        this.disconnect();
        this.reconnectAttempts = 0;
        return this.connect();
    }
}

// Create singleton instance
const wsService = new WebSocketService();

export default wsService;
