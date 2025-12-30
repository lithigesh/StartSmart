import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaSpinner,
  FaCheck,
  FaExclamationTriangle,
  FaLightbulb,
  FaDollarSign,
  FaPercentage,
  FaPlus,
  FaFileContract,
  FaBullseye,
  FaChartLine,
  FaUsers,
  FaArrowRight,
  FaArrowLeft,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaLinkedin,
} from "react-icons/fa";
import { ideasAPI, fundingAPI } from "../../services/api";

/**
 * FundingRequestForm Component - Multi-step Wizard
 * 4 Steps: Overview, Business Details, Financial, Team & Contact
 */
const FundingRequestForm = ({ isOpen, onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState({
    selectedIdeaId: "",
    amount: "",
    equity: "",
    message: "",
    fundingStage: "seed",
    investmentType: "equity",
    businessPlan: "",
    targetMarket: "",
    revenueModel: "",
    competitiveAdvantage: "",
    customerTraction: "",
    financialProjections: "",
    useOfFunds: "",
    timeline: "",
    milestones: "",
    riskFactors: "",
    exitStrategy: "",
    currentRevenue: "",
    previousFunding: "",
    teamSize: "",
    contactPhone: "",
    contactEmail: "",
    companyWebsite: "",
    linkedinProfile: "",
    intellectualProperty: "",
    additionalDocuments: "",
  });

  const [userIdeas, setUserIdeas] = useState([]);
  const [isLoadingIdeas, setIsLoadingIdeas] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const steps = [
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

  const fetchUserIdeas = async () => {
    try {
      setIsLoadingIdeas(true);
      setError("");
      const response = await ideasAPI.getUserIdeas();
      if (response && response.data && Array.isArray(response.data)) {
        setUserIdeas(response.data);
      } else {
        setUserIdeas([]);
      }
    } catch (err) {
      console.error("Error fetching user ideas:", err);
      setUserIdeas([]);
    } finally {
      setIsLoadingIdeas(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUserIdeas();
      setCurrentStep(0);
      setFormData({
        selectedIdeaId: "",
        amount: "",
        equity: "",
        message: "",
        fundingStage: "seed",
        investmentType: "equity",
        businessPlan: "",
        targetMarket: "",
        revenueModel: "",
        competitiveAdvantage: "",
        customerTraction: "",
        financialProjections: "",
        useOfFunds: "",
        timeline: "",
        milestones: "",
        riskFactors: "",
        exitStrategy: "",
        currentRevenue: "",
        previousFunding: "",
        teamSize: "",
        contactPhone: "",
        contactEmail: "",
        companyWebsite: "",
        linkedinProfile: "",
        intellectualProperty: "",
        additionalDocuments: "",
      });
      setError("");
      setSuccess("");
      setValidationErrors({});
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateCurrentStep = () => {
    const errors = {};

    if (currentStep === 0) {
      // Overview - Required fields
      if (!formData.selectedIdeaId)
        errors.selectedIdeaId = "Please select an idea";
      if (!formData.amount) {
        errors.amount = "Amount is required";
      } else if (parseFloat(formData.amount) <= 0) {
        errors.amount = "Amount must be positive";
      }
      if (!formData.equity) {
        errors.equity = "Equity is required";
      } else {
        const eq = parseFloat(formData.equity);
        if (eq <= 0 || eq > 100) {
          errors.equity = "Equity must be between 0 and 100";
        }
      }
      if (!formData.message) errors.message = "Please provide a brief message";
    } else if (currentStep === 1) {
      // Business Details - All required
      if (!formData.businessPlan)
        errors.businessPlan = "Business plan is required";
      if (!formData.targetMarket)
        errors.targetMarket = "Target market is required";
      if (!formData.revenueModel)
        errors.revenueModel = "Revenue model is required";
      if (!formData.competitiveAdvantage)
        errors.competitiveAdvantage = "Competitive advantage is required";
      if (!formData.customerTraction)
        errors.customerTraction = "Customer traction is required";
    } else if (currentStep === 2) {
      // Financial - All required
      if (!formData.financialProjections)
        errors.financialProjections = "Financial projections are required";
      if (!formData.useOfFunds) errors.useOfFunds = "Use of funds is required";
      if (!formData.timeline) errors.timeline = "Timeline is required";
      if (!formData.milestones) errors.milestones = "Milestones are required";
      if (!formData.riskFactors)
        errors.riskFactors = "Risk factors are required";
      if (!formData.exitStrategy)
        errors.exitStrategy = "Exit strategy is required";
      if (!formData.currentRevenue && formData.currentRevenue !== "0")
        errors.currentRevenue = "Current revenue is required";
      if (!formData.previousFunding && formData.previousFunding !== "0")
        errors.previousFunding =
          "Previous funding is required (enter 0 if none)";
    } else if (currentStep === 3) {
      // Team & Contact - All required
      if (!formData.teamSize) errors.teamSize = "Team size is required";
      if (!formData.contactPhone)
        errors.contactPhone = "Contact phone is required";
      if (!formData.contactEmail) {
        errors.contactEmail = "Contact email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
        errors.contactEmail = "Please enter a valid email";
      }
      if (!formData.companyWebsite)
        errors.companyWebsite = "Company website is required";
      if (!formData.linkedinProfile)
        errors.linkedinProfile = "LinkedIn profile is required";
      if (!formData.intellectualProperty)
        errors.intellectualProperty =
          "Intellectual property information is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
      setError("");
    } else {
      setError("Please fill in all required fields before proceeding");
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    setError("");
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      setSuccess("");

      const requestData = {
        ideaId: formData.selectedIdeaId,
        amount: parseFloat(formData.amount),
        equity: parseFloat(formData.equity),
        message: formData.message,
        fundingStage: formData.fundingStage,
        investmentType: formData.investmentType,
        businessPlan: formData.businessPlan,
        targetMarket: formData.targetMarket,
        revenueModel: formData.revenueModel,
        competitiveAdvantage: formData.competitiveAdvantage,
        customerTraction: formData.customerTraction,
        financialProjections: formData.financialProjections,
        useOfFunds: formData.useOfFunds,
        timeline: formData.timeline,
        milestones: formData.milestones,
        riskFactors: formData.riskFactors,
        exitStrategy: formData.exitStrategy,
        currentRevenue: parseFloat(formData.currentRevenue) || 0,
        previousFunding: parseFloat(formData.previousFunding) || 0,
        teamSize: parseInt(formData.teamSize),
        contactPhone: formData.contactPhone,
        contactEmail: formData.contactEmail,
        companyWebsite: formData.companyWebsite,
        linkedinProfile: formData.linkedinProfile,
        intellectualProperty: formData.intellectualProperty,
        additionalDocuments: formData.additionalDocuments || "",
      };

      const response = await fundingAPI.createFundingRequest(requestData);

      if (response && response.success) {
        setSuccess("Funding request submitted successfully!");
        if (onSuccess) {
          setTimeout(() => onSuccess(), 1000);
        }
        setTimeout(() => onClose(), 2000);
      } else {
        setError(response?.message || "Failed to submit funding request");
      }
    } catch (err) {
      console.error("Error submitting funding request:", err);
      setError("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return "";
    const num = parseFloat(amount);
    if (isNaN(num)) return "";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const handleCreateIdea = () => {
    onClose();
    window.dispatchEvent(new CustomEvent("navigateToIdeas"));
  };

  if (!isOpen) return null;

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-black/95 backdrop-blur-xl border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                  <span className="text-5xl">💰</span>
                  Create Funding Request
                </h1>
                <p className="mt-2 text-gray-300 text-lg">
                  Step {currentStep + 1} of {steps.length}:{" "}
                  {steps[currentStep].label}
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-3 text-gray-300 hover:text-white focus:outline-none transition-all hover:scale-105 flex items-center gap-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10"
              >
                ← Back
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
          {/* Messages */}
          {success && (
            <div className="mx-6 mt-6 p-4 bg-white/20 border border-white/30 rounded-lg flex items-center gap-3">
              <FaCheck className="w-5 h-5 text-white/90" />
              <p className="text-white/90">{success}</p>
            </div>
          )}

          {error && (
            <div className="mx-6 mt-6 p-4 bg-white/20 border border-white/30 rounded-lg flex items-center gap-3">
              <FaExclamationTriangle className="w-5 h-5 text-yellow-400" />
              <p className="text-white/80">{error}</p>
            </div>
          )}

          {/* Step Indicators */}
          <div className="border-b border-white/10">
            <div className="flex overflow-x-auto">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => index < currentStep && setCurrentStep(index)}
                  disabled={index > currentStep}
                  className={`flex items-center gap-2 px-6 py-4 whitespace-nowrap transition-all duration-200 relative ${
                    currentStep === index
                      ? "border-b-2 border-white text-white"
                      : currentStep > index
                      ? "text-white/90 hover:text-white/90 cursor-pointer"
                      : "text-white/40 cursor-not-allowed"
                  }`}
                >
                  {step.icon}
                  <span className="font-medium">{step.label}</span>
                  {currentStep > index && (
                    <FaCheck className="w-3 h-3 text-white/90" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {isLoadingIdeas ? (
              <div className="flex items-center justify-center py-12">
                <FaSpinner className="w-8 h-8 text-white animate-spin" />
                <span className="ml-3 text-white">Loading your ideas...</span>
              </div>
            ) : userIdeas.length === 0 && currentStep === 0 ? (
              <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg text-center">
                <FaLightbulb className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-white font-medium mb-2">No Ideas Found</h3>
                <p className="text-white/60 mb-4">
                  You need to create at least one idea before requesting
                  funding.
                </p>
                <button
                  type="button"
                  onClick={handleCreateIdea}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black hover:bg-white/90 font-semibold rounded-lg transition-all duration-200"
                >
                  <FaPlus className="w-4 h-4" />
                  Create Your First Idea
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* STEP 0: Overview */}
                {currentStep === 0 && (
                  <div className="space-y-6">
                    {/* Idea Selection */}
                    <div>
                      <label className="block text-white font-medium mb-3">
                        Select Idea <span className="text-white/80">*</span>
                      </label>
                      <select
                        name="selectedIdeaId"
                        value={formData.selectedIdeaId}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors ${
                          validationErrors.selectedIdeaId
                            ? "border-white"
                            : "border-gray-700"
                        }`}
                      >
                        <option value="">Choose an idea...</option>
                        {userIdeas.map((idea) => (
                          <option
                            key={idea._id || idea.id}
                            value={idea._id || idea.id}
                          >
                            {idea.title} - {idea.category}
                          </option>
                        ))}
                      </select>
                      {validationErrors.selectedIdeaId && (
                        <p className="text-white/80 text-sm mt-2">
                          {validationErrors.selectedIdeaId}
                        </p>
                      )}
                    </div>

                    {/* Selected Idea Details */}
                    {formData.selectedIdeaId && (
                      <div className="p-4 bg-gray-900 border border-gray-800 rounded-lg">
                        {(() => {
                          const selectedIdea = userIdeas.find(
                            (idea) =>
                              (idea._id || idea.id) === formData.selectedIdeaId
                          );
                          return selectedIdea ? (
                            <div>
                              <h4 className="text-white font-medium mb-2">
                                {selectedIdea.title}
                              </h4>
                              <p className="text-white/60 text-sm mb-2">
                                {selectedIdea.elevatorPitch}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-white/50">
                                <span>Category: {selectedIdea.category}</span>
                                <span>
                                  Target: {selectedIdea.targetAudience}
                                </span>
                              </div>
                            </div>
                          ) : null;
                        })()}
                      </div>
                    )}

                    {/* Amount & Equity */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white font-medium mb-3">
                          Amount Required{" "}
                          <span className="text-white/80">*</span>
                        </label>
                        <div className="relative">
                          <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
                          <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleInputChange}
                            placeholder="250000"
                            className={`w-full pl-10 pr-4 py-3 bg-gray-900 border rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors ${
                              validationErrors.amount
                                ? "border-white"
                                : "border-gray-700"
                            }`}
                          />
                        </div>
                        {formData.amount && !validationErrors.amount && (
                          <p className="text-white/60 text-sm mt-2">
                            {formatCurrency(formData.amount)}
                          </p>
                        )}
                        {validationErrors.amount && (
                          <p className="text-white/80 text-sm mt-2">
                            {validationErrors.amount}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-white font-medium mb-3">
                          Equity Offered{" "}
                          <span className="text-white/80">*</span>
                        </label>
                        <div className="relative">
                          <FaPercentage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
                          <input
                            type="number"
                            name="equity"
                            value={formData.equity}
                            onChange={handleInputChange}
                            placeholder="15"
                            step="0.1"
                            className={`w-full pl-10 pr-4 py-3 bg-gray-900 border rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors ${
                              validationErrors.equity
                                ? "border-white"
                                : "border-gray-700"
                            }`}
                          />
                        </div>
                        {validationErrors.equity && (
                          <p className="text-white/80 text-sm mt-2">
                            {validationErrors.equity}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Funding Stage & Investment Type */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white font-medium mb-3">
                          Funding Stage <span className="text-white/80">*</span>
                        </label>
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
                      </div>

                      <div>
                        <label className="block text-white font-medium mb-3">
                          Investment Type{" "}
                          <span className="text-white/80">*</span>
                        </label>
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
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-white font-medium mb-3">
                        Brief Message for Investors{" "}
                        <span className="text-white/80">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Introduce your funding request to potential investors..."
                        rows={4}
                        className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors resize-none ${
                          validationErrors.message
                            ? "border-white"
                            : "border-gray-700"
                        }`}
                      />
                      {validationErrors.message && (
                        <p className="text-white/80 text-sm mt-2">
                          {validationErrors.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 1: Business Details */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-white font-medium mb-3">
                        Business Plan <span className="text-white/80">*</span>
                      </label>
                      <textarea
                        name="businessPlan"
                        value={formData.businessPlan}
                        onChange={handleInputChange}
                        placeholder="Describe your business model, value proposition, and market strategy in detail..."
                        rows={4}
                        className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors resize-none ${
                          validationErrors.businessPlan
                            ? "border-white"
                            : "border-gray-700"
                        }`}
                      />
                      {validationErrors.businessPlan && (
                        <p className="text-white/80 text-sm mt-2">
                          {validationErrors.businessPlan}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-3">
                        Target Market <span className="text-white/80">*</span>
                      </label>
                      <textarea
                        name="targetMarket"
                        value={formData.targetMarket}
                        onChange={handleInputChange}
                        placeholder="Define your target market, market size, and addressable opportunity..."
                        rows={3}
                        className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors resize-none ${
                          validationErrors.targetMarket
                            ? "border-white"
                            : "border-gray-700"
                        }`}
                      />
                      {validationErrors.targetMarket && (
                        <p className="text-white/80 text-sm mt-2">
                          {validationErrors.targetMarket}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-3">
                        Revenue Model <span className="text-white/80">*</span>
                      </label>
                      <textarea
                        name="revenueModel"
                        value={formData.revenueModel}
                        onChange={handleInputChange}
                        placeholder="Explain how your business generates or will generate revenue..."
                        rows={3}
                        className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors resize-none ${
                          validationErrors.revenueModel
                            ? "border-white"
                            : "border-gray-700"
                        }`}
                      />
                      {validationErrors.revenueModel && (
                        <p className="text-white/80 text-sm mt-2">
                          {validationErrors.revenueModel}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-3">
                        Competitive Advantage{" "}
                        <span className="text-white/80">*</span>
                      </label>
                      <textarea
                        name="competitiveAdvantage"
                        value={formData.competitiveAdvantage}
                        onChange={handleInputChange}
                        placeholder="What sets you apart from competitors? What's your unique value proposition..."
                        rows={3}
                        className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors resize-none ${
                          validationErrors.competitiveAdvantage
                            ? "border-white"
                            : "border-gray-700"
                        }`}
                      />
                      {validationErrors.competitiveAdvantage && (
                        <p className="text-white/80 text-sm mt-2">
                          {validationErrors.competitiveAdvantage}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-3">
                        Customer Traction{" "}
                        <span className="text-white/80">*</span>
                      </label>
                      <textarea
                        name="customerTraction"
                        value={formData.customerTraction}
                        onChange={handleInputChange}
                        placeholder="Current customers, user base, growth metrics, or traction indicators..."
                        rows={3}
                        className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors resize-none ${
                          validationErrors.customerTraction
                            ? "border-white"
                            : "border-gray-700"
                        }`}
                      />
                      {validationErrors.customerTraction && (
                        <p className="text-white/80 text-sm mt-2">
                          {validationErrors.customerTraction}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 2: Financial */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white font-medium mb-3">
                          Current Revenue{" "}
                          <span className="text-white/80">*</span>
                        </label>
                        <div className="relative">
                          <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
                          <input
                            type="number"
                            name="currentRevenue"
                            value={formData.currentRevenue}
                            onChange={handleInputChange}
                            placeholder="0"
                            className={`w-full pl-10 pr-4 py-3 bg-gray-900 border rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors ${
                              validationErrors.currentRevenue
                                ? "border-white"
                                : "border-gray-700"
                            }`}
                          />
                        </div>
                        {validationErrors.currentRevenue && (
                          <p className="text-white/80 text-sm mt-2">
                            {validationErrors.currentRevenue}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-white font-medium mb-3">
                          Previous Funding{" "}
                          <span className="text-white/80">*</span>
                        </label>
                        <div className="relative">
                          <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
                          <input
                            type="number"
                            name="previousFunding"
                            value={formData.previousFunding}
                            onChange={handleInputChange}
                            placeholder="0"
                            className={`w-full pl-10 pr-4 py-3 bg-gray-900 border rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors ${
                              validationErrors.previousFunding
                                ? "border-white"
                                : "border-gray-700"
                            }`}
                          />
                        </div>
                        {validationErrors.previousFunding && (
                          <p className="text-white/80 text-sm mt-2">
                            {validationErrors.previousFunding}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-3">
                        Financial Projections{" "}
                        <span className="text-white/80">*</span>
                      </label>
                      <textarea
                        name="financialProjections"
                        value={formData.financialProjections}
                        onChange={handleInputChange}
                        placeholder="Revenue projections, growth forecasts, profitability timeline..."
                        rows={4}
                        className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors resize-none ${
                          validationErrors.financialProjections
                            ? "border-white"
                            : "border-gray-700"
                        }`}
                      />
                      {validationErrors.financialProjections && (
                        <p className="text-white/80 text-sm mt-2">
                          {validationErrors.financialProjections}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-3">
                        Use of Funds <span className="text-white/80">*</span>
                      </label>
                      <textarea
                        name="useOfFunds"
                        value={formData.useOfFunds}
                        onChange={handleInputChange}
                        placeholder="Detailed breakdown of how the funding will be allocated..."
                        rows={4}
                        className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors resize-none ${
                          validationErrors.useOfFunds
                            ? "border-white"
                            : "border-gray-700"
                        }`}
                      />
                      {validationErrors.useOfFunds && (
                        <p className="text-white/80 text-sm mt-2">
                          {validationErrors.useOfFunds}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white font-medium mb-3">
                          Timeline <span className="text-white/80">*</span>
                        </label>
                        <textarea
                          name="timeline"
                          value={formData.timeline}
                          onChange={handleInputChange}
                          placeholder="Project timeline and key dates..."
                          rows={3}
                          className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors resize-none ${
                            validationErrors.timeline
                              ? "border-white"
                              : "border-gray-700"
                          }`}
                        />
                        {validationErrors.timeline && (
                          <p className="text-white/80 text-sm mt-2">
                            {validationErrors.timeline}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-white font-medium mb-3">
                          Milestones <span className="text-white/80">*</span>
                        </label>
                        <textarea
                          name="milestones"
                          value={formData.milestones}
                          onChange={handleInputChange}
                          placeholder="Key milestones and achievements..."
                          rows={3}
                          className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors resize-none ${
                            validationErrors.milestones
                              ? "border-white"
                              : "border-gray-700"
                          }`}
                        />
                        {validationErrors.milestones && (
                          <p className="text-white/80 text-sm mt-2">
                            {validationErrors.milestones}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-3">
                        Risk Factors <span className="text-white/80">*</span>
                      </label>
                      <textarea
                        name="riskFactors"
                        value={formData.riskFactors}
                        onChange={handleInputChange}
                        placeholder="Potential risks and mitigation strategies..."
                        rows={3}
                        className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors resize-none ${
                          validationErrors.riskFactors
                            ? "border-white"
                            : "border-gray-700"
                        }`}
                      />
                      {validationErrors.riskFactors && (
                        <p className="text-white/80 text-sm mt-2">
                          {validationErrors.riskFactors}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-3">
                        Exit Strategy <span className="text-white/80">*</span>
                      </label>
                      <textarea
                        name="exitStrategy"
                        value={formData.exitStrategy}
                        onChange={handleInputChange}
                        placeholder="Potential exit scenarios (IPO, acquisition, etc.)..."
                        rows={3}
                        className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors resize-none ${
                          validationErrors.exitStrategy
                            ? "border-white"
                            : "border-gray-700"
                        }`}
                      />
                      {validationErrors.exitStrategy && (
                        <p className="text-white/80 text-sm mt-2">
                          {validationErrors.exitStrategy}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 3: Team & Contact */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-white font-medium mb-3">
                        Team Size <span className="text-white/80">*</span>
                      </label>
                      <input
                        type="number"
                        name="teamSize"
                        value={formData.teamSize}
                        onChange={handleInputChange}
                        placeholder="Number of team members"
                        min="1"
                        className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors ${
                          validationErrors.teamSize
                            ? "border-white"
                            : "border-gray-700"
                        }`}
                      />
                      {validationErrors.teamSize && (
                        <p className="text-white/80 text-sm mt-2">
                          {validationErrors.teamSize}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white font-medium mb-3">
                          Contact Phone <span className="text-white/80">*</span>
                        </label>
                        <div className="relative">
                          <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
                          <input
                            type="tel"
                            name="contactPhone"
                            value={formData.contactPhone}
                            onChange={handleInputChange}
                            placeholder="+1 (555) 123-4567"
                            className={`w-full pl-10 pr-4 py-3 bg-gray-900 border rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors ${
                              validationErrors.contactPhone
                                ? "border-white"
                                : "border-gray-700"
                            }`}
                          />
                        </div>
                        {validationErrors.contactPhone && (
                          <p className="text-white/80 text-sm mt-2">
                            {validationErrors.contactPhone}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-white font-medium mb-3">
                          Contact Email <span className="text-white/80">*</span>
                        </label>
                        <div className="relative">
                          <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
                          <input
                            type="email"
                            name="contactEmail"
                            value={formData.contactEmail}
                            onChange={handleInputChange}
                            placeholder="your@email.com"
                            className={`w-full pl-10 pr-4 py-3 bg-gray-900 border rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors ${
                              validationErrors.contactEmail
                                ? "border-white"
                                : "border-gray-700"
                            }`}
                          />
                        </div>
                        {validationErrors.contactEmail && (
                          <p className="text-white/80 text-sm mt-2">
                            {validationErrors.contactEmail}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white font-medium mb-3">
                          Company Website{" "}
                          <span className="text-white/80">*</span>
                        </label>
                        <div className="relative">
                          <FaGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
                          <input
                            type="url"
                            name="companyWebsite"
                            value={formData.companyWebsite}
                            onChange={handleInputChange}
                            placeholder="https://yourcompany.com"
                            className={`w-full pl-10 pr-4 py-3 bg-gray-900 border rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors ${
                              validationErrors.companyWebsite
                                ? "border-white"
                                : "border-gray-700"
                            }`}
                          />
                        </div>
                        {validationErrors.companyWebsite && (
                          <p className="text-white/80 text-sm mt-2">
                            {validationErrors.companyWebsite}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-white font-medium mb-3">
                          LinkedIn Profile{" "}
                          <span className="text-white/80">*</span>
                        </label>
                        <div className="relative">
                          <FaLinkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
                          <input
                            type="url"
                            name="linkedinProfile"
                            value={formData.linkedinProfile}
                            onChange={handleInputChange}
                            placeholder="https://linkedin.com/in/yourprofile"
                            className={`w-full pl-10 pr-4 py-3 bg-gray-900 border rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors ${
                              validationErrors.linkedinProfile
                                ? "border-white"
                                : "border-gray-700"
                            }`}
                          />
                        </div>
                        {validationErrors.linkedinProfile && (
                          <p className="text-white/80 text-sm mt-2">
                            {validationErrors.linkedinProfile}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-3">
                        Intellectual Property{" "}
                        <span className="text-white/80">*</span>
                      </label>
                      <textarea
                        name="intellectualProperty"
                        value={formData.intellectualProperty}
                        onChange={handleInputChange}
                        placeholder="Patents, trademarks, copyrights, trade secrets..."
                        rows={3}
                        className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors resize-none ${
                          validationErrors.intellectualProperty
                            ? "border-white"
                            : "border-gray-700"
                        }`}
                      />
                      {validationErrors.intellectualProperty && (
                        <p className="text-white/80 text-sm mt-2">
                          {validationErrors.intellectualProperty}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-3">
                        Additional Documents{" "}
                        <span className="text-white/40">(Optional)</span>
                      </label>
                      <textarea
                        name="additionalDocuments"
                        value={formData.additionalDocuments}
                        onChange={handleInputChange}
                        placeholder="Links to pitch deck, financial models, or other supporting documents..."
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer with Navigation */}
          {!isLoadingIdeas && userIdeas.length > 0 && (
            <div className="flex items-center justify-between p-6 border-t border-white/10 bg-white/[0.02]">
              <button
                type="button"
                onClick={currentStep === 0 ? onClose : handlePrevious}
                className="px-6 py-3 text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/10 flex items-center gap-2"
              >
                {currentStep === 0 ? (
                  <>
                    <FaTimes className="w-4 h-4" />
                    Cancel
                  </>
                ) : (
                  <>
                    <FaArrowLeft className="w-4 h-4" />
                    Previous
                  </>
                )}
              </button>

              {currentStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-8 py-3 bg-white text-black hover:bg-white/90 font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  Next
                  <FaArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-white text-black hover:bg-white/90 font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FaCheck className="w-4 h-4" />
                      Submit Request
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FundingRequestForm;
