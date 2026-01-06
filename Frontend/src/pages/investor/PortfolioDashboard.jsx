import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../hooks/useNotifications";
import { investorAPI } from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  InvestorDashboardHeader,
  InvestorSidebar,
} from "../../components/investor";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  FaDollarSign,
  FaHandshake,
  FaLightbulb,
  FaClipboardList,
  FaChartPie,
  FaChartLine,
  FaTrophy,
  FaSpinner,
  FaExclamationCircle,
  FaArrowUp,
  FaArrowDown,
  FaSync,
} from "react-icons/fa";

const PortfolioDashboard = () => {
  const navigate = useNavigate();
  const { addNotification, unreadCount } = useNotifications();
  const [loading, setLoading] = useState(true);
  const [portfolioData, setPortfolioData] = useState(null);
  const [error, setError] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Handle sidebar navigation
  const handleSectionChange = (sectionId) => {
    // When on Portfolio page, clicking other sections should navigate back to main dashboard
    // Portfolio is a separate route, but other sections are internal to InvestorDashboard

    if (sectionId === "portfolio") {
      // Already on portfolio page, do nothing
      return;
    }

    // Navigate back to main investor dashboard
    // The InvestorDashboard component will handle the section via its activeSection state
    navigate("/investor/dashboard", { state: { activeSection: sectionId } });
  };

  // Color palette for charts
  const COLORS = {
    primary: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"],
    gradient: [
      "#6366F1",
      "#8B5CF6",
      "#A855F7",
      "#C084FC",
      "#E879F9",
      "#F0ABFC",
    ],
  };

  useEffect(() => {
    loadPortfolioData();
  }, []);

  // Handle responsive sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }

      setIsSmallScreen(window.innerWidth < 640);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const loadPortfolioData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await investorAPI.getPortfolioAnalytics();

      if (response.success) {
        setPortfolioData(response.data);
      } else {
        throw new Error(response.message || "Failed to load portfolio data");
      }
    } catch (err) {
      console.error("Error loading portfolio data:", err);
      const errorMessage = err.message || "Failed to load portfolio analytics";
      setError(errorMessage);

      // Only show notification if it's not the initial load
      if (portfolioData) {
        addNotification(errorMessage, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const title =
        label ||
        payload?.[0]?.name ||
        payload?.[0]?.payload?.name ||
        payload?.[0]?.payload?.stage ||
        "";

      const hasValues = payload.some((e) => e && typeof e.value !== "undefined");
      if (!title && !hasValues) return null;

      return (
        <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-xl">
          {title ? (
            <p className="text-white font-semibold mb-1">{title}</p>
          ) : null}
          {payload.map((entry, index) => (
            <p
              key={index}
              className="text-sm text-white/80"
              style={{ color: entry?.color || "rgba(255,255,255,0.8)" }}
            >
              {entry?.name ? `${entry.name}: ` : ""}
              {entry.dataKey === "value" || entry.name === "Amount"
                ? formatCurrency(entry.value)
                : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom label for pie chart (truncate long names)
  const renderCustomLabel = ({ name, percent, x, y, cx }) => {
    const safeName = typeof name === "string" ? name : "";
    const truncatedName =
      safeName.length > 12 ? safeName.substring(0, 12) + "..." : safeName;
    const pct = `${Math.round((percent || 0) * 100)}%`;

    return (
      <text
        x={x}
        y={y}
        fill="rgba(255,255,255,0.75)"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
      >
        {`${truncatedName} ${pct}`}
      </text>
    );
  };

  if (loading && !portfolioData) {
    return (
      <div className="min-h-screen bg-black overflow-x-hidden">
        {/* Sidebar */}
        <InvestorSidebar
          activeSection="portfolio"
          setActiveSection={handleSectionChange}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />

        {/* Main Content */}
        <div
          className={`transition-all duration-300 ${
            isCollapsed ? "lg:ml-20" : "lg:ml-72"
          }`}
        >
          {/* Header */}
          <InvestorDashboardHeader unreadCount={unreadCount} />

          {/* Page Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <LoadingSpinner
              message="Loading portfolio analytics..."
              containerClassName="w-full flex items-center justify-center py-24 text-white"
            />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black overflow-x-hidden">
        {/* Sidebar */}
        <InvestorSidebar
          activeSection="portfolio"
          setActiveSection={handleSectionChange}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />

        {/* Main Content */}
        <div
          className={`transition-all duration-300 ${
            isCollapsed ? "lg:ml-20" : "lg:ml-72"
          }`}
        >
          {/* Header */}
          <InvestorDashboardHeader unreadCount={unreadCount} />

          {/* Page Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="bg-white/20 border border-white rounded-lg p-8 text-center">
              <FaExclamationCircle className="w-16 h-16 text-white/80 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Error Loading Portfolio
              </h3>
              <p className="text-white/70 mb-4">{error}</p>
              <button
                onClick={loadPortfolioData}
                className="px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!portfolioData) {
    return null;
  }

  const {
    overview = {},
    pipeline = {},
    distribution = { byCategory: [], byStage: [] },
    recentDeals = [],
  } = portfolioData;

  // Prepare data for pipeline funnel chart
  const pipelineData = [
    { stage: "Viewed", count: pipeline.viewed || 0, fill: COLORS.primary[0] },
    {
      stage: "Negotiating",
      count: pipeline.negotiating || 0,
      fill: COLORS.primary[1],
    },
    {
      stage: "Accepted",
      count: pipeline.accepted || 0,
      fill: COLORS.primary[2],
    },
    {
      stage: "Declined",
      count: pipeline.declined || 0,
      fill: COLORS.primary[3],
    },
  ];

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      {/* Sidebar */}
      <InvestorSidebar
        activeSection="portfolio"
        setActiveSection={handleSectionChange}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          isCollapsed ? "lg:ml-20" : "lg:ml-72"
        }`}
      >
        {/* Header */}
        <InvestorDashboardHeader unreadCount={unreadCount} />

        {/* Page Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Portfolio Dashboard
                </h1>
                <p className="text-white/60">
                  Comprehensive overview of your investment portfolio and
                  activities
                </p>
              </div>
              <button
                onClick={loadPortfolioData}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Refresh data"
              >
                <FaSync
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                <span className="text-sm font-medium">Refresh</span>
              </button>
            </div>
          </div>

          {/* Overview Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Invested */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/[0.03] border border-white/10 rounded-lg">
                  <FaDollarSign className="w-6 h-6 text-white/90" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">
                    {formatCurrency(overview.totalInvested)}
                  </div>
                  <div className="text-sm text-white/90 mt-1">
                    Total Invested
                  </div>
                </div>
              </div>
              <div className="text-xs text-white/60">
                Avg: {formatCurrency(overview.averageDealSize)} per deal
              </div>
            </div>

            {/* Active Deals */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/[0.03] border border-white/10 rounded-lg">
                  <FaHandshake className="w-6 h-6 text-white/90" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">
                    {overview.activeDeals}
                  </div>
                  <div className="text-sm text-white/90 mt-1">Active Deals</div>
                </div>
              </div>
              <div className="text-xs text-white/60">
                Currently invested in {overview.activeDeals}{" "}
                {overview.activeDeals === 1 ? "company" : "companies"}
              </div>
            </div>

            {/* Interested Ideas */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/[0.03] border border-white/10 rounded-lg">
                  <FaLightbulb className="w-6 h-6 text-white/90" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">
                    {overview.interestedIdeas}
                  </div>
                  <div className="text-sm text-white/90 mt-1">
                    Interested Ideas
                  </div>
                </div>
              </div>
              <div className="text-xs text-white/60">
                Ideas marked for potential investment
              </div>
            </div>

            {/* Pending Reviews */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/[0.03] border border-white/10 rounded-lg">
                  <FaClipboardList className="w-6 h-6 text-white/80" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">
                    {overview.pendingReviews}
                  </div>
                  <div className="text-sm text-white/80 mt-1">
                    Pending Reviews
                  </div>
                </div>
              </div>
              <div className="text-xs text-white/60">
                New funding requests awaiting review
              </div>
            </div>
          </div>

          {/* Conversion Rate Metric */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold text-lg mb-2 flex items-center gap-2">
                  <FaTrophy className="text-white/70" />
                  Conversion Performance
                </h3>
                <p className="text-white/60 text-sm">
                  Your success rate from viewed deals to accepted investments
                </p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-white mb-1">
                  {overview.conversionRate}%
                </div>
                <div className="text-sm text-white/60">Conversion Rate</div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Deal Pipeline Funnel */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                <FaChartLine className="text-white/90" />
                Deal Pipeline
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pipelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="stage" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Deals" radius={[8, 8, 0, 0]}>
                    {pipelineData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="text-sm text-white/60">
                  Total Pipeline:{" "}
                  <span className="text-white font-semibold">
                    {pipeline.total} deals
                  </span>
                </div>
              </div>
            </div>

            {/* Investment Distribution by Category */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                <FaChartPie className="text-white/90" />
                Investment by Category
              </h3>
              {distribution.byCategory.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={isSmallScreen ? 240 : 300}>
                    <PieChart>
                      <Pie
                        data={distribution.byCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={!isSmallScreen ? renderCustomLabel : false}
                        outerRadius={isSmallScreen ? 80 : 100}
                        fill="#9CA3AF"
                        dataKey="value"
                      >
                        {distribution.byCategory.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS.primary[index % COLORS.primary.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="grid grid-cols-2 gap-2">
                      {distribution.byCategory.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 min-w-0">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor:
                                COLORS.primary[index % COLORS.primary.length],
                            }}
                          />
                          <span className="text-sm text-white/80 truncate">
                            {item.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-64 text-white/60">
                  No investment data available
                </div>
              )}
            </div>
          </div>

          {/* Recent Deals */}
          {recentDeals.length > 0 && (
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-white font-semibold text-lg mb-4">
                Recent Accepted Deals
              </h3>
              <div className="space-y-3">
                {recentDeals.map((deal) => (
                  <div
                    key={deal.id}
                    className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 hover:border-white/20 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-semibold">
                        {deal.ideaTitle}
                      </h4>
                      <span className="px-3 py-1 bg-white/10 text-white/90 rounded-full text-xs font-medium">
                        {deal.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <span className="text-white/60 block mb-1">
                          Amount:
                        </span>
                        <div className="text-white font-semibold">
                          {formatCurrency(deal.amount)}
                        </div>
                      </div>
                      <div>
                        <span className="text-white/60 block mb-1">
                          Equity:
                        </span>
                        <div className="text-white font-semibold">
                          {deal.equity}%
                        </div>
                      </div>
                      <div>
                        <span className="text-white/60 block mb-1">
                          Category:
                        </span>
                        <div className="text-white font-semibold">
                          {deal.category}
                        </div>
                      </div>
                      <div>
                        <span className="text-white/60 block mb-1">Stage:</span>
                        <div className="text-white font-semibold capitalize">
                          {deal.stage}
                        </div>
                      </div>
                      <div>
                        <span className="text-white/60 block mb-1">
                          Accepted:
                        </span>
                        <div className="text-white font-semibold">
                          {formatDate(deal.acceptedAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State - Show when no active deals but has activity */}
          {overview.activeDeals === 0 &&
            (overview.interestedIdeas > 0 || pipeline.viewed > 0) && (
              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center mt-8">
                <FaHandshake className="w-12 h-12 text-white/40 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No Active Deals Yet
                </h3>
                <p className="text-white/60 mb-4">
                  You've viewed {pipeline.viewed}{" "}
                  {pipeline.viewed === 1 ? "deal" : "deals"} and marked{" "}
                  {overview.interestedIdeas}{" "}
                  {overview.interestedIdeas === 1 ? "idea" : "ideas"} as
                  interesting.
                </p>
                <p className="text-white/40 text-sm">
                  Continue reviewing funding requests to build your portfolio
                </p>
              </div>
            )}

          {/* Complete Empty State - No activity at all */}
          {overview.activeDeals === 0 &&
            overview.interestedIdeas === 0 &&
            pipeline.viewed === 0 && (
              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center mt-8">
                <FaChartLine className="w-16 h-16 text-white/40 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Start Building Your Portfolio
                </h3>
                <p className="text-white/60 mb-6">
                  Browse ideas and start marking your interests to see analytics
                  here
                </p>
                <a
                  href="/investor/deals"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  <FaLightbulb />
                  Browse Funding Requests
                </a>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioDashboard;
