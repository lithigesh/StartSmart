import React, { useState, useEffect } from "react";
import { investorAPI } from "../../services/api";
import LoadingSpinner from "../LoadingSpinner";
import {
  FaDollarSign,
  FaHandshake,
  FaLightbulb,
  FaClipboardList,
  FaTrophy,
  FaChartLine,
  FaChartPie,
  FaSync,
  FaExclamationCircle,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const PortfolioSection = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [portfolioData, setPortfolioData] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Color palette for charts
  const COLORS = {
    primary: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"],
  };

  useEffect(() => {
    loadPortfolioData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
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
      setError(err.message || "Failed to load portfolio analytics");
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

  // Custom label for pie chart
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

  if (loading) {
    return (
      <LoadingSpinner
        message="Loading portfolio analytics..."
        containerClassName="w-full flex items-center justify-center py-24 text-white"
      />
    );
  }

  if (error) {
    return (
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
        <FaExclamationCircle className="w-16 h-16 text-white/80 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">
          Error Loading Portfolio
        </h3>
        <p className="text-white/70 mb-4">{error}</p>
        <button
          onClick={loadPortfolioData}
          className="px-6 py-2 bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 text-white rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!portfolioData) {
    return null;
  }

  const { overview, pipeline, distribution, recentDeals } = portfolioData;

  // Prepare data for pipeline funnel chart
  const pipelineData = [
    { stage: "Viewed", count: pipeline.viewed, fill: COLORS.primary[0] },
    {
      stage: "Negotiating",
      count: pipeline.negotiating,
      fill: COLORS.primary[1],
    },
    { stage: "Accepted", count: pipeline.accepted, fill: COLORS.primary[2] },
    { stage: "Declined", count: pipeline.declined, fill: COLORS.primary[3] },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">
              Portfolio Analytics
            </h2>
            <p className="text-white/60">
              Comprehensive overview of your investment portfolio and activities
            </p>
          </div>
          <button
            onClick={loadPortfolioData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh data"
          >
            <FaSync className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
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
              <div className="text-sm text-white/90 mt-1">Total Invested</div>
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
              <div className="text-sm text-white/90 mt-1">Interested Ideas</div>
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
              <div className="text-sm text-white/80 mt-1">Pending Reviews</div>
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
                    <div
                      key={item.name || index}
                      className="flex items-center gap-2 min-w-0"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor:
                            COLORS.primary[index % COLORS.primary.length],
                        }}
                      />
                      <span className="text-sm text-white/80 truncate">{item.name}</span>
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
            {recentDeals.map((deal, index) => (
              <div
                key={
                  deal._id || deal.id || `${deal.ideaTitle || "deal"}-${index}`
                }
                className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 hover:border-white/20 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-white font-semibold mb-1">
                      {deal.ideaTitle}
                    </h4>
                    <div className="flex items-center gap-4 text-sm text-white/60">
                      <span className="flex items-center gap-1">
                        <FaDollarSign className="text-white/90" />
                        {formatCurrency(deal.amount)}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaLightbulb className="text-white/90" />
                        {deal.category}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-white/60">
                      {formatDate(deal.acceptedAt)}
                    </div>
                    <div className="mt-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-white/30 text-white/90 border border-white">
                        {deal.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioSection;
