import React, { useState, useEffect } from "react";
import { FaBell, FaCheck, FaTrash, FaEye, FaFilter, FaEnvelope, FaEnvelopeOpen } from "react-icons/fa";
import SideBar from "../components/entrepreneur/SideBar";
import Header from "../components/Header";
import { notificationAPI } from "../services/api";
import { useNotifications } from "../hooks/useNotifications";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, unread, read
  const { addNotification, markAsRead: markSingleAsRead } = useNotifications();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await notificationAPI.getUserNotifications();
      setNotifications(response.data || []);
    } catch (err) {
      console.error("Error loading notifications:", err);
      setError(err.message);
      addNotification("Failed to load notifications", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
      markSingleAsRead(notificationId);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      addNotification("Failed to mark notification as read", "error");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
      addNotification("All notifications marked as read", "success");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      addNotification("Failed to mark all notifications as read", "error");
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      try {
        await notificationAPI.deleteNotification(notificationId);
        setNotifications(prev =>
          prev.filter(notif => notif.id !== notificationId)
        );
        addNotification("Notification deleted", "success");
      } catch (error) {
        console.error("Error deleting notification:", error);
        addNotification("Failed to delete notification", "error");
      }
    }
  };

  const getFilteredNotifications = () => {
    switch (filter) {
      case "unread":
        return notifications.filter(notif => !notif.read);
      case "read":
        return notifications.filter(notif => notif.read);
      default:
        return notifications;
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "funding":
        return "💰";
      case "investor":
        return "👥";
      case "idea":
        return "💡";
      case "system":
        return "⚙️";
      case "collaboration":
        return "🤝";
      default:
        return "📄";
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "funding":
        return "border-l-green-500";
      case "investor":
        return "border-l-blue-500";
      case "idea":
        return "border-l-yellow-500";
      case "system":
        return "border-l-gray-500";
      case "collaboration":
        return "border-l-purple-500";
      default:
        return "border-l-gray-500";
    }
  };

  const unreadCount = notifications.filter(notif => !notif.read).length;
  const filteredNotifications = getFilteredNotifications();

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="flex">
        <SideBar />
        <main className="flex-1 ml-64 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                  <FaBell className="text-blue-400" />
                  Notifications
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </h1>
                <p className="text-gray-400">
                  Stay updated with your latest activities and updates
                </p>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <FaCheck className="w-4 h-4" />
                  Mark All as Read
                </button>
              )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="glass-card p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total</p>
                    <p className="text-2xl font-bold">{notifications.length}</p>
                  </div>
                  <FaBell className="text-blue-400 text-2xl" />
                </div>
              </div>
              <div className="glass-card p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Unread</p>
                    <p className="text-2xl font-bold text-red-400">{unreadCount}</p>
                  </div>
                  <FaEnvelope className="text-red-400 text-2xl" />
                </div>
              </div>
              <div className="glass-card p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Read</p>
                    <p className="text-2xl font-bold text-green-400">
                      {notifications.length - unreadCount}
                    </p>
                  </div>
                  <FaEnvelopeOpen className="text-green-400 text-2xl" />
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-4 mb-6">
              {[
                { key: "all", label: "All", count: notifications.length },
                { key: "unread", label: "Unread", count: unreadCount },
                { key: "read", label: "Read", count: notifications.length - unreadCount }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                    filter === tab.key
                      ? "bg-blue-600 text-white"
                      : "glass-card text-gray-400 hover:text-white"
                  }`}
                >
                  <FaFilter className="w-3 h-3" />
                  {tab.label}
                  <span className="bg-gray-700 text-white text-xs px-2 py-1 rounded-full">
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Notifications List */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-400 mb-4">Error loading notifications: {error}</p>
                <button
                  onClick={loadNotifications}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <FaBell className="mx-auto text-6xl text-gray-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {filter === "all" ? "No Notifications" : 
                   filter === "unread" ? "No Unread Notifications" : "No Read Notifications"}
                </h3>
                <p className="text-gray-400">
                  {filter === "all" ? "You're all caught up! No notifications to show." :
                   filter === "unread" ? "All notifications have been read." : "No read notifications found."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`glass-card p-4 rounded-xl border-l-4 ${getNotificationColor(notification.type)} ${
                      !notification.read ? "bg-blue-500/5" : ""
                    } hover:shadow-lg transition-all duration-200`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="text-2xl">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-white">
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{new Date(notification.createdAt).toLocaleString()}</span>
                            <span className="capitalize">{notification.type}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="text-blue-400 hover:text-blue-300 transition-colors p-2"
                            title="Mark as read"
                          >
                            <FaEye className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteNotification(notification.id)}
                          className="text-red-400 hover:text-red-300 transition-colors p-2"
                          title="Delete notification"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default NotificationsPage;