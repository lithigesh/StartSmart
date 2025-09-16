import React from "react";
import { FaChartBar, FaChartLine, FaEye, FaHeart, FaDollarSign, FaUsers, FaTrophy } from "react-icons/fa";
import SideBar from "../../components/entrepreneur/SideBar";
import DashboardHeader from "../../components/entrepreneur/DashboardHeader";

const AnalyticsPage = () => {
  return (
    <div className="min-h-screen bg-black flex">
      <SideBar />
      
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
              <p className="text-white/60">Track performance and insights for your startup ideas</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <FaEye className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Total Views</p>
                    <p className="text-2xl font-bold text-white">2,847</p>
                    <p className="text-green-400 text-xs">+12% this week</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <FaHeart className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Likes</p>
                    <p className="text-2xl font-bold text-white">156</p>
                    <p className="text-green-400 text-xs">+8% this week</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <FaDollarSign className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Funding Interest</p>
                    <p className="text-2xl font-bold text-white">$750K</p>
                    <p className="text-green-400 text-xs">+25% this month</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <FaUsers className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Investor Interest</p>
                    <p className="text-2xl font-bold text-white">8</p>
                    <p className="text-green-400 text-xs">+3 this week</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <FaChartLine className="text-blue-400" />
                  Views Over Time
                </h3>
                <div className="h-64 flex items-center justify-center">
                  <p className="text-white/60">Chart visualization will be implemented here</p>
                </div>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <FaChartBar className="text-green-400" />
                  Idea Performance
                </h3>
                <div className="h-64 flex items-center justify-center">
                  <p className="text-white/60">Chart visualization will be implemented here</p>
                </div>
              </div>
            </div>

            {/* Top Performing Ideas */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <FaTrophy className="text-yellow-400" />
                Top Performing Ideas
              </h3>
              <div className="space-y-4">
                {[
                  { name: "AI-Powered Smart Home", views: 1250, likes: 89, score: 85 },
                  { name: "Sustainable Packaging", views: 967, likes: 45, score: 92 },
                  { name: "Digital Health Platform", views: 630, likes: 22, score: 78 }
                ].map((idea, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-white/40">#{index + 1}</span>
                      <div>
                        <h4 className="text-white font-medium">{idea.name}</h4>
                        <p className="text-white/60 text-sm">{idea.views} views • {idea.likes} likes</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">Score: {idea.score}/100</p>
                      <div className="w-24 bg-white/10 rounded-full h-2 mt-1">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                          style={{ width: `${idea.score}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;