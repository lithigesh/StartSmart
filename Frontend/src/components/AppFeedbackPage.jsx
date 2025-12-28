// components/AppFeedbackPage.jsx
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
} from "lucide-react";

const AppFeedbackPage = () => {
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
  });

  const [newFeature, setNewFeature] = useState("");
  const [newImprovement, setNewImprovement] = useState("");

  const categories = [
    {
      value: "general",
      label: "General Feedback",
      icon: MessageSquare,
      color: "text-white/90",
    },
    {
      value: "bug_report",
      label: "Bug Report",
      icon: Bug,
      color: "text-white/80",
    },
    {
      value: "feature_request",
      label: "Feature Request",
      icon: Lightbulb,
      color: "text-white/70",
    },
    { value: "ui_ux", label: "UI/UX", icon: Monitor, color: "text-white/90" },
    {
      value: "performance",
      label: "Performance",
      icon: CheckCircle,
      color: "text-white/90",
    },
    {
      value: "security",
      label: "Security",
      icon: AlertCircle,
      color: "text-white/80",
    },
  ];

  const frequencyOptions = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "rarely", label: "Rarely" },
    { value: "first_time", label: "First Time" },
  ];

  useEffect(() => {
    fetchFeedback();
    fetchStats();
    detectBrowserInfo();
  }, []);

  const detectBrowserInfo = () => {
    const userAgent = navigator.userAgent;
    let browserName = "Unknown";
    let browserVersion = "Unknown";
    let os = "Unknown";

    // Detect browser
    if (userAgent.indexOf("Chrome") > -1) {
      browserName = "Chrome";
      browserVersion = userAgent.match(/Chrome\/([0-9.]+)/)?.[1] || "Unknown";
    } else if (userAgent.indexOf("Firefox") > -1) {
      browserName = "Firefox";
      browserVersion = userAgent.match(/Firefox\/([0-9.]+)/)?.[1] || "Unknown";
    } else if (userAgent.indexOf("Safari") > -1) {
      browserName = "Safari";
      browserVersion = userAgent.match(/Version\/([0-9.]+)/)?.[1] || "Unknown";
    }

    // Detect OS
    if (userAgent.indexOf("Windows") > -1) os = "Windows";
    else if (userAgent.indexOf("Mac") > -1) os = "macOS";
    else if (userAgent.indexOf("Linux") > -1) os = "Linux";

    // Detect device type
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent
      );
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
        alert("Feedback submitted successfully!");
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
        suggestedImprovements: [
          ...prev.suggestedImprovements,
          newImprovement.trim(),
        ],
      }));
      setNewImprovement("");
    }
  };

  const removeImprovement = (improvement) => {
    setFormData((prev) => ({
      ...prev,
      suggestedImprovements: prev.suggestedImprovements.filter(
        (i) => i !== improvement
      ),
    }));
  };

  const renderStars = (rating, setRating = null, readonly = false) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={20}
            className={`${
              star <= rating ? "text-white/70 fill-current" : "text-gray-300"
            } ${
              !readonly && setRating ? "cursor-pointer hover:text-white/70" : ""
            }`}
            onClick={() => !readonly && setRating && setRating(star)}
          />
        ))}
      </div>
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "text-white/90 bg-white";
      case "in_review":
        return "text-white/70 bg-white";
      case "in_progress":
        return "text-white/90 bg-white";
      case "resolved":
        return "text-white/90 bg-white";
      case "closed":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getCategoryIcon = (category) => {
    const categoryData = categories.find((cat) => cat.value === category);
    const IconComponent = categoryData?.icon || MessageSquare;
    return (
      <IconComponent
        size={16}
        className={categoryData?.color || "text-gray-500"}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            App Feedback
          </h1>
          <p className="text-gray-600">
            Help us improve StartSmart by sharing your feedback and suggestions
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Feedback
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalFeedback || 0}
                  </p>
                </div>
                <MessageSquare className="h-8 w-8 text-white/90" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Average Rating
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.averageRating
                      ? stats.averageRating.toFixed(1)
                      : "0.0"}
                    /5
                  </p>
                </div>
                <Star className="h-8 w-8 text-white/70" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Recommendation
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.averageRecommendation
                      ? stats.averageRecommendation.toFixed(1)
                      : "0.0"}
                    /10
                  </p>
                </div>
                <ThumbsUp className="h-8 w-8 text-white/90" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <button
                onClick={() => setShowForm(true)}
                className="w-full h-full flex flex-col items-center justify-center text-white/90 hover:text-white/90 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Plus className="h-8 w-8 mb-2" />
                <span className="font-medium">New Feedback</span>
              </button>
            </div>
          </div>
        )}

        {/* Feedback List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Your Feedback History
            </h2>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading feedback...</p>
              </div>
            ) : feedback.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No feedback yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Start by sharing your thoughts about the app
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
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {getCategoryIcon(item.category)}
                          <h3 className="font-medium text-gray-900">
                            {item.title}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              item.status
                            )}`}
                          >
                            {item.status.replace("_", " ").toUpperCase()}
                          </span>
                        </div>

                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {item.description}
                        </p>

                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            {renderStars(item.overallRating, null, true)}
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

                        {item.adminResponse && item.adminResponse.response && (
                          <div className="mt-3 p-3 bg-white/10 rounded-lg border-l-4 border-white">
                            <p className="text-sm font-medium text-white/90">
                              Admin Response:
                            </p>
                            <p className="text-sm text-white/90 mt-1">
                              {item.adminResponse.response}
                            </p>
                            <p className="text-xs text-white/90 mt-2">
                              Responded on{" "}
                              {new Date(
                                item.adminResponse.respondedAt
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feedback Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Submit App Feedback
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Feedback Category *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
                        className={`p-3 rounded-lg border-2 transition-colors flex items-center space-x-2 ${
                          formData.category === category.value
                            ? "border-white bg-white/10 text-white/90"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <IconComponent size={18} className={category.color} />
                        <span className="text-sm font-medium">
                          {category.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    formData.title.trim().length > 0 &&
                    formData.title.trim().length < 5
                      ? "border-white focus:ring-white"
                      : "border-gray-300 focus:ring-white"
                  }`}
                  placeholder="Brief summary of your feedback"
                  required
                />
                <div className="text-xs text-gray-500 mt-1">
                  {formData.title.length}/50 characters{" "}
                  {formData.title.trim().length < 5 &&
                    formData.title.trim().length > 0 &&
                    "(5 minimum)"}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    formData.description.trim().length > 0 &&
                    formData.description.trim().length < 10
                      ? "border-white focus:ring-white"
                      : "border-gray-300 focus:ring-white"
                  }`}
                  placeholder="Please provide detailed feedback..."
                  required
                />
                <div className="text-xs text-gray-500 mt-1">
                  {formData.description.length}/500 characters{" "}
                  {formData.description.trim().length < 10 &&
                    formData.description.trim().length > 0 &&
                    "(10 minimum)"}
                </div>
              </div>

              {/* Ratings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Overall Rating *
                  </label>
                  {renderStars(formData.overallRating, (rating) =>
                    setFormData((prev) => ({ ...prev, overallRating: rating }))
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recommendation Score * (0-10)
                  </label>
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
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Not likely</span>
                    <span className="font-medium">
                      {formData.recommendationScore}/10
                    </span>
                    <span>Very likely</span>
                  </div>
                </div>
              </div>

              {/* Specific Ratings */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Detailed Ratings
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(formData.ratings).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <p className="text-sm font-medium text-gray-700 mb-2 capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </p>
                      {renderStars(value, (rating) =>
                        setFormData((prev) => ({
                          ...prev,
                          ratings: { ...prev.ratings, [key]: rating },
                        }))
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Usage Frequency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How often do you use the app?
                </label>
                <select
                  value={formData.frequencyOfUse}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      frequencyOfUse: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                >
                  {frequencyOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Most Used Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Most Used Features
                </label>
                <div className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                    placeholder="Add a feature you use frequently"
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
                        className="ml-2 text-white/90 hover:text-white/90"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Suggested Improvements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Suggested Improvements
                </label>
                <div className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={newImprovement}
                    onChange={(e) => setNewImprovement(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                    placeholder="Suggest an improvement"
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
                        className="ml-2 text-white/90 hover:text-white/90"
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
                  <h3 className="text-lg font-medium text-white/80">
                    Bug Report Details
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                      placeholder="1. Click on...\n2. Navigate to...\n3. ..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                      placeholder="What should have happened?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                      placeholder="Describe the feature you'd like to see..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                    >
                      <option value="low">Low - Nice to have</option>
                      <option value="medium">Medium - Would be helpful</option>
                      <option value="high">High - Important</option>
                      <option value="critical">Critical - Essential</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Contact Preferences */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="contactForFollowUp"
                    checked={formData.contactForFollowUp}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        contactForFollowUp: e.target.checked,
                      }))
                    }
                    className="rounded border-gray-300 text-white/90 focus:ring-white"
                  />
                  <label
                    htmlFor="contactForFollowUp"
                    className="ml-2 text-sm text-gray-700"
                  >
                    I'm okay with being contacted for follow-up questions
                  </label>
                </div>

                {formData.contactForFollowUp && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
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
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
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

export default AppFeedbackPage;
