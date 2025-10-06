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
    interestedInvestors: 0,
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
      
      setDashboardData(metricsData);
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
      title: "Interested Investors",
      description: "Investors showing interest in your ideas",
      icon: <FaBriefcase className="w-6 h-6" />,
      count: dashboardData.interestedInvestors.toString(),
      onClick: () => window.location.href = '/entrepreneur/investors',
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
      <div>
        <WelcomeSection />
      </div>

      {/* Dashboard Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardCards.map((card, index) => (
          <div
            key={index}
            onClick={card.onClick}
            className="bg-gray-900 rounded-lg border border-gray-800 p-6 hover:bg-gray-800 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-400 group-hover:text-white transition-colors">
                {card.icon}
              </div>
              <span className="text-2xl font-bold text-white">
                {card.count}
              </span>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">
              {card.title}
            </h3>
            <p className="text-white/60 text-sm">
              {card.description}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div>
        <RecentActivitySection />
      </div>

      {/* App Feedback Section */}
      <div>
        <FeedbackCard />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900 border border-red-700 rounded-lg p-4">
          <p className="text-red-200">{error}</p>
        </div>
      )}
    </div>
  );
};

export default OverviewPage;