// pages/entrepreneur/FundingPage.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../hooks/useNotifications";
import { entrepreneurAPI, fundingAPI, ideasAPI } from "../../services/api";
import FundingRequestDetailsModal from "../../components/entrepreneur/FundingRequestDetailsModal";
import FundingRequestForm from "../../components/entrepreneur/FundingRequestForm";
import InvestorSelector from "../../components/entrepreneur/InvestorSelector";
import ContactModal from "../../components/entrepreneur/ContactModal";
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
  FaEye,
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
  const [showContactModal, setShowContactModal] = useState(false);
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
    targetMarket: "",
    competitiveAdvantage: "",
    riskFactors: "",
    exitStrategy: "",
    previousFunding: "",
    revenueModel: "",
    customerTraction: "",
    intellectualProperty: "",
    contactPhone: "",
    contactEmail: "",
    companyWebsite: "",
    linkedinProfile: "",
    additionalDocuments: "",
    fundingStage: "seed",
    investmentType: "equity",
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
    console.log("Create Funding Request clicked");
    console.log("User Ideas:", userIdeas);
    if (userIdeas.length === 0) {
      console.log("No ideas found, showing notification");
      addNotification(
        "You need to submit an idea before requesting funding",
        "error"
      );
      return;
    }
    console.log("Opening funding modal");
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
      targetMarket: "",
      competitiveAdvantage: "",
      riskFactors: "",
      exitStrategy: "",
      previousFunding: "",
      revenueModel: "",
      customerTraction: "",
      intellectualProperty: "",
      contactPhone: "",
      contactEmail: "",
      companyWebsite: "",
      linkedinProfile: "",
      additionalDocuments: "",
      fundingStage: "seed",
      investmentType: "equity",
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

  const handleViewFundingRequest = (request) => {
    setSelectedFundingRequest(request);
    setShowEditModal(true);
  };

  const handleShowContact = (request) => {
    setSelectedFundingRequest(request);
    setShowContactModal(true);
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
        return "text-white/70 bg-white/10";
      case "accepted":
        return "text-white/90 bg-white/10";
      case "declined":
        return "text-white/80 bg-white/10";
      case "negotiated":
        return "text-white/90 bg-white/10";
      case "withdrawn":
        return "text-white/60 bg-white/10";
      default:
        return "text-white/60 bg-white/10";
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="mb-6">
          <h2 className="text-2xl font-manrope font-bold text-white mb-2">
            Funding Overview
          </h2>
          <p className="text-white/60 font-manrope">
            Track your funding progress and investor relationships
          </p>
        </div>
        <div className="flex items-center justify-center py-20">
          <FaSpinner className="w-12 h-12 text-white/40 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in" key="funding-page">
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-manrope font-bold text-white mb-2">
            Funding Overview
          </h2>
          <p className="text-white/60 font-manrope">
            Track your funding progress and investor relationships
          </p>
        </div>

        {/* Funding Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div
            key="stat-total-funding"
            className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden animate-slide-up"
            style={{ animationDelay: "0ms" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="text-white/70">
                  <FaDollarSign className="w-6 h-6" />
                </div>
                <span className="text-2xl font-bold text-white/90 font-manrope">
                  {formatCurrency(dashboardData.fundingReceived)}
                </span>
              </div>
              <h3 className="text-white font-manrope font-semibold text-lg mb-2">
                Total Funding
              </h3>
              <p className="text-white/60 text-sm font-manrope">
                Received from investors
              </p>
            </div>
          </div>

          <div
            key="stat-funding-requests"
            className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden animate-slide-up"
            style={{ animationDelay: "100ms" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="text-white/70">
                  <FaFileAlt className="w-6 h-6" />
                </div>
                <span className="text-2xl font-bold text-white/90 font-manrope">
                  {fundingRequests.length}
                </span>
              </div>
              <h3 className="text-white font-manrope font-semibold text-lg mb-2">
                Funding Requests
              </h3>
              <p className="text-white/60 text-sm font-manrope">
                Total submitted requests
              </p>
            </div>
          </div>
        </div>

        {/* Create Funding Request Button */}
        <div className="mb-6">
          <button
            onClick={handleCreateFundingRequest}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black hover:bg-white/90 rounded-lg transition-colors duration-200 font-medium"
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
            <div className="text-center py-12 bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>
              <div className="relative z-10">
                <FaDollarSign className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No Funding Requests Yet
                </h3>
                <p className="text-white/60 mb-4">
                  Submit your first funding request to attract investors
                </p>
                <button
                  onClick={handleCreateFundingRequest}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black hover:bg-white/90 rounded-lg transition-colors duration-200 font-medium"
                >
                  <FaPlus className="w-4 h-4" />
                  Create First Request
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {fundingRequests.map((request) => (
                <div
                  key={request._id}
                  onClick={() => handleViewFundingRequest(request)}
                  className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 relative overflow-hidden group cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-white font-semibold text-lg mb-2">
                          {request.idea?.title ||
                            request.ideaTitle ||
                            "Untitled"}
                        </h4>
                        <p className="text-white/70 text-sm mb-3">
                          {request.idea?.description ||
                            request.description ||
                            "No description available"}
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-white/60 text-xs mb-1">
                          Amount Requested
                        </p>
                        <p className="text-white font-semibold">
                          {formatCurrency(request.amount)}
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
                        <p className="text-white/80 text-sm">
                          {request.message}
                        </p>
                      </div>
                    )}

                    {/* Investor Details - Show when accepted */}
                    {request.status === "accepted" && (
                      <div className="mb-4 p-4 bg-white/10/10 border border-white/30 rounded-lg">
                        <h5 className="text-white/90 font-semibold mb-3 flex items-center gap-2">
                          <FaCheckCircle className="w-4 h-4" />
                          Funding Accepted
                        </h5>
                        {request.acceptedBy ||
                        (request.investorResponses &&
                          request.investorResponses.find(
                            (r) => r.status === "accepted"
                          )) ? (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <p className="text-white/60 text-xs mb-1">
                                  Investor Name
                                </p>
                                <p className="text-white font-medium">
                                  {request.acceptedBy?.name ||
                                    request.investorResponses?.find(
                                      (r) => r.status === "accepted"
                                    )?.investor?.name ||
                                    "Contact Support"}
                                </p>
                              </div>
                              <div>
                                <p className="text-white/60 text-xs mb-1">
                                  Contact Email
                                </p>
                                <p className="text-white font-medium flex items-center gap-2">
                                  <FaEnvelope className="w-3 h-3 text-white/90" />
                                  {request.acceptedBy?.email ||
                                  request.investorResponses?.find(
                                    (r) => r.status === "accepted"
                                  )?.investor?.email ? (
                                    <a
                                      href={`mailto:${
                                        request.acceptedBy?.email ||
                                        request.investorResponses?.find(
                                          (r) => r.status === "accepted"
                                        )?.investor?.email
                                      }`}
                                      className="hover:text-white/90 transition-colors break-all"
                                    >
                                      {request.acceptedBy?.email ||
                                        request.investorResponses?.find(
                                          (r) => r.status === "accepted"
                                        )?.investor?.email}
                                    </a>
                                  ) : (
                                    <span className="text-white/60">
                                      Contact Support
                                    </span>
                                  )}
                                </p>
                              </div>
                              <div>
                                <p className="text-white/60 text-xs mb-1">
                                  Amount
                                </p>
                                <p className="text-white font-medium">
                                  {formatCurrency(
                                    request.acceptanceTerms?.finalAmount ||
                                      request.amount
                                  )}
                                </p>
                              </div>
                              <div>
                                <p className="text-white/60 text-xs mb-1">
                                  Equity
                                </p>
                                <p className="text-white font-medium">
                                  {request.acceptanceTerms?.finalEquity ||
                                    request.equity}
                                  %
                                </p>
                              </div>
                              {request.acceptedAt && (
                                <div>
                                  <p className="text-white/60 text-xs mb-1">
                                    Accepted On
                                  </p>
                                  <p className="text-white font-medium">
                                    {formatDate(request.acceptedAt)}
                                  </p>
                                </div>
                              )}
                            </div>
                            {request.acceptanceTerms?.conditions && (
                              <div className="mt-3 pt-3 border-t border-white/20">
                                <p className="text-white/60 text-xs mb-1">
                                  Terms & Conditions
                                </p>
                                <p className="text-white/80 text-sm">
                                  {request.acceptanceTerms.conditions}
                                </p>
                              </div>
                            )}
                          </>
                        ) : (
                          <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                              <div>
                                <p className="text-white/60 text-xs mb-1">
                                  Amount
                                </p>
                                <p className="text-white font-medium">
                                  {formatCurrency(
                                    request.acceptanceTerms?.finalAmount ||
                                      request.amount
                                  )}
                                </p>
                              </div>
                              <div>
                                <p className="text-white/60 text-xs mb-1">
                                  Equity
                                </p>
                                <p className="text-white font-medium">
                                  {request.acceptanceTerms?.finalEquity ||
                                    request.equity}
                                  %
                                </p>
                              </div>
                            </div>
                            <div className="text-white/80 text-sm bg-white/5 p-3 rounded-lg">
                              <p className="mb-1">
                                ✅ Your funding request has been accepted!
                              </p>
                              <p className="text-white/60 text-xs">
                                Investor contact details will be available soon.
                                Please check your email or contact support for
                                assistance.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewFundingRequest(request);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                      >
                        <FaEye className="w-4 h-4" />
                        Show Details
                      </button>

                      {(request.status === "pending" ||
                        request.status === "negotiated" ||
                        request.status === "accepted") && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShowContact(request);
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                        >
                          <FaEnvelope className="w-4 h-4" />
                          Contact
                        </button>
                      )}

                      {request.status === "pending" && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditFundingRequest(request);
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                          >
                            <FaEdit className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleWithdrawFundingRequest(request._id);
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                          >
                            <FaTrash className="w-4 h-4 text-red-400" />
                            Delete
                          </button>
                        </>
                      )}
                      {request.status === "accepted" && (
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10/20 text-white/90 rounded-lg text-sm font-medium">
                          <FaCheckCircle className="w-4 h-4" />
                          Accepted
                        </span>
                      )}
                      {request.status === "declined" && (
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 text-white/80 rounded-lg text-sm font-medium">
                          <FaTimesCircle className="w-4 h-4" />
                          Declined
                        </span>
                      )}
                      {request.status === "withdrawn" && (
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.05] text-white/50 rounded-lg text-sm font-medium border border-white/10">
                          <FaMinusCircle className="w-4 h-4" />
                          Withdrawn
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Funding Request Form Modal */}
      {showFundingModal && (
        <FundingRequestForm
          isOpen={showFundingModal}
          onClose={() => setShowFundingModal(false)}
          onSuccess={() => {
            setShowFundingModal(false);
            loadDashboardData();
            addNotification(
              "Funding request submitted successfully!",
              "success"
            );
          }}
        />
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
      <ContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        fundingRequest={selectedFundingRequest}
        user={user}
      />
    </div>
  );
};

export default FundingPage;
