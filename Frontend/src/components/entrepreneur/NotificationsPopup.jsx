import React, { useState, useEffect } from "react";
import { useNotifications } from "../../hooks/useNotifications";
import {
  FaBell,
  FaLightbulb,
  FaDollarSign,
  FaUsers,
  FaCheck,
  FaTimes,
  FaTrash,
} from "react-icons/fa";

const NotificationsPopup = ({ 
  showNotifications, 
  setShowNotifications, 
  isFullPage = false 
}) => {
  const { notifications, markAsRead, deleteNotification, unreadCount } = useNotifications();
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [filter, setFilter] = useState("all"); // all, unread, read

  const getNotificationIcon = (type) => {
    switch (type) {
      case "new_idea":
        return <FaLightbulb className="w-4 h-4 text-yellow-500" />;
      case "funding_update":
        return <FaDollarSign className="w-4 h-4 text-green-500" />;
      case "interest_confirmation":
        return <FaUsers className="w-4 h-4 text-purple-500" />;
      case "analysis_complete":
        return <FaLightbulb className="w-4 h-4 text-purple-500" />;
      default:
        return <FaBell className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / 60000);

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") return !notification.read;
    if (filter === "read") return notification.read;
    return true;
  });

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await markAsRead(notification._id);
    }
    
    if (notification.actionUrl && !isFullPage) {
      // Navigate to the action URL if needed
      // You can implement navigation logic here
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.read);
    for (const notification of unreadNotifications) {
      await markAsRead(notification._id);
    }
  };

  const handleDeleteSelected = async () => {
    for (const notificationId of selectedNotifications) {
      await deleteNotification(notificationId);
    }
    setSelectedNotifications([]);
  };

  const toggleSelectNotification = (notificationId) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  if (!isFullPage && !showNotifications) return null;

  const content = (
    <div className={`${
      isFullPage 
        ? "w-full" 
        : "absolute right-0 top-full mt-2 w-96 z-50"
    } bg-gray-900 border border-gray-800 rounded-lg shadow-lg overflow-hidden`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaBell className="w-5 h-5 text-white" />
            <h3 className="text-white font-semibold">
              All Notifications
            </h3>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 font-medium">
                {unreadCount}
              </span>
            )}
          </div>
          {!isFullPage && (
            <button
              onClick={() => setShowNotifications(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters and Actions */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-2">
            {["all", "unread", "read"].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  filter === filterType
                    ? "bg-white text-black"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex gap-4">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-green-400 hover:text-green-300 font-medium"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={handleDeleteSelected}
              className="text-xs text-red-400 hover:text-red-300 font-medium"
            >
              Clear all
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className={`${isFullPage ? "max-h-[calc(100vh-300px)]" : "max-h-96"} overflow-y-auto`}>
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <FaBell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">
              {filter === "unread" 
                ? "No unread notifications" 
                : filter === "read" 
                ? "No read notifications" 
                : "No notifications yet"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-4 hover:bg-gray-800/50 transition-colors cursor-pointer ${
                  !notification.read ? "bg-gray-800/30" : ""
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(notification._id)}
                      onChange={() => toggleSelectNotification(notification._id)}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded border-gray-600 text-white focus:ring-purple-500 bg-gray-700"
                    />
                  </div>

                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-medium ${
                        notification.read ? "text-gray-400" : "text-white"
                      }`}>
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 ml-2"></div>
                      )}
                    </div>
                    
                    <p className={`text-sm mt-1 ${
                      notification.read ? "text-gray-500" : "text-gray-300"
                    }`}>
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400">
                        {formatTimeAgo(notification.createdAt)}
                      </span>
                      
                      <div className="flex gap-2">
                        {!notification.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification._id);
                            }}
                            className="text-xs text-green-400 hover:text-green-300"
                          >
                            <FaCheck className="w-3 h-3" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification._id);
                          }}
                          className="text-xs text-red-400 hover:text-red-300"
                        >
                          <FaTrash className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (isFullPage) {
    return content;
  }

  return content;
};

export default NotificationsPopup;