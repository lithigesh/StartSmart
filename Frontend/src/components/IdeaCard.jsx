import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import ComparisonButton from "./investor/ComparisonButton";

const IdeaCard = ({
  idea,
  showInterestButton = true,
  isInterested = false,
  onInterest,
  loading = false,
  comparisonMode = false,
  isSelectedForComparison = false,
  onToggleComparison,
  maxComparisonReached = false,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Determine if this is entrepreneur's own idea (show edit/delete instead of interest)
  const isOwnIdea = onEdit && onDelete;

  return (
    <div
      className={`bg-white/[0.02] border border-white/10 rounded-lg p-4 sm:p-6 hover:bg-white/[0.05] transition-all duration-300 group relative${
        comparisonMode ? " pt-16 pl-16" : ""
      }`}
    >
      {/* Comparison Checkbox */}
      {comparisonMode && (
        <ComparisonButton
          isSelected={isSelectedForComparison}
          onToggle={onToggleComparison}
          disabled={maxComparisonReached && !isSelectedForComparison}
          ideaId={idea._id || idea.id}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-0 mb-4">
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-manrope font-semibold text-base sm:text-lg mb-2 group-hover:text-gray-200 transition-colors line-clamp-2">
            {idea.title}
          </h4>
          <p className="text-white/70 font-manrope text-sm line-clamp-2">
            {idea.description}
          </p>
        </div>

        {showInterestButton && !isOwnIdea && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2 sm:ml-4">
            <button
              onClick={() => {
                const route = user?.role === "investor" 
                  ? `/investor/idea/${idea._id}` 
                  : `/entrepreneur/idea/${idea._id}`;
                navigate(route);
              }}
              className="btn btn-sm bg-white text-black hover:bg-white/90 rounded-lg px-3 sm:px-4 py-2 font-manrope font-medium text-sm transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <FaEye className="w-3 h-3 flex-shrink-0" />
              <span className="hidden sm:inline">View Details</span>
              <span className="sm:hidden">View</span>
            </button>
            <button
              onClick={() =>
                onInterest(idea._id, isInterested ? "remove" : "add")
              }
              disabled={loading}
              className={`btn btn-sm rounded-lg px-3 sm:px-4 py-2 font-manrope font-medium text-sm transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 whitespace-nowrap ${
                isInterested
                  ? "bg-white/20 text-white/80 hover:bg-white/30 border border-white/30"
                  : "bg-white/20 text-white/90 hover:bg-white/30 border border-white/30"
              } w-full sm:w-auto justify-center`}
            >
              {loading ? (
                <FaSpinner className="w-3 h-3 animate-spin" />
              ) : isInterested ? (
                <FaHeartBroken className="w-3 h-3 flex-shrink-0" />
              ) : (
                <FaHeart className="w-3 h-3 flex-shrink-0" />
              )}
              <span className="hidden sm:inline">{isInterested ? "Remove" : "Interest"}</span>
              <span className="sm:hidden">{isInterested ? "Remove" : "Add"}</span>
            </button>
          </div>
        )}

        {isOwnIdea && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2 sm:ml-4">
            <button
              onClick={() => navigate(`/entrepreneur/idea/${idea._id || idea.id}`)}
              className="btn btn-sm bg-white text-black hover:bg-white/90 rounded-lg px-3 py-2 font-manrope font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <FaEye className="w-3 h-3" />
              View
            </button>
            <button
              onClick={() => onEdit(idea)}
              className="btn btn-sm bg-white/20 text-white/90 hover:bg-white/30 border border-white/30 rounded-lg px-3 py-2 font-manrope font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <FaEdit className="w-3 h-3" />
              Edit
            </button>
            <button
              onClick={() => onDelete(idea._id || idea.id, idea.title)}
              className="btn btn-sm bg-white/20 text-white/80 hover:bg-white/30 border border-white/30 rounded-lg px-3 py-2 font-manrope font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <FaTrash className="w-3 h-3" />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
        <div className="flex items-center gap-1 text-white/70">
          <FaTag className="w-3 h-3" />
          <span className="font-manrope">{idea.category}</span>
        </div>
        <div className="flex items-center gap-1 text-white/70">
          <FaUser className="w-3 h-3" />
          <span className="font-manrope">
            {idea.owner?.name || "Anonymous"}
          </span>
        </div>
        <div className="flex items-center gap-1 text-white/70">
          <FaCalendar className="w-3 h-3" />
          <span className="font-manrope">{formatDate(idea.createdAt)}</span>
        </div>
        {idea.analysis?.score && (
          <div className="flex items-center gap-1 text-white">
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
              ? "bg-white/20 text-white/90"
              : idea.status === "submitted"
              ? "bg-white/20 text-white/70"
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
