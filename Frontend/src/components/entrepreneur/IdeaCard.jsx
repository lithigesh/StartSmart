import React from "react";
import { FaLightbulb } from "react-icons/fa";

const IdeaCard = ({ idea, index, getStatusColor }) => {
  return (
    <div
      key={index}
      className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/10 rounded-lg hover:bg-white/[0.05] transition-all duration-300"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
          <FaLightbulb className="w-4 h-4 text-yellow-400" />
        </div>
        <div>
          <p className="text-white font-manrope font-medium">
            {idea.title}
          </p>
          <div className="flex items-center gap-4 mt-1">
            <span
              className={`text-xs px-2 py-1 rounded-full font-manrope ${getStatusColor(
                idea.status
              )}`}
            >
              {idea.status}
            </span>
            <span className="text-white/60 text-sm font-manrope">
              {idea.views} views
            </span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="text-green-400 font-manrope font-semibold">
          {idea.funding}
        </p>
        <p className="text-white/60 text-sm font-manrope">
          {idea.investors} investors
        </p>
      </div>
    </div>
  );
};

export default IdeaCard;
