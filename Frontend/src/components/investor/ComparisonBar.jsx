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
          className="w-full bg-gray-950/90 backdrop-blur-xl border-t border-white/10 px-4 py-3 flex items-center justify-between text-white hover:bg-gray-950 transition-all duration-300"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <FaBalanceScale className="w-5 h-5 text-white/90" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-white/10 rounded-full animate-pulse"></div>
            </div>
            <span className="font-manrope font-semibold">
              {selectedIdeas.length} idea{selectedIdeas.length !== 1 ? "s" : ""}{" "}
              selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            {canCompare && (
              <span className="text-xs bg-white/10 text-white/90 px-2 py-1 rounded-full font-manrope font-medium">
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
          bg-gray-950/90 backdrop-blur-xl border-t border-white/10 
          shadow-2xl shadow-black/20
          transition-all duration-300
          ${isExpanded ? "max-h-96" : "max-h-0 lg:max-h-96"}
          overflow-hidden
        `}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] via-transparent to-transparent pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
            {/* Left: Selected Ideas Chips */}
            <div className="flex-1 w-full lg:w-auto">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <FaBalanceScale className="w-6 h-6 text-white/90 drop-shadow-lg" />
                  {canCompare && (
                    <FaStar className="absolute -top-1 -right-1 w-3 h-3 text-white/70 animate-pulse" />
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
                    key={idea._id || idea.id || `${idea.title || "idea"}-${index}`}
                    className="bg-gray-900/60 border border-white/15 rounded-xl px-4 py-2.5 flex items-center gap-3 group hover:bg-gray-900/70 hover:border-white/25 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-black/30 animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse flex-shrink-0"></div>
                      <span className="text-white text-sm font-manrope font-medium truncate max-w-[200px]">
                        {idea.title}
                      </span>
                    </div>
                    <button
                      onClick={() => onRemove(idea._id)}
                      className="text-white/50 hover:text-white/80 hover:bg-white/10 p-1.5 rounded-lg transition-all duration-300 hover:scale-110 flex-shrink-0"
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
                className="flex-1 lg:flex-initial px-5 py-3 bg-white/10 text-white/70 hover:bg-white/20 hover:text-white/80 hover:border-white/30 border border-white/10 rounded-xl transition-all duration-300 font-manrope font-semibold min-h-[48px] touch-manipulation hover:scale-105 hover:shadow-lg"
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
                      ? "bg-white text-black hover:bg-gray-100 hover:scale-105 shadow-xl shadow-black/30 border-2 border-white/50"
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
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent animate-shimmer"></div>
                )}
                <FaBalanceScale
                  className={`w-5 h-5 ${
                    canCompare ? "text-black animate-bounce-subtle" : ""
                  }`}
                />
                <span>Compare Now</span>
                {canCompare && (
                  <div className="absolute inset-0 bg-gradient-to-r from-black/0 via-black/10 to-black/0 blur-xl group-hover:opacity-100 opacity-0 transition-opacity duration-300"></div>
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
