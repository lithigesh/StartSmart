// pages/entrepreneur/FundingPage.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../hooks/useNotifications";
import { entrepreneurAPI, fundingAPI, ideasAPI } from "../../services/api";
import FundingRequestDetailsModal from "../../components/entrepreneur/FundingRequestDetailsModal";
import InvestorSelector from "../../components/entrepreneur/InvestorSelector";
import {
  FaDollarSign,
  FaFileAlt,
  FaUsers,
  FaPlus,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
  FaMinusCircle,
  FaSpinner,
  FaTimes,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaLinkedin,
  FaUserPlus,
} from "react-icons/fa";

const FundingPage = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  // State management
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalIdeas: 0,
    fundingReceived: 0,
    interestedInvestors: 0,
  });
  const [userIdeas, setUserIdeas] = useState([]);
  const [fundingRequests, setFundingRequests] = useState([]);
  const [showFundingModal, setShowFundingModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFundingRequest, setSelectedFundingRequest] = useState(null);
  const [showInvestorSelector, setShowInvestorSelector] = useState(false);
  const [interestedInvestors, setInterestedInvestors] = useState([]);
  const [selectedInvestors, setSelectedInvestors] = useState([]);
  const [accessType, setAccessType] = useState("public");
  const [fundingFormData, setFundingFormData] = useState({
    ideaId: "",
    amount: "",
    equity: "",
    message: "",
    businessPlan: "",
    financialProjections: "",
    useOfFunds: "",
    timeline: "",
    milestones: "",
    teamSize: "",
    currentRevenue: "",
    projectedRevenue: "",
    targetMarket: "",
    competitiveAdvantage: "",
    riskFactors: "",
    exitStrategy: "",
    previousFunding: "",
    revenueModel: "",
    customerTraction: "",
    intellectualProperty: "",
    keyTeamMembers: "",
    advisors: "",
    existingInvestors: "",
    contactPhone: "",
    contactEmail: "",
    companyWebsite: "",
    linkedinProfile: "",
    additionalDocuments: "",
  });
  const [submittingFunding, setSubmittingFunding] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [metricsData, ideasData, fundingData] = await Promise.all([
        entrepreneurAPI.getDashboardMetrics(),
        ideasAPI.getUserIdeas(),
        fundingAPI.getUserFundingRequests(),
      ]);

      setDashboardData(metricsData);

      if (ideasData.success) {
        setUserIdeas(ideasData.data);
      }

      if (fundingData.success) {
        setFundingRequests(fundingData.data);
      }
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFundingRequest = () => {
    if (userIdeas.length === 0) {
      addNotification(
        "You need to submit an idea before requesting funding",
        "error"
      );
      return;
    }
    setShowFundingModal(true);
  };

  const handleFundingFormSubmit = async (e) => {
    e.preventDefault();

    if (
      !fundingFormData.ideaId ||
      !fundingFormData.amount ||
      !fundingFormData.equity
    ) {
      addNotification(
        "Please fill in all required fields (Idea, Amount, and Equity)",
        "error"
      );
      return;
    }

    // Validate equity is between 0 and 100
    const equityValue = parseFloat(fundingFormData.equity);
    if (isNaN(equityValue) || equityValue <= 0 || equityValue > 100) {
      addNotification("Equity must be between 0 and 100 percent", "error");
      return;
    }

    try {
      setSubmittingFunding(true);

      // Include targeting information
      const requestData = {
        ...fundingFormData,
        accessType: accessType,
        targetedInvestors: selectedInvestors,
      };

      const result = await fundingAPI.createFundingRequest(requestData);

      if (result.success) {
        const targetingMessage =
          selectedInvestors.length > 0
            ? ` and sent to ${selectedInvestors.length} selected investor(s)`
            : " and made visible to all investors";
        addNotification(
          "Funding request submitted successfully" + targetingMessage + "!",
          "success"
        );
        setShowFundingModal(false);
        resetFundingForm();
        await loadDashboardData();
      } else {
        throw new Error(result.message || "Failed to submit funding request");
      }
    } catch (err) {
      console.error("Error submitting funding request:", err);
      addNotification(
        err.message || "Failed to submit funding request",
        "error"
      );
    } finally {
      setSubmittingFunding(false);
    }
  };

  const resetFundingForm = () => {
    setFundingFormData({
      ideaId: "",
      amount: "",
      equity: "",
      message: "",
      businessPlan: "",
      financialProjections: "",
      useOfFunds: "",
      timeline: "",
      milestones: "",
      teamSize: "",
      currentRevenue: "",
      projectedRevenue: "",
      targetMarket: "",
      competitiveAdvantage: "",
      riskFactors: "",
      exitStrategy: "",
      previousFunding: "",
      revenueModel: "",
      customerTraction: "",
      intellectualProperty: "",
      keyTeamMembers: "",
      advisors: "",
      existingInvestors: "",
      contactPhone: "",
      contactEmail: "",
      companyWebsite: "",
      linkedinProfile: "",
      additionalDocuments: "",
    });
    setSelectedInvestors([]);
    setInterestedInvestors([]);
    setAccessType("public");
  };

  const handleWithdrawFundingRequest = async (requestId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this funding request? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      const result = await fundingAPI.withdrawFundingRequest(requestId);

      if (result.success) {
        addNotification("Funding request deleted successfully!", "success");
        await loadDashboardData();
      } else {
        throw new Error(result.message || "Failed to delete funding request");
      }
    } catch (err) {
      console.error("Error deleting funding request:", err);
      addNotification(
        err.message || "Failed to delete funding request",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditFundingRequest = (request) => {
    setSelectedFundingRequest(request);
    setShowEditModal(true);
  };

  const handleUpdateFundingRequest = async (requestId) => {
    try {
      // Refresh the specific funding request to get latest data
      const result = await fundingAPI.getFundingRequestById(requestId);

      if (result.success) {
        // Update the funding requests list
        setFundingRequests((prevRequests) =>
          prevRequests.map((req) =>
            req._id === requestId || req.id === requestId ? result.data : req
          )
        );

        // Update the selected request being viewed in the modal
        setSelectedFundingRequest(result.data);

        addNotification("Request updated successfully!", "success");
      } else {
        throw new Error(result.message || "Failed to refresh funding request");
      }
    } catch (err) {
      console.error("Error refreshing funding request:", err);
      addNotification(
        err.message || "Failed to refresh funding request",
        "error"
      );
      throw err;
    }
  };

  const handleFundingFormChange = (field, value) => {
    setFundingFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // If idea is changed, fetch interested investors
    if (field === "ideaId" && value) {
      fetchInterestedInvestorsForIdea(value);
    }
  };

  const fetchInterestedInvestorsForIdea = async (ideaId) => {
    try {
      const result = await fundingAPI.getInterestedInvestorsForIdea(ideaId);
      if (result.success) {
        setInterestedInvestors(result.data || []);
      }
    } catch (error) {
      console.error("Error fetching interested investors:", error);
      setInterestedInvestors([]);
    }
  };

  const handleInvestorSelectionChange = (investors) => {
    setSelectedInvestors(investors);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-400 bg-yellow-400/10";
      case "accepted":
        return "text-green-400 bg-green-400/10";
      case "declined":
        return "text-red-400 bg-red-400/10";
      case "negotiated":
        return "text-blue-400 bg-blue-400/10";
      case "withdrawn":
        return "text-gray-400 bg-gray-400/10";
      default:
        return "text-gray-400 bg-gray-400/10";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            Funding Overview
          </h2>
          <p className="text-white/60">
            Track your funding progress and investor relationships
          </p>
        </div>

        {/* Funding Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-400">
                <FaDollarSign className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-green-400">
                {formatCurrency(dashboardData.fundingReceived)}
              </span>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">
              Total Funding
            </h3>
            <p className="text-white/60 text-sm">Received from investors</p>
          </div>

          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-400">
                <FaFileAlt className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-blue-400">
                {fundingRequests.length}
              </span>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">
              Funding Requests
            </h3>
            <p className="text-white/60 text-sm">Total submitted requests</p>
          </div>

          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-400">
                <FaUsers className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-purple-400">
                {dashboardData.interestedInvestors}
              </span>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">
              Interested Investors
            </h3>
            <p className="text-white/60 text-sm">
              Showing interest in your ideas
            </p>
          </div>
        </div>

        {/* Create Funding Request Button */}
        <div className="mb-6">
          <button
            onClick={handleCreateFundingRequest}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black hover:bg-gray-200 rounded-lg transition-colors duration-200 font-medium"
          >
            <FaPlus className="w-4 h-4" />
            Request Funding
          </button>
        </div>

        {/* Funding Requests List */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white mb-4">
            Your Funding Requests
          </h3>

          {fundingRequests.length === 0 ? (
            <div className="text-center py-12 bg-gray-900 rounded-lg border border-gray-800">
              <FaDollarSign className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No Funding Requests Yet
              </h3>
              <p className="text-white/60 mb-4">
                Submit your first funding request to attract investors
              </p>
              <button
                onClick={handleCreateFundingRequest}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black hover:bg-gray-200 rounded-lg transition-colors duration-200 font-medium"
              >
                <FaPlus className="w-4 h-4" />
                Create First Request
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {fundingRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-gray-900 rounded-lg border border-gray-800 p-6 hover:border-gray-700 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-white font-semibold text-lg mb-2">
                        {request.ideaTitle}
                      </h4>
                      <p className="text-white/70 text-sm mb-3">
                        {request.description}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {request.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-white/60 text-xs mb-1">
                        Amount Requested
                      </p>
                      <p className="text-white font-semibold">
                        {formatCurrency(request.amount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-white/60 text-xs mb-1">Team Size</p>
                      <p className="text-white font-semibold">
                        {request.teamSize || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-white/60 text-xs mb-1">Submitted</p>
                      <p className="text-white font-semibold">
                        {formatDate(request.createdAt)}
                      </p>
                    </div>
                  </div>

                  {request.message && (
                    <div className="mb-4">
                      <p className="text-white/60 text-xs mb-1">Message</p>
                      <p className="text-white/80 text-sm">{request.message}</p>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-800">
                    {request.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleEditFundingRequest(request)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                        >
                          <FaEdit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleWithdrawFundingRequest(request._id)
                          }
                          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                        >
                          <FaTrash className="w-4 h-4" />
                          Delete
                        </button>
                      </>
                    )}
                    {request.status === "accepted" && (
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 rounded-lg text-sm font-medium">
                        <FaCheckCircle className="w-4 h-4" />
                        Accepted
                      </span>
                    )}
                    {request.status === "declined" && (
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 rounded-lg text-sm font-medium">
                        <FaTimesCircle className="w-4 h-4" />
                        Declined
                      </span>
                    )}
                    {request.status === "withdrawn" && (
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600/20 text-gray-400 rounded-lg text-sm font-medium">
                        <FaMinusCircle className="w-4 h-4" />
                        Withdrawn
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Funding Request Modal */}
      {showFundingModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white">
                Request Funding
              </h2>
              <button
                onClick={() => setShowFundingModal(false)}
                className="text-white/70 hover:text-white transition-colors hover:bg-white/10 rounded-lg p-2"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleFundingFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Select Idea *
                  </label>
                  <select
                    value={fundingFormData.ideaId}
                    onChange={(e) =>
                      handleFundingFormChange("ideaId", e.target.value)
                    }
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-white/40 focus:outline-none"
                    required
                  >
                    <option value="">Choose an idea...</option>
                    {userIdeas.map((idea) => (
                      <option key={idea.id} value={idea.id}>
                        {idea.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Funding Amount Requested *
                  </label>
                  <input
                    type="number"
                    value={fundingFormData.amount}
                    onChange={(e) =>
                      handleFundingFormChange("amount", e.target.value)
                    }
                    placeholder="Enter amount in USD"
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Equity Percentage Offered *
                </label>
                <input
                  type="number"
                  value={fundingFormData.equity}
                  onChange={(e) =>
                    handleFundingFormChange("equity", e.target.value)
                  }
                  placeholder="e.g., 10 for 10%"
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                  required
                />
                <p className="text-white/50 text-xs mt-1">
                  Percentage of your company equity offered to investors
                </p>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Message to Investors
                </label>
                <textarea
                  value={fundingFormData.message}
                  onChange={(e) =>
                    handleFundingFormChange("message", e.target.value)
                  }
                  placeholder="Tell investors why you need funding and what you plan to achieve..."
                  rows={4}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none resize-none"
                />
              </div>

              {/* Investor Targeting Section */}
              {fundingFormData.ideaId && (
                <div className="space-y-4 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold flex items-center gap-2">
                        <FaUserPlus className="text-blue-400" />
                        Target Specific Investors
                      </h3>
                      <p className="text-white/60 text-sm mt-1">
                        {interestedInvestors.length > 0
                          ? `${interestedInvestors.length} investor(s) have shown interest in this idea`
                          : "No investors have shown interest yet"}
                      </p>
                    </div>
                    {interestedInvestors.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowInvestorSelector(true)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                      >
                        <FaUsers className="w-4 h-4" />
                        Select Investors ({selectedInvestors.length})
                      </button>
                    )}
                  </div>

                  {/* Access Type Selector */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Request Visibility
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <label className="relative flex items-center p-3 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer hover:border-gray-600 transition-colors">
                        <input
                          type="radio"
                          name="accessType"
                          value="public"
                          checked={accessType === "public"}
                          onChange={(e) => setAccessType(e.target.value)}
                          className="mr-3"
                        />
                        <div>
                          <div className="text-white font-medium text-sm">
                            Public
                          </div>
                          <div className="text-white/60 text-xs">
                            Visible to all investors
                          </div>
                        </div>
                      </label>

                      <label
                        className={`relative flex items-center p-3 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer hover:border-gray-600 transition-colors ${
                          interestedInvestors.length === 0
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="accessType"
                          value="invited"
                          checked={accessType === "invited"}
                          onChange={(e) => setAccessType(e.target.value)}
                          disabled={interestedInvestors.length === 0}
                          className="mr-3"
                        />
                        <div>
                          <div className="text-white font-medium text-sm">
                            Invited Only
                          </div>
                          <div className="text-white/60 text-xs">
                            Only selected investors
                          </div>
                        </div>
                      </label>

                      <label
                        className={`relative flex items-center p-3 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer hover:border-gray-600 transition-colors ${
                          interestedInvestors.length === 0
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="accessType"
                          value="private"
                          checked={accessType === "private"}
                          onChange={(e) => setAccessType(e.target.value)}
                          disabled={interestedInvestors.length === 0}
                          className="mr-3"
                        />
                        <div>
                          <div className="text-white font-medium text-sm">
                            Private
                          </div>
                          <div className="text-white/60 text-xs">
                            Strictly selected only
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Selected Investors Display */}
                  {selectedInvestors.length > 0 && (
                    <div className="p-3 bg-blue-600/10 border border-blue-500/30 rounded-lg">
                      <p className="text-blue-400 text-sm font-medium mb-2">
                        ✓ {selectedInvestors.length} investor(s) selected
                      </p>
                      <p className="text-white/60 text-xs">
                        These investors will be notified and can view your
                        funding request.
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowFundingModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submittingFunding}
                  className="flex-1 px-4 py-3 bg-white text-black hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
                >
                  {submittingFunding ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle />
                      Submit Funding Request
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Funding Request Details Modal */}
      {showEditModal && selectedFundingRequest && (
        <FundingRequestDetailsModal
          isOpen={showEditModal}
          request={selectedFundingRequest}
          onUpdate={handleUpdateFundingRequest}
          onWithdraw={handleWithdrawFundingRequest}
          onClose={() => {
            setShowEditModal(false);
            setSelectedFundingRequest(null);
          }}
        />
      )}

      {/* Investor Selector Modal */}
      {showInvestorSelector && (
        <InvestorSelector
          ideaId={fundingFormData.ideaId}
          interestedInvestors={interestedInvestors}
          selectedInvestors={selectedInvestors}
          onSelectionChange={handleInvestorSelectionChange}
          onClose={() => setShowInvestorSelector(false)}
        />
      )}
    </div>
  );
};

export default FundingPage;
