import React from "react";
import { useNotifications } from "../../hooks/useNotifications";
import {
  FaBell,
  FaSpinner,
  FaCheck,
  FaLightbulb,
  FaSync,
  FaHeart,
  FaDollarSign,
  FaTimes,
} from "react-icons/fa";

const NotificationsSection = () => {
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
    clearError: clearNotificationsError,
  } = useNotifications();

  return (
    <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden mb-8">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-manrope font-bold text-white">
              All Notifications
            </h3>
            {unreadCount > 0 && (
              <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full font-semibold">
                {unreadCount}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadNotifications}
              disabled={notificationsLoading}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-300 disabled:opacity-50"
              title="Refresh notifications"
            >
              <FaSync
                className={`w-4 h-4 ${
                  notificationsLoading ? "animate-spin" : ""
                }`}
              />
            </button>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-white/90 hover:text-white/90 font-medium transition-colors duration-300"
              >
                Mark all read
              </button>
            )}

            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="text-xs text-white/80 hover:text-white/80 font-medium transition-colors duration-300"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Error state */}
        {notificationsError && (
          <div className="mb-4 bg-white/20 border border-white/30 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <p className="text-white/80 text-sm">{notificationsError}</p>
              <button
                onClick={clearNotificationsError}
                className="text-white/80 hover:text-white/80"
              >
                <FaTimes className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* Loading state */}
        {notificationsLoading && notifications.length === 0 && (
          <div className="flex items-center justify-center py-8">
            <FaSpinner className="w-6 h-6 text-white/60 animate-spin" />
            <span className="ml-3 text-white/60">Loading notifications...</span>
          </div>
        )}

        {/* Notifications list */}
        {notifications.length === 0 && !notificationsLoading ? (
          <div className="text-center py-8">
            <FaBell className="w-12 h-12 text-white/30 mx-auto mb-3" />
            <p className="text-white/60">No notifications yet</p>
            <p className="text-white/40 text-sm">Stay tuned for updates!</p>
          </div>
        ) : (
          <div className="relative">
            <div
              className="overflow-y-auto custom-scrollbar pr-2"
              style={{ maxHeight: "600px" }}
            >
              <div className="space-y-3 pb-4">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`relative group p-4 rounded-lg border transition-all duration-300 cursor-pointer ${
                      notification.read
                        ? "bg-white/10 border-white/20 hover:bg-white/20"
                        : "bg-white/20 border-white/30 hover:bg-white/30"
                    }`}
                    onClick={async () => {
                      if (!notification.read) {
                        try {
                          await markAsRead(notification._id);
                        } catch (err) {
                          console.error("Failed to mark as read:", err);
                        }
                      }
                    }}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          notification.type === "new_idea"
                            ? "bg-white/10/20 text-white/90"
                            : notification.type === "idea_update"
                            ? "bg-white/20/20 text-white/90"
                            : notification.type === "interest_confirmation"
                            ? "bg-white/20/20 text-white/90"
                            : notification.type === "funding_update"
                            ? "bg-white/20 text-white/70"
                            : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {notification.type === "new_idea" ? (
                          <FaLightbulb className="w-4 h-4" />
                        ) : notification.type === "idea_update" ? (
                          <FaSync className="w-4 h-4" />
                        ) : notification.type === "interest_confirmation" ? (
                          <FaHeart className="w-4 h-4" />
                        ) : notification.type === "funding_update" ? (
                          <FaDollarSign className="w-4 h-4" />
                        ) : (
                          <FaBell className="w-4 h-4" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-semibold text-sm mb-1 truncate">
                              {notification.title}
                            </h4>
                            <p className="text-white/70 text-sm line-clamp-2 mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <p className="text-white/40 text-xs">
                                {new Date(
                                  notification.createdAt
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                              <div className="flex items-center gap-1">
                                {notification.priority === "high" && (
                                  <span className="text-white/80 text-xs">
                                    ●
                                  </span>
                                )}
                                {!notification.read && (
                                  <span className="w-2 h-2 bg-white/10 rounded-full"></span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            {!notification.read && (
                              <button
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  try {
                                    await markAsRead(notification._id);
                                  } catch (err) {
                                    console.error(
                                      "Failed to mark as read:",
                                      err
                                    );
                                  }
                                }}
                                className="p-1 text-white/50 hover:text-white/90 transition-colors duration-200"
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
                                  console.error(
                                    "Failed to delete notification:",
                                    err
                                  );
                                }
                              }}
                              className="p-1 text-white/50 hover:text-white/80 transition-colors duration-200"
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
            </div>
            {/* Scroll indicator gradient - only shown when content overflows */}
            {notifications.length > 3 && (
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/40 to-transparent pointer-events-none rounded-b-2xl"></div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsSection;
