import React from "react";
import ActivityItem from "./ActivityItem";
import { FaBriefcase, FaEye, FaDollarSign, FaClock } from "react-icons/fa";

const RecentActivitySection = () => {
  const recentActivities = [
    {
      message: "New investor interest in 'AI Healthcare Platform'",
      time: "2 hours ago",
      icon: <FaBriefcase className="w-4 h-4 text-green-500" />,
    },
    {
      message: "Your idea 'Sustainable Food Delivery' received 15 new views",
      time: "4 hours ago",
      icon: <FaEye className="w-4 h-4 text-gray-400" />,
    },
    {
      message: "Funding milestone reached: $15K for EdTech Learning Assistant",
      time: "1 day ago",
      icon: <FaDollarSign className="w-4 h-4 text-yellow-500" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FaClock className="w-5 h-5 text-gray-400" />
        <h3 className="text-xl font-bold text-white">
          Recent Activity
        </h3>
      </div>

      <div className="space-y-3">
        {recentActivities.map((item, index) => (
          <ActivityItem key={index} item={item} index={index} />
        ))}
      </div>

      {recentActivities.length === 0 && (
        <div className="text-center py-8">
          <FaClock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            No recent activity
          </h3>
          <p className="text-gray-400">
            Your recent activities will appear here
          </p>
        </div>
      )}
    </div>
  );
};

export default RecentActivitySection;
