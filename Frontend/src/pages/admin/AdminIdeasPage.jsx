import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  FaLightbulb,
  FaTrash,
  FaSpinner,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaFilter,
  FaSearch,
} from "react-icons/fa";

const AdminIdeasPage = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("token");
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "admin")) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, loading, user, navigate]);

  // Fetch ideas with better error handling
  const fetchIdeas = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/api/admin/ideas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error(
          `Failed to load ideas: ${res.status} ${res.statusText}`
        );
      }
      const data = await res.json();
      const ideasArray = Array.isArray(data) ? data : [];
      setIdeas(ideasArray);
    } catch (err) {
      setError(`Error loading ideas: ${err.message}`);
      console.error("Fetch ideas error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete idea with enhanced confirmation
  const handleDeleteIdea = async (id) => {
    const idea = ideas.find((i) => i._id === id);
    if (
      !window.confirm(
        `Are you sure you want to delete idea "${
          idea?.title || "Unknown"
        }"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/api/admin/ideas/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error(
          `Failed to delete idea: ${res.status} ${res.statusText}`
        );
      }

      setIdeas((prev) => prev.filter((idea) => idea._id !== id));
      setError(null);
      toast.error(`Idea "${idea?.title || "Unknown"}" has been deleted.`);
    } catch (err) {
      setError(`Error deleting idea: ${err.message}`);
      console.error("Delete idea error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchIdeas();
    }
  }, [user]);

  // Get unique categories from ideas
  const uniqueCategories = [
    ...new Set(ideas.map((idea) => idea.category).filter(Boolean)),
  ];

  // Filter and sort ideas
  const filteredAndSortedIdeas = ideas
    .filter((idea) => {
      const matchesStatus =
        filterStatus === "all" || idea.status === filterStatus;
      const matchesCategory =
        filterCategory === "all" || idea.category === filterCategory;
      const matchesSearch =
        !searchTerm ||
        idea.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idea.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idea.owner?.name?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStatus && matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "title":
          aValue = a.title || "";
          bValue = b.title || "";
          break;
        case "category":
          aValue = a.category || "";
          bValue = b.category || "";
          break;
        case "status":
          aValue = a.status || "";
          bValue = b.status || "";
          break;
        case "owner":
          aValue = a.owner?.name || "";
          bValue = b.owner?.name || "";
          break;
        case "createdAt":
        default:
          aValue = new Date(a.createdAt || 0);
          bValue = new Date(b.createdAt || 0);
          break;
      }

      if (sortBy === "createdAt") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      } else {
        const comparison = aValue.toString().localeCompare(bValue.toString());
        return sortOrder === "asc" ? comparison : -comparison;
      }
    });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return <FaSort className="w-3 h-3 opacity-50" />;
    return sortOrder === "asc" ? (
      <FaSortUp className="w-3 h-3 text-white" />
    ) : (
      <FaSortDown className="w-3 h-3 text-white" />
    );
  };

  const resetFilters = () => {
    setSortBy("createdAt");
    setSortOrder("desc");
    setFilterStatus("all");
    setFilterCategory("all");
    setSearchTerm("");
  };

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <FaSpinner className="animate-spin text-4xl mb-4 mx-auto" />
          <p className="font-manrope">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-gradient-to-r from-white/30 to-white/20 border border-white/30 rounded-lg backdrop-blur-sm">
          <p className="text-white/80 text-sm font-manrope">{error}</p>
        </div>
      )}

      <div className="bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl">
        <div className="p-6 border-b border-white/10">
          <div className="relative">
            <h2 className="text-2xl font-semibold text-white flex items-center gap-3 mb-6">
              <FaLightbulb className="text-white" /> All Ideas (
              {filteredAndSortedIdeas.length} of {ideas.length})
            </h2>
            {/* Floating particles */}
            <div className="absolute top-2 right-4 w-1 h-1 bg-white/60 rounded-full animate-ping"></div>
            <div className="absolute bottom-2 right-8 w-1 h-1 bg-white/50 rounded-full animate-bounce"></div>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
              <input
                type="text"
                placeholder="Search ideas by title, description, or owner..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/[0.05] border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/[0.08] transition-all duration-300"
              />
            </div>

            {/* Filters and Sorting */}
            <div className="flex flex-wrap gap-4 items-center">
              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <FaFilter className="text-white/70 w-4 h-4" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="enhanced-dropdown px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50 focus:bg-white/[0.12] transition-all duration-300 backdrop-blur-sm hover:bg-white/[0.10] cursor-pointer"
                >
                  <option value="all" className="bg-gray-800 text-white">
                    All Status
                  </option>
                  <option value="pending" className="bg-gray-800 text-white">
                    Pending
                  </option>
                  <option value="approved" className="bg-gray-800 text-white">
                    Approved
                  </option>
                  <option value="rejected" className="bg-gray-800 text-white">
                    Rejected
                  </option>
                  <option value="analyzed" className="bg-gray-800 text-white">
                    Analyzed
                  </option>
                </select>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="enhanced-dropdown px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50 focus:bg-white/[0.12] transition-all duration-300 backdrop-blur-sm hover:bg-white/[0.10] cursor-pointer"
                >
                  <option value="all" className="bg-gray-800 text-white">
                    All Categories
                  </option>
                  {uniqueCategories.map((category) => (
                    <option
                      key={category}
                      value={category}
                      className="bg-gray-800 text-white"
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Options */}
              <div className="flex items-center gap-2">
                <span className="text-white/70 text-sm font-manrope">
                  Sort by:
                </span>
                <div className="flex gap-1">
                  {[
                    { field: "createdAt", label: "Date" },
                    { field: "title", label: "Title" },
                    { field: "category", label: "Category" },
                    { field: "status", label: "Status" },
                    { field: "owner", label: "Owner" },
                  ].map(({ field, label }) => (
                    <button
                      key={field}
                      onClick={() => handleSort(field)}
                      className={`px-3 py-2 rounded-lg text-sm font-manrope flex items-center gap-1 transition-all duration-300 ${
                        sortBy === field
                          ? "bg-white/20 text-white border border-white/30"
                          : "bg-white/[0.05] text-white/70 hover:bg-white/10 hover:text-white border border-white/10"
                      }`}
                    >
                      {label}
                      {getSortIcon(field)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset Filters */}
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-white/10 text-white/70 rounded-lg text-sm font-manrope hover:bg-white/20 hover:text-white transition-all duration-300 border border-white/20"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {filteredAndSortedIdeas.length === 0 ? (
          <div className="p-12 text-center">
            <FaLightbulb className="text-6xl mb-4 mx-auto text-white/30" />
            <p className="font-manrope text-white/70 text-lg">
              {ideas.length === 0
                ? "No ideas found"
                : "No ideas match your filters"}
            </p>
            {ideas.length > 0 && (
              <button
                onClick={resetFilters}
                className="mt-4 px-6 py-2 bg-white/20 text-white rounded-lg font-manrope hover:bg-white/30 transition-all duration-300"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedIdeas.map((idea) => (
                <div
                  key={idea._id}
                  className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 rounded-xl p-6 hover:from-white/[0.08] hover:to-white/[0.04] transition-all duration-300 shadow-lg hover:scale-105 hover:-translate-y-1 flex flex-col h-full"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-manrope font-semibold text-white text-lg mb-1">
                        {idea.title || "N/A"}
                      </h3>
                      <p className="text-sm text-white/70 font-manrope">
                        {idea.category || "N/A"}
                      </p>
                    </div>
                    <span
                      className={
                        idea.status === "approved"
                          ? "px-3 py-1 rounded-full text-xs font-semibold ml-3 bg-gray-700 text-gray-300"
                          : idea.status === "rejected"
                          ? "px-3 py-1 rounded-full text-xs font-semibold ml-3 bg-white/30 text-white/80"
                          : "px-3 py-1 rounded-full text-xs font-semibold ml-3 bg-gray-800 text-gray-400"
                      }
                    >
                      {idea.status || "pending"}
                    </span>
                  </div>

                  <p className="text-sm text-gray-300 font-manrope mb-4 line-clamp-3">
                    {idea.description
                      ? idea.description.substring(0, 150) + "..."
                      : "No description"}
                  </p>

                  <div className="flex justify-between items-center mb-4">
                    <p className="text-xs text-gray-500 font-manrope">
                      By: {idea.owner?.name || "Unknown"}
                    </p>
                    <p className="text-xs text-gray-500 font-manrope">
                      {idea.createdAt
                        ? new Date(idea.createdAt).toLocaleDateString()
                        : "Unknown date"}
                    </p>
                  </div>

                  <div className="flex gap-3 mt-auto">
                    <button
                      onClick={() => navigate(`/admin/idea/${idea._id}`)}
                      className="flex-1 px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors duration-300"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleDeleteIdea(idea._id)}
                      disabled={isLoading}
                      className="px-4 py-2 bg-white/20 text-white font-medium rounded-lg hover:bg-white/30 transition-colors duration-300 disabled:opacity-50 flex items-center gap-2"
                    >
                      <FaTrash className="text-sm text-red-400" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminIdeasPage;
