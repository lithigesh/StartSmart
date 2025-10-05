import React, { useState, useEffect } from 'react';
import {
  FaUsers,
  FaLightbulb,
  FaTrophy,
  FaDollarSign,
  FaArrowUp,
  FaArrowDown,
  FaDownload,
  FaCalendarAlt,
  FaChartBar,
  FaChartLine,
  FaChartPie
} from 'react-icons/fa';
import { API_BASE } from '../../services/api';
import { 
  SimpleBarChart, 
  SimpleLineChart, 
  SimplePieChart, 
  SimpleAreaChart,
  generateSampleData 
} from '../../utils/ChartComponents';

// Enhanced charts are now imported from ChartComponents utility

// Data transformation helpers
const transformChartData = (data) => {
  if (!data || !Array.isArray(data)) return [];
  
  return data.map(item => ({
    label: item._id?.month ? `${item._id.month}/${item._id.year}` : 
           item._id?.day ? `${item._id.day}/${item._id.month}` :
           item._id || 'Unknown',
    value: item.count || item.totalAmount || 0
  }));
};

const transformPieData = (data) => {
  if (!data || !Array.isArray(data)) return [];
  
  return data.map(item => ({
    label: item._id || 'Unknown',
    value: item.count || item.totalAmount || 0
  }));
};

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    end: new Date().toISOString().split('T')[0]
  });
  const [selectedChart, setSelectedChart] = useState('users');

  const token = localStorage.getItem('adminToken') || localStorage.getItem('token');

  useEffect(() => {
    fetchAnalytics();
    fetchChartData();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        dateRange: JSON.stringify(dateRange)
      });

      const response = await fetch(`${API_BASE}/api/admin/analytics/dashboard?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch analytics');
      
      const data = await response.json();
      setAnalytics(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async () => {
    try {
      const types = ['users', 'ideas', 'ideathons', 'feedback', 'sustainability'];
      const chartPromises = types.map(async (type) => {
        const queryParams = new URLSearchParams({
          type,
          dateRange: JSON.stringify(dateRange)
        });

        const response = await fetch(`${API_BASE}/api/admin/analytics/charts?${queryParams}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          return { [type]: data.data };
        }
        return { [type]: [] };
      });

      const results = await Promise.all(chartPromises);
      const combinedData = results.reduce((acc, curr) => ({ ...acc, ...curr }), {});
      setChartData(combinedData);
    } catch (err) {
      console.error('Failed to fetch chart data:', err);
    }
  };

  const downloadReport = async (reportType) => {
    try {
      const queryParams = new URLSearchParams({
        format: 'json',
        dateRange: JSON.stringify(dateRange)
      });

      const response = await fetch(`${API_BASE}/api/admin/reports/${reportType}?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to generate report');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(`Failed to download ${reportType} report: ${err.message}`);
    }
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount);
  };

  const calculateGrowth = (current, previous) => {
    if (!previous || previous === 0) return { rate: 0, isIncrease: true };
    const rate = ((current - previous) / previous) * 100;
    return { rate: Math.abs(rate).toFixed(1), isIncrease: rate >= 0 };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
          <FaChartBar className="text-blue-400" />
          Analytics Dashboard
        </h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FaCalendarAlt className="text-white/70" />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50"
            />
            <span className="text-white/70">to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50"
            />
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      {analytics && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Users Card */}
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-medium">Total Users</p>
                  <p className="text-2xl font-bold text-white">{analytics.users.totalUsers.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <FaArrowUp className="text-green-400 text-sm mr-1" />
                    <span className="text-green-400 text-sm">+12.5%</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-500/30 rounded-full">
                  <FaUsers className="text-blue-300 text-xl" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-blue-500/20">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-200">Entrepreneurs</span>
                  <span className="text-white">{analytics.users.entrepreneurs}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-blue-200">Investors</span>
                  <span className="text-white">{analytics.users.investors}</span>
                </div>
              </div>
            </div>

            {/* Ideas Card */}
            <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-xl border border-green-500/30 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-200 text-sm font-medium">Total Ideas</p>
                  <p className="text-2xl font-bold text-white">{analytics.ideas.totalIdeas.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <FaArrowUp className="text-green-400 text-sm mr-1" />
                    <span className="text-green-400 text-sm">+8.3%</span>
                  </div>
                </div>
                <div className="p-3 bg-green-500/30 rounded-full">
                  <FaLightbulb className="text-green-300 text-xl" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-green-500/20">
                <div className="flex justify-between text-sm">
                  <span className="text-green-200">Approved</span>
                  <span className="text-white">{analytics.ideas.approvedIdeas}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-green-200">Pending</span>
                  <span className="text-white">{analytics.ideas.pendingIdeas}</span>
                </div>
              </div>
            </div>

            {/* Ideathons Card */}
            <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm font-medium">Total Ideathons</p>
                  <p className="text-2xl font-bold text-white">{analytics.ideathons.totalIdeathons.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <FaArrowUp className="text-green-400 text-sm mr-1" />
                    <span className="text-green-400 text-sm">+15.7%</span>
                  </div>
                </div>
                <div className="p-3 bg-purple-500/30 rounded-full">
                  <FaTrophy className="text-purple-300 text-xl" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-purple-500/20">
                <div className="flex justify-between text-sm">
                  <span className="text-purple-200">Active</span>
                  <span className="text-white">{analytics.ideathons.activeIdeathons}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-purple-200">Upcoming</span>
                  <span className="text-white">{analytics.ideathons.upcomingIdeathons}</span>
                </div>
              </div>
            </div>

            {/* Feedback Card */}
            <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 backdrop-blur-xl border border-yellow-500/30 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-200 text-sm font-medium">Total Feedback</p>
                  <p className="text-2xl font-bold text-white">
                    {analytics.feedback?.totalFeedback || 0}
                  </p>
                  <div className="flex items-center mt-2">
                    <FaArrowUp className="text-green-400 text-sm mr-1" />
                    <span className="text-green-400 text-sm">+18.3%</span>
                  </div>
                </div>
                <div className="p-3 bg-yellow-500/30 rounded-full">
                  <FaDollarSign className="text-yellow-300 text-xl" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-yellow-500/20">
                <div className="flex justify-between text-sm">
                  <span className="text-yellow-200">Avg Rating</span>
                  <span className="text-white">{analytics.feedback?.averageRating?.toFixed(1) || 0}/5</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-yellow-200">Positive</span>
                  <span className="text-white">{analytics.feedback?.positiveCount || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart Selection and Display */}
            <div className="bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <FaChartLine className="text-blue-400" />
                  Growth Trends
                </h3>
                <select
                  value={selectedChart}
                  onChange={(e) => setSelectedChart(e.target.value)}
                  className="enhanced-dropdown px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50"
                >
                  <option value="users" className="bg-gray-800 text-white">Users</option>
                  <option value="ideas" className="bg-gray-800 text-white">Ideas</option>
                  <option value="ideathons" className="bg-gray-800 text-white">Ideathons</option>
                  <option value="feedback" className="bg-gray-800 text-white">Feedback</option>
                  <option value="sustainability" className="bg-gray-800 text-white">Sustainability</option>
                </select>
              </div>
              
              <div className="h-64">
                <SimpleBarChart 
                  data={transformChartData(chartData[selectedChart] || [])} 
                  title={`${selectedChart.charAt(0).toUpperCase() + selectedChart.slice(1)} Over Time`}
                />
              </div>
            </div>

            {/* Ideas by Category */}
            <div className="bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <FaChartPie className="text-green-400" />
                Ideas by Category
              </h3>
              
              <div className="h-64">
                <SimplePieChart 
                  data={transformPieData(analytics.ideasByCategory || [])} 
                  title="Distribution of Ideas by Category"
                />
              </div>
            </div>

            {/* Sustainability Scores */}
            <div className="bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <FaDollarSign className="text-green-400" />
                Sustainability Overview
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Total Assessments</span>
                  <span className="text-white font-bold">{analytics.sustainability?.totalAssessments || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Avg Overall Score</span>
                  <span className="text-white font-bold">{analytics.sustainability?.averageScore?.toFixed(1) || 0}/5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Environmental</span>
                  <span className="text-white font-bold">{analytics.sustainability?.averageEnvironmental?.toFixed(1) || 0}/5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Social</span>
                  <span className="text-white font-bold">{analytics.sustainability?.averageSocial?.toFixed(1) || 0}/5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Economic</span>
                  <span className="text-white font-bold">{analytics.sustainability?.averageEconomic?.toFixed(1) || 0}/5</span>
                </div>
              </div>
            </div>

            {/* User Growth */}
            <div className="bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <FaUsers className="text-blue-400" />
                User Growth
              </h3>
              
              <div className="h-64">
                <SimpleLineChart 
                  data={transformChartData(analytics.userGrowth || [])} 
                  title="Monthly User Registration"
                />
              </div>
            </div>
          </div>

          {/* Report Downloads */}
          <div className="bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <FaDownload className="text-purple-400" />
              Download Reports
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => downloadReport('users')}
                className="enhanced-button flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500/80 to-blue-600/80 text-white rounded-lg hover:from-blue-400/90 hover:to-blue-500/90 transition-all duration-300 backdrop-blur-sm border border-blue-400/30"
              >
                <FaUsers />
                <span>Users Report</span>
              </button>
              
              <button
                onClick={() => downloadReport('ideas')}
                className="enhanced-button flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-500/80 to-green-600/80 text-white rounded-lg hover:from-green-400/90 hover:to-green-500/90 transition-all duration-300 backdrop-blur-sm border border-green-400/30"
              >
                <FaLightbulb />
                <span>Ideas Report</span>
              </button>
              
              <button
                onClick={() => downloadReport('ideathons')}
                className="enhanced-button flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-500/80 to-purple-600/80 text-white rounded-lg hover:from-purple-400/90 hover:to-purple-500/90 transition-all duration-300 backdrop-blur-sm border border-purple-400/30"
              >
                <FaTrophy />
                <span>Ideathons Report</span>
              </button>
              
              <button
                onClick={() => downloadReport('feedback')}
                className="enhanced-button flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-yellow-500/80 to-yellow-600/80 text-white rounded-lg hover:from-yellow-400/90 hover:to-yellow-500/90 transition-all duration-300 backdrop-blur-sm border border-yellow-400/30"
              >
                <FaDollarSign />
                <span>Feedback Report</span>
              </button>
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/10">
              <button
                onClick={() => downloadReport('analytics')}
                className="enhanced-button w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-indigo-500/80 to-indigo-600/80 text-white rounded-lg hover:from-indigo-400/90 hover:to-indigo-500/90 transition-all duration-300 backdrop-blur-sm border border-indigo-400/30"
              >
                <FaChartBar />
                <span>Complete Analytics Report</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsDashboard;