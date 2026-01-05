// components/investor/InvestorAppFeedbackPage.jsx
import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Star,
  Send,
  Bug,
  Lightbulb,
  Smartphone,
  Monitor,
  Tablet,
  ThumbsUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  X,
  Eye,
  TrendingUp,
  BarChart3,
  Shield,
  Palette,
} from "lucide-react";

const InvestorAppFeedbackPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [stats, setStats] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    category: "general",
    title: "",
    description: "",
    overallRating: 5,
    ratings: {
      usability: 3,
      performance: 3,
      features: 3,
      design: 3,
    },
    frequencyOfUse: "weekly",
    recommendationScore: 7,
    mostUsedFeatures: [],
    suggestedImprovements: [],
    stepsToReproduce: "",
    expectedBehavior: "",
    actualBehavior: "",
    featureDescription: "",
    featurePriority: "medium",
    contactForFollowUp: false,
    preferredContactMethod: "email",
    browserInfo: {},
    deviceInfo: {},
  });

  // New feature and improvement inputs
  const [newFeature, setNewFeature] = useState("");
  const [newImprovement, setNewImprovement] = useState("");

  // Categories specific to investor needs
  const categories = [
    { value: "general", label: "General", icon: MessageSquare, color: "text-blue-500" },
    { value: "bug_report", label: "Bug Report", icon: Bug, color: "text-red-500" },
    { value: "feature_request", label: "Feature Request", icon: Lightbulb, color: "text-yellow-500" },
    { value: "ui_ux", label: "UI/UX", icon: Palette, color: "text-purple-500" },
    { value: "performance", label: "Performance", icon: TrendingUp, color: "text-green-500" },
    { value: "security", label: "Security", icon: Shield, color: "text-red-600" },
    { value: "analytics", label: "Investment Analytics", icon: BarChart3, color: "text-cyan-500" },
    { value: "other", label: "Other", icon: MessageSquare, color: "text-gray-500" },
  ];

  const ratingLabels = {
    1: "Poor",
    2: "Fair", 
    3: "Good",
    4: "Very Good",
    5: "Excellent"
  };

  const specificRatingCategories = [
    { key: "usability", label: "Ease of Use", description: "How easy is it to navigate and use the investor dashboard?" },
    { key: "performance", label: "Performance", description: "How responsive and fast is the platform?" },
    { key: "features", label: "Features", description: "How useful are the investment analysis and discovery features?" },
    { key: "design", label: "Design", description: "How appealing and professional is the visual design?" },
  ];

  useEffect(() => {
    fetchFeedback();
    fetchStats();
    detectBrowserInfo();
  }, []);

  const detectBrowserInfo = () => {
    const userAgent = navigator.userAgent;
    
    // Simple browser detection
    let browserName = "Unknown";
    let browserVersion = "Unknown";
    
    if (userAgent.indexOf("Chrome") > -1) {
      browserName = "Chrome";
      browserVersion = userAgent.match(/Chrome\/(\d+)/)?.[1] || "Unknown";
    } else if (userAgent.indexOf("Firefox") > -1) {
      browserName = "Firefox";
      browserVersion = userAgent.match(/Firefox\/(\d+)/)?.[1] || "Unknown";
    } else if (userAgent.indexOf("Safari") > -1) {
      browserName = "Safari";
      browserVersion = userAgent.match(/Version\/(\d+)/)?.[1] || "Unknown";
    } else if (userAgent.indexOf("Edge") > -1) {
      browserName = "Edge";
      browserVersion = userAgent.match(/Edge\/(\d+)/)?.[1] || "Unknown";
    }

    // OS Detection
    let os = "Unknown";
    if (userAgent.indexOf("Windows") > -1) os = "Windows";
    else if (userAgent.indexOf("Mac") > -1) os = "macOS";
    else if (userAgent.indexOf("Linux") > -1) os = "Linux";
    else if (userAgent.indexOf("Android") > -1) os = "Android";
    else if (userAgent.indexOf("iOS") > -1) os = "iOS";

    // Device Type Detection
    const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
    const isTablet = /iPad|Android(?!.*Mobile)/i.test(userAgent);

    let deviceType = "desktop";
    if (isMobile && !isTablet) deviceType = "mobile";
    else if (isTablet) deviceType = "tablet";

    setFormData((prev) => ({
      ...prev,
      browserInfo: {
        userAgent,
        browserName,
        browserVersion,
        os,
      },
      deviceInfo: {
        deviceType,
        screenResolution: `${screen.width}x${screen.height}`,
      },
    }));
  };

  const fetchFeedback = async () => {
    try {
      const token = localStorage.getItem("token");
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";
      const response = await fetch(`${API_BASE}/api/app-feedback/my-feedback`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFeedback(data.feedback || []);
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";
      const response = await fetch(`${API_BASE}/api/app-feedback/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const trimmedTitle = formData.title.trim();
    const trimmedDescription = formData.description.trim();

    if (!trimmedTitle || !trimmedDescription) {
      alert("Please fill in all required fields");
      return;
    }

    if (trimmedTitle.length < 5) {
      alert("Title must be at least 5 characters long");
      return;
    }

    if (trimmedDescription.length < 10) {
      alert("Description must be at least 10 characters long");
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";
      const response = await fetch(`${API_BASE}/api/app-feedback`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowForm(false);
        resetForm();
        fetchFeedback();
        fetchStats();
        alert("Feedback submitted successfully! Thank you for helping us improve the investor experience.");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Error submitting feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      ...formData,
      category: "general",
      title: "",
      description: "",
      overallRating: 5,
      ratings: {
        usability: 3,
        performance: 3,
        features: 3,
        design: 3,
      },
      recommendationScore: 7,
      mostUsedFeatures: [],
      suggestedImprovements: [],
      stepsToReproduce: "",
      expectedBehavior: "",
      actualBehavior: "",
      featureDescription: "",
      contactForFollowUp: false,
    });
    setNewFeature("");
    setNewImprovement("");
  };

  const addFeature = () => {
    if (
      newFeature.trim() &&
      !formData.mostUsedFeatures.includes(newFeature.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        mostUsedFeatures: [...prev.mostUsedFeatures, newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (feature) => {
    setFormData((prev) => ({
      ...prev,
      mostUsedFeatures: prev.mostUsedFeatures.filter((f) => f !== feature),
    }));
  };

  const addImprovement = () => {
    if (
      newImprovement.trim() &&
      !formData.suggestedImprovements.includes(newImprovement.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        suggestedImprovements: [...prev.suggestedImprovements, newImprovement.trim()],
      }));
      setNewImprovement("");
    }
  };

  const removeImprovement = (improvement) => {
    setFormData((prev) => ({
      ...prev,
      suggestedImprovements: prev.suggestedImprovements.filter(
        (imp) => imp !== improvement
      ),
    }));
  };

  const getCategoryIcon = (categoryValue) => {
    const categoryData = categories.find((cat) => cat.value === categoryValue);
    if (!categoryData) return <MessageSquare size={16} className="text-gray-500" />;
    
    const IconComponent = categoryData.icon;
    return (
      <IconComponent
        size={16}
        className={categoryData?.color || "text-gray-500"}
      />
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      open: "text-blue-600 bg-blue-100",
      in_review: "text-yellow-600 bg-yellow-100", 
      in_progress: "text-purple-600 bg-purple-100",
      resolved: "text-green-600 bg-green-100",
      closed: "text-gray-600 bg-gray-100"
    };
    return colors[status] || colors.open;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Investor Platform Feedback
        </h2>
        <p className="text-white/60">
          Help us improve the investment platform by sharing your feedback and suggestions
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/60">
                  Total Feedback
                </p>
                <p className="text-2xl font-bold text-white">
                  {stats.totalFeedback || 0}
                </p>
              </div>
              <MessageSquare className="h-8 w-8 text-white/90" />
            </div>
          </div>

          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/60">Avg Rating</p>
                <p className="text-2xl font-bold text-white">
                  {stats.averageRating ? stats.averageRating.toFixed(1) : "0.0"}/5
                </p>
              </div>
              <Star className="h-8 w-8 text-white/90" />
            </div>
          </div>

          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/60">
                  Recommendation
                </p>
                <p className="text-2xl font-bold text-white">
                  {stats.averageRecommendation
                    ? stats.averageRecommendation.toFixed(1)
                    : "0.0"}
                  /10
                </p>
              </div>
              <ThumbsUp className="h-8 w-8 text-white/90" />
            </div>
          </div>

          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <button
              onClick={() => setShowForm(true)}
              className="w-full h-full flex flex-col items-center justify-center text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <Plus className="h-8 w-8 mb-2" />
              <span className="font-medium">New Feedback</span>
            </button>
          </div>
        </div>
      )}

      {/* Feedback List */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl">
        <div className="px-6 py-4 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">
            Your Feedback History
          </h2>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
              <p className="mt-4 text-white/60">Loading feedback...</p>
            </div>
          ) : feedback.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-white/40 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                No feedback yet
              </h3>
              <p className="text-white/60 mb-4">
                Start by sharing your thoughts about the investment platform
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-white/20 text-white px-6 py-2 rounded-lg hover:bg-white/30 transition-colors"
              >
                Submit Your First Feedback
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {feedback.map((item) => (
                <div
                  key={item._id}
                  className="border border-white/10 rounded-lg p-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getCategoryIcon(item.category)}
                      <div>
                        <h4 className="font-medium text-white">{item.title}</h4>
                        <p className="text-sm text-white/60 capitalize">
                          {item.category.replace('_', ' ')} • {item.feedbackAge}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <p className="text-white/80 text-sm mb-3 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-white/60">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Star size={14} />
                        <span>({item.overallRating}/5)</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock size={14} />
                        <span>
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ThumbsUp size={14} />
                        <span>
                          Recommend: {item.recommendationScore}/10
                        </span>
                      </div>
                    </div>
                  </div>

                  {item.adminResponse && item.adminResponse.response && (
                    <div className="mt-3 p-3 bg-white/10 rounded-lg border-l-4 border-white">
                      <p className="text-sm font-medium text-white/90">
                        Admin Response:
                      </p>
                      <p className="text-sm text-white/90 mt-1">
                        {item.adminResponse.response}
                      </p>
                      <p className="text-xs text-white/60 mt-2">
                        Responded on{" "}
                        {new Date(
                          item.adminResponse.respondedAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Feedback Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white/[0.08] backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Submit Investor Platform Feedback
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-white/60 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-3">
                  Feedback Category *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {categories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <button
                        key={category.value}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            category: category.value,
                          }))
                        }
                        className={`p-3 rounded-lg border-2 transition-colors flex flex-col items-center space-y-2 ${
                          formData.category === category.value
                            ? "border-white bg-white/10 text-white/90"
                            : "border-white/20 hover:border-white/30 text-white/60 hover:text-white/80"
                        }`}
                      >
                        <IconComponent size={18} className={category.color} />
                        <span className="text-sm font-medium text-center">
                          {category.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className={`w-full px-3 py-2 bg-white/[0.05] border rounded-lg focus:outline-none focus:ring-2 text-white ${
                    formData.title.trim().length > 0 &&
                    formData.title.trim().length < 5
                      ? "border-red-400 focus:ring-red-400"
                      : "border-white/20 focus:ring-white/50"
                  }`}
                  placeholder="Brief summary of your feedback"
                  required
                />
                <div className="text-xs text-white/60 mt-1">
                  {formData.title.length}/50 characters{" "}
                  {formData.title.trim().length < 5 &&
                    formData.title.trim().length > 0 &&
                    "(5 minimum)"}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={4}
                  className={`w-full px-3 py-2 bg-white/[0.05] border rounded-lg focus:outline-none focus:ring-2 text-white ${
                    formData.description.trim().length > 0 &&
                    formData.description.trim().length < 10
                      ? "border-red-400 focus:ring-red-400"
                      : "border-white/20 focus:ring-white/50"
                  }`}
                  placeholder="Please provide detailed feedback..."
                  required
                />
                <div className="text-xs text-white/60 mt-1">
                  {formData.description.length}/500 characters{" "}
                  {formData.description.trim().length < 10 &&
                    formData.description.trim().length > 0 &&
                    "(10 minimum)"}
                </div>
              </div>

              {/* Overall Rating */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-3">
                  Overall Rating *
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, overallRating: rating }))
                      }
                      className="text-2xl transition-colors"
                    >
                      <Star
                        className={
                          rating <= formData.overallRating
                            ? "text-yellow-400 fill-current"
                            : "text-white/20"
                        }
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-white/80">
                    {ratingLabels[formData.overallRating]}
                  </span>
                </div>
              </div>

              {/* Specific Ratings */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-3">
                  Detailed Ratings
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {specificRatingCategories.map((category) => (
                    <div key={category.key} className="space-y-2">
                      <div>
                        <div className="text-sm font-medium text-white/80">
                          {category.label}
                        </div>
                        <div className="text-xs text-white/60">
                          {category.description}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                ratings: {
                                  ...prev.ratings,
                                  [category.key]: rating,
                                },
                              }))
                            }
                            className="text-lg transition-colors"
                          >
                            <Star
                              className={
                                rating <= formData.ratings[category.key]
                                  ? "text-yellow-400 fill-current"
                                  : "text-white/20"
                              }
                            />
                          </button>
                        ))}
                        <span className="ml-2 text-xs text-white/60">
                          {ratingLabels[formData.ratings[category.key]]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendation Score */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  How likely are you to recommend this platform to other investors? *
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={formData.recommendationScore}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        recommendationScore: parseInt(e.target.value),
                      }))
                    }
                    className="flex-1"
                  />
                  <span className="text-white font-medium">
                    {formData.recommendationScore}/10
                  </span>
                </div>
                <div className="flex justify-between text-xs text-white/60 mt-1">
                  <span>Not likely</span>
                  <span>Very likely</span>
                </div>
              </div>

              {/* Most Used Features */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Most Used Investment Features
                </label>
                <div className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white/[0.05] border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
                    placeholder="e.g., Deal Pipeline, Analytics Dashboard, etc."
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addFeature())
                    }
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-3 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.mostUsedFeatures.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-white/20 text-white/90"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(feature)}
                        className="ml-2 text-white/60 hover:text-white/90"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Suggested Improvements */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Suggested Improvements
                </label>
                <div className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={newImprovement}
                    onChange={(e) => setNewImprovement(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white/[0.05] border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
                    placeholder="Suggest an improvement for the investment platform"
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), addImprovement())
                    }
                  />
                  <button
                    type="button"
                    onClick={addImprovement}
                    className="px-3 py-2 bg-white/10 text-white rounded-lg hover:bg-white/30"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.suggestedImprovements.map((improvement, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-white/20 text-white/90"
                    >
                      {improvement}
                      <button
                        type="button"
                        onClick={() => removeImprovement(improvement)}
                        className="ml-2 text-white/60 hover:text-white/90"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Bug Report Fields */}
              {formData.category === "bug_report" && (
                <div className="space-y-4 p-4 bg-white/10 rounded-lg border">
                  <h3 className="text-lg font-medium text-white/70">
                    Bug Report Details
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Steps to Reproduce
                    </label>
                    <textarea
                      value={formData.stepsToReproduce}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          stepsToReproduce: e.target.value,
                        }))
                      }
                      rows={3}
                      className="w-full px-3 py-2 bg-white/[0.05] border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
                      placeholder="1. Go to... 2. Click on... 3. See error"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Expected Behavior
                    </label>
                    <textarea
                      value={formData.expectedBehavior}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          expectedBehavior: e.target.value,
                        }))
                      }
                      rows={2}
                      className="w-full px-3 py-2 bg-white/[0.05] border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
                      placeholder="What should have happened?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Actual Behavior
                    </label>
                    <textarea
                      value={formData.actualBehavior}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          actualBehavior: e.target.value,
                        }))
                      }
                      rows={2}
                      className="w-full px-3 py-2 bg-white/[0.05] border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
                      placeholder="What actually happened?"
                    />
                  </div>
                </div>
              )}

              {/* Feature Request Fields */}
              {formData.category === "feature_request" && (
                <div className="space-y-4 p-4 bg-white/10 rounded-lg border">
                  <h3 className="text-lg font-medium text-white/70">
                    Feature Request Details
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Feature Description
                    </label>
                    <textarea
                      value={formData.featureDescription}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          featureDescription: e.target.value,
                        }))
                      }
                      rows={3}
                      className="w-full px-3 py-2 bg-white/[0.05] border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
                      placeholder="Describe the feature you'd like to see in the investment platform..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Priority Level
                    </label>
                    <select
                      value={formData.featurePriority}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          featurePriority: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 bg-white/[0.05] border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
                    >
                      <option value="low">Low - Nice to have</option>
                      <option value="medium">Medium - Would be useful</option>
                      <option value="high">High - Important for my workflow</option>
                      <option value="critical">Critical - Essential feature</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Contact Follow-up */}
              <div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="contactFollowUp"
                    checked={formData.contactForFollowUp}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        contactForFollowUp: e.target.checked,
                      }))
                    }
                    className="rounded"
                  />
                  <label htmlFor="contactFollowUp" className="text-sm text-white/80">
                    I'm open to being contacted for follow-up questions
                  </label>
                </div>

                {formData.contactForFollowUp && (
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Preferred Contact Method
                    </label>
                    <select
                      value={formData.preferredContactMethod}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          preferredContactMethod: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 bg-white/[0.05] border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="in_app">In-app notification</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 border border-white/20 rounded-lg text-white/80 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    submitting ||
                    formData.title.trim().length < 5 ||
                    formData.description.trim().length < 10
                  }
                  className="px-6 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 disabled:opacity-50 flex items-center space-x-2"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Submit Feedback</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestorAppFeedbackPage;