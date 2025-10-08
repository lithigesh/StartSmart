import React, { useState, useEffect } from "react";
import { fundingAPI, ideasAPI } from "../services/api";
import SideBar from "../components/entrepreneur/SideBar";
import Header from "../components/Header";
import FundingRequestForm from "../components/entrepreneur/FundingRequestForm";
import FundingRequestDetailsModal from "../components/entrepreneur/FundingRequestDetailsModal";
import {
  FaDollarSign,
  FaPlus,
  FaCheck,
  FaTimes,
  FaClock,
  FaEdit,
  FaEye,
  FaFileContract,
  FaUsers,
  FaCalendarAlt,
  FaFilter,
  FaSort,
  FaSpinner,
  FaExclamationTriangle,
  FaSearch,
  FaChartLine,
  FaHandshake,
  FaPercentage,
} from "react-icons/fa";

const FundingDashboardPage = () => {
  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fundingRequests, setFundingRequests] = useState([]);
  const [userIdeas, setUserIdeas] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [fundingStats, setFundingStats] = useState({});

  // Filter and search state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    loadFundingData();
  }, []);

  const loadFundingData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load funding requests, user ideas, and stats in parallel
      const [fundingResponse, ideasResponse, statsResponse] = await Promise.all(
        [
          fundingAPI.getUserFundingRequests(),
          ideasAPI.getUserIdeas(),
          fundingAPI.getFundingStats(),
        ]
      );

      setFundingRequests(fundingResponse.data || []);
      setUserIdeas(ideasResponse.data || []);
      setFundingStats(statsResponse.data || {});
    } catch (err) {
      console.error("Error loading funding data:", err);
      setError(err.message || "Failed to load funding data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    loadFundingData();
    setShowCreateForm(false);
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleUpdateRequest = async (requestId, updateData) => {
    try {
      setActionLoading({ [`update_${requestId}`]: true });

      const response = await fundingAPI.updateFundingRequestDetails(
        requestId,
        updateData
      );

      if (response.success) {
        await loadFundingData(); // Refresh data
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      console.error("Error updating funding request:", err);
      setError(err.message);
    } finally {
      setActionLoading({ [`update_${requestId}`]: false });
    }
  };

  const handleWithdrawRequest = async (requestId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this funding request? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setActionLoading({ [`withdraw_${requestId}`]: true });

      const response = await fundingAPI.withdrawFundingRequest(requestId);

      if (response.success) {
        await loadFundingData(); // Refresh data
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      console.error("Error deleting funding request:", err);
      setError(err.message);
    } finally {
      setActionLoading({ [`withdraw_${requestId}`]: false });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "accepted":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case "negotiated":
        return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      case "declined":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      case "withdrawn":
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FaClock className="w-4 h-4" />;
      case "accepted":
        return <FaCheck className="w-4 h-4" />;
      case "negotiated":
        return <FaHandshake className="w-4 h-4" />;
      case "declined":
        return <FaTimes className="w-4 h-4" />;
      case "withdrawn":
        return <FaTimes className="w-4 h-4" />;
      default:
        return <FaClock className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return "$0";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateStats = () => {
    const totalRequests = fundingRequests.length;
    const totalAmount = fundingRequests.reduce(
      (sum, req) => sum + (req.amount || 0),
      0
    );
    const acceptedRequests = fundingRequests.filter(
      (req) => req.status === "accepted"
    ).length;
    const pendingRequests = fundingRequests.filter(
      (req) => req.status === "pending"
    ).length;
    const negotiatedRequests = fundingRequests.filter(
      (req) => req.status === "negotiated"
    ).length;
    const averageEquity =
      totalRequests > 0
        ? fundingRequests.reduce((sum, req) => sum + (req.equity || 0), 0) /
          totalRequests
        : 0;

    return {
      totalRequests,
      totalAmount,
      acceptedRequests,
      pendingRequests,
      negotiatedRequests,
      averageEquity,
    };
  };

  // Filter and sort funding requests
  const filteredAndSortedRequests = fundingRequests
    .filter((request) => {
      const matchesSearch =
        !searchTerm ||
        request.idea?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.message?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || request.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "amount":
          aValue = a.amount || 0;
          bValue = b.amount || 0;
          break;
        case "equity":
          aValue = a.equity || 0;
          bValue = b.equity || 0;
          break;
        case "status":
          aValue = a.status || "";
          bValue = b.status || "";
          break;
        case "createdAt":
        default:
          aValue = new Date(a.createdAt || 0);
          bValue = new Date(b.createdAt || 0);
          break;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <div className="flex">
          <SideBar />
          <main className="flex-1 lg:ml-72 flex items-center justify-center">
            <div className="text-center">
              <FaSpinner className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
              <p className="text-white/60 font-manrope">
                Loading funding dashboard...
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <div className="flex">
          <SideBar />
          <main className="flex-1 lg:ml-72 flex items-center justify-center">
            <div className="text-center">
              <FaExclamationTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white font-manrope">
                Error Loading Data
              </h3>
              <p className="text-white/60 mb-4 font-manrope">{error}</p>
              <button
                onClick={loadFundingData}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all duration-300 text-white font-manrope"
              >
                Try Again
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="flex">
        <SideBar />
        <main className="flex-1 lg:ml-72 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white font-manrope mb-2 flex items-center gap-3">
                  <FaDollarSign className="text-green-400" />
                  Funding Dashboard
                </h1>
                <p className="text-white/60 font-manrope">
                  Manage your funding requests and track investor interest
                </p>
              </div>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-6 py-3 bg-white text-black hover:bg-white/90 font-semibold rounded-lg transition-all duration-200 hover:scale-105 flex items-center gap-2 font-manrope"
              >
                <FaPlus className="text-sm" />
                Create Request
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-black border border-white/10 rounded-2xl p-6 hover:bg-gray-900 transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform duration-300">
                    <FaFileContract className="text-xl" />
                  </div>
                  <span className="text-2xl font-bold text-blue-400 font-manrope">
                    {stats.totalRequests}
                  </span>
                </div>
                <h3 className="text-white font-manrope font-semibold text-lg mb-2">
                  Total Requests
                </h3>
                <p className="text-white/60 text-sm font-manrope">
                  All funding requests created
                </p>
              </div>

              <div className="bg-black border border-white/10 rounded-2xl p-6 hover:bg-gray-900 transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform duration-300">
                    <FaDollarSign className="text-xl" />
                  </div>
                  <span className="text-2xl font-bold text-green-400 font-manrope">
                    {formatCurrency(stats.totalAmount)}
                  </span>
                </div>
                <h3 className="text-white font-manrope font-semibold text-lg mb-2">
                  Total Amount
                </h3>
                <p className="text-white/60 text-sm font-manrope">
                  Sum of all requests
                </p>
              </div>

              <div className="bg-black border border-white/10 rounded-2xl p-6 hover:bg-gray-900 transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform duration-300">
                    <FaCheck className="text-xl" />
                  </div>
                  <span className="text-2xl font-bold text-purple-400 font-manrope">
                    {stats.acceptedRequests}
                  </span>
                </div>
                <h3 className="text-white font-manrope font-semibold text-lg mb-2">
                  Accepted
                </h3>
                <p className="text-white/60 text-sm font-manrope">
                  Successfully approved
                </p>
              </div>

              <div className="bg-black border border-white/10 rounded-2xl p-6 hover:bg-gray-900 transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center text-yellow-400 group-hover:scale-110 transition-transform duration-300">
                    <FaPercentage className="text-xl" />
                  </div>
                  <span className="text-2xl font-bold text-yellow-400 font-manrope">
                    {stats.averageEquity.toFixed(1)}%
                  </span>
                </div>
                <h3 className="text-white font-manrope font-semibold text-lg mb-2">
                  Avg Equity
                </h3>
                <p className="text-white/60 text-sm font-manrope">
                  Average equity offered
                </p>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-black border border-white/10 rounded-2xl p-6 mb-6">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  {/* Search */}
                  <div className="relative flex-1 max-w-md">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search requests..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-white/20 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors font-manrope"
                    />
                  </div>

                  {/* Status Filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 bg-gray-900 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors font-manrope"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="negotiated">Negotiated</option>
                    <option value="accepted">Accepted</option>
                    <option value="declined">Declined</option>
                    <option value="withdrawn">Withdrawn</option>
                  </select>
                </div>

                {/* Sort Controls */}
                <div className="flex gap-2 items-center">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 bg-gray-900 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors font-manrope text-sm"
                  >
                    <option value="createdAt">Date</option>
                    <option value="amount">Amount</option>
                    <option value="equity">Equity</option>
                    <option value="status">Status</option>
                  </select>

                  <button
                    onClick={() =>
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    }
                    className="px-3 py-2 bg-gray-900 border border-white/20 rounded-lg text-white hover:bg-gray-800 transition-colors"
                  >
                    <FaSort className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Funding Requests List */}
            {filteredAndSortedRequests.length === 0 ? (
              <div className="text-center py-12">
                <FaDollarSign className="mx-auto text-6xl text-gray-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-white font-manrope">
                  {searchTerm || statusFilter !== "all"
                    ? "No matching requests"
                    : "No Funding Requests Yet"}
                </h3>
                <p className="text-white/60 mb-6 font-manrope">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Create your first funding request to start securing investment for your ideas"}
                </p>
                {!searchTerm && statusFilter === "all" && (
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="px-6 py-3 bg-white text-black hover:bg-white/90 font-semibold rounded-lg transition-all duration-300 font-manrope"
                  >
                    Create Request
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredAndSortedRequests.map((request) => (
                  <div
                    key={request._id || request.id}
                    className="bg-black border border-white/10 rounded-2xl p-6 hover:bg-gray-900 hover:border-white/20 transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-white font-manrope">
                            {request.idea?.title ||
                              request.ideaTitle ||
                              "Unknown Idea"}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm border font-manrope ${getStatusColor(
                              request.status
                            )}`}
                          >
                            {getStatusIcon(request.status)}
                            {request.status?.charAt(0).toUpperCase() +
                              request.status?.slice(1)}
                          </span>
                        </div>
                        <p className="text-white/60 mb-3 font-manrope">
                          {request.message ||
                            request.description ||
                            "No description provided"}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-white/60 font-manrope">
                          <span className="flex items-center gap-1">
                            <FaDollarSign className="w-3 h-3" />
                            {formatCurrency(request.amount)}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaPercentage className="w-3 h-3" />
                            {request.equity}% equity
                          </span>
                          {request.valuation && (
                            <span className="flex items-center gap-1">
                              <FaChartLine className="w-3 h-3" />
                              {formatCurrency(request.valuation)} valuation
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <FaCalendarAlt className="w-3 h-3" />
                            {new Date(request.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-400 mb-1 font-manrope">
                          {formatCurrency(request.amount)}
                        </p>
                        <p className="text-white/60 text-sm font-manrope">
                          Requested
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex items-center gap-3">
                        {request.viewedBy && request.viewedBy.length > 0 && (
                          <span className="text-white/60 text-sm font-manrope flex items-center gap-1">
                            <FaEye className="w-3 h-3" />
                            {request.viewedBy.length} investor
                            {request.viewedBy.length !== 1 ? "s" : ""} viewed
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleViewDetails(request)}
                          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg transition-all duration-300 flex items-center gap-2 font-manrope"
                        >
                          <FaEye className="text-sm" />
                          View Details
                        </button>

                        {["pending", "negotiated"].includes(request.status) && (
                          <>
                            <button
                              onClick={() => handleViewDetails(request)}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 flex items-center gap-2 font-manrope"
                              disabled={
                                actionLoading[
                                  `update_${request._id || request.id}`
                                ]
                              }
                            >
                              {actionLoading[
                                `update_${request._id || request.id}`
                              ] ? (
                                <FaSpinner className="w-4 h-4 animate-spin" />
                              ) : (
                                <FaEdit className="text-sm" />
                              )}
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                handleWithdrawRequest(request._id || request.id)
                              }
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300 flex items-center gap-2 font-manrope"
                              disabled={
                                actionLoading[
                                  `withdraw_${request._id || request.id}`
                                ]
                              }
                            >
                              {actionLoading[
                                `withdraw_${request._id || request.id}`
                              ] ? (
                                <FaSpinner className="w-4 h-4 animate-spin" />
                              ) : (
                                <FaTimes className="text-sm" />
                              )}
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Create Request Modal */}
      <FundingRequestForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* Details Modal */}
      {selectedRequest && (
        <FundingRequestDetailsModal
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedRequest(null);
          }}
          request={selectedRequest}
          onUpdate={handleUpdateRequest}
          onWithdraw={handleWithdrawRequest}
        />
      )}
    </div>
  );
};

export default FundingDashboardPage;
