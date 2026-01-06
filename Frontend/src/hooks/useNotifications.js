import { useState, useEffect, useCallback } from "react";
import { notificationsAPI } from "../services/api";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toastNotifications, setToastNotifications] = useState([]);

  // Load notifications
  const loadNotifications = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await notificationsAPI.getNotifications(params);

      if (response.notifications) {
        // New paginated format
        setNotifications(response.notifications);
        setUnreadCount(response.unreadCount || 0);
      } else {
        // Legacy format
        setNotifications(response);
        // Count unread notifications
        const unread = response.filter((notif) => !notif.read).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      console.error("Error loading notifications:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load unread count only
  const loadUnreadCount = useCallback(async () => {
    try {
      const response = await notificationsAPI.getUnreadCount();
      setUnreadCount(response.unreadCount || 0);
    } catch (err) {
      console.error("Error loading unread count:", err);
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await notificationsAPI.markAsRead(notificationId);

      // Update local state
      setNotifications((prev) => {
        const updated = prev.map((notif) =>
          notif._id === notificationId ? { ...notif, read: true } : notif
        );
        // Recalculate unread count
        const unread = updated.filter((notif) => !notif.read).length;
        setUnreadCount(unread);
        return updated;
      });
    } catch (err) {
      console.error("Error marking notification as read:", err);
      setError(err.message);
      throw err;
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationsAPI.markAllAsRead();

      // Update local state
      setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
      setError(err.message);
      throw err;
    }
  }, []);

  // Delete notification
  const deleteNotification = useCallback(
    async (notificationId) => {
      try {
        await notificationsAPI.deleteNotification(notificationId);

        // Update local state
        setNotifications((prev) => {
          const updated = prev.filter((notif) => notif._id !== notificationId);
          // Recalculate unread count
          const unread = updated.filter((notif) => !notif.read).length;
          setUnreadCount(unread);
          return updated;
        });
      } catch (err) {
        console.error("Error deleting notification:", err);
        setError(err.message);
        throw err;
      }
    },
    []
  );

  // Clear all notifications
  const clearAllNotifications = useCallback(async () => {
    try {
      await notificationsAPI.clearAllNotifications();

      // Update local state
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      console.error("Error clearing all notifications:", err);
      setError(err.message);
      throw err;
    }
  }, []);

  // Add toast notification (client-side only)
  const addNotification = useCallback((message, type = "info") => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      message,
      type, // 'success', 'error', 'info', 'warning'
      timestamp: new Date(),
    };

    setToastNotifications((prev) => [...prev, newNotification]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setToastNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  }, []);

  // Remove toast notification manually
  const removeToastNotification = useCallback((id) => {
    setToastNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Auto-load notifications on mount
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Auto-refresh unread count periodically (every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      loadUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [loadUnreadCount]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    loadNotifications,
    loadUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    clearError: () => setError(null),
    // Toast notifications
    toastNotifications,
    addNotification,
    removeToastNotification,
  };
};
