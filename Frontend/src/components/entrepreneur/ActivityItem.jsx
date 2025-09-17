import React from "react";

const ActivityItem = ({ item, index }) => {
  return (
    <div
      key={index}
      className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:shadow-sm transition-all duration-200"
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
          {item.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium text-sm leading-relaxed">
            {item.message}
          </p>
          <p className="text-gray-400 text-xs mt-1">
            {item.time}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;
