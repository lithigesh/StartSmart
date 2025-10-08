import React, { useState, useEffect, useRef } from "react";
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
  FaComments,
  FaHistory,
  FaPaperPlane,
  FaClock,
} from "react-icons/fa";
import { fundingAPI } from "../../services/api";

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
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // Negotiation chat states
  const [negotiationMessage, setNegotiationMessage] = useState("");
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [proposalAmount, setProposalAmount] = useState("");
  const [proposalEquity, setProposalEquity] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef(null);

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

  // Scroll to bottom of negotiation messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [request?.negotiationHistory]);

  // Handler for sending negotiation messages
  const handleSendNegotiation = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!negotiationMessage.trim() && !proposalAmount && !proposalEquity) {
      return;
    }

    try {
      setSendingMessage(true);
      setError("");

      const response = await fundingAPI.entrepreneurRespondToNegotiation(
        request._id || request.id,
        {
          message: negotiationMessage,
          proposedAmount: proposalAmount
            ? parseFloat(proposalAmount)
            : undefined,
          proposedEquity: proposalEquity
            ? parseFloat(proposalEquity)
            : undefined,
        }
      );

      if (response.success) {
        // Clear input and proposal fields
        setNegotiationMessage("");
        setProposalAmount("");
        setProposalEquity("");
        setShowProposalForm(false);

        // Call onUpdate to refresh the request data
        if (onUpdate) {
          await onUpdate(request._id || request.id);
        }
      } else {
        setError(response.message || "Failed to send message");
      }
    } catch (err) {
      console.error("Error sending negotiation:", err);
      setError("Failed to send message. Please try again.");
    } finally {
      setSendingMessage(false);
    }
  };

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
    {
      id: "negotiation",
      label: "Negotiation",
      icon: <FaComments className="w-4 h-4" />,
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
      <div className="relative w-full max-w-5xl max-h-[90vh] mx-4 bg-black border border-white/20 rounded-2xl overflow-hidden z-[70]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
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
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 flex items-center gap-2 font-manrope"
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
          <div className="mx-6 mt-4 p-4 bg-green-900/20 border border-green-500/30 rounded-lg flex items-center gap-3">
            <FaCheck className="w-5 h-5 text-green-400" />
            <p className="text-green-400">{success}</p>
          </div>
        )}

        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg flex items-center gap-3">
            <FaExclamationTriangle className="w-5 h-5 text-red-400" />
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-white/10">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.id
                    ? "border-b-2 border-white text-white"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[50vh] overflow-y-auto">
          <form onSubmit={handleSave}>
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Amount */}
                  <div>
                    <label className="block text-white font-medium mb-3">
                      Funding Amount <span className="text-red-400">*</span>
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
                      Equity Offered <span className="text-red-400">*</span>
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
                            className="text-blue-400 hover:underline"
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
                            className="text-blue-400 hover:underline"
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

            {/* Negotiation Tab */}
            {activeTab === "negotiation" && (
              <div className="space-y-6">
                {/* Negotiation Status Banner */}
                {request.status === "negotiated" && (
                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FaComments className="w-5 h-5 text-blue-400" />
                      <span className="text-blue-400 font-semibold">
                        Active Negotiation
                      </span>
                    </div>
                    <p className="text-white/80 text-sm">
                      You have ongoing negotiations with interested investors.
                      Respond to their proposals below.
                    </p>
                  </div>
                )}

                {/* Request Status Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FaCalendarAlt className="w-4 h-4 text-blue-400" />
                      <span className="text-white font-medium">Created</span>
                    </div>
                    <p className="text-white/80">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FaEye className="w-4 h-4 text-green-400" />
                      <span className="text-white font-medium">Views</span>
                    </div>
                    <p className="text-white/80">
                      {request.viewedBy?.length || 0} investors
                    </p>
                  </div>

                  <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FaHistory className="w-4 h-4 text-purple-400" />
                      <span className="text-white font-medium">
                        Last Updated
                      </span>
                    </div>
                    <p className="text-white/80">
                      {new Date(
                        request.updatedAt || request.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Negotiation Chat Interface */}
                <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
                  {/* Chat Header */}
                  <div className="bg-gray-800 border-b border-gray-700 p-4">
                    <h3 className="text-white font-semibold flex items-center gap-2">
                      <FaComments className="w-5 h-5" />
                      Negotiation Messages
                    </h3>
                    <p className="text-white/60 text-sm mt-1">
                      Communicate with investors and send counter-proposals
                    </p>
                  </div>

                  {/* Messages Container */}
                  <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                    {request.negotiationHistory &&
                    request.negotiationHistory.length > 0 ? (
                      <>
                        {request.negotiationHistory.map((entry, index) => {
                          const isEntrepreneur = !entry.investor;
                          return (
                            <div
                              key={index}
                              className={`flex ${
                                isEntrepreneur ? "justify-end" : "justify-start"
                              }`}
                            >
                              <div
                                className={`max-w-[70%] rounded-lg p-4 ${
                                  isEntrepreneur
                                    ? "bg-blue-600/20 border border-blue-500/30"
                                    : "bg-gray-800 border border-gray-700"
                                }`}
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <FaUser
                                      className={`w-4 h-4 ${
                                        isEntrepreneur
                                          ? "text-blue-400"
                                          : "text-green-400"
                                      }`}
                                    />
                                    <span className="text-white font-medium text-sm">
                                      {isEntrepreneur
                                        ? "You"
                                        : entry.investor?.name || "Investor"}
                                    </span>
                                  </div>
                                  <span className="text-white/40 text-xs">
                                    {new Date(
                                      entry.timestamp
                                    ).toLocaleDateString()}{" "}
                                    {new Date(
                                      entry.timestamp
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>
                                <p className="text-white/90 whitespace-pre-wrap text-sm">
                                  {entry.message}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <FaComments className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-white/60">
                          No negotiation messages yet
                        </p>
                        <p className="text-white/40 text-sm mt-1">
                          Investor responses will appear here
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Message Input Area */}
                  {(request.status === "pending" ||
                    request.status === "negotiated") && (
                    <div className="border-t border-gray-700 p-4 bg-gray-800/50">
                      {/* Proposal Form Toggle */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowProposalForm(!showProposalForm);
                        }}
                        className="mb-3 text-blue-400 hover:text-blue-300 text-sm flex items-center gap-2 transition-colors"
                      >
                        <FaDollarSign className="w-4 h-4" />
                        {showProposalForm
                          ? "Hide Counter-Proposal"
                          : "Send Counter-Proposal"}
                      </button>

                      {/* Counter Proposal Form */}
                      {showProposalForm && (
                        <div className="mb-4 p-4 bg-gray-900 border border-gray-700 rounded-lg space-y-3">
                          <h4 className="text-white font-medium text-sm mb-3">
                            Counter-Proposal Terms
                          </h4>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-white/60 text-xs mb-1">
                                Proposed Amount ($)
                              </label>
                              <input
                                type="number"
                                value={proposalAmount}
                                onChange={(e) =>
                                  setProposalAmount(e.target.value)
                                }
                                placeholder="500000"
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-white/60 text-xs mb-1">
                                Proposed Equity (%)
                              </label>
                              <input
                                type="number"
                                value={proposalEquity}
                                onChange={(e) =>
                                  setProposalEquity(e.target.value)
                                }
                                placeholder="10"
                                min="0"
                                max="100"
                                step="0.1"
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                              />
                            </div>
                          </div>
                          {proposalAmount && proposalEquity && (
                            <div className="text-white/60 text-xs mt-2 p-2 bg-gray-800 rounded">
                              <span className="font-medium">
                                Implied Valuation:
                              </span>{" "}
                              $
                              {Math.round(
                                (proposalAmount / proposalEquity) * 100
                              ).toLocaleString()}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Message Input */}
                      <form onSubmit={handleSendNegotiation}>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={negotiationMessage}
                            onChange={(e) =>
                              setNegotiationMessage(e.target.value)
                            }
                            placeholder="Type your message or counter-proposal..."
                            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 placeholder-gray-500"
                          />
                          <button
                            type="submit"
                            disabled={
                              sendingMessage ||
                              (!negotiationMessage.trim() &&
                                !proposalAmount &&
                                !proposalEquity)
                            }
                            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            {sendingMessage ? (
                              <>
                                <FaSpinner className="w-4 h-4 animate-spin" />
                                <span className="text-sm">Sending...</span>
                              </>
                            ) : (
                              <>
                                <FaPaperPlane className="w-4 h-4" />
                                <span className="text-sm">Send</span>
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>

                {/* Response Deadline */}
                {request.responseDeadline && (
                  <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FaClock className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 font-medium">
                        Response Deadline
                      </span>
                    </div>
                    <p className="text-white/80">
                      {new Date(request.responseDeadline).toLocaleDateString()}
                    </p>
                  </div>
                )}
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
