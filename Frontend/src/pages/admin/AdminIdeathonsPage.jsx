import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [themeFilter, setThemeFilter] = useState("all");
  const [filterOptions, setFilterOptions] = useState({
    statusOptions: [],
    locationOptions: [],
    themeOptions: [],
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
      return { status: "upcoming", label: "Upcoming", color: "gray" };
    } else if (now >= startDate && now <= endDate) {
      return { status: "active", label: "Active", color: "green" };
    } else {
      return { status: "expired", label: "Expired", color: "red" };
    }
  };

  // Fetch ideathons with better error handling and search/filter support
  const fetchIdeathons = async (params = {}) => {
    try {
      setIsLoading(true);

      // Build query parameters
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        ...params,
      });

      // Add search and filter parameters
      if (searchTerm) queryParams.append("search", searchTerm);
      if (statusFilter && statusFilter !== "all")
        queryParams.append("status", statusFilter);
      if (locationFilter && locationFilter !== "all")
        queryParams.append("location", locationFilter);
      if (themeFilter && themeFilter !== "all")
        queryParams.append("theme", themeFilter);

      const res = await fetch(`${API_BASE}/api/ideathons?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error(
          `Failed to load ideathons: ${res.status} ${res.statusText}`
        );
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
            themeOptions: response.filters.themeOptions || [],
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
        throw new Error(
          response.message ||
            `Failed to create ideathon: ${res.status} ${res.statusText}`
        );
      }

      if (response.success) {
        await fetchIdeathons();
        setShowForm(false);
        setEditingIdeathon(null);
        setError(null);
        toast.success("Ideathon created successfully!");
        return true; // Success
      } else {
        throw new Error(response.message || "Failed to create ideathon");
      }
    } catch (err) {
      setError(`Error creating ideathon: ${err.message}`);
      toast.error(err.message || "Failed to create ideathon");
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
        throw new Error(
          response.message ||
            `Failed to update ideathon: ${res.status} ${res.statusText}`
        );
      }

      if (response.success) {
        await fetchIdeathons();
        setShowForm(false);
        setEditingIdeathon(null);
        setError(null);
        toast.success("Ideathon updated successfully!");
        return true; // Success
      } else {
        throw new Error(response.message || "Failed to update ideathon");
      }
    } catch (err) {
      setError(`Error updating ideathon: ${err.message}`);
      toast.error(err.message || "Failed to update ideathon");
      console.error("Update ideathon error:", err);
      return false; // Failure
    } finally {
      setIsLoading(false);
    }
  };

  // Delete ideathon with confirmation
  const handleDeleteIdeathon = async (id) => {
    const ideathon = ideathons.find((i) => i._id === id);
    if (
      !window.confirm(
        `Are you sure you want to delete ideathon "${
          ideathon?.title || "Unknown"
        }"? This action cannot be undone.`
      )
    ) {
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
        throw new Error(
          response.message ||
            `Failed to delete ideathon: ${res.status} ${res.statusText}`
        );
      }

      if (response.success) {
        await fetchIdeathons();
        setError(null);
      } else {
        throw new Error(response.message || "Failed to delete ideathon");
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
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status color helper
  const getStatusColor = (statusInfo) => {
    switch (statusInfo.color) {
      case "green":
        return "bg-white/10/20 text-white/90 border-white/30";
      case "blue":
        return "bg-white/20/20 text-white/90 border-white/30";
      case "gray":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
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
        <div className="mb-6 p-4 bg-gradient-to-r from-white/30 to-white/20 border border-white/30 rounded-lg backdrop-blur-sm">
          <p className="text-white/80 text-sm font-manrope">{error}</p>
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
            <label className="block text-white/70 text-sm font-manrope mb-2">
              Search Ideathons
            </label>
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
            <label className="block text-white/70 text-sm font-manrope mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="enhanced-dropdown w-full px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50 focus:bg-white/[0.12] transition-all duration-300 backdrop-blur-sm hover:bg-white/[0.10] cursor-pointer"
            >
              <option value="all" className="bg-gray-800 text-white">
                All Status
              </option>
              {filterOptions.statusOptions.map((status) => (
                <option
                  key={status}
                  value={status}
                  className="bg-gray-800 text-white"
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-white/70 text-sm font-manrope mb-2">
              Location
            </label>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="enhanced-dropdown w-full px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50 focus:bg-white/[0.12] transition-all duration-300 backdrop-blur-sm hover:bg-white/[0.10] cursor-pointer"
            >
              <option value="all" className="bg-gray-800 text-white">
                All Locations
              </option>
              {filterOptions.locationOptions.map((location) => (
                <option
                  key={location}
                  value={location}
                  className="bg-gray-800 text-white"
                >
                  {location}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear Filters Button */}
        {(searchTerm ||
          statusFilter !== "all" ||
          locationFilter !== "all" ||
          themeFilter !== "all") && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setLocationFilter("all");
                setThemeFilter("all");
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
            <h4 className="font-manrope font-bold text-white text-xl mb-2">
              No ideathons found
            </h4>
            <p className="text-white/70 font-manrope">
              Create your first ideathon to get started!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideathons.map((ideathon) => {
              const statusInfo = getIdeathonStatus(ideathon);
              return (
                <div
                  key={ideathon._id}
                  className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 rounded-xl p-6 hover:from-white/[0.08] hover:to-white/[0.04] transition-all duration-300 shadow-lg hover:scale-105 hover:-translate-y-1 flex flex-col h-full"
                >
                  {/* Status Badge */}
                  <div className="flex justify-end mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        statusInfo
                      )}`}
                    >
                      {statusInfo.label}
                    </span>
                  </div>

                  {/* Title and Theme */}
                  <div className="mb-4">
                    <h4 className="font-manrope font-bold text-white text-xl mb-2 line-clamp-2">
                      {ideathon.title}
                    </h4>
                    {ideathon.theme && (
                      <p className="text-white/70 text-sm bg-white/5 px-3 py-1 rounded-lg border border-white/10">
                        <span className="font-medium">Theme:</span>{" "}
                        {ideathon.theme}
                      </p>
                    )}
                  </div>

                  {/* Organizers */}
                  {ideathon.organizers && (
                    <div className="mb-4 flex items-center gap-2">
                      <FaBuilding className="text-white/50 text-sm" />
                      <p className="text-white/80 text-sm truncate">
                        {ideathon.organizers}
                      </p>
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
                        <FaTrophy className="text-white/70 text-sm" />
                        <span className="text-white/70 text-xs font-semibold uppercase">
                          Prize Pool
                        </span>
                      </div>
                      <p className="text-white font-medium text-sm">
                        {ideathon.fundingPrizes}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-auto pt-4 space-y-3">
                    <button
                      onClick={() =>
                        navigate(`/admin/ideathon/${ideathon._id}`)
                      }
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
                        className="enhanced-button flex-1 px-3 py-2 bg-gradient-to-r from-white/500/80 to-white/600/80 text-white rounded-lg font-manrope font-medium hover:from-white/400/90 hover:to-white/500/90 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 text-sm backdrop-blur-sm border border-white/30"
                      >
                        <FaEdit className="text-xs" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteIdeathon(ideathon._id)}
                        disabled={isLoading}
                        className="enhanced-button flex-1 px-3 py-2 bg-white/20 text-white rounded-lg font-manrope font-medium hover:bg-white/30 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 text-sm backdrop-blur-sm border border-white/30"
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
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
                        ? "bg-white text-black"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-2 bg-white/10 text-white rounded-lg font-manrope font-medium hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Next
              <FaArrowRight className="text-sm" />
            </button>
          </div>
        )}
      </div>

      {/* Ideathon Form Modal */}
      {showForm && (
        <IdeathonFormModal
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingIdeathon(null);
          }}
          onSubmit={
            editingIdeathon
              ? (data) => handleEditIdeathon(editingIdeathon._id, data)
              : handleCreateIdeathon
          }
          editingIdeathon={editingIdeathon}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

// Ideathon Form Modal Component
const IdeathonFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  editingIdeathon,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    theme: "",
    fundingPrizes: "",
    startDate: "",
    endDate: "",
    description: "",
    organizers: "",
    submissionFormat: [],
    eligibilityCriteria: "",
    judgingCriteria: "",
    location: "",
    contactInformation: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  // Initialize form data when editing
  useEffect(() => {
    if (editingIdeathon) {
      setFormData({
        title: editingIdeathon.title || "",
        theme: editingIdeathon.theme || "",
        fundingPrizes: editingIdeathon.fundingPrizes || "",
        startDate: editingIdeathon.startDate
          ? new Date(editingIdeathon.startDate).toISOString().split("T")[0]
          : "",
        endDate: editingIdeathon.endDate
          ? new Date(editingIdeathon.endDate).toISOString().split("T")[0]
          : "",
        description: editingIdeathon.description || "",
        organizers: editingIdeathon.organizers || "",
        submissionFormat: editingIdeathon.submissionFormat || [],
        eligibilityCriteria: editingIdeathon.eligibilityCriteria || "",
        judgingCriteria: editingIdeathon.judgingCriteria || "",
        location: editingIdeathon.location || "",
        contactInformation: editingIdeathon.contactInformation || "",
      });
    } else {
      // Pre-fill form with sample data for testing
      const today = new Date();
      const startDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
      const endDate = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days from now

      setFormData({
        title: "AI Innovation Challenge 2025",
        theme: "Artificial Intelligence & Machine Learning",
        fundingPrizes:
          "$50,000 Grand Prize + $25,000 Runner-up + $10,000 Best Innovation Award",
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
        description:
          "Join us for an exciting 7-day ideathon focused on developing innovative AI solutions that can solve real-world problems. Participants will work in teams to create prototypes, business plans, and pitch their ideas to industry experts.",
        organizers: "StartSmart Team & Tech Innovation Hub",
        submissionFormat: ["Pitch Deck", "Prototype", "Business Document"],
        eligibilityCriteria:
          "Open to students, professionals, and entrepreneurs aged 18+. Teams of 2-5 members. Basic programming knowledge recommended.",
        judgingCriteria:
          "Innovation (30%), Technical Implementation (25%), Market Potential (25%), Presentation (20%)",
        location: "Hybrid",
        contactInformation: "contact@startsmart.com | +1-555-INNOVATION",
      });
    }
    setFormErrors({});
    setSubmitError("");
    setSubmitSuccess("");
  }, [editingIdeathon, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmissionFormatChange = (format) => {
    setFormData((prev) => ({
      ...prev,
      submissionFormat: prev.submissionFormat.includes(format)
        ? prev.submissionFormat.filter((f) => f !== format)
        : [...prev.submissionFormat, format],
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.startDate) errors.startDate = "Start date is required";
    if (!formData.endDate) errors.endDate = "End date is required";
    if (!formData.description.trim())
      errors.description = "Description is required";
    if (!formData.organizers.trim())
      errors.organizers = "Organizers is required";
    if (formData.submissionFormat.length === 0)
      errors.submissionFormat = "At least one submission format is required";

    // Validate dates
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (start >= end) {
        errors.endDate = "End date must be after start date";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitError("");
    setSubmitSuccess("");

    try {
      const success = await onSubmit(formData);
      if (success) {
        // Success handled by parent component with toast
      } else {
        setSubmitError("Failed to save ideathon. Please try again.");
      }
    } catch (error) {
      setSubmitError(
        error.message || "Failed to save ideathon. Please try again."
      );
    }
  };

  const submissionFormatOptions = [
    "Pitch Deck",
    "Prototype",
    "Code Repository",
    "Business Document",
    "Video Presentation",
    "Demo",
    "Research Paper",
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-white/[0.08] to-black/95 border border-white/20 rounded-2xl backdrop-blur-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto ml-0 md:ml-32">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-white/[0.08] to-black/95 backdrop-blur-xl border-b border-white/10 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {editingIdeathon ? "Edit Ideathon" : "Create New Ideathon"}
              </h2>
              <p className="text-white/60 text-sm">
                {editingIdeathon
                  ? "Update ideathon details"
                  : "Set up a new competition for entrepreneurs"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="mx-6 mt-4 p-4 bg-white/10/20 border border-white/30 rounded-xl flex items-center gap-3">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <p className="text-white/90 font-medium">{submitSuccess}</p>
          </div>
        )}

        {/* Error Message */}
        {submitError && (
          <div className="mx-6 mt-4 p-4 bg-white/20 border border-white/30 rounded-xl flex items-center gap-3">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <p className="text-white/80 font-medium">{submitError}</p>
          </div>
        )}

        {/* Form Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Ideathon Title <span className="text-white/80">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full bg-white/[0.05] border rounded-xl px-4 py-3 text-white placeholder-white/40 backdrop-blur-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                    formErrors.title
                      ? "border-white/50 focus:ring-white/50"
                      : "border-white/20 focus:ring-white/30"
                  }`}
                  placeholder="AI Innovation Challenge 2025"
                />
                {formErrors.title && (
                  <p className="text-white/80 text-xs mt-1 flex items-center gap-1">
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                    {formErrors.title}
                  </p>
                )}
              </div>

              {/* Theme */}
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Theme
                </label>
                <input
                  type="text"
                  name="theme"
                  value={formData.theme}
                  onChange={handleInputChange}
                  className="w-full bg-white/[0.05] border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200"
                  placeholder="Artificial Intelligence & Machine Learning"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Location
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full bg-white/[0.05] border border-white/20 rounded-xl px-4 py-3 text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200 appearance-none cursor-pointer"
                >
                  <option value="Online" className="bg-black text-white">Online</option>
                  <option value="Offline" className="bg-black text-white">Offline</option>
                  <option value="Hybrid" className="bg-black text-white">Hybrid</option>
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Start Date <span className="text-white/80">*</span>
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className={`w-full bg-white/[0.05] border rounded-xl px-4 py-3 text-white backdrop-blur-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                    formErrors.startDate
                      ? "border-white/50 focus:ring-white/50"
                      : "border-white/20 focus:ring-white/30"
                  }`}
                />
                {formErrors.startDate && (
                  <p className="text-white/80 text-xs mt-1 flex items-center gap-1">
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                    {formErrors.startDate}
                  </p>
                )}
              </div>

              {/* End Date */}
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  End Date <span className="text-white/80">*</span>
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className={`w-full bg-white/[0.05] border rounded-xl px-4 py-3 text-white backdrop-blur-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                    formErrors.endDate
                      ? "border-white/50 focus:ring-white/50"
                      : "border-white/20 focus:ring-white/30"
                  }`}
                />
                {formErrors.endDate && (
                  <p className="text-white/80 text-xs mt-1 flex items-center gap-1">
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                    {formErrors.endDate}
                  </p>
                )}
              </div>

              {/* Funding Prizes */}
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Prize Pool
                </label>
                <input
                  type="text"
                  name="fundingPrizes"
                  value={formData.fundingPrizes}
                  onChange={handleInputChange}
                  className="w-full bg-white/[0.05] border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200"
                  placeholder="$50,000 Grand Prize + $20,000 Runner-up"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">
                Description <span className="text-white/80">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full bg-white/[0.05] border rounded-xl px-4 py-3 text-white placeholder-white/40 backdrop-blur-sm focus:outline-none focus:ring-2 resize-none transition-all duration-200 ${
                  formErrors.description
                    ? "border-white/50 focus:ring-white/50"
                    : "border-white/20 focus:ring-white/30"
                }`}
                placeholder="Join us for an exciting 48-hour hackathon focused on building innovative AI solutions that solve real-world problems. Teams will compete to create groundbreaking applications..."
              />
              {formErrors.description && (
                <p className="text-white/80 text-xs mt-1 flex items-center gap-1">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  {formErrors.description}
                </p>
              )}
            </div>

            {/* Organizers */}
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">
                Organizers <span className="text-white/80">*</span>
              </label>
              <input
                type="text"
                name="organizers"
                value={formData.organizers}
                onChange={handleInputChange}
                className={`w-full bg-white/[0.05] border rounded-xl px-4 py-3 text-white placeholder-white/40 backdrop-blur-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                  formErrors.organizers
                    ? "border-white/50 focus:ring-white/50"
                    : "border-white/20 focus:ring-white/30"
                }`}
                placeholder="StartSmart Innovation Hub, TechVentures Inc."
              />
              {formErrors.organizers && (
                <p className="text-white/80 text-xs mt-1 flex items-center gap-1">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  {formErrors.organizers}
                </p>
              )}
            </div>

            {/* Submission Format */}
            <div>
              <label className="block text-white/90 text-sm font-medium mb-3">
                Submission Format <span className="text-white/80">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {submissionFormatOptions.map((format) => (
                  <label
                    key={format}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={formData.submissionFormat.includes(format)}
                        onChange={() => handleSubmissionFormatChange(format)}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
                          formData.submissionFormat.includes(format)
                            ? "bg-white/20 border-white/40"
                            : "border-white/30 group-hover:border-white/50"
                        }`}
                      >
                        {formData.submissionFormat.includes(format) && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-sm"></div>
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="text-white/80 text-sm group-hover:text-white transition-colors">
                      {format}
                    </span>
                  </label>
                ))}
              </div>
              {formErrors.submissionFormat && (
                <p className="text-white/80 text-xs mt-2 flex items-center gap-1">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  {formErrors.submissionFormat}
                </p>
              )}
            </div>

            {/* Additional Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Eligibility Criteria
                </label>
                <textarea
                  name="eligibilityCriteria"
                  value={formData.eligibilityCriteria}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full bg-white/[0.05] border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/30 resize-none transition-all duration-200"
                  placeholder="Students and professionals with programming experience. Teams of 2-5 members..."
                />
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Judging Criteria
                </label>
                <textarea
                  name="judgingCriteria"
                  value={formData.judgingCriteria}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full bg-white/[0.05] border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/30 resize-none transition-all duration-200"
                  placeholder="Innovation (30%), Technical Implementation (25%), Business Viability (25%), Presentation (20%)"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">
                Contact Information
              </label>
              <input
                type="text"
                name="contactInformation"
                value={formData.contactInformation}
                onChange={handleInputChange}
                className="w-full bg-white/[0.05] border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200"
                placeholder="contact@startsmart.com | +1 (555) 123-4567"
              />
            </div>

            {/* Footer */}
            <div className="flex gap-3 pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-200 font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || submitSuccess}
                className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-200 font-medium disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin w-4 h-4" />
                    {editingIdeathon ? "Updating..." : "Creating..."}
                  </>
                ) : submitSuccess ? (
                  <>
                    <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
                    Success!
                  </>
                ) : (
                  <>
                    <FaTrophy className="w-4 h-4" />
                    {editingIdeathon ? "Update Ideathon" : "Create Ideathon"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminIdeathonsPage;
