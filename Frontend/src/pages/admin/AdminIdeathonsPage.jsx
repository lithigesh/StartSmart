import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  FaTrophy,
  FaSpinner,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaTimes,
  FaEye,
  FaCalendarAlt,
  FaBuilding,
  FaGavel,
  FaEnvelope,
  FaArrowLeft,
  FaArrowRight,
  FaUsers,
} from "react-icons/fa";

const AdminIdeathonsPage = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [themeFilter, setThemeFilter] = useState('all');
  const [filterOptions, setFilterOptions] = useState({
    statusOptions: [],
    locationOptions: [],
    themeOptions: []
  });
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [ideathons, setIdeathons] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingIdeathon, setEditingIdeathon] = useState(null);
  const [viewingIdeathon, setViewingIdeathon] = useState(null);

  const token = localStorage.getItem("token");
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "admin")) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, loading, user, navigate]);

  // Helper function to get ideathon status
  const getIdeathonStatus = (ideathon) => {
    const now = new Date();
    const startDate = new Date(ideathon.startDate);
    const endDate = new Date(ideathon.endDate);
    
    if (now < startDate) {
      return { status: 'upcoming', label: 'Upcoming', color: 'gray' };
    } else if (now >= startDate && now <= endDate) {
      return { status: 'active', label: 'Active', color: 'green' };
    } else {
      return { status: 'expired', label: 'Expired', color: 'red' };
    }
  };

  // Fetch ideathons with better error handling and search/filter support
  const fetchIdeathons = async (params = {}) => {
    try {
      setIsLoading(true);
      
      // Build query parameters
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...params
      });

      // Add search and filter parameters
      if (searchTerm) queryParams.append('search', searchTerm);
      if (statusFilter && statusFilter !== 'all') queryParams.append('status', statusFilter);
      if (locationFilter && locationFilter !== 'all') queryParams.append('location', locationFilter);
      if (themeFilter && themeFilter !== 'all') queryParams.append('theme', themeFilter);

      const res = await fetch(`${API_BASE}/api/ideathons?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error(`Failed to load ideathons: ${res.status} ${res.statusText}`);
      }
      const response = await res.json();
      
      // Handle new API response format
      let ideathonsArray = [];
      if (response.success && response.data) {
        ideathonsArray = Array.isArray(response.data) ? response.data : [];
        setTotalPages(response.totalPages || 1);
        setCurrentPage(response.currentPage || 1);
        
        // Update filter options
        if (response.filters) {
          setFilterOptions({
            statusOptions: response.filters.statusOptions || [],
            locationOptions: response.filters.locationOptions || [],
            themeOptions: response.filters.themeOptions || []
          });
        }
      } else if (Array.isArray(response)) {
        ideathonsArray = response; // Fallback for old format
      }
      
      setIdeathons(ideathonsArray);
    } catch (err) {
      setError(`Error loading ideathons: ${err.message}`);
      console.error("Fetch ideathons error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Create new ideathon
  const handleCreateIdeathon = async (ideathonData) => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/api/ideathons`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(ideathonData),
      });
      
      const response = await res.json();
      
      if (!res.ok) {
        throw new Error(response.message || `Failed to create ideathon: ${res.status} ${res.statusText}`);
      }
      
      if (response.success) {
        await fetchIdeathons();
        setError(null);
        return true; // Success
      } else {
        throw new Error(response.message || 'Failed to create ideathon');
      }
    } catch (err) {
      setError(`Error creating ideathon: ${err.message}`);
      console.error("Create ideathon error:", err);
      return false; // Failure
    } finally {
      setIsLoading(false);
    }
  };

  // Edit ideathon
  const handleEditIdeathon = async (ideathonId, ideathonData) => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/api/ideathons/${ideathonId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(ideathonData),
      });
      
      const response = await res.json();
      
      if (!res.ok) {
        throw new Error(response.message || `Failed to update ideathon: ${res.status} ${res.statusText}`);
      }
      
      if (response.success) {
        await fetchIdeathons();
        setError(null);
        return true; // Success
      } else {
        throw new Error(response.message || 'Failed to update ideathon');
      }
    } catch (err) {
      setError(`Error updating ideathon: ${err.message}`);
      console.error("Update ideathon error:", err);
      return false; // Failure
    } finally {
      setIsLoading(false);
    }
  };

  // Delete ideathon with confirmation
  const handleDeleteIdeathon = async (id) => {
    const ideathon = ideathons.find(i => i._id === id);
    if (!window.confirm(`Are you sure you want to delete ideathon "${ideathon?.title || 'Unknown'}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/api/ideathons/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const response = await res.json();
      
      if (!res.ok) {
        throw new Error(response.message || `Failed to delete ideathon: ${res.status} ${res.statusText}`);
      }
      
      if (response.success) {
        await fetchIdeathons();
        setError(null);
      } else {
        throw new Error(response.message || 'Failed to delete ideathon');
      }
    } catch (err) {
      setError(`Error deleting ideathon: ${err.message}`);
      console.error("Delete ideathon error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load ideathons when component mounts
  useEffect(() => {
    if (user?.role === "admin") {
      fetchIdeathons();
    }
  }, [user]);

  // Effect for search and filter changes
  useEffect(() => {
    if (user?.role === "admin") {
      const timeoutId = setTimeout(() => {
        setCurrentPage(1); // Reset to first page when searching
        fetchIdeathons();
      }, 500); // Debounce search

      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm, statusFilter, locationFilter, themeFilter]);

  // Effect for pagination changes
  useEffect(() => {
    if (user?.role === "admin" && currentPage > 1) {
      fetchIdeathons();
    }
  }, [currentPage]);

  // Format date helper
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status color helper
  const getStatusColor = (statusInfo) => {
    switch (statusInfo.color) {
      case 'green': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'blue': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'gray': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
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
        <div className="mb-6 p-4 bg-gradient-to-r from-red-900/30 to-red-800/20 border border-red-500/30 rounded-lg backdrop-blur-sm">
          <p className="text-red-400 text-sm font-manrope">{error}</p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
          <FaTrophy className="text-white" />
          Ideathon Management
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-3 bg-white text-black rounded-lg font-manrope font-medium hover:bg-gray-200 transition-all duration-300 flex items-center gap-3"
        >
          <FaPlus className="text-sm" />
          Create New Ideathon
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-3">
          <FaSearch className="text-white" />
          Search & Filter
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="lg:col-span-2">
            <label className="block text-white/70 text-sm font-manrope mb-2">Search Ideathons</label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
              <input
                type="text"
                placeholder="Search by title, theme, or organizer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/[0.05] border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/[0.08] transition-all duration-300"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-white/70 text-sm font-manrope mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="enhanced-dropdown w-full px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50 focus:bg-white/[0.12] transition-all duration-300 backdrop-blur-sm hover:bg-white/[0.10] cursor-pointer"
            >
              <option value="all" className="bg-gray-800 text-white">All Status</option>
              {filterOptions.statusOptions.map((status) => (
                <option key={status} value={status} className="bg-gray-800 text-white">
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-white/70 text-sm font-manrope mb-2">Location</label>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="enhanced-dropdown w-full px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50 focus:bg-white/[0.12] transition-all duration-300 backdrop-blur-sm hover:bg-white/[0.10] cursor-pointer"
            >
              <option value="all" className="bg-gray-800 text-white">All Locations</option>
              {filterOptions.locationOptions.map((location) => (
                <option key={location} value={location} className="bg-gray-800 text-white">
                  {location}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear Filters Button */}
        {(searchTerm || statusFilter !== 'all' || locationFilter !== 'all' || themeFilter !== 'all') && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setLocationFilter('all');
                setThemeFilter('all');
              }}
              className="px-4 py-2 bg-white/10 text-white rounded-lg font-manrope font-medium hover:bg-white/20 transition-all duration-300 flex items-center gap-2 border border-white/20"
            >
              <FaTimes className="text-sm" />
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Ideathons Grid */}
      <div className="bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-3">
            <FaTrophy className="text-white" />
            All Ideathons ({ideathons.length})
          </h3>
          
          {/* Pagination Info */}
          {totalPages > 1 && (
            <div className="text-white/70 text-sm">
              Page {currentPage} of {totalPages}
            </div>
          )}
        </div>
        
        {ideathons.length === 0 ? (
          <div className="p-12 text-center">
            <FaTrophy className="text-6xl text-white/30 mx-auto mb-4" />
            <h4 className="font-manrope font-bold text-white text-xl mb-2">No ideathons found</h4>
            <p className="text-white/70 font-manrope">Create your first ideathon to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideathons.map((ideathon) => {
              const statusInfo = getIdeathonStatus(ideathon);
              return (
                <div key={ideathon._id} className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 rounded-xl p-6 hover:from-white/[0.08] hover:to-white/[0.04] transition-all duration-300 shadow-lg hover:scale-105 hover:-translate-y-1 flex flex-col h-full">
                  {/* Status Badge */}
                  <div className="flex justify-end mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(statusInfo)}`}>
                      {statusInfo.label}
                    </span>
                  </div>

                  {/* Title and Theme */}
                  <div className="mb-4">
                    <h4 className="font-manrope font-bold text-white text-xl mb-2 line-clamp-2">{ideathon.title}</h4>
                    {ideathon.theme && (
                      <p className="text-white/70 text-sm bg-white/5 px-3 py-1 rounded-lg border border-white/10">
                        <span className="font-medium">Theme:</span> {ideathon.theme}
                      </p>
                    )}
                  </div>

                  {/* Organizers */}
                  {ideathon.organizers && (
                    <div className="mb-4 flex items-center gap-2">
                      <FaBuilding className="text-white/50 text-sm" />
                      <p className="text-white/80 text-sm truncate">{ideathon.organizers}</p>
                    </div>
                  )}

                  {/* Date Range */}
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                      <FaCalendarAlt className="text-white/50" />
                      <span>Start: {formatDate(ideathon.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                      <FaCalendarAlt className="text-white/50" />
                      <span>End: {formatDate(ideathon.endDate)}</span>
                    </div>
                  </div>

                  {/* Prize Pool */}
                  {ideathon.fundingPrizes && (
                    <div className="mb-4 p-3 bg-white/5 border border-white/10 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <FaTrophy className="text-yellow-400 text-sm" />
                        <span className="text-white/70 text-xs font-semibold uppercase">Prize Pool</span>
                      </div>
                      <p className="text-white font-medium text-sm">{ideathon.fundingPrizes}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-auto pt-4 space-y-3">
                    <button
                      onClick={() => setViewingIdeathon(ideathon)}
                      className="enhanced-button w-full px-4 py-2 bg-gradient-to-r from-white/20 to-white/10 text-white border border-white/20 rounded-lg font-manrope font-medium hover:from-white/30 hover:to-white/20 hover:border-white/30 transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-sm"
                    >
                      <FaEye className="text-sm" />
                      View Details
                    </button>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingIdeathon(ideathon);
                          setShowForm(true);
                        }}
                        disabled={isLoading}
                        className="enhanced-button flex-1 px-3 py-2 bg-gradient-to-r from-blue-500/80 to-blue-600/80 text-white rounded-lg font-manrope font-medium hover:from-blue-400/90 hover:to-blue-500/90 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 text-sm backdrop-blur-sm border border-blue-400/30"
                      >
                        <FaEdit className="text-xs" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteIdeathon(ideathon._id)}
                        disabled={isLoading}
                        className="enhanced-button flex-1 px-3 py-2 bg-gradient-to-r from-red-500/80 to-red-600/80 text-white rounded-lg font-manrope font-medium hover:from-red-400/90 hover:to-red-500/90 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 text-sm backdrop-blur-sm border border-red-400/30"
                      >
                        <FaTrash className="text-xs" /> 
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-white/10 text-white rounded-lg font-manrope font-medium hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <FaArrowLeft className="text-sm" />
              Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`px-3 py-2 rounded-lg font-manrope font-medium transition-all duration-300 ${
                      currentPage === pageNumber
                        ? 'bg-white text-black'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 bg-white/10 text-white rounded-lg font-manrope font-medium hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Next
              <FaArrowRight className="text-sm" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminIdeathonsPage;