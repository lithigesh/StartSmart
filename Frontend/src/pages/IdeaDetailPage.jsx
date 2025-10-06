import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { investorAPI } from "../services/api";
import IdeaDetailCharts from "../components/charts/IdeaDetailCharts";
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
  FaChartBar,
} from "react-icons/fa";

const IdeaDetailPage = () => {
  const { ideaId, id } = useParams(); // Support both ideaId and id params
  const navigate = useNavigate();
  const { user, getRoleDashboardUrl } = useAuth();
  
  const currentId = id || ideaId; // Use whichever param is available
  const isAdminView = user?.role === 'admin' && window.location.pathname.includes('/admin/idea/');

  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInterested, setIsInterested] = useState(false);
  const [showCharts, setShowCharts] = useState(false);

  const token = localStorage.getItem("token");
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

  const getDashboardUrl = () => {
    if (isAdminView) return '/admin/dashboard?section=ideas';
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
        if (!res.ok) throw new Error('Failed to fetch idea');
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
    if (!window.confirm('Are you sure you want to delete this idea?')) return;
    
    try {
      setActionLoading(true);
      const res = await fetch(`${API_BASE}/api/admin/ideas/${currentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) {
        throw new Error('Failed to delete idea');
      }
      
      navigate('/admin/dashboard');
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
            Back to Dashboard
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
              onClick={() => navigate(getDashboardUrl())}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <FaArrowLeft className="w-4 h-4" />
              <span className="font-manrope">{isAdminView ? 'Back to All Ideas' : 'Back to Dashboard'}</span>
            </button>

            {isAdminView ? (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowCharts(!showCharts)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    showCharts 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-gray-700 hover:bg-gray-600 text-white/70'
                  }`}
                >
                  <FaChartBar className="w-4 h-4" />
                  {showCharts ? 'Hide Analytics' : 'Show Analytics'}
                </button>
                <button
                  onClick={handleDelete}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
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
                  onClick={() => setShowCharts(!showCharts)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    showCharts 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-gray-700 hover:bg-gray-600 text-white/70'
                  }`}
                >
                  <FaChartBar className="w-4 h-4" />
                  {showCharts ? 'Hide Analytics' : 'Show Analytics'}
                </button>
                <button
                  onClick={handleInterest}
                  disabled={actionLoading}
                  className={`btn rounded-lg px-6 py-2 font-manrope font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 ${
                    isInterested
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-pink-500 hover:bg-pink-600 text-white"
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
            ) : (
              <button 
                onClick={() => setShowCharts(!showCharts)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  showCharts 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-gray-700 hover:bg-gray-600 text-white/70'
                }`}
              >
                <FaChartBar className="w-4 h-4" />
                {showCharts ? 'Hide Analytics' : 'Show Analytics'}
              </button>
            )}
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
                  <div className="flex items-center gap-1 text-blue-400">
                    <FaTag className="w-4 h-4" />
                    <span className="font-manrope">{idea.category}</span>
                  </div>
                  <div className="flex items-center gap-1 text-green-400">
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
                    <div className="flex items-center gap-1 text-yellow-400">
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
                        ? "bg-green-100 text-green-800"
                        : idea.status === "submitted"
                        ? "bg-yellow-100 text-yellow-800"
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

        {/* Analytics Charts */}
        {showCharts && (
          <div className="mb-8">
            <IdeaDetailCharts ideaId={currentId} />
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
                    <div className="bg-white/[0.02] border border-green-500/20 rounded-lg p-6">
                      <h3 className="text-green-400 font-manrope font-semibold text-lg mb-3 flex items-center gap-2">
                        <FaCheckCircle className="w-5 h-5" />
                        Strengths
                      </h3>
                      <p className="text-white/80 font-manrope leading-relaxed">
                        {idea.analysis.swot.strengths}
                      </p>
                    </div>
                  )}

                  {idea.analysis.swot?.weaknesses && (
                    <div className="bg-white/[0.02] border border-orange-500/20 rounded-lg p-6">
                      <h3 className="text-orange-400 font-manrope font-semibold text-lg mb-3 flex items-center gap-2">
                        <FaExclamationTriangle className="w-5 h-5" />
                        Weaknesses
                      </h3>
                      <p className="text-white/80 font-manrope leading-relaxed">
                        {idea.analysis.swot.weaknesses}
                      </p>
                    </div>
                  )}

                  {idea.analysis.swot?.opportunities && (
                    <div className="bg-white/[0.02] border border-blue-500/20 rounded-lg p-6">
                      <h3 className="text-blue-400 font-manrope font-semibold text-lg mb-3 flex items-center gap-2">
                        <FaBullseye className="w-5 h-5" />
                        Opportunities
                      </h3>
                      <p className="text-white/80 font-manrope leading-relaxed">
                        {idea.analysis.swot.opportunities}
                      </p>
                    </div>
                  )}

                  {idea.analysis.swot?.threats && (
                    <div className="bg-white/[0.02] border border-red-500/20 rounded-lg p-6">
                      <h3 className="text-red-400 font-manrope font-semibold text-lg mb-3 flex items-center gap-2">
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
                        <div className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-manrope font-bold text-sm">
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
                        <div className="text-blue-400 font-manrope font-semibold">
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
