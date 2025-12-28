import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaSearch,
  FaFilter,
  FaEye,
  FaEdit,
  FaTrash,
  FaBook,
  FaTimes,
  FaChartLine,
  FaLightbulb,
  FaTag,
  FaCalendar,
} from "react-icons/fa";
import { investorAPI } from "../../services/api";
import MarketResearchModal from "./MarketResearchModal";
import MarketResearchDetailView from "./MarketResearchDetailView";

const MarketResearchSection = () => {
  const [researchNotes, setResearchNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sectorFilter, setSectorFilter] = useState("");
  const [sectors, setSectors] = useState([]);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailView, setShowDetailView] = useState(false);
  const [selectedResearch, setSelectedResearch] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadResearchNotes();
    loadSectors();
  }, []);

  const loadResearchNotes = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await investorAPI.marketResearch.getAll(filters);
      setResearchNotes(data.researchNotes || []);
    } catch (err) {
      console.error("Error loading research notes:", err);
      setError(err.message || "Failed to load research notes");
    } finally {
      setLoading(false);
    }
  };

  const loadSectors = async () => {
    try {
      const data = await investorAPI.marketResearch.getSectors();
      setSectors(data.sectors || []);
    } catch (err) {
      console.error("Error loading sectors:", err);
    }
  };

  const handleSearch = () => {
    const filters = {};
    if (searchQuery) filters.search = searchQuery;
    if (sectorFilter) filters.sector = sectorFilter;
    loadResearchNotes(filters);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSectorFilter("");
    loadResearchNotes();
  };

  const handleCreateNew = () => {
    setSelectedResearch(null);
    setIsEditing(false);
    setShowCreateModal(true);
  };

  const handleViewDetails = (research) => {
    setSelectedResearch(research);
    setShowDetailView(true);
  };

  const handleEdit = (research) => {
    setSelectedResearch(research);
    setIsEditing(true);
    setShowCreateModal(true);
  };

  const handleDelete = async (researchId) => {
    if (
      !window.confirm("Are you sure you want to delete this research note?")
    ) {
      return;
    }

    try {
      await investorAPI.marketResearch.delete(researchId);
      loadResearchNotes();
      if (showDetailView) {
        setShowDetailView(false);
      }
    } catch (err) {
      console.error("Error deleting research note:", err);
      alert(err.message || "Failed to delete research note");
    }
  };

  const handleSaveResearch = async (researchData) => {
    try {
      if (isEditing && selectedResearch) {
        await investorAPI.marketResearch.update(
          selectedResearch._id,
          researchData
        );
      } else {
        await investorAPI.marketResearch.create(researchData);
      }
      loadResearchNotes();
      loadSectors();
      setShowCreateModal(false);
      setSelectedResearch(null);
      setIsEditing(false);
    } catch (err) {
      throw err;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return "No content";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="min-h-screen p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-white/20/30 blur-xl rounded-full"></div>
            <div className="relative bg-gradient-to-br from-white/500 to-white p-4 rounded-xl shadow-lg">
              <FaBook className="w-7 h-7 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white font-manrope bg-gradient-to-r from-white via-white to-white bg-clip-text text-transparent">
              Market Research Notes
            </h1>
            <p className="text-white/60 text-sm font-manrope mt-1">
              Document and organize your market analysis
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-end">
          <div className="flex-1 flex flex-col sm:flex-row gap-3">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search by title, sector, or trends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-12 pr-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all duration-300 font-manrope"
              />
            </div>

            {/* Sector Filter */}
            <div className="sm:w-64 relative">
              <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" />
              <select
                value={sectorFilter}
                onChange={(e) => setSectorFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all duration-300 font-manrope appearance-none cursor-pointer"
              >
                <option value="" className="bg-gray-800">
                  All Sectors
                </option>
                {sectors.map((sector) => (
                  <option key={sector} value={sector} className="bg-gray-800">
                    {sector}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-gradient-to-r from-white/500 to-white text-white rounded-xl hover:from-white/600 hover:to-white transition-all duration-300 font-manrope font-semibold hover:scale-105 hover:shadow-xl hover:shadow-white/30 border border-white/30 flex items-center gap-2"
              >
                <FaSearch className="w-4 h-4" />
                <span className="hidden sm:inline">Search</span>
              </button>
              {(searchQuery || sectorFilter) && (
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-3 bg-white/10 text-white/70 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-300 font-manrope border border-white/10"
                  title="Clear filters"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Create New Button */}
          <button
            onClick={handleCreateNew}
            className="px-6 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all duration-300 font-manrope font-semibold flex items-center gap-2 hover:scale-105 hover:shadow-xl hover:shadow-white/30 border border-white/30"
          >
            <FaPlus className="w-4 h-4" />
            New Research Note
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-gradient-to-r from-white/20 to-white/20 border-2 border-white/40 rounded-xl p-6 text-white/80 font-manrope backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            {error}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && researchNotes.length === 0 && (
        <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border-2 border-white/10 rounded-2xl p-12 text-center backdrop-blur-sm">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-white/20/20 blur-2xl rounded-full"></div>
            <div className="relative bg-gradient-to-br from-white/500/20 to-white/20 p-8 rounded-full border border-white/30">
              <FaBook className="w-16 h-16 text-white/90" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-3 font-manrope">
            No Research Notes Yet
          </h3>
          <p className="text-white/60 mb-6 font-manrope max-w-md mx-auto">
            Start documenting your market research and industry insights to make
            better investment decisions.
          </p>
          <button
            onClick={handleCreateNew}
            className="px-8 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all duration-300 font-manrope font-semibold inline-flex items-center gap-2 hover:scale-105 hover:shadow-xl hover:shadow-white/30 border border-white/30"
          >
            <FaPlus className="w-5 h-5" />
            Create Your First Research Note
          </button>
        </div>
      )}

      {/* Research Notes Grid */}
      {!loading && !error && researchNotes.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {researchNotes.map((research, index) => (
            <div
              key={research._id}
              className="group bg-gradient-to-br from-white/[0.08] to-white/[0.03] border border-white/20 rounded-xl p-6 hover:from-white/[0.12] hover:to-white/[0.06] hover:border-white/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/10 backdrop-blur-sm animate-fade-in cursor-pointer"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => handleViewDetails(research)}
            >
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

              <div className="relative">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2 font-manrope line-clamp-2 group-hover:text-white/90 transition-colors">
                      {research.title}
                    </h3>
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                      <FaTag className="w-3 h-3 text-white/90" />
                      <span className="font-manrope">{research.sector}</span>
                    </div>
                  </div>
                </div>

                {/* Content Preview */}
                <div className="space-y-3 mb-4">
                  {research.trends && (
                    <div className="text-white/70 text-sm font-manrope">
                      <span className="text-white/50">Trends:</span>{" "}
                      {truncateText(research.trends, 80)}
                    </div>
                  )}
                  {research.notes && (
                    <div className="text-white/70 text-sm font-manrope">
                      <span className="text-white/50">Notes:</span>{" "}
                      {truncateText(research.notes, 80)}
                    </div>
                  )}
                </div>

                {/* Meta Info */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-white/60 text-xs">
                    <FaCalendar className="w-3 h-3" />
                    <span className="font-manrope">
                      {formatDate(research.createdAt)}
                    </span>
                  </div>

                  {research.relatedIdeas &&
                    research.relatedIdeas.length > 0 && (
                      <div className="flex items-center gap-1 bg-white/10/20 px-2 py-1 rounded-lg border border-white/30">
                        <FaLightbulb className="w-3 h-3 text-white/90" />
                        <span className="text-white/90 text-xs font-bold font-manrope">
                          {research.relatedIdeas.length}{" "}
                          {research.relatedIdeas.length === 1
                            ? "Idea"
                            : "Ideas"}
                        </span>
                      </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails(research);
                    }}
                    className="flex-1 px-4 py-2 bg-white/20/20 text-white/90 rounded-lg hover:bg-white/20/30 transition-all duration-300 font-manrope font-medium text-sm flex items-center justify-center gap-2 border border-white/30"
                  >
                    <FaEye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(research);
                    }}
                    className="flex-1 px-4 py-2 bg-white/20 text-white/70 rounded-lg hover:bg-white/30 transition-all duration-300 font-manrope font-medium text-sm flex items-center justify-center gap-2 border border-white/30"
                  >
                    <FaEdit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(research._id);
                    }}
                    className="px-4 py-2 bg-white/20 text-white/80 rounded-lg hover:bg-white/30 transition-all duration-300 font-manrope font-medium text-sm flex items-center justify-center gap-2 border border-white/30"
                  >
                    <FaTrash className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <MarketResearchModal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedResearch(null);
            setIsEditing(false);
          }}
          onSave={handleSaveResearch}
          initialData={isEditing ? selectedResearch : null}
          isEditing={isEditing}
        />
      )}

      {showDetailView && selectedResearch && (
        <MarketResearchDetailView
          isOpen={showDetailView}
          onClose={() => {
            setShowDetailView(false);
            setSelectedResearch(null);
          }}
          research={selectedResearch}
          onEdit={() => {
            setShowDetailView(false);
            handleEdit(selectedResearch);
          }}
          onDelete={() => handleDelete(selectedResearch._id)}
        />
      )}
    </div>
  );
};

export default MarketResearchSection;
