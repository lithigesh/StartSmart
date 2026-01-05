// pages/entrepreneur/OverviewPage.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../hooks/useNotifications";
import { entrepreneurAPI, fundingAPI, ideasAPI, ideathonsAPI } from "../../services/api";
import { FaLightbulb, FaDollarSign, FaCheckCircle, FaTrophy, FaArrowRight, FaClock } from "react-icons/fa";

const OverviewPage = () => {
  const { user } = useAuth();
  const { notifications } = useNotifications();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalIdeas: 0,
    fundingReceived: 0,
    activeFundingRequests: 0,
    ideathonsRegistered: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [metricsData, ideasData, fundingData, ideathonsData] = await Promise.all([
        entrepreneurAPI.getDashboardMetrics(),
        ideasAPI.getUserIdeas(),
        fundingAPI.getUserFundingRequests(),
        ideathonsAPI.getUserIdeathonRegistrations ? ideathonsAPI.getUserIdeathonRegistrations() : Promise.resolve([]),
      ]);

      // Calculate active funding requests
      const activeFundingCount = fundingData?.data
        ? fundingData.data.filter(
            (req) => req.status === "pending" || req.status === "negotiated"
          ).length
        : 0;

      // Get ideathon count
      const ideathonCount = Array.isArray(ideathonsData) ? ideathonsData.length : 0;

      setStats({
        totalIdeas: metricsData?.totalIdeas || 0,
        fundingReceived: metricsData?.fundingReceived || 0,
        activeFundingRequests: activeFundingCount,
        ideathonsRegistered: ideathonCount,
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
      case "ideathon":
        return <FaTrophy className="w-4 h-4 text-white/60" />;
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
      title: "My Ideas",
      subtitle: "Startup ideas you've submitted",
      value: stats.totalIdeas,
      icon: FaLightbulb,
      href: "/entrepreneur/my-ideas",
      color: "text-white/80",
    },
    {
      title: "Funding Received",
      subtitle: "Total funding received from investors",
      value: `$${(stats.fundingReceived / 1000).toFixed(0)}K`,
      icon: FaDollarSign,
      href: "/entrepreneur/funding",
      color: "text-white/80",
    },
    {
      title: "Active Funding Requests",
      subtitle: "Funding requests awaiting investor response",
      value: stats.activeFundingRequests,
      icon: FaCheckCircle,
      href: "/entrepreneur/funding",
      color: "text-white/80",
    },
    {
      title: "Ideathons Registered",
      subtitle: "Competitions you've joined",
      value: stats.ideathonsRegistered,
      icon: FaTrophy,
      href: "/entrepreneur/ideathons",
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
          Here's your startup journey at a glance
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
              href="/entrepreneur/notifications"
              className="mt-6 block text-center p-3 rounded-lg bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all duration-300 group"
            >
              <p className="text-white/70 font-manrope text-sm font-medium group-hover:text-white transition-colors">
                View all notifications
              </p>
            </a>
          </div>
        </div>

        {/* Getting Started */}
        <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-8 backdrop-blur-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent rounded-2xl pointer-events-none"></div>
          <div className="relative z-10">
            <h2 className="text-xl font-bold text-white font-manrope mb-6">
              Next Steps
            </h2>
            <div className="space-y-3">
              <a
                href="/entrepreneur/my-ideas"
                className="block p-3 rounded-lg bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all duration-300 group"
              >
                <p className="text-white/90 font-manrope text-sm font-medium group-hover:text-white transition-colors">
                  Submit a new startup idea
                </p>
                <p className="text-white/50 font-manrope text-xs mt-1">
                  Share your brilliant concept with investors
                </p>
              </a>

              <a
                href="/entrepreneur/funding"
                className="block p-3 rounded-lg bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all duration-300 group"
              >
                <p className="text-white/90 font-manrope text-sm font-medium group-hover:text-white transition-colors">
                  Request funding
                </p>
                <p className="text-white/50 font-manrope text-xs mt-1">
                  Get the capital you need to scale your startup
                </p>
              </a>

              <a
                href="/entrepreneur/ideathons"
                className="block p-3 rounded-lg bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all duration-300 group"
              >
                <p className="text-white/90 font-manrope text-sm font-medium group-hover:text-white transition-colors">
                  Join competitions
                </p>
                <p className="text-white/50 font-manrope text-xs mt-1">
                  Participate in exciting startup competitions
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

export default OverviewPage;
