import React, { useState, useEffect } from "react";
import ActivityItem from "./ActivityItem";
import { FaBriefcase, FaEye, FaDollarSign, FaClock, FaSpinner } from "react-icons/fa";
import { entrepreneurAPI, notificationsAPI } from "../../services/api";

const RecentActivitySection = () => {
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch recent activities on component mount
  useEffect(() => {
    fetchRecentActivities();
  }, []);

  const fetchRecentActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch recent notifications first
      try {
        const response = await notificationsAPI.getNotifications({ limit: 5 });
        
        // Handle both array and object responses
        const notifications = Array.isArray(response) ? response : response.notifications || [];
        
        // Transform notifications to activity format
        const activities = notifications.map(notification => ({
          message: notification.message || notification.title,
          time: formatTimeAgo(notification.createdAt),
          icon: getIconForNotificationType(notification.type),
          id: notification._id
        }));
        
        setRecentActivities(activities);
      } catch (notificationError) {
        console.log('Notifications not available, trying alternative approach:', notificationError);
        
        // Fallback: Get activities from other sources
        const fallbackActivities = await entrepreneurAPI.getRecentActivity();
        setRecentActivities(fallbackActivities);
      }
      
    } catch (err) {
      console.error('Error fetching recent activities:', err);
      setError('Failed to load recent activities.');
    } finally {
      setLoading(false);
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

  const getIconForNotificationType = (type) => {
    switch (type) {
      case 'interest_confirmation':
      case 'new_investor_interest':
        return <FaBriefcase className="w-4 h-4 text-white/90" />;
      case 'funding_update':
      case 'funding_received':
        return <FaDollarSign className="w-4 h-4 text-white/70" />;
      case 'idea_viewed':
      case 'new_view':
        return <FaEye className="w-4 h-4 text-gray-400" />;
      default:
        return <FaClock className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FaClock className="w-5 h-5 text-gray-400" />
        <h3 className="text-xl font-bold text-white">
          Recent Activity
        </h3>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <FaSpinner className="w-6 h-6 text-gray-600 mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-semibold text-white mb-2">
            Loading recent activity...
          </h3>
          <p className="text-gray-400">
            Please wait while we fetch your recent activities
          </p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-white/20 border border-white rounded-lg p-4">
          <p className="text-white/80 mb-2">{error}</p>
          <button 
            onClick={fetchRecentActivities}
            className="text-sm text-white/80 hover:text-white/80 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Activities List */}
      {!loading && !error && recentActivities.length > 0 && (
        <div className="space-y-3">
          {recentActivities.map((item, index) => (
            <ActivityItem key={item.id || index} item={item} index={index} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && recentActivities.length === 0 && (
        <div className="text-center py-8">
          <FaClock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            No recent activity
          </h3>
          <p className="text-gray-400">
            Your recent activities will appear here as you engage with the platform
          </p>
        </div>
      )}
    </div>
  );
};

export default RecentActivitySection;
