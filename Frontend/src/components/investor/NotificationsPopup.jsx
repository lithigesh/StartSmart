import React from "react";
import { useNotifications } from "../../hooks/useNotifications";
import {
  FaBell,
  FaSpinner,
  FaCheckDouble,
  FaTrash,
  FaTimes,
  FaCheck,
  FaLightbulb,
  FaSync,
  FaHeart,
  FaDollarSign,
} from "react-icons/fa";

const NotificationsPopup = ({ showNotifications, setShowNotifications }) => {
  const {
    notifications,
    unreadCount,
    loading: notificationsLoading,
    error: notificationsError,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    clearError: clearNotificationsError
  } = useNotifications();

  if (!showNotifications) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setShowNotifications(false)}
      ></div>

      {/* Popup Content */}
      <div className="absolute top-20 right-4 w-96 max-w-[calc(100vw-2rem)] bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 max-h-[70vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-manrope font-bold text-white">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* Mark All Read */}
              {unreadCount > 0 && (
                <button
                  onClick={async () => {
                    try {
                      await markAllAsRead();
                    } catch (err) {
                      console.error('Failed to mark all as read:', err);
                    }
                  }}
                  className="p-2 text-white/70 hover:text-white transition-colors duration-300 hover:bg-white/10 rounded-lg"
                  title="Mark all as read"
                >
                  <FaCheckDouble className="w-4 h-4" />
                </button>
              )}
              
              {/* Clear All */}
              {notifications.length > 0 && (
                <button
                  onClick={async () => {
                    if (window.confirm('Are you sure you want to clear all notifications?')) {
                      try {
                        await clearAllNotifications();
                      } catch (err) {
                        console.error('Failed to clear all notifications:', err);
                      }
                    }
                  }}
                  className="p-2 text-white/70 hover:text-red-400 transition-colors duration-300 hover:bg-white/10 rounded-lg"
                  title="Clear all notifications"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              )}
              
              {/* Close */}
              <button
                onClick={() => setShowNotifications(false)}
                className="p-2 text-white/70 hover:text-white transition-colors duration-300 hover:bg-white/10 rounded-lg"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Loading State */}
          {notificationsLoading && (
            <div className="flex items-center justify-center py-8">
              <FaSpinner className="w-6 h-6 text-white/60 animate-spin" />
            </div>
          )}

          {/* Error State */}
          {notificationsError && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex justify-between items-start">
                <p className="text-red-400 text-sm font-manrope">{notificationsError}</p>
                <button
                  onClick={clearNotificationsError}
                  className="text-red-300 hover:text-red-100 text-sm"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="max-h-[50vh] overflow-y-auto custom-scrollbar pr-4">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <FaBell className="w-8 h-8 text-white/40 mx-auto mb-3" />
                <p className="text-white/60 font-manrope">
                  No notifications
                </p>
                <p className="text-white/40 text-sm font-manrope mt-1">
                  New updates will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`relative group p-4 rounded-lg border transition-all duration-300 cursor-pointer ${
                      notification.read 
                        ? 'bg-white/[0.02] border-white/10 hover:bg-white/[0.05]' 
                        : 'bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20'
                    }`}
                    onClick={async () => {
                      // Mark as read when clicked
                      if (!notification.read) {
                        try {
                          await markAsRead(notification._id);
                        } catch (err) {
                          console.error('Failed to mark as read:', err);
                        }
                      }
                      
                      // Handle navigation if actionUrl is provided
                      if (notification.actionUrl) {
                        // You might want to use React Router here
                        setShowNotifications(false);
                        // navigate(notification.actionUrl);
                      }
                    }}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        notification.type === 'new_idea' ? 'bg-green-500/20 text-green-400' :
                        notification.type === 'idea_update' ? 'bg-blue-500/20 text-blue-400' :
                        notification.type === 'interest_confirmation' ? 'bg-purple-500/20 text-purple-400' :
                        notification.type === 'funding_update' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {notification.type === 'new_idea' ? <FaLightbulb className="w-4 h-4" /> :
                         notification.type === 'idea_update' ? <FaSync className="w-4 h-4" /> :
                         notification.type === 'interest_confirmation' ? <FaHeart className="w-4 h-4" /> :
                         notification.type === 'funding_update' ? <FaDollarSign className="w-4 h-4" /> :
                         <FaBell className="w-4 h-4" />}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-manrope font-semibold text-sm mb-1 truncate">
                              {notification.title}
                            </h4>
                            <p className="text-white/70 text-sm font-manrope line-clamp-2 mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <p className="text-white/40 text-xs font-manrope">
                                {new Date(notification.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                              <div className="flex items-center gap-1">
                                {notification.priority === 'high' && (
                                  <span className="text-red-400 text-xs">●</span>
                                )}
                                {!notification.read && (
                                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Action buttons (visible on hover) */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            {!notification.read && (
                              <button
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  try {
                                    await markAsRead(notification._id);
                                  } catch (err) {
                                    console.error('Failed to mark as read:', err);
                                  }
                                }}
                                className="p-1 text-white/50 hover:text-green-400 transition-colors duration-200"
                                title="Mark as read"
                              >
                                <FaCheck className="w-3 h-3" />
                              </button>
                            )}
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                try {
                                  await deleteNotification(notification._id);
                                } catch (err) {
                                  console.error('Failed to delete notification:', err);
                                }
                              }}
                              className="p-1 text-white/50 hover:text-red-400 transition-colors duration-200"
                              title="Delete notification"
                            >
                              <FaTimes className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Load More Button (if needed for pagination) */}
            {notifications.length >= 50 && (
              <div className="mt-6 pt-4 border-t border-white/10 text-center">
                <button
                  onClick={() => loadNotifications({ page: 2 })}
                  className="text-blue-400 hover:text-blue-300 font-manrope text-sm hover:underline"
                >
                  Load more notifications
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPopup;
