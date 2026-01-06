// pages/investor/InvestorOverviewPage.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../hooks/useNotifications";
import { investorAPI } from "../../services/api";
import { FaLightbulb, FaHeart, FaCheckCircle, FaDollarSign, FaArrowRight, FaClock } from "react-icons/fa";

const InvestorOverviewPage = () => {
  const { user } = useAuth();
  const { notifications } = useNotifications();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalIdeas: 0,
    interestedIdeas: 0,
    activeInvestments: 0,
    totalPortfolioValue: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [ideasData, interestedData, portfolioAnalytics] = await Promise.all([
        investorAPI.getAllIdeas(),
        investorAPI.getInterestedIdeas(),
        investorAPI.getPortfolioAnalytics(),
      ]);

      // Calculate stats
      const totalIdeas = Array.isArray(ideasData) ? ideasData.length : 0;
      const interestedCount = Array.isArray(interestedData) ? interestedData.length : 0;
      
      // Get portfolio data from analytics
      let activeInvestments = 0;
      let portfolioValue = 0;

      if (portfolioAnalytics?.data?.overview) {
        const overview = portfolioAnalytics.data.overview;
        activeInvestments = overview.activeDeals || 0;
        portfolioValue = overview.totalInvested || 0;
      }

      setStats({
        totalIdeas,
        interestedIdeas: interestedCount,
        activeInvestments,
        totalPortfolioValue: portfolioValue,
      });
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "new_idea":
        return <FaLightbulb className="w-4 h-4 text-white/60" />;
      case "funding_update":
        return <FaDollarSign className="w-4 h-4 text-white/60" />;
      case "interest_confirmation":
        return <FaCheckCircle className="w-4 h-4 text-white/60" />;
      case "new_investor":
        return <FaHeart className="w-4 h-4 text-white/60" />;
      default:
        return <FaClock className="w-4 h-4 text-white/60" />;
    }
  };

  const formatTimeAgo = (date) => {
    if (!date) return "just now";
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const cards = [
    {
      title: "Available Ideas",
      subtitle: "Ideas available to invest in",
      value: stats.totalIdeas,
      icon: FaLightbulb,
      href: "/investor/browse",
      color: "text-white/80",
    },
    {
      title: "Interested Ideas",
      subtitle: "Ideas you're interested in",
      value: stats.interestedIdeas,
      icon: FaHeart,
      href: "/investor/interests",
      color: "text-white/80",
    },
    {
      title: "Active Investments",
      subtitle: "Approved and funded deals",
      value: stats.activeInvestments,
      icon: FaCheckCircle,
      href: "/investor/deals",
      color: "text-white/80",
    },
    {
      title: "Portfolio Value",
      subtitle: "Total investment portfolio",
      value: `$${(stats.totalPortfolioValue / 1000).toFixed(0)}K`,
      icon: FaDollarSign,
      href: "/investor/deals",
      color: "text-white/80",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-white font-manrope">
          Welcome back, {user?.name?.split(" ")[0]}
        </h1>
        <p className="text-white/60 font-manrope text-lg">
          Here's your investment portfolio at a glance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <a
              key={index}
              href={card.href}
              onClick={(e) => {
                e.preventDefault();
                window.location.href = card.href;
              }}
              style={{ animationDelay: `${index * 50}ms` }}
              className="group relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/10 p-6 backdrop-blur-xl transition-all duration-300 hover:bg-white/[0.06] hover:border-white/20 cursor-pointer animate-slide-up"
            >
              {/* Subtle gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent rounded-2xl pointer-events-none"></div>

              <div className="relative z-10 flex flex-col">
                {/* Icon and Title */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex flex-col gap-1 flex-1">
                    <h3 className="text-white/90 font-manrope font-semibold text-sm">
                      {card.title}
                    </h3>
                    <p className="text-white/50 font-manrope text-xs">
                      {card.subtitle}
                    </p>
                  </div>
                  <Icon className={`w-5 h-5 ${card.color} opacity-60 group-hover:opacity-100 transition-opacity duration-300 ml-2 flex-shrink-0`} />
                </div>

                {/* Value */}
                <div className="flex items-baseline gap-2 mt-auto">
                  <span className="text-3xl font-bold text-white font-manrope tracking-tight">
                    {card.value}
                  </span>
                </div>

                {/* Hover indicator */}
                <div className="mt-4 flex items-center text-white/40 group-hover:text-white/70 transition-colors duration-300 text-xs font-manrope">
                  <span>View details</span>
                  <FaArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>

              {/* Hover border effect */}
              <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-white/20 transition-colors duration-300 pointer-events-none"></div>
            </a>
          );
        })}
      </div>

      {/* Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Recent Notifications */}
        <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-8 backdrop-blur-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent rounded-2xl pointer-events-none"></div>
          <div className="relative z-10">
            <h2 className="text-xl font-bold text-white font-manrope mb-6">
              Last Notifications
            </h2>
            {notifications.length > 0 ? (
              <div className="space-y-3 max-h-72 overflow-y-auto">
                {notifications.slice(0, 3).map((notification, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white/90 font-manrope text-sm font-medium group-hover:text-white transition-colors truncate">
                          {notification.title || notification.message || "New notification"}
                        </p>
                        <p className="text-white/50 font-manrope text-xs mt-1">
                          {formatTimeAgo(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-white/50 font-manrope text-sm">
                  No recent notifications
                </p>
              </div>
            )}
            <a
              href="/investor/notifications"
              className="mt-6 block text-center p-3 rounded-lg bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all duration-300 group"
            >
              <p className="text-white/70 font-manrope text-sm font-medium group-hover:text-white transition-colors">
                View all notifications
              </p>
            </a>
          </div>
        </div>

        {/* Next Steps */}
        <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-8 backdrop-blur-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent rounded-2xl pointer-events-none"></div>
          <div className="relative z-10">
            <h2 className="text-xl font-bold text-white font-manrope mb-6">
              Next Steps
            </h2>
            <div className="space-y-3">
              <a
                href="/investor/browse"
                className="block p-3 rounded-lg bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all duration-300 group"
              >
                <p className="text-white/90 font-manrope text-sm font-medium group-hover:text-white transition-colors">
                  Browse startup ideas
                </p>
                <p className="text-white/50 font-manrope text-xs mt-1">
                  Discover promising investment opportunities
                </p>
              </a>

              <a
                href="/investor/interests"
                className="block p-3 rounded-lg bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all duration-300 group"
              >
                <p className="text-white/90 font-manrope text-sm font-medium group-hover:text-white transition-colors">
                  View interested ideas
                </p>
                <p className="text-white/50 font-manrope text-xs mt-1">
                  Review ideas you've marked as interesting
                </p>
              </a>

              <a
                href="/investor/deals"
                className="block p-3 rounded-lg bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all duration-300 group"
              >
                <p className="text-white/90 font-manrope text-sm font-medium group-hover:text-white transition-colors">
                  Check your portfolio
                </p>
                <p className="text-white/50 font-manrope text-xs mt-1">
                  Monitor your active investments
                </p>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg border border-white/20 bg-white/[0.03] p-4 backdrop-blur-xl">
          <p className="text-white/70 font-manrope text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default InvestorOverviewPage;
