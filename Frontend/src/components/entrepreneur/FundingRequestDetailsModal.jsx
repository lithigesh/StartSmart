import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaSpinner,
  FaCheck,
  FaExclamationTriangle,
  FaDollarSign,
  FaPercentage,
  FaEdit,
  FaSave,
  FaCalendarAlt,
  FaUsers,
  FaFileContract,
  FaChartLine,
  FaBullseye,
  FaLightbulb,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaLinkedin,
  FaFileAlt,
  FaExchangeAlt,
  FaEye,
  FaHistory,
  FaClock,
} from "react-icons/fa";
import { fundingAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

/**
 * FundingRequestDetailsModal Component
 * Displays comprehensive details of a funding request with edit functionality
 *
 * Props:
 * - isOpen: Boolean to control modal visibility
 * - onClose: Function to close the modal
 * - request: The funding request object to display
 * - onUpdate: Function called when request is updated
 * - onWithdraw: Function called when request is withdrawn
 */
const FundingRequestDetailsModal = ({
  isOpen,
  onClose,
  request,
  onUpdate,
  onWithdraw,
}) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // Form data state
  const [formData, setFormData] = useState({
    amount: "",
    equity: "",
    message: "",
    teamSize: "",
    businessPlan: "",
    currentRevenue: "",
    previousFunding: "",
    revenueModel: "",
    targetMarket: "",
    competitiveAdvantage: "",
    customerTraction: "",
    financialProjections: "",
    useOfFunds: "",
    timeline: "",
    milestones: "",
    riskFactors: "",
    exitStrategy: "",
    intellectualProperty: "",
    contactPhone: "",
    contactEmail: "",
    companyWebsite: "",
    linkedinProfile: "",
    additionalDocuments: "",
    fundingStage: "",
    investmentType: "",
  });

  // Initialize form data when request changes
  useEffect(() => {
    if (request) {
      setFormData({
        amount: request.amount?.toString() || "",
        equity: request.equity?.toString() || "",
        message: request.message || "",
        teamSize: request.teamSize?.toString() || "",
        businessPlan: request.businessPlan || "",
        currentRevenue: request.currentRevenue?.toString() || "",
        previousFunding: request.previousFunding?.toString() || "",
        revenueModel: request.revenueModel || "",
        targetMarket: request.targetMarket || "",
        competitiveAdvantage: request.competitiveAdvantage || "",
        customerTraction: request.customerTraction || "",
        financialProjections: request.financialProjections || "",
        useOfFunds: request.useOfFunds || "",
        timeline: request.timeline || "",
        milestones: request.milestones || "",
        riskFactors: request.riskFactors || "",
        exitStrategy: request.exitStrategy || "",
        intellectualProperty: request.intellectualProperty || "",
        contactPhone: request.contactPhone || "",
        contactEmail: request.contactEmail || "",
        companyWebsite: request.companyWebsite || "",
        linkedinProfile: request.linkedinProfile || "",
        additionalDocuments: request.additionalDocuments || "",
        fundingStage: request.fundingStage || "seed",
        investmentType: request.investmentType || "equity",
      });
      setIsEditing(false);
      setError("");
      setSuccess("");
    }
  }, [request]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setError("");
      setSuccess("");

      // Validate required fields
      if (!formData.amount || !formData.equity) {
        setError("Amount and equity are required fields.");
        return;
      }

      // Call the onUpdate function with the form data
      await onUpdate(request._id || request.id, formData);

      setSuccess("Funding request updated successfully!");
      setIsEditing(false);

      // Close modal after brief delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Error updating funding request:", err);
      setError("Failed to update funding request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    if (request) {
      setFormData({
        amount: request.amount?.toString() || "",
        equity: request.equity?.toString() || "",
        message: request.message || "",
        teamSize: request.teamSize?.toString() || "",
        businessPlan: request.businessPlan || "",
        currentRevenue: request.currentRevenue?.toString() || "",
        previousFunding: request.previousFunding?.toString() || "",
        revenueModel: request.revenueModel || "",
        targetMarket: request.targetMarket || "",
        competitiveAdvantage: request.competitiveAdvantage || "",
        customerTraction: request.customerTraction || "",
        financialProjections: request.financialProjections || "",
        useOfFunds: request.useOfFunds || "",
        timeline: request.timeline || "",
        milestones: request.milestones || "",
        riskFactors: request.riskFactors || "",
        exitStrategy: request.exitStrategy || "",
        intellectualProperty: request.intellectualProperty || "",
        contactPhone: request.contactPhone || "",
        contactEmail: request.contactEmail || "",
        companyWebsite: request.companyWebsite || "",
        linkedinProfile: request.linkedinProfile || "",
        additionalDocuments: request.additionalDocuments || "",
        fundingStage: request.fundingStage || "seed",
        investmentType: request.investmentType || "equity",
      });
    }
    setIsEditing(false);
    setError("");
    setSuccess("");

    // Auto-switch to negotiation tab if there are messages
    if (request.negotiationHistory && request.negotiationHistory.length > 0) {
      setActiveTab("negotiation");
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

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-white/70 bg-white/10 border-white/20";
      case "accepted":
        return "text-white/90 bg-white/10 border-white/20";
      case "negotiated":
        return "text-white/90 bg-white/10 border-white/20";
      case "declined":
        return "text-white/80 bg-white/10 border-white/20";
      case "withdrawn":
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const canEdit = ["pending", "negotiated"].includes(request?.status);

  // Don't render if modal is not open
  if (!isOpen || !request) return null;

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: <FaFileContract className="w-4 h-4" />,
    },
    {
      id: "business",
      label: "Business Details",
      icon: <FaBullseye className="w-4 h-4" />,
    },
    {
      id: "financial",
      label: "Financial",
      icon: <FaChartLine className="w-4 h-4" />,
    },
    {
      id: "team",
      label: "Team & Contact",
      icon: <FaUsers className="w-4 h-4" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl max-h-[90vh] mx-4 bg-black border border-white/20 rounded-2xl overflow-hidden z-[70] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Funding Request Details
              </h2>
              <p className="text-white/60 mt-1">
                {request.idea?.title || request.ideaTitle || "Unknown Idea"}
              </p>
            </div>
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm border font-manrope ${getStatusColor(
                request.status
              )}`}
            >
              {request.status?.charAt(0).toUpperCase() +
                request.status?.slice(1)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {canEdit && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-300 flex items-center gap-2 font-manrope"
              >
                <FaEdit className="w-4 h-4" />
                Edit
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mx-6 mt-4 p-4 bg-white/20 border border-white/30 rounded-lg flex items-center gap-3">
            <FaCheck className="w-5 h-5 text-white/90" />
            <p className="text-white/90">{success}</p>
          </div>
        )}

        {error && (
          <div className="mx-6 mt-4 p-4 bg-white/20 border border-white/30 rounded-lg flex items-center gap-3">
            <FaExclamationTriangle className="w-5 h-5 text-yellow-400" />
            <p className="text-white/80">{error}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-white/10 flex-shrink-0">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 whitespace-nowrap transition-all duration-200 relative ${
                  activeTab === tab.id
                    ? "border-b-2 border-white text-white"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {tab.icon}
                {tab.label}
                {/* Show badge for negotiation tab when there are messages */}
                {tab.id === "negotiation" &&
                  request.negotiationHistory &&
                  request.negotiationHistory.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-white/20 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                      {request.negotiationHistory.length}
                    </span>
                  )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          {/* Form tabs - Only for editable content */}
          <form onSubmit={handleSave}>
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Amount */}
                  <div>
                    <label className="block text-white font-medium mb-3">
                      Funding Amount <span className="text-white/80">*</span>
                    </label>
                    <div className="relative">
                      <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
                      {isEditing ? (
                        <input
                          type="number"
                          name="amount"
                          value={formData.amount}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors"
                          required
                        />
                      ) : (
                        <div className="pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white">
                          {formatCurrency(request.amount)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Equity */}
                  <div>
                    <label className="block text-white font-medium mb-3">
                      Equity Offered <span className="text-white/80">*</span>
                    </label>
                    <div className="relative">
                      <FaPercentage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
                      {isEditing ? (
                        <input
                          type="number"
                          name="equity"
                          value={formData.equity}
                          onChange={handleInputChange}
                          min="0"
                          max="100"
                          step="0.1"
                          className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors"
                          required
                        />
                      ) : (
                        <div className="pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white">
                          {request.equity}%
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Valuation */}
                {request.valuation && (
                  <div>
                    <label className="block text-white font-medium mb-3">
                      Company Valuation
                    </label>
                    <div className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white">
                      {formatCurrency(request.valuation)}
                    </div>
                  </div>
                )}

                {/* Message */}
                <div>
                  <label className="block text-white font-medium mb-3">
                    Message
                  </label>
                  {isEditing ? (
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors resize-none"
                      placeholder="Describe your funding needs and how you plan to use the investment..."
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white">
                      {request.message || "No message provided"}
                    </div>
                  )}
                </div>

                {/* Funding Stage and Investment Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-medium mb-3">
                      Funding Stage
                    </label>
                    {isEditing ? (
                      <select
                        name="fundingStage"
                        value={formData.fundingStage}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors"
                      >
                        <option value="seed">Seed</option>
                        <option value="series_a">Series A</option>
                        <option value="series_b">Series B</option>
                        <option value="series_c">Series C</option>
                        <option value="bridge">Bridge</option>
                        <option value="other">Other</option>
                      </select>
                    ) : (
                      <div className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white">
                        {request.fundingStage
                          ?.replace("_", " ")
                          ?.toUpperCase() || "SEED"}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-3">
                      Investment Type
                    </label>
                    {isEditing ? (
                      <select
                        name="investmentType"
                        value={formData.investmentType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors"
                      >
                        <option value="equity">Equity</option>
                        <option value="convertible_note">
                          Convertible Note
                        </option>
                        <option value="safe">SAFE</option>
                        <option value="revenue_share">Revenue Share</option>
                        <option value="other">Other</option>
                      </select>
                    ) : (
                      <div className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white">
                        {request.investmentType
                          ?.replace("_", " ")
                          ?.toUpperCase() || "EQUITY"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Business Details Tab */}
            {activeTab === "business" && (
              <div className="space-y-6">
                {/* Business Plan */}
                <div>
                  <label className="block text-white font-medium mb-3">
                    Business Plan
                  </label>
                  {isEditing ? (
                    <textarea
                      name="businessPlan"
                      value={formData.businessPlan}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors resize-none"
                      placeholder="Describe your business model, value proposition, and market strategy..."
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white">
                      {request.businessPlan || "No business plan provided"}
                    </div>
                  )}
                </div>

                {/* Target Market */}
                <div>
                  <label className="block text-white font-medium mb-3">
                    Target Market
                  </label>
                  {isEditing ? (
                    <textarea
                      name="targetMarket"
                      value={formData.targetMarket}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors resize-none"
                      placeholder="Describe your target market, size, and demographics..."
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white">
                      {request.targetMarket ||
                        "No target market description provided"}
                    </div>
                  )}
                </div>

                {/* Competitive Advantage */}
                <div>
                  <label className="block text-white font-medium mb-3">
                    Competitive Advantage
                  </label>
                  {isEditing ? (
                    <textarea
                      name="competitiveAdvantage"
                      value={formData.competitiveAdvantage}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors resize-none"
                      placeholder="What makes your solution unique and better than competitors..."
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white">
                      {request.competitiveAdvantage ||
                        "No competitive advantage description provided"}
                    </div>
                  )}
                </div>

                {/* Revenue Model */}
                <div>
                  <label className="block text-white font-medium mb-3">
                    Revenue Model
                  </label>
                  {isEditing ? (
                    <textarea
                      name="revenueModel"
                      value={formData.revenueModel}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors resize-none"
                      placeholder="How will your business generate revenue..."
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white">
                      {request.revenueModel ||
                        "No revenue model description provided"}
                    </div>
                  )}
                </div>

                {/* Customer Traction */}
                <div>
                  <label className="block text-white font-medium mb-3">
                    Customer Traction
                  </label>
                  {isEditing ? (
                    <textarea
                      name="customerTraction"
                      value={formData.customerTraction}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors resize-none"
                      placeholder="Current customer base, growth metrics, testimonials..."
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white">
                      {request.customerTraction ||
                        "No customer traction information provided"}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Financial Tab */}
            {activeTab === "financial" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Current Revenue */}
                  <div>
                    <label className="block text-white font-medium mb-3">
                      Current Revenue
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        name="currentRevenue"
                        value={formData.currentRevenue}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors"
                        placeholder="0"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white">
                        {request.currentRevenue
                          ? formatCurrency(request.currentRevenue)
                          : "No current revenue"}
                      </div>
                    )}
                  </div>

                  {/* Previous Funding */}
                  <div>
                    <label className="block text-white font-medium mb-3">
                      Previous Funding
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        name="previousFunding"
                        value={formData.previousFunding}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors"
                        placeholder="0"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white">
                        {request.previousFunding
                          ? formatCurrency(request.previousFunding)
                          : "No previous funding"}
                      </div>
                    )}
                  </div>
                </div>

                {/* Financial Projections */}
                <div>
                  <label className="block text-white font-medium mb-3">
                    Financial Projections
                  </label>
                  {isEditing ? (
                    <textarea
                      name="financialProjections"
                      value={formData.financialProjections}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors resize-none"
                      placeholder="3-5 year financial projections including revenue, expenses, and profitability..."
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white">
                      {request.financialProjections ||
                        "No financial projections provided"}
                    </div>
                  )}
                </div>

                {/* Use of Funds */}
                <div>
                  <label className="block text-white font-medium mb-3">
                    Use of Funds
                  </label>
                  {isEditing ? (
                    <textarea
                      name="useOfFunds"
                      value={formData.useOfFunds}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors resize-none"
                      placeholder="How will you use the investment funds..."
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white">
                      {request.useOfFunds ||
                        "No use of funds description provided"}
                    </div>
                  )}
                </div>

                {/* Risk Factors and Exit Strategy */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-medium mb-3">
                      Risk Factors
                    </label>
                    {isEditing ? (
                      <textarea
                        name="riskFactors"
                        value={formData.riskFactors}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors resize-none"
                        placeholder="Key risks and mitigation strategies..."
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white">
                        {request.riskFactors || "No risk factors provided"}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-3">
                      Exit Strategy
                    </label>
                    {isEditing ? (
                      <textarea
                        name="exitStrategy"
                        value={formData.exitStrategy}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors resize-none"
                        placeholder="IPO, acquisition, or other exit plans..."
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white">
                        {request.exitStrategy || "No exit strategy provided"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Team & Contact Tab */}
            {activeTab === "team" && (
              <div className="space-y-6">
                {/* Team Size */}
                <div>
                  <label className="block text-white font-medium mb-3">
                    Team Size
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="teamSize"
                      value={formData.teamSize}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors"
                      placeholder="Number of team members"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white">
                      {request.teamSize
                        ? `${request.teamSize} members`
                        : "Team size not specified"}
                    </div>
                  )}
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-medium mb-3">
                      <FaPhone className="inline w-4 h-4 mr-2" />
                      Contact Phone
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors"
                        placeholder="Phone number"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white">
                        {request.contactPhone || "No phone number provided"}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-3">
                      <FaEnvelope className="inline w-4 h-4 mr-2" />
                      Contact Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors"
                        placeholder="Email address"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white">
                        {request.contactEmail || "No email provided"}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-medium mb-3">
                      <FaGlobe className="inline w-4 h-4 mr-2" />
                      Company Website
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        name="companyWebsite"
                        value={formData.companyWebsite}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors"
                        placeholder="https://example.com"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white">
                        {request.companyWebsite ? (
                          <a
                            href={request.companyWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/90 hover:underline"
                          >
                            {request.companyWebsite}
                          </a>
                        ) : (
                          "No website provided"
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-3">
                      <FaLinkedin className="inline w-4 h-4 mr-2" />
                      LinkedIn Profile
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        name="linkedinProfile"
                        value={formData.linkedinProfile}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors"
                        placeholder="https://linkedin.com/in/profile"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white">
                        {request.linkedinProfile ? (
                          <a
                            href={request.linkedinProfile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/90 hover:underline"
                          >
                            LinkedIn Profile
                          </a>
                        ) : (
                          "No LinkedIn profile provided"
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Timeline and Milestones */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-medium mb-3">
                      Timeline
                    </label>
                    {isEditing ? (
                      <textarea
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors resize-none"
                        placeholder="Project timeline and key dates..."
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white">
                        {request.timeline || "No timeline provided"}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-3">
                      Milestones
                    </label>
                    {isEditing ? (
                      <textarea
                        name="milestones"
                        value={formData.milestones}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors resize-none"
                        placeholder="Key milestones and achievements..."
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white">
                        {request.milestones || "No milestones provided"}
                      </div>
                    )}
                  </div>
                </div>

                {/* Intellectual Property */}
                <div>
                  <label className="block text-white font-medium mb-3">
                    Intellectual Property
                  </label>
                  {isEditing ? (
                    <textarea
                      name="intellectualProperty"
                      value={formData.intellectualProperty}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors resize-none"
                      placeholder="Patents, trademarks, copyrights, trade secrets..."
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white">
                      {request.intellectualProperty ||
                        "No intellectual property information provided"}
                    </div>
                  )}
                </div>

                {/* Additional Documents */}
                <div>
                  <label className="block text-white font-medium mb-3">
                    Additional Documents
                  </label>
                  {isEditing ? (
                    <textarea
                      name="additionalDocuments"
                      value={formData.additionalDocuments}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors resize-none"
                      placeholder="Links to additional documents, presentations, demos..."
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white">
                      {request.additionalDocuments ||
                        "No additional documents provided"}
                    </div>
                  )}
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer - Show edit controls when editing */}
        {isEditing && (
          <div className="flex items-center justify-between p-6 border-t border-white/10 bg-black">
            <button
              onClick={handleCancel}
              className="px-6 py-3 text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/10"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={isSubmitting}
              className="px-8 py-3 bg-white text-black hover:bg-white/90 font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <FaSave className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FundingRequestDetailsModal;
