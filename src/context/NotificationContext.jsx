import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { AuthContext } from './AuthContext';

const NotificationContext = createContext(null);

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        // Return a safe fallback if not wrapped in provider
        return {
            notifications: [],
            unreadCount: 0,
            loading: false,
            fetchNotifications: () => { },
            markAsRead: () => { },
            markAllAsRead: () => { },
            deleteNotification: () => { },
            requestPermission: () => { },
            getNotificationIcon: () => '🔔',
            formatNotificationTime: () => ''
        };
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const auth = useContext(AuthContext);
    const user = auth?.user;
    const profile = auth?.profile;

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const lastFetchRef = useRef(0);

    // Get the user ID for notifications
    const getUserId = useCallback(() => {
        if (!user && !profile) return null;
        return profile?.id || user?.id;
    }, [user?.id, profile?.id]);

    // Fetch notifications from API
    const fetchNotifications = useCallback(async (force = false) => {
        const userId = getUserId();
        if (!userId) return;

        // Rate limit: Prevent multiple fetches within 5 seconds unless forced
        const now = Date.now();
        if (!force && now - lastFetchRef.current < 5000) {
            console.log('[DEBUG] fetchNotifications skipped (rate limited)');
            return;
        }
        lastFetchRef.current = now;

        setLoading(true);
        try {
            // Direct Supabase query
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) throw error;

            setNotifications(data || []);
            setUnreadCount(data ? data.filter(n => !n.read).length : 0);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    }, [getUserId]);

    // Subscribe to real-time notifications
    useEffect(() => {
        const userId = getUserId();
        if (!userId) return;

        // Fetch initial notifications
        fetchNotifications();

        // Set up real-time subscription
        let channel = null;
        try {
            channel = supabase
                .channel(`notifications:${userId}`)
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'notifications',
                        filter: `user_id=eq.${userId}`
                    },
                    (payload) => {
                        const newNotification = payload.new;
                        setNotifications(prev => [newNotification, ...prev]);
                        setUnreadCount(prev => prev + 1);
                        showToastNotification(newNotification);
                        playNotificationSound();
                    }
                )
                .on(
                    'postgres_changes',
                    {
                        event: 'UPDATE',
                        schema: 'public',
                        table: 'notifications',
                        filter: `user_id=eq.${userId}`
                    },
                    (payload) => {
                        setNotifications(prev =>
                            prev.map(n => n.id === payload.new.id ? payload.new : n)
                        );
                        // Re-calc unread count
                        setUnreadCount(prev => {
                            // This is an approximation, ideally we fetch count for absolute accuracy
                            // but for UI responsiveness this is fine
                            if (payload.old.read === false && payload.new.read === true) return Math.max(0, prev - 1);
                            if (payload.old.read === true && payload.new.read === false) return prev + 1;
                            return prev;
                        });
                    }
                )
                .on(
                    'postgres_changes',
                    {
                        event: 'DELETE',
                        schema: 'public',
                        table: 'notifications',
                        filter: `user_id=eq.${userId}`
                    },
                    (payload) => {
                        setNotifications(prev => prev.filter(n => n.id !== payload.old.id));
                    }
                )
                .subscribe();
        } catch (err) {
            console.error('Failed to set up notification subscription:', err);
        }

        // Cleanup subscription
        return () => {
            if (channel) {
                supabase.removeChannel(channel);
            }
        };
    }, [getUserId, fetchNotifications]);

    // Show toast notification
    const showToastNotification = (notification) => {
        try {
            const settingsStr = localStorage.getItem('techcare_settings');
            const settings = settingsStr ? JSON.parse(settingsStr) : {};

            // Request browser notification permission and show
            if (settings.pushNotifications !== false && typeof window !== 'undefined' && 'Notification' in window) {
                if (Notification.permission === 'granted') {
                    new Notification(notification.title || 'TechCare', {
                        body: notification.message || '',
                        icon: '/favicon.ico'
                    });
                } else if (Notification.permission !== 'denied') {
                    Notification.requestPermission().then(permission => {
                        if (permission === 'granted') {
                            new Notification(notification.title || 'TechCare', {
                                body: notification.message || '',
                                icon: '/favicon.ico'
                            });
                        }
                    });
                }
            }
        } catch (err) {
            console.error('Error showing toast notification:', err);
        }
    };

    // Play notification sound
    const playNotificationSound = () => {
        try {
            const settingsStr = localStorage.getItem('techcare_settings');
            const settings = settingsStr ? JSON.parse(settingsStr) : {};

            if (settings.soundEnabled !== false) {
                const audio = new Audio('/notification.mp3');
                audio.volume = 0.5;
                audio.play().catch(() => {
                    // Audio play failed, likely due to autoplay restrictions
                });
            }
        } catch (err) {
            // Audio not available
        }
    };

    // Mark notification as read
    const markAsRead = async (notificationId) => {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ read: true })
                .eq('id', notificationId);

            if (error) throw error;

            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    // Mark all as read
    const markAllAsRead = async () => {
        const userId = getUserId();
        if (!userId) return;

        try {
            const { error } = await supabase
                .from('notifications')
                .update({ read: true })
                .eq('user_id', userId);

            if (error) throw error;

            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    // Delete notification
    const deleteNotification = async (notificationId) => {
        try {
            const { error } = await supabase
                .from('notifications')
                .delete()
                .eq('id', notificationId);

            if (error) throw error;

            const deleted = notifications.find(n => n.id === notificationId);
            setNotifications(prev => prev.filter(n => n.id !== notificationId));
            if (deleted && !deleted.read) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    // Request notification permission
    const requestPermission = async () => {
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
            await Notification.requestPermission();
        }
    };

    // Get notification icon based on type
    const getNotificationIcon = (type) => {
        const icons = {
            booking: '📅',
            payment: '💳',
            review: '⭐',
            message: '💬',
            system: '🔔',
            promotion: '🎉',
            warning: '⚠️',
            success: '✅',
            error: '❌'
        };
        return icons[type] || '🔔';
    };

    // Format notification time
    const formatNotificationTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    const value = {
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        requestPermission,
        getNotificationIcon,
        formatNotificationTime
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationProvider;
