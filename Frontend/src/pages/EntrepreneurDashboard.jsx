import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../hooks/useNotifications";
import DashboardHeader from "../components/entrepreneur/DashboardHeader";
import SideBar from "../components/entrepreneur/SideBar";
import WelcomeSection from "../components/entrepreneur/WelcomeSection";
import MyIdeasSection from "../components/entrepreneur/MyIdeasSection";
import RecentActivitySection from "../components/entrepreneur/RecentActivitySection";
import NotificationsPopup from "../components/entrepreneur/NotificationsPopup";
import {
  FaLightbulb,
  FaDollarSign,
  FaBriefcase,
  FaChartBar,
  FaTrophy,
  FaUsers,
  FaBell,
} from "react-icons/fa";

const EntrepreneurDashboard = () => {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();

  // State management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    typeof window !== "undefined" ? window.innerWidth < 1024 : false
  );

  // Refs for scrolling to sections
  const myIdeasRef = useRef(null);
  const analyticsRef = useRef(null);

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  // Calculate dashboard metrics (mock data for now)
  const totalIdeas = 3;
  const fundingReceived = 25000;
  const interestedInvestors = 8;

  const dashboardCards = [
    {
      title: "My Ideas",
      description: "Startup ideas you've submitted",
      icon: <FaLightbulb className="w-6 h-6" />,
      count: totalIdeas.toString(),
      onClick: () => setActiveSection("my-ideas"),
    },
    {
      title: "Funding Received",
      description: "Total funding received from investors",
      icon: <FaDollarSign className="w-6 h-6" />,
      count: `$${(fundingReceived / 1000).toFixed(0)}K`,
      onClick: () => setActiveSection("funding"),
    },
    {
      title: "Interested Investors",
      description: "Investors showing interest in your ideas",
      icon: <FaBriefcase className="w-6 h-6" />,
      count: interestedInvestors.toString(),
      onClick: () => setActiveSection("investors"),
    },
    {
      title: "Notifications",
      description: "New notifications requiring your attention",
      icon: <FaBell className="w-6 h-6" />,
      count: unreadCount.toString(),
      onClick: () => setActiveSection("notifications"),
    },
  ];

  // Render section content based on active section
  const renderSectionContent = () => {
    switch (activeSection) {
      case "overview":
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

            {/* Error Message */}
            {error && (
              <div className="bg-red-900 border border-red-700 rounded-lg p-4">
                <p className="text-red-200">{error}</p>
              </div>
            )}
          </div>
        );

      case "my-ideas":
        return (
          <div className="space-y-6" ref={myIdeasRef}>
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  My Ideas
                </h2>
                <p className="text-white/60">
                  Manage and track your startup ideas
                </p>
              </div>
              <MyIdeasSection showTitle={false} />
            </div>
          </div>
        );

      case "funding":
        return (
          <div className="space-y-6">
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Funding Overview
                </h2>
                <p className="text-white/60">
                  Track your funding progress and investor relationships
                </p>
              </div>
              <div className="text-center py-12">
                <FaDollarSign className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Funding Dashboard Coming Soon
                </h3>
                <p className="text-white/60">
                  Track funding requests, investor communications, and financial progress
                </p>
              </div>
            </div>
          </div>
        );

      case "investors":
        return (
          <div className="space-y-6">
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Interested Investors
                </h2>
                <p className="text-white/60">
                  Connect with investors who are interested in your ideas
                </p>
              </div>
              <div className="text-center py-12">
                <FaBriefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Investor Dashboard Coming Soon
                </h3>
                <p className="text-white/60">
                  View and manage investor interest, communications, and partnerships
                </p>
              </div>
            </div>
          </div>
        );

      case "analytics":
        return (
          <div className="space-y-6" ref={analyticsRef}>
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Analytics & Insights
                </h2>
                <p className="text-white/60">
                  Track performance and gain insights into your startup journey
                </p>
              </div>
              <div className="text-center py-12">
                <FaChartBar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Analytics Dashboard Coming Soon
                </h3>
                <p className="text-white/60">
                  Detailed analytics on idea performance, investor engagement, and growth metrics
                </p>
              </div>
            </div>
          </div>
        );

      case "ideathons":
        return (
          <div className="space-y-6">
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Ideathons & Competitions
                </h2>
                <p className="text-white/60">
                  Participate in startup competitions and showcase your ideas
                </p>
              </div>
              <div className="text-center py-12">
                <FaTrophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Ideathons Coming Soon
                </h3>
                <p className="text-white/60">
                  Join competitions, win prizes, and gain recognition for your innovative ideas
                </p>
              </div>
            </div>
          </div>
        );

      case "collaborations":
        return (
          <div className="space-y-6">
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Collaborations & Networking
                </h2>
                <p className="text-white/60">
                  Connect with other entrepreneurs and build your network
                </p>
              </div>
              <div className="text-center py-12">
                <FaUsers className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Collaboration Hub Coming Soon
                </h3>
                <p className="text-white/60">
                  Network with fellow entrepreneurs, find co-founders, and build partnerships
                </p>
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Notifications
                </h2>
                <p className="text-white/60">
                  Stay updated with the latest activities
                </p>
              </div>
              <NotificationsPopup
                showNotifications={true}
                setShowNotifications={() => {}}
                isFullPage={true}
              />
            </div>
          </div>
        );

      case "settings":
        return (
          <div className="space-y-6">
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Settings
                </h2>
                <p className="text-white/60">
                  Manage your account settings and preferences
                </p>
              </div>
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Settings Coming Soon
                </h3>
                <p className="text-white/60">
                  Customize your profile, notification preferences, and account settings
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <div>
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Coming Soon
                </h2>
                <p className="text-white/60">This section is under development</p>
              </div>
            </div>
          </div>
        );
    }
  };

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarCollapsed(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      {/* Sidebar */}
      <SideBar 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Main Content */}
      <div className="lg:ml-72">
        {/* Header */}
        <DashboardHeader onSectionChange={handleSectionChange} />

        {/* Page Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderSectionContent()}
        </div>
      </div>
    </div>
  );
};

export default EntrepreneurDashboard;
