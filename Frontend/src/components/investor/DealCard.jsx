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
      seed: "bg-white/10 text-white/90 border-white/30",
      series_a: "bg-white/20 text-white/90 border-white/30",
      series_b: "bg-white/20 text-white/90 border-white/30",
      series_c: "bg-white/20 text-white/80 border-white/30",
      bridge: "bg-white/20 text-white/80 border-white/30",
      other: "bg-white/20 text-white/70 border-white/30",
    };
    return colors[stage] || colors.seed;
  };

  // Get status icon
  const getStatusIcon = () => {
    if (stage === "new") return <FaClock className="w-4 h-4 text-white/90" />;
    if (stage === "viewed") return <FaEye className="w-4 h-4 text-white/90" />;
    if (stage === "negotiating")
      return <FaComments className="w-4 h-4 text-white/70" />;
    if (stage === "accepted")
      return <FaCheckCircle className="w-4 h-4 text-white/90" />;
    if (stage === "declined")
      return <FaTimesCircle className="w-4 h-4 text-white/80" />;
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
      className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-4 hover:bg-white/[0.05] hover:border-white/20 hover:shadow-lg hover:shadow-white/10 transition-all duration-200 cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-white truncate group-hover:text-white/90 transition-colors">
            {idea?.title || "Untitled Idea"}
          </h3>
          <p className="text-sm text-white/60 truncate">
            {entrepreneur?.name || "Unknown Entrepreneur"}
          </p>
        </div>
        <div className="ml-2 flex-shrink-0">{getStatusIcon()}</div>
      </div>

      {/* Category & Stage Badge */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {idea?.category && (
          <span className="px-2 py-1 bg-white/[0.03] border border-white/10 text-white/70 rounded text-xs">
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
        <div className="bg-white/[0.03] border border-white/10 rounded-lg p-2">
          <div className="flex items-center gap-1 text-white/60 mb-1">
            <FaDollarSign className="w-3 h-3" />
            <p className="text-xs">Amount</p>
          </div>
          <p className="text-base font-bold text-white">
            ${amount ? (amount / 1000).toFixed(0) : "0"}K
          </p>
        </div>
        <div className="bg-white/[0.03] border border-white/10 rounded-lg p-2">
          <div className="flex items-center gap-1 text-white/60 mb-1">
            <FaPercentage className="w-3 h-3" />
            <p className="text-xs">Equity</p>
          </div>
          <p className="text-base font-bold text-white">{equity || 0}%</p>
        </div>
      </div>

      {/* Valuation */}
      <div className="mb-3 p-2 bg-white/[0.03] border border-white/10 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-white/60">
            <FaBuilding className="w-3 h-3" />
            <p className="text-xs">Valuation</p>
          </div>
          <p className="text-sm font-semibold text-white/90">
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
        <p className="text-xs text-white/50">
          Type:{" "}
          <span className="text-white/70">{formatType(investmentType)}</span>
        </p>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-xs text-white/50 pt-3 border-t border-white/10">
        <span>{formatDate(createdAt)}</span>
      </div>

      {/* Hover Effect Indicator */}
      <div className="mt-3 pt-3 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-xs text-center text-white/90 font-medium">
          Click to view details →
        </p>
      </div>
    </div>
  );
};

export default DealCard;
