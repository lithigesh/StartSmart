import React, { useState, useEffect } from 'react';
import {
  FaUsers,
  FaLightbulb,
  FaTrophy,
  FaDollarSign,
  FaArrowUp,
  FaDownload,
  FaChartBar,
  FaChartPie
} from 'react-icons/fa';
import { API_BASE } from '../../services/api';
import { 
  SimplePieChart, 
  SimpleBarChart
} from '../../utils/ChartComponents';

// Data transformation helpers
const transformChartData = (data) => {
  if (!data || !Array.isArray(data)) return [];
  
  return data.map(item => {
    let label = 'Unknown';
    
    if (item._id?.day && item._id?.month && item._id?.year) {
      // Format as DD/MM for daily data
      const day = item._id.day.toString().padStart(2, '0');
      const month = item._id.month.toString().padStart(2, '0');
      label = `${day}/${month}`;
    } else if (item._id?.month && item._id?.year) {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      label = `${monthNames[item._id.month - 1]} ${item._id.year}`;
    } else if (item._id?.day && item._id?.month) {
      label = `${item._id.day}/${item._id.month}`;
    } else if (item._id) {
      label = item._id;
    }
    
    return {
      label,
      value: item.count || item.totalAmount || 0
    };
  });
};

const transformPieData = (data) => {
  if (!data || !Array.isArray(data)) return [];
  
  return data.map(item => ({
    label: item._id || 'Unknown',
    value: item.count || item.approved || 0
  }));
};

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Removed dateRange since we removed calendar selection
  // const [dateRange, setDateRange] = useState({
  //   start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
  //   end: new Date().toISOString().split('T')[0]
  // });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAnalytics();
    fetchChartData();
  }, []); // Remove dateRange dependency

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // Remove date range query since we removed calendar selection
      const response = await fetch(`${API_BASE}/api/admin/analytics/dashboard`, {
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
      const types = ['ideas'];
      const chartPromises = types.map(async (type) => {
        const queryParams = new URLSearchParams({
          type
          // Remove dateRange since we removed calendar selection
        });

        const response = await fetch(`${API_BASE}/api/admin/analytics/charts?${queryParams}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) throw new Error(`Failed to fetch ${type} chart data`);
        
        const result = await response.json();
        return { [type]: result.data };
      });

      const chartResults = await Promise.all(chartPromises);
      const combinedChartData = chartResults.reduce((acc, curr) => ({ ...acc, ...curr }), {});
      
      setChartData(combinedChartData);
    } catch (err) {
      console.error('Error fetching chart data:', err);
    }
  };

  const downloadReport = async (reportType) => {
    try {
      const queryParams = new URLSearchParams({
        format: 'json'
        // Remove dateRange since we removed calendar selection
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
      console.error('Download error:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/20 border border-white/50 rounded-lg p-4">
        <p className="text-white/80">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <FaChartBar className="text-white/80" />
          Analytics Dashboard
        </h2>
        <p className="text-white/60 mt-2">Monitor your platform's performance and growth metrics</p>
      </div>

      {analytics && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Users Card */}
            <div className="bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-medium">Total Users</p>
                  <p className="text-2xl font-bold text-white">{analytics.users.totalUsers.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <FaArrowUp className="text-white/60 text-sm mr-1" />
                    <span className="text-white/60 text-sm">+12.5%</span>
                  </div>
                </div>
                <div className="p-3 bg-white/[0.08] border border-white/20 rounded-full">
                  <FaUsers className="text-white/80 text-xl" />
                </div>
              </div>

            </div>

            {/* Ideas Card */}
            <div className="bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-medium">Total Ideas</p>
                  <p className="text-2xl font-bold text-white">{analytics.ideas.totalIdeas.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <FaArrowUp className="text-white/60 text-sm mr-1" />
                    <span className="text-white/60 text-sm">+8.3%</span>
                  </div>
                </div>
                <div className="p-3 bg-white/[0.08] border border-white/20 rounded-full">
                  <FaLightbulb className="text-white/80 text-xl" />
                </div>
              </div>

            </div>

            {/* Ideathons Card */}
            <div className="bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-medium">Total Ideathons</p>
                  <p className="text-2xl font-bold text-white">{analytics.ideathons.totalIdeathons.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <FaArrowUp className="text-white/60 text-sm mr-1" />
                    <span className="text-white/60 text-sm">+5.2%</span>
                  </div>
                </div>
                <div className="p-3 bg-white/[0.08] border border-white/20 rounded-full">
                  <FaTrophy className="text-white/80 text-xl" />
                </div>
              </div>

            </div>

            {/* Feedback Card */}
            <div className="bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-medium">Total Feedback</p>
                  <p className="text-2xl font-bold text-white">{analytics.feedback.totalFeedback.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <FaArrowUp className="text-white/60 text-sm mr-1" />
                    <span className="text-white/60 text-sm">+15.8%</span>
                  </div>
                </div>
                <div className="p-3 bg-white/[0.08] border border-white/20 rounded-full">
                  <FaDollarSign className="text-white/80 text-xl" />
                </div>
              </div>

            </div>
          </div>

          {/* Charts Section */}
          <div className="space-y-6">
            {/* Ideas Growth Trends - Full Width */}
            <div className="bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <FaLightbulb className="text-white/80" />
                  Ideas Growth Trends
                </h3>
                <div className="text-sm text-white/70 bg-white/[0.08] border border-white/20 px-3 py-1 rounded-full">
                  Daily Submissions
                </div>
              </div>
              
              <div className="h-96 w-full overflow-hidden">
                <SimpleBarChart 
                  data={transformChartData(chartData.ideas || [])} 
                  title="Daily Ideas Submissions"
                />
              </div>
            </div>

            {/* Ideas by Category - Full Width */}
            <div className="bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <FaChartPie className="text-white/80" />
                Ideas by Category
              </h3>
              
              <div className="h-96 w-full overflow-hidden">
                <SimplePieChart 
                  data={transformPieData(analytics.ideasByCategory || [])} 
                  title="Distribution of Ideas by Category"
                />
              </div>
            </div>
          </div>

          {/* Report Downloads */}
          <div className="bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <FaDownload className="text-white/80" />
              Download Reports
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => downloadReport('users')}
                className="enhanced-button flex items-center justify-center space-x-2 px-4 py-3 bg-white/[0.08] text-white rounded-lg hover:bg-white/[0.12] transition-all duration-300 backdrop-blur-sm border border-white/20"
              >
                <FaUsers />
                <span>Users Report</span>
              </button>
              
              <button
                onClick={() => downloadReport('ideas')}
                className="enhanced-button flex items-center justify-center space-x-2 px-4 py-3 bg-white/[0.08] text-white rounded-lg hover:bg-white/[0.12] transition-all duration-300 backdrop-blur-sm border border-white/20"
              >
                <FaLightbulb />
                <span>Ideas Report</span>
              </button>
              
              <button
                onClick={() => downloadReport('ideathons')}
                className="enhanced-button flex items-center justify-center space-x-2 px-4 py-3 bg-white/[0.08] text-white rounded-lg hover:bg-white/[0.12] transition-all duration-300 backdrop-blur-sm border border-white/20"
              >
                <FaTrophy />
                <span>Ideathons Report</span>
              </button>
              
              <button
                onClick={() => downloadReport('feedback')}
                className="enhanced-button flex items-center justify-center space-x-2 px-4 py-3 bg-white/[0.08] text-white rounded-lg hover:bg-white/[0.12] transition-all duration-300 backdrop-blur-sm border border-white/20"
              >
                <FaDollarSign />
                <span>Feedback Report</span>
              </button>
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/10">
              <button
                onClick={() => downloadReport('analytics')}
                className="enhanced-button w-full flex items-center justify-center space-x-2 px-4 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-all duration-300 font-medium"
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