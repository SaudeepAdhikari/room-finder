import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchNotifications, getUnreadNotificationCount, markNotificationRead, markAllNotificationsRead } from '../api';
import { useUser } from './UserContext';

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const { user } = useUser();

    // Fetch notifications
    const refreshNotifications = useCallback(async () => {
        if (!user) {
            setNotifications([]);
            setUnreadCount(0);
            return;
        }

        try {
            setLoading(true);
            const [notifs, countData] = await Promise.all([
                fetchNotifications(),
                getUnreadNotificationCount()
            ]);
            setNotifications(notifs);
            setUnreadCount(countData.count);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Mark notification as read
    const markAsRead = useCallback(async (notificationId) => {
        try {
            await markNotificationRead(notificationId);
            setNotifications(prev =>
                prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    }, []);

    // Mark all as read
    const markAllAsRead = useCallback(async () => {
        try {
            await markAllNotificationsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
        }
    }, []);

    // Poll for new notifications every 30 seconds
    useEffect(() => {
        if (!user) return;

        refreshNotifications();
        const interval = setInterval(refreshNotifications, 30000);

        return () => clearInterval(interval);
    }, [user, refreshNotifications]);

    const value = {
        notifications,
        unreadCount,
        loading,
        refreshNotifications,
        markAsRead,
        markAllAsRead
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};
