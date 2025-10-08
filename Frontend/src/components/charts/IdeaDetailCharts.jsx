import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  RadialBarChart,
  RadialBar,
} from "recharts";
import {
  FaChartLine,
  FaEye,
  FaHeart,
  FaFire,
  FaTrophy,
  FaSpinner,
} from "react-icons/fa";
import { api } from "../../services/api";

const IdeaDetailCharts = ({ ideaId }) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMetric, setActiveMetric] = useState("views");

  useEffect(() => {
    if (ideaId) {
      fetchAnalyticsData();
    }
  }, [ideaId]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/charts/idea/${ideaId}`);
      if (response.success) {
        setAnalyticsData(response.data);
      } else {
        throw new Error("Failed to fetch analytics data");
      }
    } catch (err) {
      console.error("Error fetching analytics data:", err);
      setError("Failed to load analytics data");
      // Use fallback data in case of error
      setAnalyticsData({
        idea: {
          title: "Sample Idea",
          category: "Technology",
          views: 123,
          likes: 15,
        },
        trendData: [
          { date: "Jan 1", views: 5, likes: 1, engagement: 3 },
          { date: "Jan 2", views: 8, likes: 2, engagement: 5 },
          { date: "Jan 3", views: 12, likes: 3, engagement: 7 },
          { date: "Jan 4", views: 15, likes: 4, engagement: 9 },
          { date: "Jan 5", views: 18, likes: 5, engagement: 11 },
        ],
        performanceData: [
          { metric: "Views", value: 123, benchmark: 100 },
          { metric: "Likes", value: 15, benchmark: 20 },
          { metric: "Engagement", value: 12.2, benchmark: 15 },
          { metric: "Score", value: 75, benchmark: 70 },
        ],
        summary: {
          totalViews: 123,
          totalLikes: 15,
          averageEngagement: 12.2,
          categoryRank: 3,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>
        <div className="relative z-10 flex items-center justify-center py-12">
          <FaSpinner className="w-8 h-8 text-white animate-spin" />
          <span className="ml-3 text-white font-manrope">
            Loading analytics...
          </span>
        </div>
      </div>
    );
  }

  if (error && !analyticsData) {
    return (
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>
        <div className="relative z-10 text-center py-8">
          <p className="text-white/60 font-manrope mb-4">{error}</p>
          <button
            onClick={fetchAnalyticsData}
            className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-300 hover:scale-105 font-manrope"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { idea, trendData, performanceData, summary } = analyticsData;

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-lg p-3">
          <p className="text-white font-manrope font-semibold mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-white/80 font-manrope text-sm">
              {entry.name}: <span className="font-bold">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Idea Header */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white mb-3 font-manrope">
            {idea?.title}
          </h2>
          <div className="flex items-center gap-4 text-sm">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full font-manrope border border-blue-500/30">
              {idea?.category}
            </span>
            <span className="text-white/60 font-manrope flex items-center gap-1">
              <FaEye className="w-4 h-4" />
              {summary?.totalViews || 0} views
            </span>
            <span className="text-white/60 font-manrope flex items-center gap-1">
              <FaHeart className="w-4 h-4" />
              {summary?.totalLikes || 0} likes
            </span>
            <span className="text-white/60 font-manrope flex items-center gap-1">
              <FaFire className="w-4 h-4" />
              {summary?.averageEngagement?.toFixed(1) || 0}% engagement
            </span>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/30 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <FaEye className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm font-medium text-white/60 font-manrope">
                Total Views
              </h3>
            </div>
            <p className="text-3xl font-bold text-white font-manrope">
              {summary?.totalViews || 0}
            </p>
          </div>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-green-500/30 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-green-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <FaHeart className="w-5 h-5 text-green-400" />
              <h3 className="text-sm font-medium text-white/60 font-manrope">
                Total Likes
              </h3>
            </div>
            <p className="text-3xl font-bold text-white font-manrope">
              {summary?.totalLikes || 0}
            </p>
          </div>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-purple-500/30 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <FaFire className="w-5 h-5 text-purple-400" />
              <h3 className="text-sm font-medium text-white/60 font-manrope">
                Engagement Rate
              </h3>
            </div>
            <p className="text-3xl font-bold text-white font-manrope">
              {summary?.averageEngagement?.toFixed(1) || 0}%
            </p>
          </div>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-orange-500/30 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-orange-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <FaTrophy className="w-5 h-5 text-orange-400" />
              <h3 className="text-sm font-medium text-white/60 font-manrope">
                Category Rank
              </h3>
            </div>
            <p className="text-3xl font-bold text-white font-manrope">
              #{summary?.categoryRank || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Popularity Trend Chart */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2 font-manrope">
              <FaChartLine className="w-5 h-5" />
              Popularity Trends (Last 30 Days)
            </h3>
            <div className="flex space-x-2">
              {["views", "likes", "engagement"].map((metric) => (
                <button
                  key={metric}
                  onClick={() => setActiveMetric(metric)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium font-manrope transition-all duration-300 ${
                    activeMetric === metric
                      ? "bg-white text-black"
                      : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                  }`}
                >
                  {metric.charAt(0).toUpperCase() + metric.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={trendData || []}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.1)"
              />
              <XAxis
                dataKey="date"
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
              {activeMetric === "views" && (
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  name="Views"
                  dot={{ fill: "#3B82F6", strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7 }}
                />
              )}
              {activeMetric === "likes" && (
                <Line
                  type="monotone"
                  dataKey="likes"
                  stroke="#10B981"
                  strokeWidth={3}
                  name="Likes"
                  dot={{ fill: "#10B981", strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7 }}
                />
              )}
              {activeMetric === "engagement" && (
                <Line
                  type="monotone"
                  dataKey="engagement"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  name="Engagement Score"
                  dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Comparison */}
      {/* Performance vs Benchmarks */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>
        <div className="relative z-10">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2 font-manrope">
            <FaTrophy className="w-5 h-5 text-orange-400" />
            Performance vs Industry Benchmarks
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={performanceData || []}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.1)"
              />
              <XAxis
                dataKey="metric"
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
                dataKey="yourIdea"
                fill="#3B82F6"
                radius={[8, 8, 0, 0]}
                name="Your Idea"
              />
              <Bar
                dataKey="benchmark"
                fill="rgba(255,255,255,0.2)"
                radius={[8, 8, 0, 0]}
                name="Industry Average"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-purple-500/30 transition-colors duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-purple-500/5 rounded-2xl pointer-events-none"></div>
          <div className="relative z-10">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2 font-manrope">
              <FaFire className="w-5 h-5 text-purple-400" />
              Engagement Score
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="40%"
                outerRadius="80%"
                data={[
                  {
                    name: "Engagement",
                    value: summary?.averageEngagement || 0,
                    fill: "#8B5CF6",
                  },
                ]}
              >
                <RadialBar dataKey="value" cornerRadius={10} fill="#8B5CF6" />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-2xl font-bold fill-white font-manrope"
                >
                  {summary?.averageEngagement?.toFixed(1) || 0}%
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-cyan-500/30 transition-colors duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-cyan-500/5 rounded-2xl pointer-events-none"></div>
          <div className="relative z-10">
            <h3 className="text-xl font-semibold text-white mb-4 font-manrope">
              Quick Stats
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-300">
                <span className="text-white/70 font-manrope">
                  Views to Likes Ratio
                </span>
                <span className="font-semibold text-white font-manrope">
                  {summary?.totalViews && summary?.totalLikes
                    ? (summary.totalViews / summary.totalLikes).toFixed(1)
                    : "N/A"}
                  :1
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-300">
                <span className="text-white/70 font-manrope">
                  Category Position
                </span>
                <span className="font-semibold text-white font-manrope">
                  #{summary?.categoryRank || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-300">
                <span className="text-white/70 font-manrope">
                  Performance Score
                </span>
                <span className="font-semibold text-white font-manrope">
                  {performanceData?.find((p) => p.metric === "Score")?.value ||
                    0}
                  /100
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaDetailCharts;
