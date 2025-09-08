import React from "react";
import { FaSearch } from "react-icons/fa";
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
  maxHeight = "600px"
}) => {
  return (
    <div
      ref={sectionRef}
      className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden mb-8"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <h3 className="text-xl font-manrope font-bold text-white">
            {title} ({filteredIdeas.length} of {ideas.length})
          </h3>

          {/* Filter Controls */}
          {showFilters && (
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              {/* Search */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search ideas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors w-full sm:w-64"
                />
              </div>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30 transition-colors"
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
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30 transition-colors"
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
              className="overflow-y-auto pr-8 custom-scrollbar"
              style={{ maxHeight }}
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
