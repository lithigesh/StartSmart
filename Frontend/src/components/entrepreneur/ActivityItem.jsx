import React from "react";

const ActivityItem = ({ item, index }) => {
  return (
    <div
      key={index}
      className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/10 rounded-lg hover:bg-white/[0.05] transition-all duration-300"
    >
      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
        {item.icon}
      </div>
      <div className="flex-1">
        <p className="text-white font-manrope font-medium">
          {item.message}
        </p>
        <p className="text-white/60 text-sm font-manrope">
          {item.time}
        </p>
      </div>
    </div>
  );
};

export default ActivityItem;
