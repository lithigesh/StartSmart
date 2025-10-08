import React from "react";
import {
  FaDollarSign,
  FaPercentage,
  FaBuilding,
  FaEye,
  FaComments,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";

/**
 * DealCard Component
 * Displays a compact funding request card for the deal pipeline
 */
const DealCard = ({ request, onClick, stage }) => {
  if (!request) return null;

  const {
    idea,
    entrepreneur,
    amount,
    equity,
    valuation,
    fundingStage,
    investmentType,
    status,
    createdAt,
    negotiationHistory = [],
  } = request;

  // Calculate valuation if not provided
  const calculatedValuation =
    valuation || (amount && equity ? Math.round((amount / equity) * 100) : 0);

  // Format funding stage
  const formatStage = (stage) => {
    if (!stage) return "Seed";
    return stage
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Format investment type
  const formatType = (type) => {
    if (!type) return "Equity";
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Get stage color
  const getStageColor = (stage) => {
    const colors = {
      seed: "bg-green-600/20 text-green-300 border-green-500/30",
      series_a: "bg-blue-600/20 text-blue-300 border-blue-500/30",
      series_b: "bg-purple-600/20 text-purple-300 border-purple-500/30",
      series_c: "bg-pink-600/20 text-pink-300 border-pink-500/30",
      bridge: "bg-orange-600/20 text-orange-300 border-orange-500/30",
      other: "bg-gray-600/20 text-gray-300 border-gray-500/30",
    };
    return colors[stage] || colors.seed;
  };

  // Get status icon
  const getStatusIcon = () => {
    if (stage === "new") return <FaClock className="w-4 h-4 text-blue-400" />;
    if (stage === "viewed")
      return <FaEye className="w-4 h-4 text-purple-400" />;
    if (stage === "negotiating")
      return <FaComments className="w-4 h-4 text-yellow-400" />;
    if (stage === "accepted")
      return <FaCheckCircle className="w-4 h-4 text-green-400" />;
    if (stage === "declined")
      return <FaTimesCircle className="w-4 h-4 text-red-400" />;
    return null;
  };

  // Format date
  const formatDate = (date) => {
    const now = new Date();
    const created = new Date(date);
    const diffMs = now - created;
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return created.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      onClick={onClick}
      className="bg-gray-900 border border-gray-700 rounded-lg p-4 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-200 cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-white truncate group-hover:text-blue-300 transition-colors">
            {idea?.title || "Untitled Idea"}
          </h3>
          <p className="text-sm text-gray-400 truncate">
            {entrepreneur?.name || "Unknown Entrepreneur"}
          </p>
        </div>
        <div className="ml-2 flex-shrink-0">{getStatusIcon()}</div>
      </div>

      {/* Category & Stage Badge */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {idea?.category && (
          <span className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs">
            {idea.category}
          </span>
        )}
        <span
          className={`px-2 py-1 rounded text-xs border ${getStageColor(
            fundingStage
          )}`}
        >
          {formatStage(fundingStage)}
        </span>
      </div>

      {/* Financial Info */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-gray-800/50 rounded p-2">
          <div className="flex items-center gap-1 text-gray-400 mb-1">
            <FaDollarSign className="w-3 h-3" />
            <p className="text-xs">Amount</p>
          </div>
          <p className="text-base font-bold text-white">
            ${amount ? (amount / 1000).toFixed(0) : "0"}K
          </p>
        </div>
        <div className="bg-gray-800/50 rounded p-2">
          <div className="flex items-center gap-1 text-gray-400 mb-1">
            <FaPercentage className="w-3 h-3" />
            <p className="text-xs">Equity</p>
          </div>
          <p className="text-base font-bold text-white">{equity || 0}%</p>
        </div>
      </div>

      {/* Valuation */}
      <div className="mb-3 p-2 bg-gradient-to-r from-green-600/10 to-blue-600/10 border border-green-500/20 rounded">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-gray-400">
            <FaBuilding className="w-3 h-3" />
            <p className="text-xs">Valuation</p>
          </div>
          <p className="text-sm font-semibold text-green-400">
            $
            {calculatedValuation
              ? (calculatedValuation / 1000000).toFixed(1)
              : "0"}
            M
          </p>
        </div>
      </div>

      {/* Investment Type */}
      <div className="mb-3">
        <p className="text-xs text-gray-500">
          Type:{" "}
          <span className="text-gray-300">{formatType(investmentType)}</span>
        </p>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-800">
        <span>{formatDate(createdAt)}</span>
        {negotiationHistory.length > 0 && (
          <span className="flex items-center gap-1 text-yellow-400">
            <FaComments className="w-3 h-3" />
            {negotiationHistory.length}
          </span>
        )}
      </div>

      {/* Hover Effect Indicator */}
      <div className="mt-3 pt-3 border-t border-gray-800 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-xs text-center text-blue-400 font-medium">
          Click to view details →
        </p>
      </div>
    </div>
  );
};

export default DealCard;
