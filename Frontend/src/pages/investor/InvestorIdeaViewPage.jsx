import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { investorAPI } from "../../services/api";
import toast from "react-hot-toast";
import {
  FaArrowLeft,
  FaLightbulb,
  FaHeart,
  FaHeartBroken,
  FaSpinner,
  FaUser,
  FaCalendarAlt,
  FaTag,
  FaChartLine,
  FaCheckCircle,
  FaExclamationTriangle,
  FaBullseye,
  FaDollarSign,
  FaCogs,
  FaLeaf,
  FaFileAlt,
  FaClipboardList,
} from "react-icons/fa";

const InvestorIdeaViewPage = () => {
  const { ideaId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInterested, setIsInterested] = useState(false);

  const token = localStorage.getItem("token");
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

  useEffect(() => {
    loadIdea();
  }, [ideaId]);

  const loadIdea = async () => {
    try {
      setLoading(true);
      setError(null);

      // Investor API call
      let ideaData = await investorAPI.getIdeaById(ideaId);
      
      // Handle response wrapping if needed
      if (ideaData.data && !ideaData._id) {
        ideaData = ideaData.data;
      }
      
      console.log("Loaded idea data:", ideaData); // Debug log
      setIdea(ideaData);

      // Check if user has shown interest
      try {
        const interestedIdeas = await investorAPI.getInterestedIdeas();
        setIsInterested(
          interestedIdeas.some((interested) => interested._id === ideaId)
        );
      } catch (err) {
        console.error("Error checking interest status:", err);
      }
    } catch (err) {
      console.error("Error fetching idea:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkInterest = async () => {
    try {
      setActionLoading(true);
      if (isInterested) {
        // Remove interest
        await investorAPI.removeInterest(ideaId);
        setIsInterested(false);
        toast.success("Removed from your interested ideas");
      } else {
        // Mark interest
        await investorAPI.markInterest(ideaId);
        setIsInterested(true);
        toast.success("Added to your interested ideas");
      }
    } catch (err) {
      console.error("Error updating interest:", err);
      toast.error("Failed to update interest");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-4xl text-white/50" />
        </div>
      </div>
    );
  }

  if (error || !idea) {
    return (
      <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-white/70 hover:text-white transition-all"
          >
            <FaArrowLeft />
            Back
          </button>
          <div className="bg-white/30 border border-white/30 rounded-lg p-6 text-center">
            <p className="text-white/80 text-lg">{error || "Idea not found"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-8 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/10 rounded-lg transition-all text-white/70 hover:text-white"
          >
            <FaArrowLeft className="text-xl" />
          </button>
          <h1 className="text-3xl font-bold text-white">Idea Details</h1>
        </div>

        {/* Main Content Area */}
        <div className="space-y-8">
          {/* Hero Section - Full Width */}
          <div className="bg-gradient-to-br from-white/[0.06] via-white/[0.03] to-black border border-white/10 rounded-2xl p-8">
            <div className="mb-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-yellow-400/20 rounded-lg">
                  <FaLightbulb className="text-yellow-400 text-2xl" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {idea.title}
                  </h2>
                  <p className="text-white/70 text-lg leading-relaxed">
                    {idea.description}
                  </p>
                </div>
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap gap-6 text-sm mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center gap-2 text-white/60">
                  <FaCalendarAlt />
                  <span>{new Date(idea.createdAt).toLocaleDateString()}</span>
                </div>
                {idea.category && (
                  <div className="flex items-center gap-2 text-white/60">
                    <FaTag />
                    <span>{idea.category}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Call to Action Button */}
            <button
              onClick={handleMarkInterest}
              disabled={actionLoading}
              className={`w-full sm:w-auto px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all mt-6 ${
                isInterested
                  ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
                  : "bg-yellow-400/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-400/30"
              }`}
            >
              {actionLoading ? (
                <FaSpinner className="animate-spin" />
              ) : isInterested ? (
                <>
                  <FaHeartBroken />
                  Remove Interest
                </>
              ) : (
                <>
                  <FaHeart />
                  Mark Interest
                </>
              )}
            </button>
          </div>

          {/* Two Column Layout - Entrepreneur & Funding */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Entrepreneur Card */}
            {idea.owner && (
              <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <FaUser className="text-white/70" />
                  </div>
                  Entrepreneur
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-2">
                      Full Name
                    </p>
                    <p className="text-white font-semibold text-lg">
                      {idea.owner.name || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-2">
                      Email Address
                    </p>
                    <a
                      href={`mailto:${idea.owner.email}`}
                      className="text-yellow-400 hover:text-yellow-300 transition-colors font-medium break-all text-sm"
                    >
                      {idea.owner.email || "Not provided"}
                    </a>
                  </div>

                  {idea.owner.phone && (
                    <div>
                      <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-2">
                        Phone
                      </p>
                      <a
                        href={`tel:${idea.owner.phone}`}
                        className="text-yellow-400 hover:text-yellow-300 transition-colors font-medium"
                      >
                        {idea.owner.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Funding Target Card */}
            <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <FaDollarSign className="text-white/70" />
                </div>
                Funding Target
              </h3>
              {idea.fundingRequests && idea.fundingRequests.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-4xl font-bold text-yellow-400">
                    ${idea.fundingRequests[0].amount.toLocaleString()}
                  </p>
                  <div className="text-sm space-y-2">
                    <p className="text-white/60">
                      <span className="text-white font-semibold">Equity Offered:</span> {idea.fundingRequests[0].equity}%
                    </p>
                    <p className="text-white/60">
                      <span className="text-white font-semibold">Valuation:</span> ${idea.fundingRequests[0].valuation?.toLocaleString() || "TBD"}
                    </p>
                    <p className="text-white/60">
                      <span className="text-white font-semibold">Status:</span>{" "}
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          idea.fundingRequests[0].status === "accepted"
                            ? "bg-green-500/20 text-green-400"
                            : idea.fundingRequests[0].status === "negotiated"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {idea.fundingRequests[0].status.charAt(0).toUpperCase() + idea.fundingRequests[0].status.slice(1)}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/investor/deals")}
                    className="mt-4 w-full px-4 py-2 bg-yellow-400/20 text-yellow-400 border border-yellow-500/30 rounded-lg hover:bg-yellow-400/30 transition-all text-sm font-semibold"
                  >
                    View Details in Deal Management →
                  </button>
                </div>
              ) : (
                <p className="text-gray-400">
                  {idea.fundingRequirements && idea.fundingRequirements > 0
                    ? `$${parseInt(idea.fundingRequirements).toLocaleString()}`
                    : "Not specified"}
                </p>
              )}
            </div>
          </div>

          {/* Main Content Grid - Full Width Sections */}
          <div className="space-y-6">
            {/* Elevator Pitch */}
            {idea.elevatorPitch && (
              <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <FaBullseye className="text-white/60" />
                  Elevator Pitch
                </h2>
                <p className="text-white/80 text-lg italic leading-relaxed">
                  "{idea.elevatorPitch}"
                </p>
              </div>
            )}

            {/* Target Audience */}
            {idea.targetAudience && (
              <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <FaUser className="text-white/60" />
                  Target Audience
                </h2>
                <p className="text-white/80 text-lg leading-relaxed">
                  {idea.targetAudience}
                </p>
              </div>
            )}

            {/* Problem & Solution */}
            {(idea.problemStatement || idea.solution || idea.competitors) && (
              <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                  <FaLightbulb className="text-white/60" />
                  Problem & Solution
                </h2>
                <div className="space-y-6">
                  {idea.problemStatement && (
                    <div>
                      <h3 className="text-white font-semibold mb-3 text-lg">
                        Problem Statement
                      </h3>
                      <p className="text-white/80 leading-relaxed">
                        {idea.problemStatement}
                      </p>
                    </div>
                  )}
                  {idea.solution && (
                    <div className="pt-6 border-t border-white/10">
                      <h3 className="text-white font-semibold mb-3 text-lg">
                        Our Solution
                      </h3>
                      <p className="text-white/80 leading-relaxed">
                        {idea.solution}
                      </p>
                    </div>
                  )}
                  {idea.competitors && (
                    <div className="pt-6 border-t border-white/10">
                      <h3 className="text-white font-semibold mb-3 text-lg">
                        Competitive Landscape
                      </h3>
                      <p className="text-white/80 leading-relaxed">
                        {idea.competitors}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Business Model */}
            {(idea.revenueStreams ||
              idea.pricingStrategy ||
              idea.keyPartnerships) && (
              <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                  <FaCogs className="text-white/60" />
                  Business Model
                </h2>
                <div className="space-y-6">
                  {idea.revenueStreams && (
                    <div>
                      <h3 className="text-white font-semibold mb-3 text-lg">
                        Revenue Streams
                      </h3>
                      <p className="text-white/80 leading-relaxed">
                        {idea.revenueStreams}
                      </p>
                    </div>
                  )}
                  {idea.pricingStrategy && (
                    <div className="pt-6 border-t border-white/10">
                      <h3 className="text-white font-semibold mb-3 text-lg">
                        Pricing Strategy
                      </h3>
                      <p className="text-white/80 leading-relaxed">
                        {idea.pricingStrategy}
                      </p>
                    </div>
                  )}
                  {idea.keyPartnerships && (
                    <div className="pt-6 border-t border-white/10">
                      <h3 className="text-white font-semibold mb-3 text-lg">
                        Key Partnerships
                      </h3>
                      <p className="text-white/80 leading-relaxed">
                        {idea.keyPartnerships}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Market & Growth Strategy */}
            {(idea.marketSize ||
              idea.goToMarketStrategy ||
              idea.scalabilityPlan) && (
              <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                  <FaChartLine className="text-white/60" />
                  Market & Growth Strategy
                </h2>
                <div className="space-y-6">
                  {idea.marketSize && (
                    <div>
                      <h3 className="text-white font-semibold mb-3 text-lg">
                        Market Size & Opportunity
                      </h3>
                      <p className="text-white/80 leading-relaxed">
                        {idea.marketSize}
                      </p>
                    </div>
                  )}
                  {idea.goToMarketStrategy && (
                    <div className="pt-6 border-t border-white/10">
                      <h3 className="text-white font-semibold mb-3 text-lg">
                        Go-to-Market Strategy
                      </h3>
                      <p className="text-white/80 leading-relaxed">
                        {idea.goToMarketStrategy}
                      </p>
                    </div>
                  )}
                  {idea.scalabilityPlan && (
                    <div className="pt-6 border-t border-white/10">
                      <h3 className="text-white font-semibold mb-3 text-lg">
                        Scalability Plan
                      </h3>
                      <p className="text-white/80 leading-relaxed">
                        {idea.scalabilityPlan}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Technical Details */}
            {(idea.technologyStack || idea.challengesAnticipated) && (
              <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                  <FaCogs className="text-white/60" />
                  Technical Details
                </h2>
                <div className="space-y-6">
                  {idea.technologyStack && (
                    <div>
                      <h3 className="text-white font-semibold mb-3 text-lg">
                        Technology Stack
                      </h3>
                      <p className="text-white/80 leading-relaxed">
                        {idea.technologyStack}
                      </p>
                    </div>
                  )}
                  {idea.challengesAnticipated && (
                    <div className="pt-6 border-t border-white/10">
                      <h3 className="text-white font-semibold mb-3 text-lg">
                        Challenges & Mitigation
                      </h3>
                      <p className="text-white/80 leading-relaxed">
                        {idea.challengesAnticipated}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sustainability & Social Impact */}
            {(idea.ecoFriendlyPractices || idea.socialImpact) && (
              <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                  <FaLeaf className="text-white/60" />
                  Sustainability & Social Impact
                </h2>
                <div className="space-y-6">
                  {idea.ecoFriendlyPractices && (
                    <div>
                      <h3 className="text-white font-semibold mb-3 text-lg">
                        Environmental Practices
                      </h3>
                      <p className="text-white/80 leading-relaxed">
                        {idea.ecoFriendlyPractices}
                      </p>
                    </div>
                  )}
                  {idea.socialImpact && (
                    <div className="pt-6 border-t border-white/10">
                      <h3 className="text-white font-semibold mb-3 text-lg">
                        Social Impact
                      </h3>
                      <p className="text-white/80 leading-relaxed">
                        {idea.socialImpact}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Funding & Investment */}
            {(idea.fundingRequirements || idea.useOfFunds || idea.equityOffer) && (
              <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                  <FaDollarSign className="text-white/60" />
                  Funding & Investment
                </h2>
                <div className="space-y-6">
                  {idea.fundingRequirements && (
                    <div>
                      <h3 className="text-white font-semibold mb-3 text-lg">
                        Funding Requirements
                      </h3>
                      <p className="text-white/80 leading-relaxed">
                        {idea.fundingRequirements}
                      </p>
                    </div>
                  )}
                  {idea.useOfFunds && (
                    <div className="pt-6 border-t border-white/10">
                      <h3 className="text-white font-semibold mb-3 text-lg">
                        Use of Funds
                      </h3>
                      <p className="text-white/80 leading-relaxed">
                        {idea.useOfFunds}
                      </p>
                    </div>
                  )}
                  {idea.equityOffer && (
                    <div className="pt-6 border-t border-white/10">
                      <h3 className="text-white font-semibold mb-3 text-lg">
                        Equity Offer
                      </h3>
                      <p className="text-white/80 leading-relaxed">
                        {idea.equityOffer}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Funding Requests */}
            {idea.fundingRequests && idea.fundingRequests.length > 0 && (
              <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                  <FaClipboardList className="text-white/60" />
                  Funding Requests ({idea.fundingRequests.length})
                </h2>
                <div className="space-y-6">
                  {idea.fundingRequests.map((request, index) => (
                    <div
                      key={index}
                      className="bg-white/[0.05] border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all"
                    >
                      {/* Request Header */}
                      <div className="flex items-start justify-between mb-4 pb-4 border-b border-white/10">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-white font-semibold text-lg">
                              Request #{index + 1}
                            </h3>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                                request.status === "accepted"
                                  ? "bg-green-500/20 text-green-400"
                                  : request.status === "negotiated"
                                  ? "bg-blue-500/20 text-blue-400"
                                  : "bg-yellow-500/20 text-yellow-400"
                              }`}
                            >
                              {request.status}
                            </span>
                          </div>
                          <p className="text-white/60 text-sm">
                            Requested on{" "}
                            {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Funding Details Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        <div>
                          <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-1">
                            Amount Requested
                          </p>
                          <p className="text-yellow-400 text-xl font-bold">
                            ${request.amount.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-1">
                            Equity Offered
                          </p>
                          <p className="text-white text-xl font-bold">
                            {request.equity}%
                          </p>
                        </div>
                        <div>
                          <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-1">
                            Valuation
                          </p>
                          <p className="text-white text-xl font-bold">
                            ${request.valuation?.toLocaleString() || "TBD"}
                          </p>
                        </div>
                      </div>

                      {/* Message */}
                      {request.message && (
                        <div className="mb-4 p-4 bg-white/[0.03] rounded-lg border border-white/10">
                          <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-2">
                            Message
                          </p>
                          <p className="text-white/80 text-sm leading-relaxed">
                            {request.message}
                          </p>
                        </div>
                      )}

                      {/* Business Plan */}
                      {request.businessPlan && (
                        <div className="mb-4">
                          <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-2">
                            Business Plan
                          </p>
                          <p className="text-white/80 text-sm leading-relaxed line-clamp-2">
                            {request.businessPlan}
                          </p>
                        </div>
                      )}

                      {/* Key Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pt-4 border-t border-white/10">
                        {request.useOfFunds && (
                          <div>
                            <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-2">
                              Use of Funds
                            </p>
                            <p className="text-white/80 text-sm leading-relaxed line-clamp-2">
                              {request.useOfFunds}
                            </p>
                          </div>
                        )}
                        {request.timeline && (
                          <div>
                            <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-2">
                              Timeline
                            </p>
                            <p className="text-white/80 text-sm leading-relaxed line-clamp-2">
                              {request.timeline}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Milestones */}
                      {request.milestones && (
                        <div className="pt-4 border-t border-white/10">
                          <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-2">
                            Key Milestones
                          </p>
                          <p className="text-white/80 text-sm leading-relaxed line-clamp-2">
                            {request.milestones}
                          </p>
                        </div>
                      )}

                      {/* Accepted By Info */}
                      {request.acceptedBy && (
                        <div className="mt-4 pt-4 border-t border-green-500/20 bg-green-500/5 rounded-lg p-3">
                          <p className="text-green-400 text-xs font-semibold uppercase tracking-widest mb-1">
                            Accepted by Investor
                          </p>
                          <p className="text-white text-sm font-medium">
                            {request.acceptedBy.name}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Analysis */}
            {idea.aiAnalysis && (
              <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                  <FaChartLine className="text-white/60" />
                  AI Analysis
                </h2>
                <div className="space-y-6">
                  {idea.aiAnalysis.strengths && (
                    <div>
                      <h3 className="text-white font-semibold mb-3 text-lg">
                        Strengths
                      </h3>
                      <p className="text-white/80 leading-relaxed">
                        {idea.aiAnalysis.strengths}
                      </p>
                    </div>
                  )}
                  {idea.aiAnalysis.weaknesses && (
                    <div className="pt-6 border-t border-white/10">
                      <h3 className="text-white font-semibold mb-3 text-lg">
                        Weaknesses
                      </h3>
                      <p className="text-white/80 leading-relaxed">
                        {idea.aiAnalysis.weaknesses}
                      </p>
                    </div>
                  )}
                  {idea.aiAnalysis.opportunities && (
                    <div className="pt-6 border-t border-white/10">
                      <h3 className="text-white font-semibold mb-3 text-lg">
                        Opportunities
                      </h3>
                      <p className="text-white/80 leading-relaxed">
                        {idea.aiAnalysis.opportunities}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SWOT Analysis */}
            {idea.analysis?.swot && (
              <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                  <FaChartLine className="text-white/60" />
                  SWOT Analysis
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {idea.analysis.swot?.strengths && (
                    <div className="bg-white/[0.05] border border-white/10 rounded-lg p-6">
                      <h3 className="text-white font-semibold mb-3 flex items-center gap-2 text-lg">
                        <FaCheckCircle className="text-green-400" />
                        Strengths
                      </h3>
                      <p className="text-white/80">{idea.analysis.swot.strengths}</p>
                    </div>
                  )}

                  {idea.analysis.swot?.weaknesses && (
                    <div className="bg-white/[0.05] border border-white/10 rounded-lg p-6">
                      <h3 className="text-white font-semibold mb-3 flex items-center gap-2 text-lg">
                        <FaExclamationTriangle className="text-yellow-400" />
                        Weaknesses
                      </h3>
                      <p className="text-white/80">
                        {idea.analysis.swot.weaknesses}
                      </p>
                    </div>
                  )}

                  {idea.analysis.swot?.opportunities && (
                    <div className="bg-white/[0.05] border border-white/10 rounded-lg p-6">
                      <h3 className="text-white font-semibold mb-3 flex items-center gap-2 text-lg">
                        <FaBullseye className="text-blue-400" />
                        Opportunities
                      </h3>
                      <p className="text-white/80">
                        {idea.analysis.swot.opportunities}
                      </p>
                    </div>
                  )}

                  {idea.analysis.swot?.threats && (
                    <div className="bg-white/[0.05] border border-white/10 rounded-lg p-6">
                      <h3 className="text-white font-semibold mb-3 flex items-center gap-2 text-lg">
                        <FaExclamationTriangle className="text-red-400" />
                        Threats
                      </h3>
                      <p className="text-white/80">{idea.analysis.swot.threats}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Market Trends */}
            {idea.analysis?.trends && idea.analysis.trends.length > 0 && (
              <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                  <FaChartLine className="text-white/60" />
                  Market Trends
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
                  {idea.analysis.trends.map((trend, index) => (
                    <div
                      key={index}
                      className="bg-white/[0.05] border border-white/10 rounded-lg p-4 text-center hover:bg-white/10 transition-all"
                    >
                      <div className="text-2xl font-bold text-white mb-1">
                        {trend.year}
                      </div>
                      <div className="text-yellow-400 font-semibold text-lg mb-1">
                        {trend.popularity}%
                      </div>
                      <div className="text-white/50 text-xs">Growth</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Documents Section */}
            {idea.attachments && idea.attachments.length > 0 && (
              <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <FaFileAlt className="text-white/60" />
                  Documents
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {idea.attachments.map((doc, idx) => (
                    <a
                      key={idx}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all text-white/80 hover:text-white flex items-center gap-3 truncate"
                    >
                      <FaFileAlt className="text-white/60 flex-shrink-0" />
                      <span className="truncate text-sm">{doc.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorIdeaViewPage;
    