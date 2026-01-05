import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { investorAPI } from "../services/api";
import {
  FaArrowLeft,
  FaLightbulb,
  FaStar,
  FaHeart,
  FaHeartBroken,
  FaSpinner,
  FaUser,
  FaCalendarAlt,
  FaTag,
  FaTrash,
  FaCalendar,
  FaChartLine,
  FaDownload,
  FaCheckCircle,
  FaExclamationTriangle,
  FaBullseye,
  FaRocket,
  FaMoneyBill,
  FaDollarSign,
  FaCogs,
  FaLeaf,
  FaPaperclip,
  FaFileAlt,
  FaExternalLinkAlt,
} from "react-icons/fa";

const IdeaDetailPage = () => {
  const { ideaId, id } = useParams(); // Support both ideaId and id params
  const navigate = useNavigate();
  const { user, getRoleDashboardUrl } = useAuth();

  const currentId = id || ideaId; // Use whichever param is available
  const isAdminView =
    user?.role === "admin" && window.location.pathname.includes("/admin/idea/");

  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInterested, setIsInterested] = useState(false);

  const token = localStorage.getItem("token");
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

  const getDashboardUrl = () => {
    if (isAdminView) return "/admin/dashboard?section=ideas";
    if (user?.role === "entrepreneur") return "/entrepreneur/my-ideas";
    if (user?.role === "investor") return "/investor/dashboard";
    return user ? getRoleDashboardUrl(user) : "/";
  };

  useEffect(() => {
    loadIdea();
  }, [currentId]);

  const loadIdea = async () => {
    try {
      setLoading(true);
      setError(null);

      let ideaData;
      if (isAdminView) {
        // Admin API call
        const res = await fetch(`${API_BASE}/api/admin/ideas/${currentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch idea");
        ideaData = await res.json();
      } else {
        // Investor API call
        ideaData = await investorAPI.getIdeaById(currentId);
      }

      setIdea(ideaData);

      // Check if user has shown interest (only for investors)
      if (user?.role === "investor" && !isAdminView) {
        try {
          const interestedIdeas = await investorAPI.getInterestedIdeas();
          setIsInterested(
            interestedIdeas.some((interested) => interested._id === currentId)
          );
        } catch (err) {
          console.error("Error checking interest status:", err);
        }
      }
    } catch (err) {
      console.error("Error loading idea:", err);
      setError("Failed to load idea details");
    } finally {
      setLoading(false);
    }
  };

  const handleInterest = async () => {
    if (user?.role !== "investor") return;

    try {
      setActionLoading(true);

      if (isInterested) {
        await investorAPI.removeInterest(currentId);
        setIsInterested(false);
      } else {
        await investorAPI.markInterest(currentId);
        setIsInterested(true);
      }
    } catch (err) {
      console.error("Error updating interest:", err);
      setError("Failed to update interest");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isAdminView) return;
    if (!window.confirm("Are you sure you want to delete this idea?")) return;

    try {
      setActionLoading(true);
      const res = await fetch(`${API_BASE}/api/admin/ideas/${currentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to delete idea");
      }

      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Error deleting idea:", err);
      setError("Failed to delete idea");
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="w-8 h-8 text-white animate-spin mx-auto mb-4" />
          <p className="text-white font-manrope">Loading idea details...</p>
        </div>
      </div>
    );
  }

  if (error || !idea) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-white font-manrope mb-4">
            {error || "Idea not found"}
          </p>
          <button
            onClick={() => navigate(getDashboardUrl())}
            className="btn bg-white text-black hover:bg-gray-100 rounded-lg px-6 py-2 font-manrope"
          >
            {user?.role === "entrepreneur"
              ? "Back to My Ideas"
              : "Back to Dashboard"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <FaArrowLeft className="w-4 h-4" />
              <span className="font-manrope">
                {isAdminView
                  ? "Back to All Ideas"
                  : user?.role === "entrepreneur"
                  ? "Back to My Ideas"
                  : "Back to Dashboard"}
              </span>
            </button>

            {isAdminView ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDelete}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {actionLoading ? (
                    <FaSpinner className="w-4 h-4 animate-spin" />
                  ) : (
                    <FaTrash className="w-4 h-4" />
                  )}
                  Delete Idea
                </button>
              </div>
            ) : user?.role === "investor" ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleInterest}
                  disabled={actionLoading}
                  className={`btn rounded-lg px-6 py-2 font-manrope font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 ${
                    isInterested
                      ? "bg-white/20 hover:bg-white/30 text-white"
                      : "bg-white/20 hover:bg-white/30 text-white"
                  }`}
                >
                  {actionLoading ? (
                    <FaSpinner className="w-4 h-4 animate-spin" />
                  ) : isInterested ? (
                    <FaHeartBroken className="w-4 h-4" />
                  ) : (
                    <FaHeart className="w-4 h-4" />
                  )}
                  {isInterested ? "Remove Interest" : "Show Interest"}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Idea Header */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-manrope font-bold text-white mb-4">
                  {idea.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center gap-1 text-white/90">
                    <FaTag className="w-4 h-4" />
                    <span className="font-manrope">{idea.category}</span>
                  </div>
                  <div className="flex items-center gap-1 text-white/90">
                    <FaUser className="w-4 h-4" />
                    <span className="font-manrope">
                      {idea.owner?.name || "Anonymous"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <FaCalendar className="w-4 h-4" />
                    <span className="font-manrope">
                      {formatDate(idea.createdAt)}
                    </span>
                  </div>
                  {idea.analysis?.score && (
                    <div className="flex items-center gap-1 text-white/70">
                      <FaStar className="w-4 h-4" />
                      <span className="font-manrope font-semibold">
                        Score: {idea.analysis.score}%
                      </span>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium font-manrope ${
                      idea.status === "analyzed"
                        ? "bg-white/20 text-white/90"
                        : idea.status === "submitted"
                        ? "bg-white/20 text-white/70"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {idea.status.charAt(0).toUpperCase() + idea.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-white/80 font-manrope text-lg leading-relaxed">
              {idea.description}
            </p>
          </div>
        </div>

        {/* Elevator Pitch */}
        {idea.elevatorPitch && (
          <div className="bg-gradient-to-br from-white/900/20 via-white/20 to-white/20 backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-white/[0.05] rounded-2xl pointer-events-none"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-manrope font-bold text-white mb-4 flex items-center gap-2">
                <FaBullseye className="w-6 h-6 text-white/90" />
                Elevator Pitch
              </h2>
              <p className="text-white/90 font-manrope text-lg leading-relaxed italic">
                "{idea.elevatorPitch}"
              </p>
            </div>
          </div>
        )}

        {/* Basic Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Target Audience */}
          {idea.targetAudience && (
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>
              <div className="relative z-10">
                <h3 className="text-xl font-manrope font-bold text-white mb-3 flex items-center gap-2">
                  <FaUser className="w-5 h-5 text-white/90" />
                  Target Audience
                </h3>
                <p className="text-white/80 font-manrope leading-relaxed">
                  {idea.targetAudience}
                </p>
              </div>
            </div>
          )}

          {/* Funding Status */}
          {idea.fundingStatus && (
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>
              <div className="relative z-10">
                <h3 className="text-xl font-manrope font-bold text-white mb-3 flex items-center gap-2">
                  <FaMoneyBill className="w-5 h-5 text-white/70" />
                  Funding Status
                </h3>
                <span
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium font-manrope ${
                    idea.fundingStatus === "funded"
                      ? "bg-white/20 text-white/90"
                      : idea.fundingStatus === "seeking"
                      ? "bg-white/20 text-white/90"
                      : idea.fundingStatus === "rejected"
                      ? "bg-white/20 text-white/80"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {idea.fundingStatus
                    .replace("_", " ")
                    .charAt(0)
                    .toUpperCase() +
                    idea.fundingStatus.replace("_", " ").slice(1)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Problem & Solution Section */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-manrope font-bold text-white mb-6 flex items-center gap-2">
              <FaLightbulb className="w-6 h-6 text-white/70" />
              Problem & Solution
            </h2>

            <div className="space-y-6">
              {idea.problemStatement && (
                <div>
                  <h3 className="text-lg font-manrope font-semibold text-white/80 mb-2">
                    Problem Statement
                  </h3>
                  <p className="text-white/80 font-manrope leading-relaxed">
                    {idea.problemStatement}
                  </p>
                </div>
              )}

              {idea.solution && (
                <div>
                  <h3 className="text-lg font-manrope font-semibold text-white/90 mb-2">
                    Our Solution
                  </h3>
                  <p className="text-white/80 font-manrope leading-relaxed">
                    {idea.solution}
                  </p>
                </div>
              )}

              {idea.competitors && (
                <div>
                  <h3 className="text-lg font-manrope font-semibold text-white/80 mb-2">
                    Competitive Landscape
                  </h3>
                  <p className="text-white/80 font-manrope leading-relaxed">
                    {idea.competitors}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Business Model Section */}
        {(idea.revenueStreams ||
          idea.pricingStrategy ||
          idea.keyPartnerships) && (
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-manrope font-bold text-white mb-6 flex items-center gap-2">
                <FaMoneyBill className="w-6 h-6 text-white/90" />
                Business Model
              </h2>

              <div className="space-y-6">
                {idea.revenueStreams && (
                  <div>
                    <h3 className="text-lg font-manrope font-semibold text-white/90 mb-2">
                      Revenue Streams
                    </h3>
                    <p className="text-white/80 font-manrope leading-relaxed">
                      {idea.revenueStreams}
                    </p>
                  </div>
                )}

                {idea.pricingStrategy && (
                  <div>
                    <h3 className="text-lg font-manrope font-semibold text-white/90 mb-2">
                      Pricing Strategy
                    </h3>
                    <p className="text-white/80 font-manrope leading-relaxed">
                      {idea.pricingStrategy}
                    </p>
                  </div>
                )}

                {idea.keyPartnerships && (
                  <div>
                    <h3 className="text-lg font-manrope font-semibold text-white/90 mb-2">
                      Key Partnerships
                    </h3>
                    <p className="text-white/80 font-manrope leading-relaxed">
                      {idea.keyPartnerships}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Market & Growth Section */}
        {(idea.marketSize ||
          idea.goToMarketStrategy ||
          idea.scalabilityPlan) && (
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-manrope font-bold text-white mb-6 flex items-center gap-2">
                <FaChartLine className="w-6 h-6 text-white/90" />
                Market & Growth Strategy
              </h2>

              <div className="space-y-6">
                {idea.marketSize && (
                  <div>
                    <h3 className="text-lg font-manrope font-semibold text-white/90 mb-2">
                      Market Size & Opportunity
                    </h3>
                    <p className="text-white/80 font-manrope leading-relaxed">
                      {idea.marketSize}
                    </p>
                  </div>
                )}

                {idea.goToMarketStrategy && (
                  <div>
                    <h3 className="text-lg font-manrope font-semibold text-white/90 mb-2">
                      Go-to-Market Strategy
                    </h3>
                    <p className="text-white/80 font-manrope leading-relaxed">
                      {idea.goToMarketStrategy}
                    </p>
                  </div>
                )}

                {idea.scalabilityPlan && (
                  <div>
                    <h3 className="text-lg font-manrope font-semibold text-white/90 mb-2">
                      Scalability Plan
                    </h3>
                    <p className="text-white/80 font-manrope leading-relaxed">
                      {idea.scalabilityPlan}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Technical Requirements Section */}
        {(idea.technologyStack ||
          idea.developmentRoadmap ||
          idea.challengesAnticipated) && (
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-manrope font-bold text-white mb-6 flex items-center gap-2">
                <FaCogs className="w-6 h-6 text-white/90" />
                Technical Details
              </h2>

              <div className="space-y-6">
                {idea.technologyStack && (
                  <div>
                    <h3 className="text-lg font-manrope font-semibold text-white/90 mb-2">
                      Technology Stack
                    </h3>
                    <p className="text-white/80 font-manrope leading-relaxed">
                      {idea.technologyStack}
                    </p>
                  </div>
                )}

                {idea.developmentRoadmap && (
                  <div>
                    <h3 className="text-lg font-manrope font-semibold text-white/90 mb-2">
                      Development Roadmap
                    </h3>
                    <p className="text-white/80 font-manrope leading-relaxed">
                      {idea.developmentRoadmap}
                    </p>
                  </div>
                )}

                {idea.challengesAnticipated && (
                  <div>
                    <h3 className="text-lg font-manrope font-semibold text-white/80 mb-2">
                      Challenges & Mitigation
                    </h3>
                    <p className="text-white/80 font-manrope leading-relaxed">
                      {idea.challengesAnticipated}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Sustainability & Impact Section */}
        {(idea.ecoFriendlyPractices || idea.socialImpact) && (
          <div className="bg-gradient-to-br from-white/20 via-white/20 to-white/20 backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-white/[0.05] rounded-2xl pointer-events-none"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-manrope font-bold text-white mb-6 flex items-center gap-2">
                <FaLeaf className="w-6 h-6 text-white/90" />
                Sustainability & Social Impact
              </h2>

              <div className="space-y-6">
                {idea.ecoFriendlyPractices && (
                  <div>
                    <h3 className="text-lg font-manrope font-semibold text-white/90 mb-2">
                      Environmental Practices
                    </h3>
                    <p className="text-white/80 font-manrope leading-relaxed">
                      {idea.ecoFriendlyPractices}
                    </p>
                  </div>
                )}

                {idea.socialImpact && (
                  <div>
                    <h3 className="text-lg font-manrope font-semibold text-white/90 mb-2">
                      Social Impact
                    </h3>
                    <p className="text-white/80 font-manrope leading-relaxed">
                      {idea.socialImpact}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Funding & Investment Section */}
        {(idea.fundingRequirements || idea.useOfFunds || idea.equityOffer) && (
          <div className="bg-gradient-to-br from-white/20 via-white/20 to-white/20 backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-white/[0.05] rounded-2xl pointer-events-none"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-manrope font-bold text-white mb-6 flex items-center gap-2">
                <FaDollarSign className="w-6 h-6 text-white/70" />
                Funding & Investment
              </h2>

              <div className="space-y-6">
                {idea.fundingRequirements && (
                  <div>
                    <h3 className="text-lg font-manrope font-semibold text-white/70 mb-2">
                      Funding Requirements
                    </h3>
                    <p className="text-white/80 font-manrope leading-relaxed">
                      {idea.fundingRequirements}
                    </p>
                  </div>
                )}

                {idea.useOfFunds && (
                  <div>
                    <h3 className="text-lg font-manrope font-semibold text-white/80 mb-2">
                      Use of Funds
                    </h3>
                    <p className="text-white/80 font-manrope leading-relaxed">
                      {idea.useOfFunds}
                    </p>
                  </div>
                )}

                {idea.equityOffer && (
                  <div>
                    <h3 className="text-lg font-manrope font-semibold text-white/90 mb-2">
                      Equity Offer
                    </h3>
                    <p className="text-white/80 font-manrope leading-relaxed">
                      {idea.equityOffer}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Attachments Section */}
        {idea.attachments && idea.attachments.length > 0 && (
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-manrope font-bold text-white mb-6 flex items-center gap-2">
                <FaPaperclip className="w-6 h-6 text-gray-400" />
                Attachments ({idea.attachments.length})
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {idea.attachments.map((attachment, index) => (
                  <a
                    key={index}
                    href={attachment.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/10 rounded-lg hover:bg-white/[0.05] transition-colors"
                  >
                    <FaFileAlt className="w-5 h-5 text-white/90" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-manrope font-medium truncate">
                        {attachment.originalname}
                      </p>
                      <p className="text-white/60 text-sm font-manrope">
                        {(attachment.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <FaExternalLinkAlt className="w-4 h-4 text-white/40" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Analysis Section */}
        {idea.analysis && (
          <div className="grid gap-8 mb-8">
            {/* SWOT Analysis */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>

              <div className="relative z-10">
                <h2 className="text-2xl font-manrope font-bold text-white mb-6 flex items-center gap-2">
                  <FaChartLine className="w-6 h-6" />
                  SWOT Analysis
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {idea.analysis.swot?.strengths && (
                    <div className="bg-white/[0.02] border border-white/20 rounded-lg p-6">
                      <h3 className="text-white/90 font-manrope font-semibold text-lg mb-3 flex items-center gap-2">
                        <FaCheckCircle className="w-5 h-5" />
                        Strengths
                      </h3>
                      <p className="text-white/80 font-manrope leading-relaxed">
                        {idea.analysis.swot.strengths}
                      </p>
                    </div>
                  )}

                  {idea.analysis.swot?.weaknesses && (
                    <div className="bg-white/[0.02] border border-white/20 rounded-lg p-6">
                      <h3 className="text-white/80 font-manrope font-semibold text-lg mb-3 flex items-center gap-2">
                        <FaExclamationTriangle className="w-5 h-5" />
                        Weaknesses
                      </h3>
                      <p className="text-white/80 font-manrope leading-relaxed">
                        {idea.analysis.swot.weaknesses}
                      </p>
                    </div>
                  )}

                  {idea.analysis.swot?.opportunities && (
                    <div className="bg-white/[0.02] border border-white/20 rounded-lg p-6">
                      <h3 className="text-white/90 font-manrope font-semibold text-lg mb-3 flex items-center gap-2">
                        <FaBullseye className="w-5 h-5" />
                        Opportunities
                      </h3>
                      <p className="text-white/80 font-manrope leading-relaxed">
                        {idea.analysis.swot.opportunities}
                      </p>
                    </div>
                  )}

                  {idea.analysis.swot?.threats && (
                    <div className="bg-white/[0.02] border border-white/20 rounded-lg p-6">
                      <h3 className="text-white/80 font-manrope font-semibold text-lg mb-3 flex items-center gap-2">
                        <FaExclamationTriangle className="w-5 h-5" />
                        Threats
                      </h3>
                      <p className="text-white/80 font-manrope leading-relaxed">
                        {idea.analysis.swot.threats}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Roadmap */}
            {idea.analysis.roadmap && idea.analysis.roadmap.length > 0 && (
              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>

                <div className="relative z-10">
                  <h2 className="text-2xl font-manrope font-bold text-white mb-6 flex items-center gap-2">
                    <FaRocket className="w-6 h-6" />
                    Development Roadmap
                  </h2>

                  <div className="space-y-4">
                    {idea.analysis.roadmap.map((step, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-4 bg-white/[0.02] border border-white/10 rounded-lg"
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white font-manrope font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-white/80 font-manrope leading-relaxed">
                            {step}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Trends Chart */}
            {idea.analysis.trends && idea.analysis.trends.length > 0 && (
              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>

                <div className="relative z-10">
                  <h2 className="text-2xl font-manrope font-bold text-white mb-6 flex items-center gap-2">
                    <FaChartLine className="w-6 h-6" />
                    Market Trends
                  </h2>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {idea.analysis.trends.map((trend, index) => (
                      <div
                        key={index}
                        className="text-center p-4 bg-white/[0.02] border border-white/10 rounded-lg"
                      >
                        <div className="text-2xl font-manrope font-bold text-white mb-1">
                          {trend.year}
                        </div>
                        <div className="text-white/90 font-manrope font-semibold">
                          {trend.popularity}%
                        </div>
                        <div className="text-white/60 text-sm font-manrope">
                          Popularity
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default IdeaDetailPage;
