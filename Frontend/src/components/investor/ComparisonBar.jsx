import React, { useState } from "react";
import {
  FaTimes,
  FaBalanceScale,
  FaChevronDown,
  FaChevronUp,
  FaStar,
} from "react-icons/fa";

const ComparisonBar = ({
  selectedIdeas = [],
  onRemove,
  onCompare,
  onClearAll,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (selectedIdeas.length === 0) return null;

  const canCompare = selectedIdeas.length >= 2;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:left-72 animate-slide-up">
      {/* Mobile Expand/Collapse Toggle */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full bg-gradient-to-r from-white/[0.05] to-white/[0.03] backdrop-blur-xl border-t border-white/10 px-4 py-3 flex items-center justify-between text-white hover:from-white/[0.08] hover:to-white/[0.05] transition-all duration-300"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <FaBalanceScale className="w-5 h-5 text-green-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <span className="font-manrope font-semibold">
              {selectedIdeas.length} idea{selectedIdeas.length !== 1 ? "s" : ""}{" "}
              selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            {canCompare && (
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full font-manrope font-medium">
                Ready
              </span>
            )}
            {isExpanded ? (
              <FaChevronDown className="w-4 h-4 text-white/60" />
            ) : (
              <FaChevronUp className="w-4 h-4 text-white/60" />
            )}
          </div>
        </button>
      </div>

      {/* Main Bar Content */}
      <div
        className={`
          bg-gradient-to-r from-white/[0.05] to-white/[0.03] backdrop-blur-xl border-t border-white/10 
          shadow-2xl shadow-black/20
          transition-all duration-300
          ${isExpanded ? "max-h-96" : "max-h-0 lg:max-h-96"}
          overflow-hidden
        `}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/[0.03] via-transparent to-emerald-500/[0.03] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.1),transparent)] pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
            {/* Left: Selected Ideas Chips */}
            <div className="flex-1 w-full lg:w-auto">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <FaBalanceScale className="w-6 h-6 text-green-400 drop-shadow-lg" />
                  {canCompare && (
                    <FaStar className="absolute -top-1 -right-1 w-3 h-3 text-yellow-400 animate-pulse" />
                  )}
                </div>
                <div>
                  <h3 className="text-white font-manrope font-bold text-lg">
                    Compare Ideas
                  </h3>
                  <p className="text-white/60 text-sm font-manrope">
                    {selectedIdeas.length}/4 selected
                    {canCompare && " • Ready to compare"}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto custom-scrollbar pr-2">
                {selectedIdeas.map((idea, index) => (
                  <div
                    key={idea._id}
                    className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl px-4 py-2.5 flex items-center gap-3 group hover:from-white/15 hover:to-white/10 hover:border-green-400/30 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/10 animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0"></div>
                      <span className="text-white text-sm font-manrope font-medium truncate max-w-[200px]">
                        {idea.title}
                      </span>
                    </div>
                    <button
                      onClick={() => onRemove(idea._id)}
                      className="text-white/50 hover:text-red-400 hover:bg-red-500/10 p-1.5 rounded-lg transition-all duration-300 hover:scale-110 flex-shrink-0"
                      title="Remove from comparison"
                    >
                      <FaTimes className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <button
                onClick={onClearAll}
                className="flex-1 lg:flex-initial px-5 py-3 bg-white/10 text-white/70 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 border border-white/10 rounded-xl transition-all duration-300 font-manrope font-semibold min-h-[48px] touch-manipulation hover:scale-105 hover:shadow-lg"
              >
                Clear All
              </button>

              <button
                onClick={onCompare}
                disabled={!canCompare}
                className={`
                  flex-1 lg:flex-initial px-8 py-3 rounded-xl font-manrope font-bold text-base
                  transition-all duration-300 min-h-[48px] touch-manipulation
                  flex items-center justify-center gap-3 relative overflow-hidden group
                  ${
                    canCompare
                      ? "bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white hover:scale-105 shadow-xl shadow-green-500/30 hover:shadow-2xl hover:shadow-green-500/40 border-2 border-green-400/50"
                      : "bg-white/10 text-white/40 cursor-not-allowed border-2 border-white/10"
                  }
                `}
                title={
                  canCompare
                    ? "Compare selected ideas"
                    : "Select at least 2 ideas to compare"
                }
              >
                {canCompare && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                )}
                <FaBalanceScale
                  className={`w-5 h-5 ${
                    canCompare ? "animate-bounce-subtle" : ""
                  }`}
                />
                <span>Compare Now</span>
                {canCompare && (
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/20 to-green-400/0 blur-xl group-hover:opacity-100 opacity-0 transition-opacity duration-300"></div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonBar;
