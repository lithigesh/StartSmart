import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaLightbulb,
  FaStar,
  FaHeart,
  FaHeartBroken,
  FaSpinner,
  FaUser,
  FaTag,
  FaCalendar,
  FaEye,
} from "react-icons/fa";

const IdeaCard = ({
  idea,
  showInterestButton = true,
  isInterested = false,
  onInterest,
  loading = false,
}) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white/[0.02] border border-white/10 rounded-lg p-6 hover:bg-white/[0.05] transition-all duration-300 group">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h4 className="text-white font-manrope font-semibold text-lg mb-2 group-hover:text-gray-200 transition-colors">
            {idea.title}
          </h4>
          <p className="text-white/70 font-manrope mb-3 line-clamp-2">
            {idea.description}
          </p>
        </div>

        {showInterestButton && (
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={() => navigate(`/idea/${idea._id}`)}
              className="btn btn-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 font-manrope font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <FaEye className="w-3 h-3" />
              View Details
            </button>
            <button
              onClick={() =>
                onInterest(idea._id, isInterested ? "remove" : "add")
              }
              disabled={loading}
              className={`btn btn-sm rounded-lg px-4 py-2 font-manrope font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 ${
                isInterested
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-pink-500 hover:bg-pink-600 text-white"
              }`}
            >
              {loading ? (
                <FaSpinner className="w-3 h-3 animate-spin" />
              ) : isInterested ? (
                <FaHeartBroken className="w-3 h-3" />
              ) : (
                <FaHeart className="w-3 h-3" />
              )}
              {isInterested ? "Remove" : "Interest"}
            </button>
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
        <div className="flex items-center gap-1 text-blue-400">
          <FaTag className="w-3 h-3" />
          <span className="font-manrope">{idea.category}</span>
        </div>
        <div className="flex items-center gap-1 text-green-400">
          <FaUser className="w-3 h-3" />
          <span className="font-manrope">
            {idea.owner?.name || "Anonymous"}
          </span>
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          <FaCalendar className="w-3 h-3" />
          <span className="font-manrope">{formatDate(idea.createdAt)}</span>
        </div>
        {idea.analysis?.score && (
          <div className="flex items-center gap-1 text-yellow-400">
            <FaStar className="w-3 h-3" />
            <span className="font-manrope font-semibold">
              Score: {idea.analysis.score}%
            </span>
          </div>
        )}
      </div>

      {/* Status Badge */}
      <div className="mb-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-manrope ${
            idea.status === "analyzed"
              ? "bg-green-100 text-green-800"
              : idea.status === "submitted"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {idea.status.charAt(0).toUpperCase() + idea.status.slice(1)}
        </span>
      </div>
    </div>
  );
};

export default IdeaCard;
