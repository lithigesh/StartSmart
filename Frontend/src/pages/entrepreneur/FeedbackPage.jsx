// pages/entrepreneur/FeedbackPage.jsx
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../hooks/useNotifications";
import { appFeedbackAPI } from "../../services/api";
import { FaComment, FaPaperPlane, FaStar, FaCheckCircle } from "react-icons/fa";

const FeedbackPage = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    overallRating: 0,
    recommendationScore: 0,
    category: "general",
  });
  const [submitting, setSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [hoveredRecommendation, setHoveredRecommendation] = useState(0);

  const categories = [
    { value: "general", label: "General Feedback" },
    { value: "bug_report", label: "Bug Report" },
    { value: "feature_request", label: "Feature Request" },
    { value: "ui_ux", label: "UI/UX Feedback" },
    { value: "performance", label: "Performance" },
    { value: "security", label: "Security" },
    { value: "other", label: "Other" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      addNotification("Please enter a title", "error");
      return;
    }

    if (!formData.description.trim()) {
      addNotification("Please enter your feedback", "error");
      return;
    }

    if (formData.description.trim().length < 10) {
      addNotification(
        "Feedback description must be at least 10 characters long",
        "error"
      );
      return;
    }

    if (formData.overallRating === 0) {
      addNotification("Please select an overall rating", "error");
      return;
    }

    if (formData.recommendationScore === 0) {
      addNotification("Please select a recommendation score", "error");
      return;
    }

    try {
      setSubmitting(true);
      const result = await appFeedbackAPI.submitFeedback(formData);

      // Handle successful submission
      addNotification("Thank you for your feedback!", "success");
      setFormData({
        title: "",
        description: "",
        overallRating: 0,
        recommendationScore: 0,
        category: "general",
      });
    } catch (err) {
      console.error("Error submitting feedback:", err);
      addNotification(
        err.message || "Failed to submit feedback. Please try again.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" key="feedback-page">
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-manrope font-bold text-white mb-2">
            App Feedback
          </h2>
          <p className="text-white/60 font-manrope">
            Share your thoughts and help us improve StartSmart
          </p>
        </div>

        {/* Feedback Form */}
        <div
          className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden animate-slide-up"
          style={{ animationDelay: "0ms" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <FaComment className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-manrope font-semibold text-white">
                  Share Your Feedback
                </h3>
                <p className="text-white/60 text-sm font-manrope">
                  We value your input
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-white font-manrope font-medium mb-3">
                  Title <span className="text-white/80">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Brief summary of your feedback"
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors duration-200 font-manrope"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-white font-manrope font-medium mb-3">
                  Feedback Category <span className="text-white/80">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, category: cat.value })
                      }
                      className={`px-4 py-3 rounded-lg border transition-all duration-200 font-manrope font-medium ${
                        formData.category === cat.value
                          ? "bg-white/20 border-white/30 text-white"
                          : "bg-white/[0.03] border-white/10 text-white/70 hover:bg-white/[0.05] hover:border-white/20"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-white font-manrope font-medium mb-3">
                  Your Feedback <span className="text-white/80">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={6}
                  placeholder="Tell us what you think in detail..."
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors duration-200 font-manrope resize-none"
                />
              </div>

              {/* Overall Rating */}
              <div>
                <label className="block text-white font-manrope font-medium mb-3">
                  Overall Experience Rating{" "}
                  <span className="text-white/80">*</span>
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, overallRating: star })
                      }
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-all duration-200 hover:scale-110"
                    >
                      <FaStar
                        className={`w-10 h-10 transition-colors duration-200 ${
                          star <= (hoveredRating || formData.overallRating)
                            ? "text-white/70"
                            : "text-white/20"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Recommendation Score */}
              <div>
                <label className="block text-white font-manrope font-medium mb-3">
                  How likely are you to recommend StartSmart?{" "}
                  <span className="text-white/80">*</span>
                </label>
                <div className="flex gap-2 flex-wrap">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                    <button
                      key={score}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, recommendationScore: score })
                      }
                      onMouseEnter={() => setHoveredRecommendation(score)}
                      onMouseLeave={() => setHoveredRecommendation(0)}
                      className={`w-12 h-12 rounded-lg border transition-all duration-200 font-manrope font-semibold ${
                        score <=
                        (hoveredRecommendation || formData.recommendationScore)
                          ? score <= 6
                            ? "bg-white/20 border-white/30 text-white/80"
                            : score <= 8
                            ? "bg-white/20 border-white/30 text-white/70"
                            : "bg-white/20 border-white/30 text-white/90"
                          : "bg-white/[0.03] border-white/10 text-white/70"
                      } hover:scale-110`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
                <p className="text-white/50 text-xs mt-2 font-manrope">
                  1 = Not likely at all • 10 = Extremely likely
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full px-6 py-4 bg-white text-black hover:bg-white/90 rounded-lg transition-all duration-200 font-manrope font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="w-4 h-4" />
                    <span>Submit Feedback</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div
            className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden animate-slide-up"
            style={{ animationDelay: "100ms" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                <FaCheckCircle className="w-6 h-6 text-white/90" />
              </div>
              <h4 className="text-white font-manrope font-semibold text-lg mb-2">
                We Listen
              </h4>
              <p className="text-white/60 text-sm font-manrope">
                Every piece of feedback is reviewed by our team
              </p>
            </div>
          </div>

          <div
            className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden animate-slide-up"
            style={{ animationDelay: "200ms" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                <FaCheckCircle className="w-6 h-6 text-white/90" />
              </div>
              <h4 className="text-white font-manrope font-semibold text-lg mb-2">
                We Improve
              </h4>
              <p className="text-white/60 text-sm font-manrope">
                Your suggestions help shape our platform's future
              </p>
            </div>
          </div>

          <div
            className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden animate-slide-up"
            style={{ animationDelay: "300ms" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                <FaCheckCircle className="w-6 h-6 text-white/90" />
              </div>
              <h4 className="text-white font-manrope font-semibold text-lg mb-2">
                We Respond
              </h4>
              <p className="text-white/60 text-sm font-manrope">
                Get updates on how we're addressing your feedback
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
