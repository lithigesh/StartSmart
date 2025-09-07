import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { investorAPI, fundingAPI } from "../services/api";
import IdeaCard from "../components/IdeaCard";
import EmptyState from "../components/EmptyState";
import {
  FaBriefcase,
  FaSignOutAlt,
  FaCog,
  FaBell,
  FaChartLine,
  FaLightbulb,
  FaSearch,
  FaEye,
  FaHeart,
  FaHeartBroken,
  FaDollarSign,
  FaStar,
  FaSpinner,
  FaSync,
} from "react-icons/fa";

const InvestorDashboard = () => {
  const { user, logout } = useAuth();

  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ideas, setIdeas] = useState([]);
  const [interestedIdeas, setInterestedIdeas] = useState([]);
  const [fundingRequests, setFundingRequests] = useState([]);
  const [activeView, setActiveView] = useState("browse"); // 'browse', 'interested', 'funding'
  const [actionLoading, setActionLoading] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest"); // 'newest', 'oldest', 'score'

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load data in parallel - Using only investorAPI for consistency
      const [ideasData, interestedData, fundingData] = await Promise.all([
        investorAPI.getAllIdeas().catch((err) => {
          console.error("Error loading ideas:", err);
          return [];
        }),
        investorAPI.getInterestedIdeas().catch((err) => {
          console.error("Error loading interested ideas:", err);
          return [];
        }),
        fundingAPI.getAllFundingRequests().catch((err) => {
          console.error("Error loading funding requests:", err);
          return [];
        }),
      ]);

      setIdeas(ideasData);
      setInterestedIdeas(interestedData);
      setFundingRequests(fundingData);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleInterest = async (ideaId, action) => {
    try {
      setActionLoading((prev) => ({ ...prev, [ideaId]: true }));
      setError(null);

      // Use only investorAPI for consistency
      if (action === "add") {
        await investorAPI.markInterest(ideaId);
      } else {
        await investorAPI.removeInterest(ideaId);
      }

      // Reload data to reflect changes
      await loadDashboardData();

      // Show success message briefly
      const successMessage =
        action === "add"
          ? "Interest marked successfully"
          : "Interest removed successfully";
      // You could add a toast notification here instead of using error state
    } catch (err) {
      console.error(`Error ${action}ing interest:`, err);

      // Provide more specific error messages
      let errorMessage = `Failed to ${action} interest`;
      if (err.message.includes("Already marked")) {
        errorMessage = "You have already marked interest in this idea";
      } else if (err.message.includes("not found")) {
        errorMessage = "Idea not found or no longer available";
      } else if (err.message.includes("analyzed")) {
        errorMessage = "Can only show interest in analyzed ideas";
      }

      setError(errorMessage);

      // Auto-dismiss error after 5 seconds
      setTimeout(() => setError(null), 5000);
    } finally {
      setActionLoading((prev) => ({ ...prev, [ideaId]: false }));
    }
  };

  const handleLogout = () => {
    logout();
  };

  // Filter and sort ideas
  const getFilteredIdeas = (ideasList) => {
    let filtered = ideasList;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (idea) =>
          idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          idea.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (idea.owner?.name &&
            idea.owner.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((idea) => idea.category === categoryFilter);
    }

    // Sort
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "score":
        filtered.sort(
          (a, b) => (b.analysis?.score || 0) - (a.analysis?.score || 0)
        );
        break;
      default:
        break;
    }

    return filtered;
  };

  // Get unique categories
  const getCategories = () => {
    const categories = [...new Set(ideas.map((idea) => idea.category))];
    return categories.sort();
  };

  // Calculate dashboard metrics
  const totalInvestments = interestedIdeas.length;
  const availableIdeas = ideas.length;
  const avgScore =
    ideas.length > 0
      ? (
          ideas.reduce((sum, idea) => sum + (idea.analysis?.score || 0), 0) /
          ideas.length
        ).toFixed(1)
      : "0";
  const newOpportunities = ideas.filter((idea) => {
    const createdAt = new Date(idea.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return createdAt > weekAgo;
  }).length;

  const dashboardCards = [
    {
      title: "Total Interests",
      description: "Ideas you've shown interest in",
      icon: <FaHeart />,
      count: totalInvestments.toString(),
      color: "text-pink-400",
    },
    {
      title: "Available Ideas",
      description: "Browse innovative startup ideas seeking funding",
      icon: <FaLightbulb />,
      count: availableIdeas.toString(),
      color: "text-yellow-400",
    },
    {
      title: "Average Score",
      description: "AI analysis score of available ideas",
      icon: <FaChartLine />,
      count: `${avgScore}%`,
      color: "text-blue-400",
    },
    {
      title: "New This Week",
      description: "Recently submitted ideas requiring review",
      icon: <FaBell />,
      count: newOpportunities.toString(),
      color: "text-purple-400",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="w-8 h-8 text-white animate-spin mx-auto mb-4" />
          <p className="text-white font-manrope">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-white/[0.03] backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-green-400">
                <FaBriefcase className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-white font-manrope font-semibold text-lg">
                  Welcome, {user?.name}
                </h1>
                <p className="text-white/60 text-sm capitalize font-manrope">
                  Investor Dashboard
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 text-white/70 hover:text-white transition-colors duration-300 hover:bg-white/10 rounded-lg">
                <FaCog className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300 hover:scale-105 font-manrope"
              >
                <FaSignOutAlt className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>

            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-4 right-4 w-1 h-1 bg-white/40 rounded-full animate-ping"></div>
              <div className="absolute bottom-6 left-8 w-1 h-1 bg-white/35 rounded-full animate-bounce"></div>
            </div>

            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-manrope font-bold text-white mb-4">
                Ready to invest in the future?
              </h2>
              <p className="text-white/70 font-manrope mb-6 max-w-2xl">
                Explore curated startup ideas, analyze opportunities, and build
                your investment portfolio with promising entrepreneurs. Discover
                the next big innovation.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setActiveView("browse")}
                  className={`btn rounded-lg px-6 py-3 font-manrope font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 ${
                    activeView === "browse"
                      ? "bg-white text-black"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  <FaSearch className="w-4 h-4" />
                  Browse Ideas ({availableIdeas})
                </button>
                <button
                  onClick={() => setActiveView("interested")}
                  className={`btn rounded-lg px-6 py-3 font-manrope font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 ${
                    activeView === "interested"
                      ? "bg-white text-black"
                      : "btn-outline border-white text-white hover:bg-white hover:text-black"
                  }`}
                >
                  <FaHeart className="w-4 h-4" />
                  My Interests ({totalInvestments})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardCards.map((card, index) => (
            <div
              key={index}
              className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300 hover:scale-105 cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-white/[0.02] rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center ${card.color} group-hover:scale-110 transition-transform duration-300`}
                  >
                    {card.icon}
                  </div>
                  <span
                    className={`text-2xl font-bold ${card.color} font-manrope`}
                  >
                    {card.count}
                  </span>
                </div>

                <h3 className="text-white font-manrope font-semibold text-lg mb-2 group-hover:text-gray-200 transition-colors duration-300">
                  {card.title}
                </h3>
                <p className="text-white/60 text-sm font-manrope group-hover:text-white/80 transition-colors duration-300">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <p className="text-red-400 font-manrope">{error}</p>
              <div className="flex gap-2">
                <button
                  onClick={loadDashboardData}
                  className="text-red-300 hover:text-red-100 text-sm flex items-center gap-1"
                  title="Retry"
                >
                  <FaSync className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setError(null)}
                  className="text-red-300 hover:text-red-100 text-sm"
                  title="Dismiss"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Content Based on Active View */}
        {activeView === "browse" && (
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>

            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                <h3 className="text-xl font-manrope font-bold text-white">
                  Available Ideas ({getFilteredIdeas(ideas).length} of{" "}
                  {availableIdeas})
                </h3>

                {/* Filter Controls */}
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  {/* Search */}
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search ideas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors w-full sm:w-64"
                    />
                  </div>

                  {/* Category Filter */}
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30 transition-colors"
                  >
                    <option value="all" className="bg-gray-800">
                      All Categories
                    </option>
                    {getCategories().map((category) => (
                      <option
                        key={category}
                        value={category}
                        className="bg-gray-800"
                      >
                        {category}
                      </option>
                    ))}
                  </select>

                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30 transition-colors"
                  >
                    <option value="newest" className="bg-gray-800">
                      Newest First
                    </option>
                    <option value="oldest" className="bg-gray-800">
                      Oldest First
                    </option>
                    <option value="score" className="bg-gray-800">
                      Highest Score
                    </option>
                  </select>
                </div>
              </div>

              {getFilteredIdeas(ideas).length === 0 ? (
                <EmptyState
                  type={
                    searchTerm || categoryFilter !== "all" ? "search" : "ideas"
                  }
                  title={
                    searchTerm || categoryFilter !== "all"
                      ? "No Results Found"
                      : "No Ideas Available"
                  }
                  description={
                    searchTerm || categoryFilter !== "all"
                      ? "No ideas match your current filters. Try adjusting your search criteria."
                      : "No ideas are available at the moment. Check back later for new opportunities."
                  }
                  action={
                    searchTerm || categoryFilter !== "all"
                      ? () => {
                          setSearchTerm("");
                          setCategoryFilter("all");
                        }
                      : null
                  }
                  actionText={
                    searchTerm || categoryFilter !== "all"
                      ? "Clear Filters"
                      : null
                  }
                />
              ) : (
                <div className="grid gap-6">
                  {getFilteredIdeas(ideas).map((idea) => (
                    <IdeaCard
                      key={idea._id}
                      idea={idea}
                      showInterestButton={true}
                      isInterested={interestedIdeas.some(
                        (interested) => interested._id === idea._id
                      )}
                      onInterest={handleInterest}
                      loading={actionLoading[idea._id]}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeView === "interested" && (
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>

            <div className="relative z-10">
              <h3 className="text-xl font-manrope font-bold text-white mb-6">
                My Interested Ideas ({totalInvestments})
              </h3>

              {interestedIdeas.length === 0 ? (
                <EmptyState
                  type="interested"
                  action={() => setActiveView("browse")}
                  actionText="Browse Ideas"
                />
              ) : (
                <div className="grid gap-6">
                  {interestedIdeas.map((idea) => (
                    <IdeaCard
                      key={idea._id}
                      idea={idea}
                      showInterestButton={true}
                      isInterested={true}
                      onInterest={handleInterest}
                      loading={actionLoading[idea._id]}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recent Activity Section */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>

          <div className="relative z-10">
            <h3 className="text-xl font-manrope font-bold text-white mb-6">
              Recent Activity
            </h3>

            <div className="space-y-4">
              {ideas.slice(0, 3).map((idea) => (
                <div
                  key={idea._id}
                  className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/10 rounded-lg hover:bg-white/[0.05] transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <FaLightbulb className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-manrope font-medium">
                      New idea: "{idea.title}"{" "}
                      {idea.analysis?.score
                        ? `(Score: ${idea.analysis.score}%)`
                        : ""}
                    </p>
                    <p className="text-white/60 text-sm font-manrope">
                      by {idea.owner?.name || "Anonymous"} •{" "}
                      {new Date(idea.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleInterest(idea._id, "add")}
                    disabled={actionLoading[idea._id]}
                    className="btn btn-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-3 py-1 font-manrope text-sm"
                  >
                    {actionLoading[idea._id] ? (
                      <FaSpinner className="w-3 h-3 animate-spin" />
                    ) : (
                      "View"
                    )}
                  </button>
                </div>
              ))}

              {ideas.length === 0 && (
                <EmptyState
                  type="ideas"
                  title="No Recent Activity"
                  description="No recent ideas or activity to display."
                />
              )}
            </div>

            {ideas.length > 3 && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setActiveView("browse")}
                  className="text-blue-400 hover:text-blue-300 font-manrope text-sm"
                >
                  View all {ideas.length} ideas →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorDashboard;
