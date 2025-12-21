import React from 'react';
import { FaChartBar, FaChartLine, FaChartPie, FaArrowUp, FaArrowDown } from 'react-icons/fa';

function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            Analytics & Insights
          </h2>
          <p className="text-white/60">
            Track performance and gain insights into your startup journey
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-400">
                <FaChartLine className="w-6 h-6" />
              </div>
              <span className="flex items-center gap-1 text-green-400 text-sm">
                <FaArrowUp className="w-3 h-3" />
                <span>12%</span>
              </span>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">
              Idea Views
            </h3>
            <p className="text-2xl font-bold text-white mb-1">1,234</p>
            <p className="text-white/60 text-sm">Total views this month</p>
          </div>

          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-400">
                <FaChartBar className="w-6 h-6" />
              </div>
              <span className="flex items-center gap-1 text-green-400 text-sm">
                <FaArrowUp className="w-3 h-3" />
                <span>8%</span>
              </span>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">
              Investor Interest
            </h3>
            <p className="text-2xl font-bold text-white mb-1">87</p>
            <p className="text-white/60 text-sm">Interest actions this month</p>
          </div>

          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-400">
                <FaChartPie className="w-6 h-6" />
              </div>
              <span className="flex items-center gap-1 text-red-400 text-sm">
                <FaArrowDown className="w-3 h-3" />
                <span>3%</span>
              </span>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">
              Engagement Rate
            </h3>
            <p className="text-2xl font-bold text-white mb-1">23.4%</p>
            <p className="text-white/60 text-sm">Avg. engagement rate</p>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="text-center py-12 bg-gray-900 rounded-lg border border-gray-800">
          <FaChartBar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Advanced Analytics Coming Soon
          </h3>
          <p className="text-white/60 mb-4">
            Detailed analytics on idea performance, investor engagement, and growth metrics
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <span className="px-4 py-2 bg-gray-800 rounded-lg text-white/70 text-sm">
              Performance Tracking
            </span>
            <span className="px-4 py-2 bg-gray-800 rounded-lg text-white/70 text-sm">
              Investor Insights
            </span>
            <span className="px-4 py-2 bg-gray-800 rounded-lg text-white/70 text-sm">
              Growth Metrics
            </span>
            <span className="px-4 py-2 bg-gray-800 rounded-lg text-white/70 text-sm">
              Competitive Analysis
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;