import React, { useState } from "react";
import {
  FaSearch,
  FaFilter,
  FaTimes,
  FaBalanceScale,
  FaCheck,
} from "react-icons/fa";
import IdeaCard from "../IdeaCard";
import EmptyState from "../EmptyState";

const IdeasSection = ({
  title,
  ideas,
  filteredIdeas,
  interestedIdeas = [],
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  sortBy,
  setSortBy,
  categories,
  onInterest,
  actionLoading,
  showFilters = false,
  emptyStateType,
  emptyStateAction,
  emptyStateActionText,
  sectionRef,
  maxHeight = "600px",
  // Advanced filter props
  minScore = 0,
  setMinScore,
  maxScore = 100,
  setMaxScore,
  fundingRange = "all",
  setFundingRange,
  statusFilter = "all",
  setStatusFilter,
  selectedTags = [],
  setSelectedTags,
  showAdvancedFilters = false,
  // Comparison props
  comparisonMode = false,
  setComparisonMode,
  selectedForComparison = [],
  onToggleComparison,
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  // Available tags for filtering
  const availableTags = [
    "AI",
    "Machine Learning",
    "Blockchain",
    "IoT",
    "SaaS",
    "Mobile",
    "Web",
    "E-commerce",
    "Healthcare",
    "Education",
    "Finance",
    "Gaming",
  ];

  // Funding range options
  const fundingRanges = [
    { value: "all", label: "Any Amount" },
    { value: "0-10k", label: "$0 - $10,000" },
    { value: "10k-50k", label: "$10,000 - $50,000" },
    { value: "50k-100k", label: "$50,000 - $100,000" },
    { value: "100k+", label: "$100,000+" },
  ];

  // Status options
  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "new", label: "New Ideas" },
    { value: "analyzed", label: "AI Analyzed" },
    { value: "funded", label: "Seeking Funding" },
  ];

  // Handle tag toggle
  const handleTagToggle = (tag) => {
    if (setSelectedTags) {
      setSelectedTags((prev) =>
        prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
      );
    }
  };

  // Clear all advanced filters
  const clearAdvancedFilters = () => {
    if (setMinScore) setMinScore(0);
    if (setMaxScore) setMaxScore(100);
    if (setFundingRange) setFundingRange("all");
    if (setStatusFilter) setStatusFilter("all");
    if (setSelectedTags) setSelectedTags([]);
  };

  // Count active advanced filters
  const activeAdvancedFilters = [
    minScore > 0 ? 1 : 0,
    maxScore < 100 ? 1 : 0,
    fundingRange !== "all" ? 1 : 0,
    statusFilter !== "all" ? 1 : 0,
    selectedTags.length > 0 ? 1 : 0,
  ].reduce((sum, count) => sum + count, 0);
  return (
    <div
      ref={sectionRef}
      className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 lg:p-8 relative overflow-hidden mb-8"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-manrope font-bold text-white">
              {title} ({filteredIdeas.length} of {ideas.length})
            </h3>

            {/* Comparison Mode Toggle */}
            {setComparisonMode && (
              <button
                onClick={() => setComparisonMode(!comparisonMode)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 font-manrope font-medium min-h-[44px] touch-manipulation
                  ${
                    comparisonMode
                      ? "bg-white/10 text-white/90 border border-white/30"
                      : "bg-white/[0.03] text-white/70 border border-white/10 hover:bg-white/[0.05]"
                  }
                `}
                title={
                  comparisonMode
                    ? "Exit comparison mode"
                    : "Enter comparison mode"
                }
              >
                {comparisonMode ? (
                  <>
                    <FaCheck className="w-4 h-4" />
                    <span className="hidden sm:inline">Comparing</span>
                  </>
                ) : (
                  <>
                    <FaBalanceScale className="w-4 h-4" />
                    <span className="hidden sm:inline">Compare</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Filter Controls */}
          {showFilters && (
            <div className="space-y-4 w-full xl:w-auto">
              {/* Basic Filters Row */}
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 w-full">
                {/* Search */}
                <div className="relative min-w-0 flex-1 sm:flex-initial sm:w-64">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search ideas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all duration-300 font-manrope min-h-[44px] touch-manipulation"
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all duration-300 font-manrope min-h-[44px] touch-manipulation w-full sm:w-auto"
                >
                  <option value="all" className="bg-gray-800">
                    All Categories
                  </option>
                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                      className="bg-gray-800"
                    >
                      {category}
                    </option>
                  ))}
                </select>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all duration-300 font-manrope min-h-[44px] touch-manipulation w-full sm:w-auto"
                >
                  <option value="newest" className="bg-gray-800">
                    Newest First
                  </option>
                  <option value="oldest" className="bg-gray-800">
                    Oldest First
                  </option>
                  <option value="score" className="bg-gray-800">
                    Highest Score
                  </option>
                </select>

                {/* Advanced Filters Toggle */}
                {showAdvancedFilters && (
                  <button
                    onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-300 font-manrope min-h-[44px] touch-manipulation w-full sm:w-auto justify-center sm:justify-start ${
                      isAdvancedOpen
                        ? "bg-white/10 text-white/90 border border-white/30"
                        : "bg-white/[0.03] text-white/70 border border-white/10 hover:bg-white/[0.05]"
                    }`}
                  >
                    <FaFilter className="w-4 h-4" />
                    <span className="whitespace-nowrap">Advanced</span>
                    {activeAdvancedFilters > 0 && (
                      <span className="bg-white/10 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                        {activeAdvancedFilters}
                      </span>
                    )}
                  </button>
                )}
              </div>

              {/* Advanced Filters Panel */}
              {showAdvancedFilters && isAdvancedOpen && (
                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-lg p-4 sm:p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-white font-semibold text-lg font-manrope">
                      Advanced Filters
                    </h4>
                    {activeAdvancedFilters > 0 && (
                      <button
                        onClick={clearAdvancedFilters}
                        className="flex items-center gap-2 px-3 py-1 text-white/80 hover:text-white/80 hover:bg-white/10 rounded-lg transition-colors duration-300 font-manrope"
                      >
                        <FaTimes className="w-4 h-4" />
                        Clear Advanced
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {/* AI Score Range */}
                    <div className="sm:col-span-2 lg:col-span-1">
                      <label className="block text-white/80 text-sm font-medium mb-3 font-manrope">
                        AI Score Range: {minScore}% - {maxScore}%
                      </label>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-white/60 mb-1 block">
                            Min: {minScore}%
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={minScore}
                            onChange={(e) =>
                              setMinScore &&
                              setMinScore(parseInt(e.target.value))
                            }
                            className="w-full accent-green-500 h-2"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-white/60 mb-1 block">
                            Max: {maxScore}%
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={maxScore}
                            onChange={(e) =>
                              setMaxScore &&
                              setMaxScore(parseInt(e.target.value))
                            }
                            className="w-full accent-green-500 h-2"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Funding Range */}
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2 font-manrope">
                        Funding Range
                      </label>
                      <select
                        value={fundingRange}
                        onChange={(e) =>
                          setFundingRange && setFundingRange(e.target.value)
                        }
                        className="w-full px-4 py-3 bg-white/[0.03] border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent font-manrope"
                      >
                        {fundingRanges.map((range) => (
                          <option
                            key={range.value}
                            value={range.value}
                            className="bg-gray-800"
                          >
                            {range.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Status Filter */}
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2 font-manrope">
                        Status
                      </label>
                      <select
                        value={statusFilter}
                        onChange={(e) =>
                          setStatusFilter && setStatusFilter(e.target.value)
                        }
                        className="w-full px-4 py-3 bg-white/[0.03] border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent font-manrope"
                      >
                        {statusOptions.map((status) => (
                          <option
                            key={status.value}
                            value={status.value}
                            className="bg-gray-800"
                          >
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Tags Filter */}
                  <div className="sm:col-span-2 lg:col-span-3 xl:col-span-4">
                    <label className="block text-white/80 text-sm font-medium mb-3 font-manrope">
                      Tags ({selectedTags.length} selected)
                    </label>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                      {availableTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => handleTagToggle(tag)}
                          className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 font-manrope min-h-[36px] touch-manipulation whitespace-nowrap ${
                            selectedTags.includes(tag)
                              ? "bg-white/10 text-white"
                              : "bg-white/10 text-white/70 hover:bg-white/20"
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {filteredIdeas.length === 0 ? (
          <EmptyState
            type={emptyStateType}
            title={
              searchTerm || categoryFilter !== "all"
                ? "No Results Found"
                : emptyStateType === "interested"
                ? "No Interested Ideas"
                : "No Ideas Available"
            }
            description={
              searchTerm || categoryFilter !== "all"
                ? "No ideas match your current filters. Try adjusting your search criteria."
                : emptyStateType === "interested"
                ? "You haven't shown interest in any ideas yet. Browse available ideas to get started."
                : "No ideas are available at the moment. Check back later for new opportunities."
            }
            action={emptyStateAction}
            actionText={
              searchTerm || categoryFilter !== "all"
                ? "Clear Filters"
                : emptyStateActionText
            }
          />
        ) : (
          <div className="relative">
            <div
              className="overflow-visible sm:overflow-y-auto pr-0 sm:pr-4 lg:pr-8 custom-scrollbar max-h-none sm:max-h-[var(--ideas-max-h)]"
              style={{ "--ideas-max-h": maxHeight }}
            >
              <div className="grid gap-6">
                {filteredIdeas.map((idea) => (
                  <IdeaCard
                    key={idea._id}
                    idea={idea}
                    showInterestButton={true}
                    isInterested={interestedIdeas.some(
                      (interested) => interested._id === idea._id
                    )}
                    onInterest={onInterest}
                    loading={actionLoading[idea._id]}
                    comparisonMode={comparisonMode}
                    isSelectedForComparison={selectedForComparison.some(
                      (selected) => selected._id === idea._id
                    )}
                    onToggleComparison={onToggleComparison}
                    maxComparisonReached={selectedForComparison.length >= 4}
                  />
                ))}
              </div>
            </div>
            {/* Scroll indicator gradient - only shown when content overflows */}
            {filteredIdeas.length > 3 && (
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/40 to-transparent pointer-events-none rounded-b-2xl"></div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default IdeasSection;
