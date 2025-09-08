import React from "react";
import ActivityItem from "./ActivityItem";
import { FaBriefcase, FaEye, FaDollarSign } from "react-icons/fa";

const RecentActivitySection = () => {
  const recentActivities = [
    {
      message: "New investor interest in 'AI Healthcare Platform'",
      time: "2 hours ago",
      icon: <FaBriefcase className="w-4 h-4 text-green-400" />,
    },
    {
      message: "Your idea 'Sustainable Food Delivery' received 15 new views",
      time: "4 hours ago",
      icon: <FaEye className="w-4 h-4 text-blue-400" />,
    },
    {
      message: "Funding milestone reached: $15K for EdTech Learning Assistant",
      time: "1 day ago",
      icon: <FaDollarSign className="w-4 h-4 text-yellow-400" />,
    },
  ];

  return (
    <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>

      <div className="relative z-10">
        <h3 className="text-xl font-manrope font-bold text-white mb-6">
          Recent Activity
        </h3>

        <div className="space-y-4">
          {recentActivities.map((item, index) => (
            <ActivityItem key={index} item={item} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentActivitySection;
