// pages/entrepreneur/OverviewPage.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../hooks/useNotifications";
import { entrepreneurAPI, fundingAPI, ideasAPI } from "../../services/api";
import WelcomeSection from "../../components/entrepreneur/WelcomeSection";
import RecentActivitySection from "../../components/entrepreneur/RecentActivitySection";
import FeedbackCard from "../../components/entrepreneur/FeedbackCard";
import {
  FaLightbulb,
  FaDollarSign,
  FaBriefcase,
  FaBell,
} from "react-icons/fa";

const OverviewPage = () => {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    totalIdeas: 0,
    fundingReceived: 0,
    activeFundingRequests: 0,
    ideas: []
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [metricsData, ideasData, fundingData] = await Promise.all([
        entrepreneurAPI.getDashboardMetrics(),
        ideasAPI.getUserIdeas(),
        fundingAPI.getUserFundingRequests()
      ]);
      
      // Calculate active funding requests
      const activeFundingCount = fundingData?.data ? 
        fundingData.data.filter(req => req.status === 'pending' || req.status === 'negotiated').length : 
        0;
      
      setDashboardData({
        ...metricsData,
        activeFundingRequests: activeFundingCount
      });
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const dashboardCards = [
    {
      title: "My Ideas",
      description: "Startup ideas you've submitted",
      icon: <FaLightbulb className="w-6 h-6" />,
      count: dashboardData.totalIdeas.toString(),
      onClick: () => window.location.href = '/entrepreneur/my-ideas',
    },
    {
      title: "Funding Received",
      description: "Total funding received from investors",
      icon: <FaDollarSign className="w-6 h-6" />,
      count: `$${(dashboardData.fundingReceived / 1000).toFixed(0)}K`,
      onClick: () => window.location.href = '/entrepreneur/funding',
    },
    {
      title: "Active Funding Requests",
      description: "Funding requests awaiting investor response",
      icon: <FaDollarSign className="w-6 h-6" />,
      count: dashboardData.activeFundingRequests.toString(),
      onClick: () => window.location.href = '/entrepreneur/funding',
    },
    {
      title: "Notifications",
      description: "New notifications requiring your attention",
      icon: <FaBell className="w-6 h-6" />,
      count: unreadCount.toString(),
      onClick: () => window.location.href = '/entrepreneur/notifications',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="animate-fade-in">
        <WelcomeSection />
      </div>

      {/* Dashboard Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardCards.map((card, index) => (
          <div
            key={index}
            onClick={card.onClick}
            style={{ animationDelay: `${index * 100}ms` }}
            className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/[0.05] transition-all duration-500 ease-out cursor-pointer group relative overflow-hidden animate-slide-up"
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="text-white/70 group-hover:text-white transition-all duration-500 group-hover:scale-110 transform">
                  {card.icon}
                </div>
                <span className="text-3xl font-bold text-white font-manrope group-hover:scale-110 transition-transform duration-500">
                  {card.count}
                </span>
              </div>
              <h3 className="text-white font-manrope font-semibold text-lg mb-2 group-hover:text-white transition-colors duration-300">
                {card.title}
              </h3>
              <p className="text-white/60 text-sm font-manrope group-hover:text-white/80 transition-colors duration-300">
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden animate-slide-up" style={{ animationDelay: '400ms' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>
        <div className="relative z-10">
          <RecentActivitySection />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-700/50 rounded-2xl p-4 backdrop-blur-xl animate-shake">
          <p className="text-red-200 font-manrope">{error}</p>
        </div>
      )}
    </div>
  );
};

export default OverviewPage;