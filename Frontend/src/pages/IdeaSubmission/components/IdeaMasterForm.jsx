import React, { useState, useEffect } from "react";
import { ideasAPI } from "../../../services/api";
import { Lightbulb, Trash2, Rocket } from "lucide-react";

const IdeaMasterForm = ({
  onDataChange,
  onSuccess,
  onError,
  initialData = {},
  isEditMode = false,
}) => {
  // Sample data for quick testing and demonstration
  const sampleData = {
    title: "Zepto – 10–20 Minute Grocery Delivery Platform",

    description:
      "Zepto is a hyperlocal quick-commerce platform that delivers groceries and everyday essentials within 10–20 minutes. Using a dense network of tech-enabled dark stores, real-time inventory systems, and AI-driven logistics, Zepto ensures ultra-fast order fulfillment with high accuracy. The platform offers a wide assortment of daily-use items including fresh produce, dairy, snacks, beverages, personal care, and household essentials. With competitive pricing, reliable delivery speed, and strong in-app user experience, Zepto is transforming the grocery retail landscape for urban consumers.",

    category: "Quick Commerce / E-commerce",

    stage: "Growth / Late-Stage Startup",

    targetAudience:
      "Urban millennials, Gen Z users, busy professionals, students, and families in major Indian metropolitan cities who prioritize convenience and speed. Core markets include Tier-1 cities and fast-growing Tier-2 cities with high digital adoption and demand for instant delivery.",

    problemStatement:
      "Traditional grocery shopping requires travel, waiting in queues, and limited store timings, making it inefficient for busy urban consumers. Standard online grocery platforms typically offer scheduled deliveries with lead times of several hours or even a full day. This leaves customers without fast access to essentials during urgent or unplanned needs. Urban households increasingly require rapid, reliable, and time-saving solutions for everyday purchases.",

    solution:
      "Zepto provides a mobile-first platform that enables customers to order essentials with delivery in 10–20 minutes through a network of strategically located dark stores. The company uses real-time inventory management, AI-powered demand prediction, and optimized delivery routing. Store locations are chosen based on population density and delivery radius constraints to maintain speed and accuracy. The app offers fast search, personalized recommendations, secure payments, and a seamless checkout experience.",

    uniqueValueProposition:
      "Zepto differentiates itself through ultra-fast delivery, high product availability, strong operational efficiency, and superior user experience. Its dense dark-store network, tech-driven forecasting systems, and optimized last-mile logistics enable consistent delivery reliability. Zepto’s focus on operational discipline and cost control has improved unit economics, setting it apart from competitors facing profitability challenges in quick commerce.",

    marketSize:
      "The Indian e-grocery market is valued at $15B+ and is growing at ~30–40% CAGR. The quick-commerce segment is one of the fastest-growing categories, projected to reach $5B+ by 2025 as urban consumers increasingly adopt instant delivery for routine purchases. Large expansion opportunities remain across Tier-2/3 Indian cities and select Asian markets.",

    competitiveAdvantage:
      "Zepto’s competitive strengths include its proprietary logistics and inventory software, optimized dark-store operations, improving unit economics, strong repeat purchase behavior (high retention and order frequency), data-driven assortment planning, and rapid expansion capability. Its focus on disciplined execution, customer experience, and operational efficiency positions it strongly in India’s quick-commerce ecosystem.",
  };

  const [formData, setFormData] = useState({
    title: initialData.title || sampleData.title,
    description: initialData.description || sampleData.description,
    category: initialData.category || sampleData.category,
    stage: initialData.stage || sampleData.stage,
    targetAudience: initialData.targetAudience || sampleData.targetAudience,
    problemStatement:
      initialData.problemStatement || sampleData.problemStatement,
    solution: initialData.solution || sampleData.solution,
    uniqueValueProposition:
      initialData.uniqueValueProposition || sampleData.uniqueValueProposition,
    marketSize: initialData.marketSize || sampleData.marketSize,
    competitiveAdvantage:
      initialData.competitiveAdvantage || sampleData.competitiveAdvantage,
    attachments: initialData.attachments || null,
    ...initialData,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to clear form data
  const clearForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      stage: "Concept",
      targetAudience: "",
      problemStatement: "",
      solution: "",
      uniqueValueProposition: "",
      marketSize: "",
      competitiveAdvantage: "",
      attachments: null,
    });
    setErrors({});
  };

  // Function to load fresh sample data
  const loadSampleData = () => {
    setFormData({
      ...sampleData,
      attachments: null,
    });
    setErrors({});
  };

  const categories = [
    "Technology",
    "Healthcare",
    "Education",
    "Finance",
    "E-commerce",
    "Social Impact",
    "Environment",
    "Entertainment",
    "Transportation",
    "Food & Beverage",
    "Real Estate",
    "Fashion",
    "Sports",
    "Energy",
    "Agriculture",
    "Quick-commerce",
    "Other",
  ];

  const stages = [
    "Concept",
    "Research",
    "Prototype",
    "MVP",
    "Beta",
    "Launch",
    "Growth",
    "Scale",
  ];

  useEffect(() => {
    // Notify parent component of data changes
    if (onDataChange) {
      onDataChange(formData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "attachments") {
      setFormData((prev) => ({
        ...prev,
        [name]: files,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required field validations
    if (!formData.title.trim()) {
      newErrors.title = "Idea title is required";
    } else if (formData.title.length < 5) {
      newErrors.title = "Title must be at least 5 characters long";
    } else if (formData.title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 50) {
      newErrors.description = "Description must be at least 50 characters long";
    } else if (formData.description.length > 2000) {
      newErrors.description = "Description must be less than 2000 characters";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.problemStatement.trim()) {
      newErrors.problemStatement = "Problem statement is required";
    } else if (formData.problemStatement.length < 20) {
      newErrors.problemStatement =
        "Problem statement must be at least 20 characters long";
    } else if (formData.problemStatement.length > 1000) {
      newErrors.problemStatement =
        "Problem statement must be less than 1000 characters";
    }

    if (!formData.solution.trim()) {
      newErrors.solution = "Solution description is required";
    } else if (formData.solution.length < 20) {
      newErrors.solution =
        "Solution description must be at least 20 characters long";
    } else if (formData.solution.length > 1000) {
      newErrors.solution =
        "Solution description must be less than 1000 characters";
    }

    if (!formData.targetAudience.trim()) {
      newErrors.targetAudience = "Target audience is required";
    } else if (formData.targetAudience.length < 10) {
      newErrors.targetAudience =
        "Target audience must be at least 10 characters long";
    } else if (formData.targetAudience.length > 500) {
      newErrors.targetAudience =
        "Target audience must be less than 500 characters";
    }

    if (!formData.uniqueValueProposition.trim()) {
      newErrors.uniqueValueProposition = "Unique value proposition is required";
    }

    // File validation
    if (formData.attachments && formData.attachments.length > 0) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = [
        "application/pdf",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/png",
        "image/gif",
      ];

      for (let file of formData.attachments) {
        if (file.size > maxSize) {
          newErrors.attachments = "File size must be less than 10MB";
          break;
        }
        if (!allowedTypes.includes(file.type)) {
          newErrors.attachments =
            "Invalid file type. Allowed: PDF, PPT, DOC, Images";
          break;
        }
      }

      if (formData.attachments.length > 5) {
        newErrors.attachments = "Maximum 5 files allowed";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        // Basic Information from form
        title: formData.title,
        description: formData.description,
        category: formData.category,
        targetAudience: formData.targetAudience,
        // Problem & Solution from form
        problemStatement: formData.problemStatement,
        solution: formData.solution,
        // Market info from form
        marketSize: formData.marketSize,
        // Additional info from form
        uniqueValueProposition: formData.uniqueValueProposition,
        competitiveAdvantage: formData.competitiveAdvantage,
        ...(formData.attachments &&
          formData.attachments.length > 0 && {
            attachments: formData.attachments,
          }),

        // Required fields with default values (will be filled in other forms)
        elevatorPitch:
          `${formData.title} - A solution for ${
            formData.targetAudience || "target market"
          }` || "Innovative solution to be detailed",

        // Optional fields that can be empty
        competitors: "",
        revenueStreams: "",
        pricingStrategy: "",
        keyPartnerships: "",
        goToMarketStrategy: "",
        scalabilityPlan: "",
        technologyStack: "",
        developmentRoadmap: "",
        challengesAnticipated: "",
        ecoFriendlyPractices: "",
        socialImpact: "",
        fundingRequirements: "",
        useOfFunds: "",
        equityOffer: "",
      };

      // Debug logging
      console.log("Submitting idea with data:", submitData);
      console.log("Field lengths:", {
        title: submitData.title?.length,
        elevatorPitch: submitData.elevatorPitch?.length,
        description: submitData.description?.length,
        targetAudience: submitData.targetAudience?.length,
        problemStatement: submitData.problemStatement?.length,
        solution: submitData.solution?.length,
      });

      let result;
      if (isEditMode && initialData._id) {
        // Update existing idea
        result = await ideasAPI.updateIdea(initialData._id, submitData);
      } else {
        // Create new idea
        result = await ideasAPI.submitIdea(submitData);
      }

      if (result.success) {
        // Success will be handled by parent component
        console.log("Idea form submitted successfully:", result);
        if (onSuccess) {
          onSuccess(result);
        }
      } else {
        const errorMessage = result.message || "Failed to submit idea";
        setErrors({ submit: errorMessage });
        if (onError) {
          onError(errorMessage);
        }
      }
    } catch (error) {
      console.error("Error submitting idea form:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        submitData: submitData,
      });
      const errorMessage =
        error.message || "An error occurred while submitting the form";
      setErrors({ submit: errorMessage });
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white font-manrope mb-3">
                {isEditMode ? "Edit Your Idea" : "Submit Your Innovative Idea"}
              </h2>
              <p className="text-white/70 font-manrope text-lg">
                Define the core concept, problem, and solution for your
                innovative startup idea.
              </p>
              {!isEditMode && (
                <div className="mt-4 p-4 bg-white/5 border border-white/20 rounded-xl">
                  <p className="text-white/80 font-manrope text-sm flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Sample data has been pre-loaded</strong> to help
                      you get started quickly. You can modify any field or use
                      the "Clear Form" button to start fresh.
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Quick Action Buttons */}
            {!isEditMode && (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={clearForm}
                  className="px-4 py-2 bg-white/[0.05] hover:bg-white/[0.08] text-white/70 hover:text-white text-sm rounded-lg transition-all duration-300 border border-white/10 hover:border-white/20 font-manrope flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Form
                </button>
                <button
                  type="button"
                  onClick={loadSampleData}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm rounded-lg transition-all duration-300 font-manrope shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center gap-2"
                >
                  <Rocket className="w-4 h-4" />
                  Load Sample Data
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>
        <div className="relative z-10 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-xl font-semibold text-white font-manrope">
                  Basic Information
                </h3>
                <p className="text-white/60 font-manrope text-sm mt-1">
                  Essential details about your innovative idea
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {/* Idea Title */}
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-white font-manrope mb-2"
                  >
                    Idea Title <span className="text-white/70">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white/[0.03] border rounded-lg text-white font-manrope placeholder-white/40 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/20 ${
                      errors.title
                        ? "border-white/50 focus:border-white/70"
                        : "border-white/10 focus:border-white/30"
                    }`}
                    placeholder="Enter a compelling title for your innovative idea"
                    maxLength={100}
                    required
                  />
                  {errors.title && (
                    <p className="mt-2 text-sm text-white/70 font-manrope">
                      {errors.title}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-white/40 font-manrope">
                    {formData.title.length}/100 characters
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category */}
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-white font-manrope mb-2"
                    >
                      Category <span className="text-white/70">*</span>
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-white/[0.03] border rounded-lg text-white font-manrope backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/20 ${
                        errors.category
                          ? "border-white/50 focus:border-white"
                          : "border-white/10 focus:border-white/30"
                      }`}
                      required
                    >
                      <option value="" className="bg-black text-white">
                        Select a category
                      </option>
                      {categories.map((cat) => (
                        <option
                          key={cat}
                          value={cat}
                          className="bg-black text-white"
                        >
                          {cat}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-2 text-sm text-white/70 font-manrope">
                        {errors.category}
                      </p>
                    )}
                  </div>

                  {/* Stage */}
                  <div>
                    <label
                      htmlFor="stage"
                      className="block text-sm font-medium text-white font-manrope mb-2"
                    >
                      Development Stage
                    </label>
                    <select
                      id="stage"
                      name="stage"
                      value={formData.stage}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg text-white font-manrope backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30"
                    >
                      {stages.map((stage) => (
                        <option
                          key={stage}
                          value={stage}
                          className="bg-black text-white"
                        >
                          {stage}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-white font-manrope mb-2"
                  >
                    Detailed Description{" "}
                    <span className="text-white/70">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={6}
                    className={`w-full px-4 py-3 bg-white/[0.03] border rounded-lg text-white font-manrope placeholder-white/40 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none ${
                      errors.description
                        ? "border-white/50 focus:border-white"
                        : "border-white/10 focus:border-white/30"
                    }`}
                    placeholder="Provide a comprehensive description of your innovative idea, its features, and potential impact"
                    maxLength={2000}
                    required
                  />
                  {errors.description && (
                    <p className="mt-2 text-sm text-white/70 font-manrope">
                      {errors.description}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-white/40 font-manrope">
                    {formData.description.length}/2000 characters
                  </p>
                </div>
              </div>
            </div>

            {/* Problem & Solution Section */}
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-xl font-semibold text-white font-manrope">
                  Problem & Solution
                </h3>
                <p className="text-white/60 font-manrope text-sm mt-1">
                  Define the problem you're solving and your innovative solution
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {/* Target Audience */}
                <div>
                  <label
                    htmlFor="targetAudience"
                    className="block text-sm font-medium text-white font-manrope mb-2"
                  >
                    Target Audience <span className="text-white/70">*</span>
                  </label>
                  <input
                    type="text"
                    id="targetAudience"
                    name="targetAudience"
                    value={formData.targetAudience}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white/[0.03] border rounded-lg text-white font-manrope placeholder-white/40 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/20 ${
                      errors.targetAudience
                        ? "border-white/50 focus:border-white"
                        : "border-white/10 focus:border-white/30"
                    }`}
                    placeholder="Who is your primary target audience? Be specific about demographics, needs, and characteristics"
                    maxLength={500}
                    required
                  />
                  {errors.targetAudience && (
                    <p className="mt-2 text-sm text-white/70 font-manrope">
                      {errors.targetAudience}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-white/40 font-manrope">
                    {formData.targetAudience.length}/500 characters
                  </p>
                </div>

                {/* Problem Statement */}
                <div>
                  <label
                    htmlFor="problemStatement"
                    className="block text-sm font-medium text-white font-manrope mb-2"
                  >
                    Problem Statement <span className="text-white/70">*</span>
                  </label>
                  <textarea
                    id="problemStatement"
                    name="problemStatement"
                    value={formData.problemStatement}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-4 py-3 bg-white/[0.03] border rounded-lg text-white font-manrope placeholder-white/40 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none ${
                      errors.problemStatement
                        ? "border-white/50 focus:border-white"
                        : "border-white/10 focus:border-white/30"
                    }`}
                    placeholder="Clearly describe the problem your idea addresses. What pain points does your target audience face?"
                    maxLength={1000}
                    required
                  />
                  {errors.problemStatement && (
                    <p className="mt-2 text-sm text-white/70 font-manrope">
                      {errors.problemStatement}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-white/40 font-manrope">
                    {formData.problemStatement.length}/1000 characters
                  </p>
                </div>

                {/* Solution */}
                <div>
                  <label
                    htmlFor="solution"
                    className="block text-sm font-medium text-white font-manrope mb-2"
                  >
                    Your Solution <span className="text-white/70">*</span>
                  </label>
                  <textarea
                    id="solution"
                    name="solution"
                    value={formData.solution}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-4 py-3 bg-white/[0.03] border rounded-lg text-white font-manrope placeholder-white/40 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none ${
                      errors.solution
                        ? "border-white/50 focus:border-white"
                        : "border-white/10 focus:border-white/30"
                    }`}
                    placeholder="How does your idea solve the identified problem? What makes your solution unique and effective?"
                    maxLength={1000}
                    required
                  />
                  {errors.solution && (
                    <p className="mt-2 text-sm text-white/70 font-manrope">
                      {errors.solution}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-white/40 font-manrope">
                    {formData.solution.length}/1000 characters
                  </p>
                </div>
              </div>
            </div>
            {/* Market & Value Proposition Section */}
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-xl font-semibold text-white font-manrope">
                  Market & Value Proposition
                </h3>
                <p className="text-white/60 font-manrope text-sm mt-1">
                  Define your unique value and market opportunity
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {/* Unique Value Proposition */}
                <div>
                  <label
                    htmlFor="uniqueValueProposition"
                    className="block text-sm font-medium text-white font-manrope mb-2"
                  >
                    Unique Value Proposition{" "}
                    <span className="text-white/70">*</span>
                  </label>
                  <textarea
                    id="uniqueValueProposition"
                    name="uniqueValueProposition"
                    value={formData.uniqueValueProposition}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-4 py-3 bg-white/[0.03] border rounded-lg text-white font-manrope placeholder-white/40 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none ${
                      errors.uniqueValueProposition
                        ? "border-white/50 focus:border-white"
                        : "border-white/10 focus:border-white/30"
                    }`}
                    placeholder="What makes your solution unique? How does it differentiate from existing alternatives?"
                    required
                  />
                  {errors.uniqueValueProposition && (
                    <p className="mt-2 text-sm text-white/70 font-manrope">
                      {errors.uniqueValueProposition}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Market Size */}
                  <div>
                    <label
                      htmlFor="marketSize"
                      className="block text-sm font-medium text-white font-manrope mb-2"
                    >
                      Market Size & Opportunity
                    </label>
                    <input
                      type="text"
                      id="marketSize"
                      name="marketSize"
                      value={formData.marketSize}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg text-white font-manrope placeholder-white/40 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30"
                      placeholder="e.g., $5B market growing at 15% annually"
                    />
                  </div>

                  {/* Competitive Advantage */}
                  <div>
                    <label
                      htmlFor="competitiveAdvantage"
                      className="block text-sm font-medium text-white font-manrope mb-2"
                    >
                      Competitive Advantage
                    </label>
                    <input
                      type="text"
                      id="competitiveAdvantage"
                      name="competitiveAdvantage"
                      value={formData.competitiveAdvantage}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg text-white font-manrope placeholder-white/40 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30"
                      placeholder="What gives you an edge over competitors?"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* File Attachments Section */}
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-xl font-semibold text-white font-manrope">
                  Supporting Documents
                </h3>
                <p className="text-white/60 font-manrope text-sm mt-1">
                  Upload any supporting documents (optional)
                </p>
              </div>

              <div>
                <label
                  htmlFor="attachments"
                  className="block text-sm font-medium text-white font-manrope mb-2"
                >
                  Attachments (Optional)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id="attachments"
                    name="attachments"
                    onChange={handleInputChange}
                    multiple
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.gif"
                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg text-white font-manrope backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/20 file:text-white hover:file:bg-white/30"
                  />
                </div>
                {errors.attachments && (
                  <p className="mt-2 text-sm text-white/70 font-manrope">
                    {errors.attachments}
                  </p>
                )}
                <p className="mt-2 text-xs text-white/40 font-manrope">
                  Supported formats: PDF, DOC, PPT, Images • Max size: 10MB per
                  file • Max files: 5
                </p>
              </div>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-white/5 border border-white/20 rounded-xl p-4">
                <p className="text-white/80 font-manrope">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-8 border-t border-white/10">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-3 bg-white/20 hover:bg-white/30 text-white font-manrope font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] ${
                  isSubmitting
                    ? "opacity-50 cursor-not-allowed transform-none hover:scale-100"
                    : ""
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Saving...
                  </div>
                ) : isEditMode ? (
                  "Update Idea"
                ) : (
                  "Submit Idea"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default IdeaMasterForm;
