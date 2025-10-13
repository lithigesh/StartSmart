import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ComposedChart,
} from "recharts";
import {
  FaDollarSign,
  FaChartBar,
  FaChartLine,
  FaChartPie,
  FaClock,
  FaCheck,
  FaTimes,
  FaHandshake,
  FaSpinner,
  FaArrowUp,
  FaCalendarAlt,
} from "react-icons/fa";

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#F97316",
];
const STATUS_COLORS = {
  pending: "#F59E0B",
  approved: "#10B981",
  rejected: "#EF4444",
  negotiated: "#3B82F6",
  withdrawn: "#6B7280",
  accepted: "#059669",
  declined: "#DC2626",
};

const FundingAnalyticsCharts = ({
  fundingRequests,
  loading,
  userRole = "entrepreneur",
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [chartData, setChartData] = useState(null);
  const [timeRange, setTimeRange] = useState("6months");

  useEffect(() => {
    if (fundingRequests && fundingRequests.length > 0) {
      prepareChartData();
    }
  }, [fundingRequests, timeRange]);

  const prepareChartData = () => {
    if (!fundingRequests || fundingRequests.length === 0) return;

    // Status distribution
    const statusDistribution = {};
    fundingRequests.forEach((request) => {
      const status = request.status || "pending";
      statusDistribution[status] = (statusDistribution[status] || 0) + 1;
    });

    const statusData = Object.entries(statusDistribution).map(
      ([status, count]) => ({
        status: status.charAt(0).toUpperCase() + status.slice(1),
        count,
        color: STATUS_COLORS[status] || "#6B7280",
      })
    );

    // Amount distribution by status
    const amountByStatus = {};
    fundingRequests.forEach((request) => {
      const status = request.status || "pending";
      if (!amountByStatus[status]) {
        amountByStatus[status] = 0;
      }
      amountByStatus[status] += request.amount || 0;
    });

    const amountData = Object.entries(amountByStatus).map(
      ([status, amount]) => ({
        status: status.charAt(0).toUpperCase() + status.slice(1),
        amount: amount / 1000, // Convert to thousands
        color: STATUS_COLORS[status] || "#6B7280",
      })
    );

    // Timeline data (last 12 months)
    const now = new Date();
    const timelineData = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      });

      const monthRequests = fundingRequests.filter((request) => {
        const requestDate = new Date(request.createdAt || request.requestedAt);
        return (
          requestDate.getMonth() === date.getMonth() &&
          requestDate.getFullYear() === date.getFullYear()
        );
      });

      timelineData.push({
        month: monthName,
        count: monthRequests.length,
        amount:
          monthRequests.reduce((sum, req) => sum + (req.amount || 0), 0) / 1000,
        approved: monthRequests.filter(
          (req) => req.status === "approved" || req.status === "accepted"
        ).length,
      });
    }

    // Success rate over time
    const successRateData = timelineData.map((item) => ({
      month: item.month,
      successRate:
        item.count > 0 ? Math.round((item.approved / item.count) * 100) : 0,
      totalRequests: item.count,
    }));

    // Equity vs Amount analysis
    const equityAmountData = fundingRequests
      .filter((req) => req.equity && req.amount)
      .map((req) => ({
        amount: req.amount / 1000,
        equity: req.equity,
        valuation: req.amount / (req.equity / 100) / 1000000, // In millions
        status: req.status,
        name: req.ideaId?.title || req.idea?.title || "Unnamed Idea",
      }));

    // Average metrics by category
    const categoryMetrics = {};
    fundingRequests.forEach((request) => {
      const category =
        request.ideaId?.category || request.idea?.category || "Other";
      if (!categoryMetrics[category]) {
        categoryMetrics[category] = {
          category,
          totalAmount: 0,
          count: 0,
          approved: 0,
          avgEquity: 0,
          equitySum: 0,
        };
      }
      categoryMetrics[category].totalAmount += request.amount || 0;
      categoryMetrics[category].count += 1;
      if (request.status === "approved" || request.status === "accepted") {
        categoryMetrics[category].approved += 1;
      }
      categoryMetrics[category].equitySum += request.equity || 0;
    });

    const categoryData = Object.values(categoryMetrics).map((cat) => ({
      category: cat.category,
      avgAmount: Math.round(cat.totalAmount / cat.count / 1000),
      successRate: Math.round((cat.approved / cat.count) * 100),
      avgEquity: Math.round((cat.equitySum / cat.count) * 10) / 10,
      count: cat.count,
    }));

    setChartData({
      status: statusData,
      amounts: amountData,
      timeline: timelineData,
      successRate: successRateData,
      equityAmount: equityAmountData,
      categories: categoryData,
    });
  };

  const formatCurrency = (value) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}M`;
    }
    return `$${value}K`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-lg p-3 shadow-xl">
          <p className="text-white font-manrope font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-white/80 font-manrope text-sm">
              <span style={{ color: entry.color }}>●</span>
              {` ${entry.dataKey}: ${
                entry.dataKey.includes("amount") ||
                entry.dataKey.includes("Amount")
                  ? formatCurrency(entry.value)
                  : entry.dataKey.includes("Rate")
                  ? `${entry.value}%`
                  : entry.value
              }`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8">
        <div className="flex items-center justify-center h-64">
          <FaSpinner className="w-8 h-8 animate-spin text-white/60" />
          <span className="ml-3 text-white/60 font-manrope">
            Loading funding analytics...
          </span>
        </div>
      </div>
    );
  }

  if (!chartData || !fundingRequests || fundingRequests.length === 0) {
    return (
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <FaDollarSign className="w-12 h-12 text-white/40 mx-auto mb-4" />
            <p className="text-white/60 font-manrope text-lg mb-2">
              No Funding Data Available
            </p>
            <p className="text-white/40 font-manrope text-sm">
              {userRole === "entrepreneur"
                ? "Create your first funding request to see analytics"
                : "No funding requests found"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Status Overview", icon: FaChartPie },
    { id: "amounts", label: "Funding Amounts", icon: FaDollarSign },
    { id: "timeline", label: "Timeline Trends", icon: FaChartLine },
    { id: "performance", label: "Success Analysis", icon: FaArrowUp },
    { id: "categories", label: "Category Insights", icon: FaChartBar },
  ];

  // Calculate summary stats
  const totalRequests = fundingRequests.length;
  const totalAmount = fundingRequests.reduce(
    (sum, req) => sum + (req.amount || 0),
    0
  );
  const approvedRequests = fundingRequests.filter(
    (req) => req.status === "approved" || req.status === "accepted"
  ).length;
  const successRate =
    totalRequests > 0
      ? Math.round((approvedRequests / totalRequests) * 100)
      : 0;

  return (
    <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2 font-manrope">
            <FaDollarSign className="w-5 h-5 text-green-400" />
            Funding Analytics
          </h3>
          <div className="flex items-center gap-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm font-manrope focus:outline-none focus:border-white/40"
            >
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="12months">Last 12 Months</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/[0.02] border border-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <FaCalendarAlt className="w-4 h-4 text-blue-400" />
              <span className="text-2xl font-bold text-white font-manrope">
                {totalRequests}
              </span>
            </div>
            <div className="text-white/60 text-sm font-manrope">
              Total Requests
            </div>
          </div>
          <div className="bg-white/[0.02] border border-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <FaDollarSign className="w-4 h-4 text-green-400" />
              <span className="text-2xl font-bold text-white font-manrope">
                {formatCurrency(totalAmount / 1000)}
              </span>
            </div>
            <div className="text-white/60 text-sm font-manrope">
              Total Requested
            </div>
          </div>
          <div className="bg-white/[0.02] border border-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <FaCheck className="w-4 h-4 text-green-400" />
              <span className="text-2xl font-bold text-white font-manrope">
                {approvedRequests}
              </span>
            </div>
            <div className="text-white/60 text-sm font-manrope">Approved</div>
          </div>
          <div className="bg-white/[0.02] border border-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <FaArrowUp className="w-4 h-4 text-purple-400" />
              <span className="text-2xl font-bold text-white font-manrope">
                {successRate}%
              </span>
            </div>
            <div className="text-white/60 text-sm font-manrope">
              Success Rate
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium font-manrope transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Chart Content */}
        <div className="h-96">
          {activeTab === "overview" && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.status}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, count, percent }) =>
                    `${status}: ${count} (${(percent * 100).toFixed(1)}%)`
                  }
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {chartData.status.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.9)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "8px",
                    fontFamily: "Manrope",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}

          {activeTab === "amounts" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.amounts}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis
                  dataKey="status"
                  stroke="rgba(255,255,255,0.5)"
                  style={{ fontFamily: "Manrope", fontSize: "12px" }}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.5)"
                  style={{ fontFamily: "Manrope", fontSize: "12px" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="amount" name="Amount (K)" radius={[4, 4, 0, 0]}>
                  {chartData.amounts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          {activeTab === "timeline" && (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData.timeline}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis
                  dataKey="month"
                  stroke="rgba(255,255,255,0.5)"
                  style={{ fontFamily: "Manrope", fontSize: "12px" }}
                />
                <YAxis
                  yAxisId="left"
                  stroke="rgba(255,255,255,0.5)"
                  style={{ fontFamily: "Manrope", fontSize: "12px" }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="rgba(255,255,255,0.5)"
                  style={{ fontFamily: "Manrope", fontSize: "12px" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{
                    fontFamily: "Manrope",
                    color: "rgba(255,255,255,0.8)",
                  }}
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="amount"
                  fill="#3B82F6"
                  fillOpacity={0.3}
                  stroke="#3B82F6"
                  name="Amount (K)"
                />
                <Bar
                  yAxisId="left"
                  dataKey="count"
                  fill="#10B981"
                  name="Requests Count"
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="approved"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  dot={{ fill: "#F59E0B", strokeWidth: 2, r: 4 }}
                  name="Approved"
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}

          {activeTab === "performance" && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData.successRate}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis
                  dataKey="month"
                  stroke="rgba(255,255,255,0.5)"
                  style={{ fontFamily: "Manrope", fontSize: "12px" }}
                />
                <YAxis
                  domain={[0, 100]}
                  stroke="rgba(255,255,255,0.5)"
                  style={{ fontFamily: "Manrope", fontSize: "12px" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{
                    fontFamily: "Manrope",
                    color: "rgba(255,255,255,0.8)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="successRate"
                  stroke="#10B981"
                  strokeWidth={4}
                  dot={{ fill: "#10B981", strokeWidth: 2, r: 6 }}
                  name="Success Rate (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          )}

          {activeTab === "categories" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.categories}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis
                  dataKey="category"
                  stroke="rgba(255,255,255,0.5)"
                  style={{ fontFamily: "Manrope", fontSize: "12px" }}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.5)"
                  style={{ fontFamily: "Manrope", fontSize: "12px" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{
                    fontFamily: "Manrope",
                    color: "rgba(255,255,255,0.8)",
                  }}
                />
                <Bar
                  dataKey="avgAmount"
                  fill="#3B82F6"
                  name="Avg Amount (K)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="successRate"
                  fill="#10B981"
                  name="Success Rate %"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="count"
                  fill="#F59E0B"
                  name="Request Count"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default FundingAnalyticsCharts;
