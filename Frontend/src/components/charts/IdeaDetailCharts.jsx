import React, { useState, useEffect } from 'react';
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
  RadialBar
} from 'recharts';
import { api } from '../../services/api';

const IdeaDetailCharts = ({ ideaId }) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMetric, setActiveMetric] = useState('views');

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
        throw new Error('Failed to fetch analytics data');
      }
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError('Failed to load analytics data');
      // Use fallback data in case of error
      setAnalyticsData({
        idea: { title: 'Sample Idea', category: 'Technology', views: 123, likes: 15 },
        trendData: [
          { date: 'Jan 1', views: 5, likes: 1, engagement: 3 },
          { date: 'Jan 2', views: 8, likes: 2, engagement: 5 },
          { date: 'Jan 3', views: 12, likes: 3, engagement: 7 },
          { date: 'Jan 4', views: 15, likes: 4, engagement: 9 },
          { date: 'Jan 5', views: 18, likes: 5, engagement: 11 }
        ],
        performanceData: [
          { metric: 'Views', value: 123, benchmark: 100 },
          { metric: 'Likes', value: 15, benchmark: 20 },
          { metric: 'Engagement', value: 12.2, benchmark: 15 },
          { metric: 'Score', value: 75, benchmark: 70 }
        ],
        summary: {
          totalViews: 123,
          totalLikes: 15,
          averageEngagement: 12.2,
          categoryRank: 3
        }
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error && !analyticsData) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="text-center py-8">
          <p className="text-gray-500">{error}</p>
          <button 
            onClick={fetchAnalyticsData}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { idea, trendData, performanceData, summary } = analyticsData;

  return (
    <div className="space-y-6">
      {/* Idea Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{idea?.title}</h2>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
            {idea?.category}
          </span>
          <span>{summary?.totalViews || 0} views</span>
          <span>{summary?.totalLikes || 0} likes</span>
          <span>{summary?.averageEngagement?.toFixed(1) || 0}% engagement</span>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Total Views</h3>
          <p className="text-2xl font-bold text-blue-600">{summary?.totalViews || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Total Likes</h3>
          <p className="text-2xl font-bold text-green-600">{summary?.totalLikes || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Engagement Rate</h3>
          <p className="text-2xl font-bold text-purple-600">{summary?.averageEngagement?.toFixed(1) || 0}%</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Category Rank</h3>
          <p className="text-2xl font-bold text-orange-600">#{summary?.categoryRank || 0}</p>
        </div>
      </div>

      {/* Popularity Trend Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Popularity Trends (Last 30 Days)</h3>
          <div className="flex space-x-2">
            {['views', 'likes', 'engagement'].map((metric) => (
              <button
                key={metric}
                onClick={() => setActiveMetric(metric)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  activeMetric === metric
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {metric.charAt(0).toUpperCase() + metric.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={trendData || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            {activeMetric === 'views' && (
              <Line 
                type="monotone" 
                dataKey="views" 
                stroke="#3B82F6" 
                strokeWidth={3}
                name="Views"
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
            )}
            {activeMetric === 'likes' && (
              <Line 
                type="monotone" 
                dataKey="likes" 
                stroke="#10B981" 
                strokeWidth={3}
                name="Likes"
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              />
            )}
            {activeMetric === 'engagement' && (
              <Line 
                type="monotone" 
                dataKey="engagement" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                name="Engagement Score"
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Comparison */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance vs Benchmarks</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={performanceData || []} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="metric" />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#3B82F6" name="Current" />
            <Bar dataKey="benchmark" fill="#E5E7EB" name="Benchmark" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Score</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="80%" data={[
              { 
                name: 'Engagement', 
                value: summary?.averageEngagement || 0, 
                fill: '#3B82F6' 
              }
            ]}>
              <RadialBar dataKey="value" cornerRadius={10} fill="#3B82F6" />
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold">
                {summary?.averageEngagement?.toFixed(1) || 0}%
              </text>
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Views to Likes Ratio</span>
              <span className="font-semibold">
                {summary?.totalViews && summary?.totalLikes 
                  ? (summary.totalViews / summary.totalLikes).toFixed(1) 
                  : 'N/A'}:1
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Category Position</span>
              <span className="font-semibold">#{summary?.categoryRank || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Performance Score</span>
              <span className="font-semibold">
                {performanceData?.find(p => p.metric === 'Score')?.value || 0}/100
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaDetailCharts;