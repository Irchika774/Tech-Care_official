/**
 * WebSocket Context
 * Provides real-time WebSocket functionality throughout the app
 */

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import wsService from '../utils/websocketService';
import { useAuth } from './AuthContext';

const WebSocketContext = createContext();

export function WebSocketProvider({ children }) {
    const { user, token } = useAuth();
    const [connected, setConnected] = useState(false);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Connect to WebSocket when user is authenticated
        if (user && token) {
            connectWebSocket();
        }

        // Cleanup on unmount
        return () => {
            wsService.disconnect();
        };
    }, [user, token]);

    const connectWebSocket = () => {
        wsService.connect(token);

        // Listen for connection status
        wsService.on('connection_status', ({ connected }) => {
            setConnected(connected);
        });

        // Subscribe to notifications based on user role
        if (user) {
            wsService.subscribeToNotifications(user._id, handleNotification);

            if (user.role === 'technician') {
                wsService.subscribeToJobs(user._id, handleJobUpdate);
            } else if (user.role === 'user' || user.role === 'customer') {
                wsService.subscribeToBookings(user._id, handleBookingUpdate);
            } else if (user.role === 'admin') {
                wsService.subscribeToAdmin(handleAdminUpdate);
            }
        }
    };

    const handleNotification = useCallback((notification) => {
        setNotifications(prev => [notification, ...prev]);

        // Show browser notification if permitted
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('TechCare', {
                body: notification.message,
                icon: '/logo.png',
            });
        }
    }, []);

    const handleJobUpdate = useCallback((data) => {
        // Trigger custom event for job updates
        window.dispatchEvent(new CustomEvent('job_update', { detail: data }));
    }, []);

    const handleBookingUpdate = useCallback((data) => {
        // Trigger custom event for booking updates
        window.dispatchEvent(new CustomEvent('booking_update', { detail: data }));
    }, []);

    const handleAdminUpdate = useCallback((data) => {
        // Trigger custom event for admin updates
        window.dispatchEvent(new CustomEvent('admin_update', { detail: data }));
    }, []);

    const sendNotification = (userId, notification) => {
        wsService.sendNotification(userId, notification);
    };

    const clearNotifications = () => {
        setNotifications([]);
    };

    const markNotificationAsRead = (notificationId) => {
        setNotifications(prev =>
            prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
        );
    };

    const value = {
        connected,
        notifications,
        sendNotification,
        clearNotifications,
        markNotificationAsRead,
        wsService, // Expose service for advanced usage
    };

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
}

export function useWebSocket() {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
}

export default WebSocketContext;
