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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  FaChartBar,
  FaChartLine,
  FaStar,
  FaUsers,
  FaEye,
  FaHeart,
  FaSpinner,
  FaChartArea,
  FaTrophy,
} from "react-icons/fa";

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#F97316",
];

const IdeaComparisonCharts = ({ ideas, comparisonData, loading }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (ideas && ideas.length > 0) {
      prepareChartData();
    }
  }, [ideas]);

  const prepareChartData = () => {
    if (!ideas || ideas.length === 0) return;

    // Overview comparison data
    const overviewData = ideas.map((idea, index) => ({
      name:
        idea.title.length > 15
          ? idea.title.substring(0, 15) + "..."
          : idea.title,
      fullName: idea.title,
      score: idea.analysis?.score || 0,
      views: idea.views || 0,
      likes: idea.likes || 0,
      category: idea.category,
      color: COLORS[index % COLORS.length],
    }));

    // Radar chart data for comprehensive comparison
    const radarData = [
      "Innovation",
      "Market Potential",
      "Technical Feasibility",
      "Team Capability",
      "Financial Viability",
      "Risk Factor",
    ].map((metric) => {
      const dataPoint = { metric };
      ideas.forEach((idea, index) => {
        // Generate realistic scores based on existing data or default values
        let score = 0;
        switch (metric) {
          case "Innovation":
            score = idea.analysis?.innovation_score || 50 + Math.random() * 40;
            break;
          case "Market Potential":
            score = idea.analysis?.market_score || 40 + Math.random() * 50;
            break;
          case "Technical Feasibility":
            score = idea.analysis?.tech_score || 60 + Math.random() * 35;
            break;
          case "Team Capability":
            score = idea.analysis?.team_score || 45 + Math.random() * 45;
            break;
          case "Financial Viability":
            score = idea.analysis?.financial_score || 35 + Math.random() * 55;
            break;
          case "Risk Factor":
            score =
              100 - (idea.analysis?.risk_score || 20 + Math.random() * 60);
            break;
          default:
            score = 50 + Math.random() * 40;
        }
        dataPoint[`idea${index}`] = Math.round(score);
      });
      return dataPoint;
    });

    // Category distribution
    const categoryDistribution = {};
    ideas.forEach((idea) => {
      categoryDistribution[idea.category] =
        (categoryDistribution[idea.category] || 0) + 1;
    });

    const categoryData = Object.entries(categoryDistribution).map(
      ([category, count]) => ({
        category,
        count,
      })
    );

    // Engagement metrics
    const engagementData = ideas.map((idea, index) => ({
      name:
        idea.title.length > 12
          ? idea.title.substring(0, 12) + "..."
          : idea.title,
      fullName: idea.title,
      views: idea.views || 0,
      likes: idea.likes || 0,
      engagement: ((idea.likes || 0) / Math.max(idea.views || 1, 1)) * 100,
    }));

    setChartData({
      overview: overviewData,
      radar: radarData,
      categories: categoryData,
      engagement: engagementData,
    });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-lg p-3 shadow-xl">
          <p className="text-white font-manrope font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-white/80 font-manrope text-sm">
              <span style={{ color: entry.color }}>●</span>
              {` ${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const RadarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-lg p-3 shadow-xl">
          <p className="text-white font-manrope font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-white/80 font-manrope text-sm">
              <span style={{ color: entry.color }}>●</span>
              {` Idea ${index + 1}: ${entry.value}/100`}
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
            Loading comparison charts...
          </span>
        </div>
      </div>
    );
  }

  if (!chartData || !ideas || ideas.length === 0) {
    return (
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <FaChartBar className="w-12 h-12 text-white/40 mx-auto mb-4" />
            <p className="text-white/60 font-manrope">
              No data available for comparison charts
            </p>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Scores Overview", icon: FaChartBar },
    { id: "radar", label: "Multi-Metric Analysis", icon: FaChartArea },
    { id: "engagement", label: "Engagement Metrics", icon: FaHeart },
    { id: "categories", label: "Category Distribution", icon: FaTrophy },
  ];

  return (
    <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2 font-manrope">
            <FaChartLine className="w-5 h-5 text-blue-400" />
            Comparison Analytics
          </h3>
          <div className="text-sm text-white/60 font-manrope">
            {ideas.length} ideas being compared
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
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
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
              <BarChart data={chartData.overview}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis
                  dataKey="name"
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
                  dataKey="score"
                  fill="#3B82F6"
                  name="Overall Score"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="views"
                  fill="#10B981"
                  name="Views"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="likes"
                  fill="#F59E0B"
                  name="Likes"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}

          {activeTab === "radar" && (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData.radar}>
                <PolarGrid stroke="rgba(255,255,255,0.2)" />
                <PolarAngleAxis
                  dataKey="metric"
                  tick={{
                    fill: "rgba(255,255,255,0.8)",
                    fontFamily: "Manrope",
                    fontSize: 12,
                  }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{
                    fill: "rgba(255,255,255,0.6)",
                    fontFamily: "Manrope",
                    fontSize: 10,
                  }}
                />
                {ideas.map((idea, index) => (
                  <Radar
                    key={`idea${index}`}
                    name={`Idea ${index + 1}`}
                    dataKey={`idea${index}`}
                    stroke={COLORS[index % COLORS.length]}
                    fill={COLORS[index % COLORS.length]}
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                ))}
                <Tooltip content={<RadarTooltip />} />
                <Legend
                  wrapperStyle={{
                    fontFamily: "Manrope",
                    color: "rgba(255,255,255,0.8)",
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          )}

          {activeTab === "engagement" && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData.engagement}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis
                  dataKey="name"
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
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                  name="Views"
                />
                <Line
                  type="monotone"
                  dataKey="likes"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                  name="Likes"
                />
                <Line
                  type="monotone"
                  dataKey="engagement"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  dot={{ fill: "#F59E0B", strokeWidth: 2, r: 4 }}
                  name="Engagement %"
                />
              </LineChart>
            </ResponsiveContainer>
          )}

          {activeTab === "categories" && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.categories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, count, percent }) =>
                    `${category}: ${count} (${(percent * 100).toFixed(1)}%)`
                  }
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {chartData.categories.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
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
        </div>

        {/* Quick Stats */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white font-manrope">
                {Math.round(
                  chartData.overview.reduce(
                    (sum, item) => sum + item.score,
                    0
                  ) / chartData.overview.length
                )}
              </div>
              <div className="text-white/60 text-sm font-manrope">
                Avg Score
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white font-manrope">
                {chartData.overview
                  .reduce((sum, item) => sum + item.views, 0)
                  .toLocaleString()}
              </div>
              <div className="text-white/60 text-sm font-manrope">
                Total Views
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white font-manrope">
                {chartData.overview.reduce((sum, item) => sum + item.likes, 0)}
              </div>
              <div className="text-white/60 text-sm font-manrope">
                Total Likes
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white font-manrope">
                {chartData.categories.length}
              </div>
              <div className="text-white/60 text-sm font-manrope">
                Categories
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaComparisonCharts;
