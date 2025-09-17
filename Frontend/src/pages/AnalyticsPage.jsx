import React, { useState, useEffect } from "react";
import { ideasAPI, fundingAPI, investorAPI } from "../services/api";
import { useNotifications } from "../hooks/useNotifications";
import { 
  FaChartLine, 
  FaChartPie, 
  FaChartBar,
  FaArrowUp,
  FaArrowDown,
  FaDollarSign,
  FaEye,
  FaHeart,
  FaCalendarAlt,
  FaDownload
} from "react-icons/fa";
import EmptyState from "../components/EmptyState";
import ErrorBoundary from "../components/ErrorBoundary";

const AnalyticsPage = () => {
  const { addNotification } = useNotifications();
  
  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState({
    ideas: [],
    funding: [],
    investors: [],
    performance: {}
  });
  const [timeRange, setTimeRange] = useState("30"); // days
  const [selectedMetric, setSelectedMetric] = useState("overview");

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load data from multiple sources
      const [ideasResponse, fundingResponse, investorResponse] = await Promise.all([
        ideasAPI.getUserIdeas().catch(() => ({ data: [] })),
        fundingAPI.getUserFundingRequests().catch(() => ({ data: [] })),
        investorAPI.getUserConnections().catch(() => ({ data: [] }))
      ]);
      
      const ideasData = ideasResponse.data || [];
      const fundingData = fundingResponse.data || [];
      const investorData = investorResponse.data || [];

      // If no real data, generate demo analytics
      if (ideasData.length === 0 && fundingData.length === 0) {
        setAnalytics(generateDemoAnalytics());
      } else {
        setAnalytics({
          ideas: ideasData,
          funding: fundingData,
          investors: investorData,
          performance: calculatePerformanceMetrics(ideasData, fundingData, investorData)
        });
      }
    } catch (err) {
      console.error("Error loading analytics data:", err);
      setError(err.message);
      
      // Show demo data on error
      setAnalytics(generateDemoAnalytics());
      addNotification("Using demo data - API connection failed", "warning");
    } finally {
      setLoading(false);
    }
  };

  const generateDemoAnalytics = () => {
    const currentDate = new Date();
    const monthsAgo = (months) => new Date(currentDate.getFullYear(), currentDate.getMonth() - months, 1);
    
    return {
      ideas: [
        { _id: "1", title: "AI-Powered Analytics", category: "Technology", createdAt: monthsAgo(1), views: 245, interests: 18 },
        { _id: "2", title: "Sustainable Energy Solution", category: "Energy", createdAt: monthsAgo(2), views: 189, interests: 12 },
        { _id: "3", title: "HealthTech Platform", category: "Healthcare", createdAt: monthsAgo(0), views: 156, interests: 24 }
      ],
      funding: [
        { _id: "1", amount: 250000, status: "accepted", createdAt: monthsAgo(1) },
        { _id: "2", amount: 150000, status: "pending", createdAt: monthsAgo(0) },
        { _id: "3", amount: 500000, status: "negotiated", createdAt: monthsAgo(2) }
      ],
      investors: [
        { _id: "1", name: "Tech Ventures", status: "connected", createdAt: monthsAgo(1) },
        { _id: "2", name: "Future Fund", status: "pending", createdAt: monthsAgo(0) }
      ],
      performance: {
        totalViews: 590,
        totalInterests: 54,
        totalFunding: 900000,
        conversionRate: 9.15,
        growthRate: 23.5,
        avgFundingAmount: 300000
      }
    };
  };

  const calculatePerformanceMetrics = (ideas, funding, investors) => {
    const totalViews = ideas.reduce((sum, idea) => sum + (idea.views || 0), 0);
    const totalInterests = ideas.reduce((sum, idea) => sum + (idea.interests || 0), 0);
    const totalFunding = funding.reduce((sum, req) => sum + (req.amount || 0), 0);
    const conversionRate = totalViews > 0 ? (totalInterests / totalViews) * 100 : 0;
    
    return {
      totalViews,
      totalInterests,
      totalFunding,
      conversionRate,
      growthRate: 15.2, // This would be calculated based on historical data
      avgFundingAmount: funding.length > 0 ? totalFunding / funding.length : 0
    };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getMetricColor = (value, isPositive = true) => {
    if (isPositive) {
      return value > 0 ? "text-green-400" : "text-red-400";
    }
    return value > 0 ? "text-red-400" : "text-green-400";
  };

  const getMetricIcon = (value, isPositive = true) => {
    if (isPositive) {
      return value > 0 ? FaArrowUp : FaArrowDown;
    }
    return value > 0 ? FaArrowDown : FaArrowUp;
  };

  // Chart data preparation
  const pieChartData = analytics.ideas.reduce((acc, idea) => {
    acc[idea.category] = (acc[idea.category] || 0) + 1;
    return acc;
  }, {});

  const lineChartData = analytics.funding.map(req => ({
    date: new Date(req.createdAt).toLocaleDateString(),
    amount: req.amount,
    status: req.status
  }));

  const barChartData = analytics.ideas.map(idea => ({
    title: idea.title.substring(0, 20) + "...",
    views: idea.views || 0,
    interests: idea.interests || 0
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <div className="border-b border-gray-800 bg-black/50 backdrop-blur-xl sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Analytics Dashboard
                </h1>
                <p className="text-gray-400 mt-1">
                  Track your ideas performance, funding metrics, and growth insights
                </p>
              </div>
              <div className="flex items-center gap-4">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="bg-gray-900/50 border border-gray-800 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                  <option value="365">Last year</option>
                </select>
                <button className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-600/30 rounded-lg transition-colors flex items-center gap-2">
                  <FaDownload className="text-sm" />
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <FaEye className="text-blue-400 text-xl" />
                <span className="text-green-400 text-sm flex items-center gap-1">
                  <FaArrowUp className="text-xs" />
                  +12%
                </span>
              </div>
              <p className="text-gray-400 text-sm">Total Views</p>
              <p className="text-2xl font-bold text-white">{analytics.performance.totalViews?.toLocaleString()}</p>
            </div>
            
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <FaHeart className="text-red-400 text-xl" />
                <span className="text-green-400 text-sm flex items-center gap-1">
                  <FaArrowUp className="text-xs" />
                  +8%
                </span>
              </div>
              <p className="text-gray-400 text-sm">Total Interests</p>
              <p className="text-2xl font-bold text-white">{analytics.performance.totalInterests}</p>
            </div>
            
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <FaDollarSign className="text-green-400 text-xl" />
                <span className="text-green-400 text-sm flex items-center gap-1">
                  <FaArrowUp className="text-xs" />
                  +24%
                </span>
              </div>
              <p className="text-gray-400 text-sm">Total Funding</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(analytics.performance.totalFunding)}</p>
            </div>
            
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <FaChartLine className="text-purple-400 text-xl" />
                <span className="text-green-400 text-sm flex items-center gap-1">
                  <FaArrowUp className="text-xs" />
                  +{analytics.performance.growthRate}%
                </span>
              </div>
              <p className="text-gray-400 text-sm">Conversion Rate</p>
              <p className="text-2xl font-bold text-white">{analytics.performance.conversionRate?.toFixed(1)}%</p>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Ideas by Category (Pie Chart) */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <FaChartPie className="text-blue-400" />
                  Ideas by Category
                </h2>
              </div>
              <div className="space-y-4">
                {Object.entries(pieChartData).map(([category, count], index) => {
                  const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500'];
                  const percentage = ((count / analytics.ideas.length) * 100).toFixed(1);
                  return (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${colors[index % colors.length]}`}></div>
                        <span className="text-gray-300">{category}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-white font-medium">{count}</span>
                        <span className="text-gray-400 text-sm ml-2">({percentage}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Funding Timeline */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <FaChartLine className="text-green-400" />
                  Funding Timeline
                </h2>
              </div>
              <div className="space-y-4">
                {lineChartData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{formatCurrency(item.amount)}</p>
                      <p className="text-gray-400 text-sm">{item.date}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm border ${
                      item.status === 'accepted' ? 'text-green-400 bg-green-400/10 border-green-400/20' :
                      item.status === 'pending' ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' :
                      item.status === 'negotiated' ? 'text-blue-400 bg-blue-400/10 border-blue-400/20' :
                      'text-red-400 bg-red-400/10 border-red-400/20'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Ideas Performance */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <FaChartBar className="text-purple-400" />
                Ideas Performance
              </h2>
            </div>
            <div className="space-y-4">
              {barChartData.map((idea, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 font-medium">{idea.title}</span>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-blue-400">{idea.views} views</span>
                      <span className="text-green-400">{idea.interests} interests</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-blue-500 h-full transition-all duration-500"
                        style={{ width: `${Math.min((idea.views / Math.max(...barChartData.map(i => i.views))) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-green-500 h-full transition-all duration-500"
                        style={{ width: `${Math.min((idea.interests / Math.max(...barChartData.map(i => i.interests))) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <FaCalendarAlt className="text-blue-400" />
                Recent Activity
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">New funding request accepted</p>
                    <p className="text-gray-400 text-xs">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">Investor showed interest in AI Analytics</p>
                    <p className="text-gray-400 text-xs">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">New idea submitted: HealthTech Platform</p>
                    <p className="text-gray-400 text-xs">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-white mb-6">Quick Insights</h2>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-600/30 rounded-lg">
                  <p className="text-blue-400 font-medium mb-1">🎯 Top Performing Category</p>
                  <p className="text-white text-sm">
                    {Object.entries(pieChartData).sort(([,a], [,b]) => b - a)[0]?.[0] || 'Technology'} ideas are getting the most attention
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-600/30 rounded-lg">
                  <p className="text-green-400 font-medium mb-1">💰 Funding Success</p>
                  <p className="text-white text-sm">
                    Average funding amount is {formatCurrency(analytics.performance.avgFundingAmount)}
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-600/30 rounded-lg">
                  <p className="text-purple-400 font-medium mb-1">📈 Growth Trend</p>
                  <p className="text-white text-sm">
                    {analytics.performance.conversionRate?.toFixed(1)}% interest conversion rate
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AnalyticsPage;