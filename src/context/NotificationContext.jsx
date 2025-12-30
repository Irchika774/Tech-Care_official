import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!user) return;

        // Poll for notifications every 30 seconds
        const fetchNotifications = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const token = session?.access_token;
                // Use the generic notifications endpoint or role-specific one
                // Using the generic one from server/routes/notifications.js which expects userId and role in query
                // OR the one in customers.js/technicians.js. 
                // Let's use the generic one: /api/notifications?userId=...&role=...
                // But wait, the guide used: http://localhost:5000/api/notifications
                // Let's check server/routes/notifications.js again.
                // It expects query params: userId, role.

                // However, the guide code used: 
                // const response = await fetch('http://localhost:5000/api/notifications', ...
                // And didn't pass query params in the fetch call in the guide snippet? 
                // Ah, the guide snippet might be simplified or assuming the backend extracts from token.
                // But server/routes/notifications.js explicitly checks req.query.userId and req.query.role.

                // Let's adjust to pass the query params correctly.
                const response = await fetch(`${API_URL}/api/notifications?userId=${user._id}&role=${user.role}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setNotifications(data.notifications || []);
                    setUnreadCount(data.unreadCount || 0);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, [user]);

    const markAsRead = async (notificationId) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            await fetch(`${API_URL}/api/notifications/${notificationId}/read`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setNotifications(prev =>
                prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);
