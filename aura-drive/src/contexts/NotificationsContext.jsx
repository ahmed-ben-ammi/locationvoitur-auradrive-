import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getNotifications, markAsRead as apiMarkAsRead, markAllAsRead as apiMarkAllAsRead } from '../api/notifications';

// Create the context
const NotificationsContext = createContext(null);

// Create the provider component
export const NotificationsProvider = ({ children }) => {
  const { isLoggedIn, user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Load notifications from API on mount or when user changes
  const loadNotifications = useCallback(async () => {
    if (isLoggedIn && user?.id) {
      try {
        setLoading(true);
        const data = await getNotifications();
        setNotifications(data);
        // Calculate unread count
        const count = data.filter(n => !n.is_read).length;
        setUnreadCount(count);
      } catch (error) {
        console.error('Error loading notifications:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [isLoggedIn, user?.id]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Mark a specific notification as read
  const markAsRead = useCallback(async (id) => {
    try {
      await apiMarkAsRead(id);
      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      await apiMarkAllAsRead();
      // Update local state
      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  }, []);

  // Function to refresh notifications (can be called from other components)
  const refreshNotifications = useCallback(() => {
    loadNotifications();
  }, [loadNotifications]);

  return (
    <NotificationsContext.Provider 
      value={{ 
        notifications, 
        unreadCount, 
        markAsRead, 
        markAllAsRead, 
        refreshNotifications,
        loading 
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

// Custom hook to access the context
export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationsProvider");
  }
  return context;
};
