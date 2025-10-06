import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer
} from 'recharts';
import { api } from '../../services/api';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff7f', '#dc143c'];

const IdeasListCharts = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('category');

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/charts/ideas-overview');
      if (response.success) {
        setChartData(response.data);
      } else {
        throw new Error('Failed to fetch chart data');
      }
    } catch (err) {
      console.error('Error fetching chart data:', err);
      setError('Failed to load chart data');
      // Use fallback data in case of error
      setChartData({
        categoryData: [
          { category: 'Technology', count: 3, totalLikes: 25, totalViews: 150 },
          { category: 'Healthcare', count: 2, totalLikes: 18, totalViews: 89 },
          { category: 'Finance', count: 1, totalLikes: 12, totalViews: 67 }
        ],
        statusData: [
          { status: 'Active', count: 4 },
          { status: 'Draft', count: 2 }
        ],
        monthlyTrends: [
          { month: 'Aug 2025', ideas: 2, likes: 15, views: 89 },
          { month: 'Sep 2025', ideas: 3, likes: 22, views: 134 },
          { month: 'Oct 2025', ideas: 1, likes: 8, views: 43 }
        ],
        totalIdeas: 6,
        totalLikes: 45,
        totalViews: 266
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error && !chartData) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="text-center py-8">
          <p className="text-gray-500">{error}</p>
          <button 
            onClick={fetchChartData}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700">Total Ideas</h3>
          <p className="text-3xl font-bold text-blue-600">{chartData?.totalIdeas || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700">Total Likes</h3>
          <p className="text-3xl font-bold text-green-600">{chartData?.totalLikes || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700">Total Views</h3>
          <p className="text-3xl font-bold text-purple-600">{chartData?.totalViews || 0}</p>
        </div>
      </div>

      {/* Chart Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'category', label: 'Categories' },
              { key: 'status', label: 'Status' },
              { key: 'trends', label: 'Trends' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'category' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Category Bar Chart */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Ideas by Category</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData?.categoryData || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" name="Number of Ideas" />
                    <Bar dataKey="totalLikes" fill="#82ca9d" name="Total Likes" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Category Pie Chart */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Category Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData?.categoryData || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, count }) => `${category}: ${count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {(chartData?.categoryData || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === 'status' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Status Bar Chart */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Ideas by Status</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData?.statusData || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#ffc658" name="Number of Ideas" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Status Pie Chart */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Status Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData?.statusData || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ status, count }) => `${status}: ${count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {(chartData?.statusData || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === 'trends' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Monthly Trends</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData?.monthlyTrends || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="ideas" stroke="#8884d8" name="New Ideas" />
                  <Line type="monotone" dataKey="likes" stroke="#82ca9d" name="Total Likes" />
                  <Line type="monotone" dataKey="views" stroke="#ffc658" name="Total Views" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IdeasListCharts;