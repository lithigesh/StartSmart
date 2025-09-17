import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../hooks/useNotifications";
import { entrepreneurAPI, fundingAPI, ideasAPI, ideathonsAPI, collaborationsAPI } from "../../services/api";
import DashboardHeader from "./DashboardHeader";
import SideBar from "./SideBar";
import WelcomeSection from "./WelcomeSection";
import MyIdeasSection from "./MyIdeasSection";
import RecentActivitySection from "./RecentActivitySection";
import NotificationsPopup from "./NotificationsPopup";
import {
  FaLightbulb,
  FaDollarSign,
  FaBriefcase,
  FaChartBar,
  FaTrophy,
  FaUsers,
  FaBell,
  FaPlus,
  FaCheck,
  FaTimes,
  FaClock,
  FaEdit,
  FaEye,
  FaFileContract,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaExternalLinkAlt,
  FaUserFriends,
  FaFlag,
  FaGift,
  FaRegClock,
  FaHandshake,
  FaBuilding,
  FaTag,
  FaFilter,
  FaPaperPlane,
  FaClipboardList
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

  // Dashboard metrics state
  const [dashboardMetrics, setDashboardMetrics] = useState({
    totalIdeas: 0,
    fundingReceived: 0,
    interestedInvestors: 0
  });

  // Refs for scrolling to sections
  const myIdeasRef = useRef(null);
  const analyticsRef = useRef(null);

  // Fetch dashboard metrics on component mount
  useEffect(() => {
    fetchDashboardMetrics();
  }, []);

  const fetchDashboardMetrics = async () => {
    try {
      setLoading(true);
      const metrics = await entrepreneurAPI.getDashboardMetrics();
      setDashboardMetrics(metrics);
    } catch (err) {
      console.error('Error fetching dashboard metrics:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const dashboardCards = [
    {
      title: "My Ideas",
      description: "Startup ideas you've submitted",
      icon: <FaLightbulb className="w-6 h-6" />,
      count: dashboardMetrics.totalIdeas.toString(),
      onClick: () => setActiveSection("my-ideas"),
    },
    {
      title: "Funding Received",
      description: "Total funding received from investors",
      icon: <FaDollarSign className="w-6 h-6" />,
      count: `$${(dashboardMetrics.fundingReceived / 1000).toFixed(0)}K`,
      onClick: () => setActiveSection("funding"),
    },
    {
      title: "Interested Investors",
      description: "Investors showing interest in your ideas",
      icon: <FaBriefcase className="w-6 h-6" />,
      count: dashboardMetrics.interestedInvestors.toString(),
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
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-black  border border-white/10 rounded-lg p-6 hover:bg-gray-900 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <FaDollarSign className="w-6 h-6 text-white" />
                    <span className="text-2xl font-bold text-white">$750K</span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">Total Requested</h3>
                  <p className="text-white/60 text-sm">Amount across all requests</p>
                </div>

                <div className="bg-black  border border-white/10 rounded-lg p-6 hover:bg-gray-900 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <FaCheck className="w-6 h-6 text-white" />
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">Approved</h3>
                  <p className="text-white/60 text-sm">Successfully funded requests</p>
                </div>

                <div className="bg-black  border border-white/10 rounded-lg p-6 hover:bg-gray-900 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <FaClock className="w-6 h-6 text-white" />
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">Pending</h3>
                  <p className="text-white/60 text-sm">Awaiting review</p>
                </div>

                <div className="bg-black  border border-white/10 rounded-lg p-6 hover:bg-gray-900 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <FaFileContract className="w-6 h-6 text-white" />
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">Total Requests</h3>
                  <p className="text-white/60 text-sm">All funding applications</p>
                </div>
              </div>

              {/* Funding Requests List */}
              <div className="bg-black  border border-white/10 rounded-lg overflow-hidden">
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-white">Your Funding Requests</h3>
                      <p className="text-white/60 mt-1">Manage and track your funding applications</p>
                    </div>
                    <button className="flex items-center gap-2 bg-black hover:bg-gray-900 border border-white/10 hover:border-white/20 text-white px-4 py-2 rounded-lg transition-all duration-300  font-manrope">
                      <FaPlus className="w-4 h-4" />
                      Create Request
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-white/10">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-white mb-1">AI-Powered Marketing Platform</h4>
                        <p className="text-white/60 text-sm mb-2">Revolutionary AI platform for automated marketing campaigns with machine learning algorithms</p>
                        <div className="flex items-center gap-4 text-sm text-white/60">
                          <span className="flex items-center gap-1">
                            <FaDollarSign className="w-3 h-3" />
                            $500,000
                          </span>
                          <span className="flex items-center gap-1">
                            <FaUsers className="w-3 h-3" />
                            15% equity
                          </span>
                          <span className="flex items-center gap-1">
                            <FaCalendarAlt className="w-3 h-3" />
                            Jan 15, 2024
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border text-white bg-gray-800 border-gray-600">
                          <FaClock className="w-4 h-4" />
                          Pending
                        </span>
                        <button className="text-white/60 hover:text-white p-1">
                          <FaEye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-white mb-1">Smart Home Automation</h4>
                        <p className="text-white/60 text-sm mb-2">IoT-based home automation system with AI integration for energy efficiency</p>
                        <div className="flex items-center gap-4 text-sm text-white/60">
                          <span className="flex items-center gap-1">
                            <FaDollarSign className="w-3 h-3" />
                            $250,000
                          </span>
                          <span className="flex items-center gap-1">
                            <FaUsers className="w-3 h-3" />
                            10% equity
                          </span>
                          <span className="flex items-center gap-1">
                            <FaCalendarAlt className="w-3 h-3" />
                            Jan 10, 2024
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border text-white bg-gray-800 border-gray-600">
                          <FaCheck className="w-4 h-4" />
                          Approved
                        </span>
                        <button className="text-white/60 hover:text-white p-1">
                          <FaEye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 p-3 bg-gray-800 border border-gray-600 rounded">
                      <p className="text-white text-sm">
                        Valuation: $2,500,000
                      </p>
                    </div>
                  </div>
                </div>
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
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-black  border border-white/10 rounded-lg p-6 hover:bg-gray-900 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <FaBriefcase className="w-6 h-6 text-white" />
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">Total Investors</h3>
                  <p className="text-white/60 text-sm">Showing interest</p>
                </div>

                <div className="bg-black  border border-white/10 rounded-lg p-6 hover:bg-gray-900 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <FaCheck className="w-6 h-6 text-white" />
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">High Interest</h3>
                  <p className="text-white/60 text-sm">Priority investors</p>
                </div>

                <div className="bg-black  border border-white/10 rounded-lg p-6 hover:bg-gray-900 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <FaUsers className="w-6 h-6 text-white" />
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">Active</h3>
                  <p className="text-white/60 text-sm">Ongoing communications</p>
                </div>

                <div className="bg-black  border border-white/10 rounded-lg p-6 hover:bg-gray-900 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <FaCalendarAlt className="w-6 h-6 text-orange-400" />
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">Meetings</h3>
                  <p className="text-white/60 text-sm">Scheduled meetings</p>
                </div>
              </div>

              {/* Investors List */}
              <div className="bg-black  border border-white/10 rounded-lg overflow-hidden">
                <div className="p-6 border-b border-white/10">
                  <h3 className="text-xl font-semibold text-white">Investor Interest</h3>
                  <p className="text-white/60 mt-1">Manage your investor relationships</p>
                </div>
                
                <div className="divide-y divide-white/10">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-white">TechVentures Capital</h4>
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium border text-white bg-gray-800 border-gray-600">
                            High Interest
                          </span>
                        </div>
                        <div className="text-white/60 text-sm mb-2">
                          <p className="mb-1"><span className="font-medium">Company:</span> TechVentures Capital</p>
                          <p className="mb-1"><span className="font-medium">Interested in:</span> AI-Powered Marketing Platform</p>
                          <p className="mb-1"><span className="font-medium">Investment Range:</span> $500K - $1M</p>
                        </div>
                        <p className="text-white/80 text-sm mb-3 bg-white/5 rounded p-2">
                          "Very interested in your AI marketing platform. Would like to schedule a meeting to discuss investment opportunities."
                        </p>
                      </div>
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium border text-white bg-gray-800 border-gray-600">
                        Pending
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-white">Green Tech Investments</h4>
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium border text-white bg-gray-800 border-gray-600">
                            Medium Interest
                          </span>
                        </div>
                        <div className="text-white/60 text-sm mb-2">
                          <p className="mb-1"><span className="font-medium">Company:</span> Green Tech Investments</p>
                          <p className="mb-1"><span className="font-medium">Interested in:</span> Smart Home Automation</p>
                          <p className="mb-1"><span className="font-medium">Investment Range:</span> $250K - $500K</p>
                        </div>
                        <p className="text-white/80 text-sm mb-3 bg-white/5 rounded p-2">
                          "Interested in your IoT solution. Could you provide more details about the technology stack?"
                        </p>
                      </div>
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium border text-white bg-gray-800 border-gray-600">
                        Contacted
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-white">Impact Ventures</h4>
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium border text-white bg-gray-800 border-gray-600">
                            High Interest
                          </span>
                        </div>
                        <div className="text-white/60 text-sm mb-2">
                          <p className="mb-1"><span className="font-medium">Company:</span> Impact Ventures</p>
                          <p className="mb-1"><span className="font-medium">Interested in:</span> Sustainable Fashion Marketplace</p>
                          <p className="mb-1"><span className="font-medium">Investment Range:</span> $100K - $300K</p>
                        </div>
                        <p className="text-white/80 text-sm mb-3 bg-white/5 rounded p-2">
                          "Love the sustainability angle. This aligns perfectly with our ESG investment thesis."
                        </p>
                      </div>
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium border text-white bg-gray-800 border-gray-600">
                        Meeting Scheduled
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "analytics":
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
              
              {/* Overview Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-black  border border-white/10 rounded-lg p-6 hover:bg-gray-900 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <FaLightbulb className="w-6 h-6 text-white" />
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">Total Ideas</h3>
                  <p className="text-white/60 text-sm">Ideas submitted</p>
                </div>

                <div className="bg-black  border border-white/10 rounded-lg p-6 hover:bg-gray-900 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <FaEye className="w-6 h-6 text-white" />
                    <span className="text-2xl font-bold text-white">1,247</span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">Total Views</h3>
                  <p className="text-white/60 text-sm">All-time views</p>
                </div>

                <div className="bg-black  border border-white/10 rounded-lg p-6 hover:bg-gray-900 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <FaUsers className="w-6 h-6 text-white" />
                    <span className="text-2xl font-bold text-white">8</span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">Investor Interest</h3>
                  <p className="text-white/60 text-sm">Interested investors</p>
                </div>

                <div className="bg-black  border border-white/10 rounded-lg p-6 hover:bg-gray-900 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <FaChartBar className="w-6 h-6 text-white" />
                    <span className="text-2xl font-bold text-white">12.5%</span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">Conversion Rate</h3>
                  <p className="text-white/60 text-sm">Views to interest</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Idea Performance */}
                <div className="bg-black  border border-white/10 rounded-lg overflow-hidden">
                  <div className="p-6 border-b border-white/10">
                    <h3 className="text-xl font-semibold text-white">Idea Performance</h3>
                    <p className="text-white/60 mt-1">Performance metrics for each idea</p>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="bg-gray-900 border border-white/5 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="text-white font-medium mb-1">AI-Powered Marketing Platform</h4>
                            <div className="flex items-center gap-4 text-sm text-white/60">
                              <span className="flex items-center gap-1">
                                <FaEye className="w-3 h-3" />
                                687 views
                              </span>
                              <span className="flex items-center gap-1">
                                <FaUsers className="w-3 h-3" />
                                5 interested
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-white/60">18.2%</span>
                            <span className="text-white">↑</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white/50">Funding: $500,000</span>
                          <span className="px-2 py-1 rounded bg-gray-800 text-white">active</span>
                        </div>
                      </div>

                      <div className="bg-gray-900 border border-white/5 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="text-white font-medium mb-1">Smart Home Automation</h4>
                            <div className="flex items-center gap-4 text-sm text-white/60">
                              <span className="flex items-center gap-1">
                                <FaEye className="w-3 h-3" />
                                423 views
                              </span>
                              <span className="flex items-center gap-1">
                                <FaUsers className="w-3 h-3" />
                                2 interested
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-white/60">8.5%</span>
                            <span className="text-gray-400">→</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white/50">Funding: $250,000</span>
                          <span className="px-2 py-1 rounded bg-gray-800 text-white">active</span>
                        </div>
                      </div>

                      <div className="bg-gray-900 border border-white/5 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="text-white font-medium mb-1">Sustainable Fashion Marketplace</h4>
                            <div className="flex items-center gap-4 text-sm text-white/60">
                              <span className="flex items-center gap-1">
                                <FaEye className="w-3 h-3" />
                                137 views
                              </span>
                              <span className="flex items-center gap-1">
                                <FaUsers className="w-3 h-3" />
                                1 interested
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-white/60">4.3%</span>
                            <span className="text-white">↓</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white/50">Funding: $0</span>
                          <span className="px-2 py-1 rounded bg-gray-800 text-gray-400">concept</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Monthly Performance */}
                <div className="bg-black  border border-white/10 rounded-lg overflow-hidden">
                  <div className="p-6 border-b border-white/10">
                    <h3 className="text-xl font-semibold text-white">Monthly Performance</h3>
                    <p className="text-white/60 mt-1">Views and engagement over time</p>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2">
                        <span className="text-white font-medium w-12">Jan</span>
                        <div className="flex-1 mx-4">
                          <div className="flex items-center gap-2 text-sm text-white/60">
                            <div className="flex items-center gap-1">
                              <FaEye className="w-3 h-3" />
                              <span>145</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FaUsers className="w-3 h-3" />
                              <span>2</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FaDollarSign className="w-3 h-3" />
                              <span>$0K</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between py-2">
                        <span className="text-white font-medium w-12">Feb</span>
                        <div className="flex-1 mx-4">
                          <div className="flex items-center gap-2 text-sm text-white/60">
                            <div className="flex items-center gap-1">
                              <FaEye className="w-3 h-3" />
                              <span>289</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FaUsers className="w-3 h-3" />
                              <span>3</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FaDollarSign className="w-3 h-3" />
                              <span>$150K</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between py-2">
                        <span className="text-white font-medium w-12">Mar</span>
                        <div className="flex-1 mx-4">
                          <div className="flex items-center gap-2 text-sm text-white/60">
                            <div className="flex items-center gap-1">
                              <FaEye className="w-3 h-3" />
                              <span>432</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FaUsers className="w-3 h-3" />
                              <span>1</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FaDollarSign className="w-3 h-3" />
                              <span>$0K</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between py-2">
                        <span className="text-white font-medium w-12">Apr</span>
                        <div className="flex-1 mx-4">
                          <div className="flex items-center gap-2 text-sm text-white/60">
                            <div className="flex items-center gap-1">
                              <FaEye className="w-3 h-3" />
                              <span>381</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FaUsers className="w-3 h-3" />
                              <span>2</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FaDollarSign className="w-3 h-3" />
                              <span>$250K</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-black  border border-white/10 rounded-lg overflow-hidden">
                <div className="p-6 border-b border-white/10">
                  <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
                  <p className="text-white/60 mt-1">Latest activities and achievements</p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-gray-900 rounded-lg">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-white text-sm">TechVentures Capital showed interest in AI-Powered Marketing Platform</p>
                        <p className="text-white/50 text-xs mt-1">Jan 15, 2024 at 10:00 AM</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-gray-900 rounded-lg">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-white text-sm">Received $250K funding for Smart Home Automation</p>
                        <p className="text-white/50 text-xs mt-1">Jan 12, 2024 at 2:30 PM</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-gray-900 rounded-lg">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-white text-sm">Meeting scheduled with Impact Ventures</p>
                        <p className="text-white/50 text-xs mt-1">Jan 8, 2024 at 9:15 AM</p>
                      </div>
                    </div>
                  </div>
                </div>
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
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-black  border border-white/10 rounded-lg p-6 hover:bg-gray-900 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <FaTrophy className="w-6 h-6 text-white" />
                    <span className="text-2xl font-bold text-white">4</span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">Available</h3>
                  <p className="text-white/60 text-sm">Active competitions</p>
                </div>

                <div className="bg-black  border border-white/10 rounded-lg p-6 hover:bg-gray-900 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <FaUserFriends className="w-6 h-6 text-white" />
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">Registered</h3>
                  <p className="text-white/60 text-sm">Your registrations</p>
                </div>

                <div className="bg-black  border border-white/10 rounded-lg p-6 hover:bg-gray-900 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <FaGift className="w-6 h-6 text-white" />
                    <span className="text-2xl font-bold text-white">$305K</span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">Total Prizes</h3>
                  <p className="text-white/60 text-sm">Available winnings</p>
                </div>

                <div className="bg-black  border border-white/10 rounded-lg p-6 hover:bg-gray-900 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <FaFlag className="w-6 h-6 text-white" />
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">Submitted</h3>
                  <p className="text-white/60 text-sm">Ideas submitted</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Available Ideathons */}
                <div className="bg-black  border border-white/10 rounded-lg overflow-hidden">
                  <div className="p-6 border-b border-white/10">
                    <h3 className="text-xl font-semibold text-white">Available Competitions</h3>
                    <p className="text-white/60 mt-1">Discover and join exciting challenges</p>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="bg-gray-900 border border-white/5 rounded-lg p-4 hover:bg-gray-800 transition-all duration-300">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="text-white font-medium">Global Innovation Challenge 2024</h4>
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium border text-white bg-gray-800 border-gray-600">
                                Active
                              </span>
                            </div>
                            <p className="text-white/60 text-sm mb-2">A worldwide competition for groundbreaking innovations</p>
                            <div className="flex items-center gap-4 text-xs text-white/50">
                              <span className="flex items-center gap-1">
                                <FaGift className="w-3 h-3" />
                                $100K Prize
                              </span>
                              <span className="flex items-center gap-1">
                                <FaUsers className="w-3 h-3" />
                                2,847 participants
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-white/50 flex items-center gap-1">
                            <FaRegClock className="w-3 h-3" />
                            Deadline: Mar 15, 2024
                          </span>
                          <button className="bg-black hover:bg-gray-900 border border-white/10 hover:border-white/20 text-white px-3 py-1 rounded text-sm transition-all duration-300">
                            Register
                          </button>
                        </div>
                      </div>

                      <div className="bg-gray-900 border border-white/5 rounded-lg p-4 hover:bg-gray-800 transition-all duration-300">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="text-white font-medium">AI for Good Hackathon</h4>
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium border text-white bg-gray-800 border-gray-600">
                                Active
                              </span>
                            </div>
                            <p className="text-white/60 text-sm mb-2">Develop AI solutions for social impact</p>
                            <div className="flex items-center gap-4 text-xs text-white/50">
                              <span className="flex items-center gap-1">
                                <FaGift className="w-3 h-3" />
                                $50K Prize
                              </span>
                              <span className="flex items-center gap-1">
                                <FaUsers className="w-3 h-3" />
                                1,456 participants
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-white/50 flex items-center gap-1">
                            <FaRegClock className="w-3 h-3" />
                            Deadline: Feb 28, 2024
                          </span>
                          <button className="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white px-3 py-1 rounded text-sm transition-all duration-300">
                            Registered
                          </button>
                        </div>
                      </div>

                      <div className="bg-gray-900 border border-white/5 rounded-lg p-4 hover:bg-gray-800 transition-all duration-300">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="text-white font-medium">Green Tech Innovation Awards</h4>
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium border text-white bg-gray-800 border-gray-600">
                                Upcoming
                              </span>
                            </div>
                            <p className="text-white/60 text-sm mb-2">Sustainable technology solutions</p>
                            <div className="flex items-center gap-4 text-xs text-white/50">
                              <span className="flex items-center gap-1">
                                <FaGift className="w-3 h-3" />
                                $75K Prize
                              </span>
                              <span className="flex items-center gap-1">
                                <FaUsers className="w-3 h-3" />
                                892 participants
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-white/50 flex items-center gap-1">
                            <FaRegClock className="w-3 h-3" />
                            Deadline: Apr 30, 2024
                          </span>
                          <button className="bg-black hover:bg-gray-900 border border-white/10 hover:border-white/20 text-white px-3 py-1 rounded text-sm transition-all duration-300">
                            Register
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Your Registrations */}
                <div className="bg-black  border border-white/10 rounded-lg overflow-hidden">
                  <div className="p-6 border-b border-white/10">
                    <h3 className="text-xl font-semibold text-white">Your Registrations</h3>
                    <p className="text-white/60 mt-1">Track your competition progress</p>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="bg-gray-900 border border-white/5 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="text-white font-medium">Global Innovation Challenge 2024</h4>
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium border text-white bg-gray-800 border-gray-600">
                                Registered
                              </span>
                            </div>
                            <div className="text-white/60 text-sm mb-2">
                              <p className="mb-1"><span className="font-medium">Team:</span> InnovatorsUnited</p>
                              <p className="mb-1"><span className="font-medium">Members:</span> 3 people</p>
                              <p><span className="font-medium">Registered:</span> Jan 5, 2024</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="bg-black hover:bg-gray-900 border border-white/10 hover:border-white/20 text-white px-3 py-1 rounded text-sm transition-all duration-300 flex items-center gap-1">
                            <FaEye className="w-3 h-3" />
                            View Details
                          </button>
                          <button className="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white px-3 py-1 rounded text-sm transition-all duration-300">
                            Submit Idea
                          </button>
                        </div>
                      </div>

                      <div className="bg-gray-900 border border-white/5 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="text-white font-medium">AI for Good Hackathon</h4>
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium border text-white bg-gray-800 border-gray-600">
                                Submitted
                              </span>
                            </div>
                            <div className="text-white/60 text-sm mb-2">
                              <p className="mb-1"><span className="font-medium">Team:</span> AI Impact</p>
                              <p className="mb-1"><span className="font-medium">Members:</span> 4 people</p>
                              <p><span className="font-medium">Submitted:</span> Jan 10, 2024</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="bg-black hover:bg-gray-900 border border-white/10 hover:border-white/20 text-white px-3 py-1 rounded text-sm transition-all duration-300 flex items-center gap-1">
                            <FaEye className="w-3 h-3" />
                            View Submission
                          </button>
                          <button className="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white px-3 py-1 rounded text-sm transition-all duration-300 flex items-center gap-1">
                            <FaExternalLinkAlt className="w-3 h-3" />
                            Track Progress
                          </button>
                        </div>
                      </div>

                      <div className="text-center py-6">
                        <button className="bg-black hover:bg-gray-900 border border-white/10 hover:border-white/20 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 mx-auto">
                          <FaPlus className="w-4 h-4" />
                          Join More Competitions
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Competition Categories */}
              <div className="bg-black  border border-white/10 rounded-lg overflow-hidden">
                <div className="p-6 border-b border-white/10">
                  <h3 className="text-xl font-semibold text-white">Competition Categories</h3>
                  <p className="text-white/60 mt-1">Explore different types of competitions</p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-900 rounded-lg hover:bg-gray-800 transition-all duration-300 cursor-pointer">
                      <FaLightbulb className="w-8 h-8 text-white mx-auto mb-2" />
                      <h4 className="text-white font-medium text-sm mb-1">Innovation</h4>
                      <p className="text-white/60 text-xs">2 competitions</p>
                    </div>
                    <div className="text-center p-4 bg-gray-900 rounded-lg hover:bg-gray-800 transition-all duration-300 cursor-pointer">
                      <FaChartBar className="w-8 h-8 text-white mx-auto mb-2" />
                      <h4 className="text-white font-medium text-sm mb-1">AI & Tech</h4>
                      <p className="text-white/60 text-xs">1 competition</p>
                    </div>
                    <div className="text-center p-4 bg-gray-900 rounded-lg hover:bg-gray-800 transition-all duration-300 cursor-pointer">
                      <div className="w-8 h-8 text-white mx-auto mb-2 flex items-center justify-center">
                        🌱
                      </div>
                      <h4 className="text-white font-medium text-sm mb-1">Sustainability</h4>
                      <p className="text-white/60 text-xs">1 competition</p>
                    </div>
                    <div className="text-center p-4 bg-gray-900 rounded-lg hover:bg-gray-800 transition-all duration-300 cursor-pointer">
                      <FaDollarSign className="w-8 h-8 text-white mx-auto mb-2" />
                      <h4 className="text-white font-medium text-sm mb-1">FinTech</h4>
                      <p className="text-white/60 text-xs">0 active</p>
                    </div>
                  </div>
                </div>
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
                  Collaborations & Partnerships
                </h2>
                <p className="text-white/60">
                  Discover collaboration opportunities and build strategic partnerships
                </p>
              </div>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-black  border border-white/10 rounded-lg p-6 hover:bg-gray-900 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <FaHandshake className="w-6 h-6 text-white" />
                    <span className="text-2xl font-bold text-white">5</span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">Available</h3>
                  <p className="text-white/60 text-sm">Open opportunities</p>
                </div>

                <div className="bg-black  border border-white/10 rounded-lg p-6 hover:bg-gray-900 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <FaPaperPlane className="w-6 h-6 text-white" />
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">Applied</h3>
                  <p className="text-white/60 text-sm">Applications sent</p>
                </div>

                <div className="bg-black  border border-white/10 rounded-lg p-6 hover:bg-gray-900 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <FaCheck className="w-6 h-6 text-white" />
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">Accepted</h3>
                  <p className="text-white/60 text-sm">Active partnerships</p>
                </div>

                <div className="bg-black  border border-white/10 rounded-lg p-6 hover:bg-gray-900 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <FaDollarSign className="w-6 h-6 text-white" />
                    <span className="text-2xl font-bold text-white">87%</span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">Match Rate</h3>
                  <p className="text-white/60 text-sm">Average compatibility</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Available Opportunities */}
                <div className="lg:col-span-2 bg-black  border border-white/10 rounded-lg overflow-hidden">
                  <div className="p-6 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-white">Available Opportunities</h3>
                        <p className="text-white/60 mt-1">Find your next collaboration partner</p>
                      </div>
                      <button className="bg-black hover:bg-gray-900 border border-white/10 hover:border-white/20 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2">
                        <FaFilter className="w-4 h-4" />
                        Filter
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="bg-gray-900 border border-white/5 rounded-lg p-5 hover:bg-gray-800 transition-all duration-300">
                        <div className="flex items-start gap-4">
                          <img 
                            src="https://via.placeholder.com/50x50/3B82F6/ffffff?text=MT" 
                            alt="MedTech"
                            className="w-12 h-12 rounded-lg"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="text-white font-medium text-lg">AI Healthcare Platform Partnership</h4>
                                <p className="text-white font-medium">MedTech Innovations</p>
                              </div>
                              <span className="bg-gray-800 text-white px-2 py-1 rounded text-xs font-medium border border-gray-600">
                                92% Match
                              </span>
                            </div>
                            <p className="text-white/60 text-sm mb-3">
                              Looking for AI/ML experts to develop predictive healthcare analytics platform
                            </p>
                            <div className="flex flex-wrap gap-2 mb-3">
                              <span className="bg-gray-800 text-white/80 px-2 py-1 rounded text-xs">Machine Learning</span>
                              <span className="bg-gray-800 text-white/80 px-2 py-1 rounded text-xs">Python</span>
                              <span className="bg-gray-800 text-white/80 px-2 py-1 rounded text-xs">Healthcare</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-xs text-white/50">
                                <span className="flex items-center gap-1">
                                  <FaDollarSign className="w-3 h-3" />
                                  $75K - $150K
                                </span>
                                <span className="flex items-center gap-1">
                                  <FaMapMarkerAlt className="w-3 h-3" />
                                  San Francisco, CA
                                </span>
                                <span className="flex items-center gap-1">
                                  <FaUsers className="w-3 h-3" />
                                  23 applicants
                                </span>
                              </div>
                              <button className="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300">
                                Apply Now
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-900 border border-white/5 rounded-lg p-5 hover:bg-gray-800 transition-all duration-300">
                        <div className="flex items-start gap-4">
                          <img 
                            src="https://via.placeholder.com/50x50/10B981/ffffff?text=GT" 
                            alt="GreenTech"
                            className="w-12 h-12 rounded-lg"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="text-white font-medium text-lg">Sustainable Energy IoT Project</h4>
                                <p className="text-white font-medium">GreenTech Solutions</p>
                              </div>
                              <span className="bg-gray-800 text-white px-2 py-1 rounded text-xs font-medium border border-gray-600">
                                87% Match
                              </span>
                            </div>
                            <p className="text-white/60 text-sm mb-3">
                              Collaborate on IoT sensors for smart grid optimization and renewable energy management
                            </p>
                            <div className="flex flex-wrap gap-2 mb-3">
                              <span className="bg-gray-800 text-white/80 px-2 py-1 rounded text-xs">IoT Development</span>
                              <span className="bg-gray-800 text-white/80 px-2 py-1 rounded text-xs">React</span>
                              <span className="bg-gray-800 text-white/80 px-2 py-1 rounded text-xs">Node.js</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-xs text-white/50">
                                <span className="flex items-center gap-1">
                                  <FaDollarSign className="w-3 h-3" />
                                  $50K - $100K
                                </span>
                                <span className="flex items-center gap-1">
                                  <FaMapMarkerAlt className="w-3 h-3" />
                                  Austin, TX
                                </span>
                                <span className="flex items-center gap-1">
                                  <FaUsers className="w-3 h-3" />
                                  18 applicants
                                </span>
                              </div>
                              <button className="bg-black hover:bg-gray-900 border border-white/10 hover:border-white/20 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300">
                                Apply Now
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-900 border border-white/5 rounded-lg p-5 hover:bg-gray-800 transition-all duration-300">
                        <div className="flex items-start gap-4">
                          <img 
                            src="https://via.placeholder.com/50x50/F59E0B/ffffff?text=SB" 
                            alt="SecureBank"
                            className="w-12 h-12 rounded-lg"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="text-white font-medium text-lg">Fintech Security Solutions</h4>
                                <p className="text-white font-medium">SecureBank</p>
                              </div>
                              <span className="bg-gray-800 text-white px-2 py-1 rounded text-xs font-medium border border-gray-600">
                                95% Match
                              </span>
                            </div>
                            <p className="text-white/60 text-sm mb-3">
                              Partner to develop blockchain-based security solutions for digital banking
                            </p>
                            <div className="flex flex-wrap gap-2 mb-3">
                              <span className="bg-gray-800 text-white/80 px-2 py-1 rounded text-xs">Blockchain</span>
                              <span className="bg-gray-800 text-white/80 px-2 py-1 rounded text-xs">Cybersecurity</span>
                              <span className="bg-gray-800 text-white/80 px-2 py-1 rounded text-xs">Fintech</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-xs text-white/50">
                                <span className="flex items-center gap-1">
                                  <FaDollarSign className="w-3 h-3" />
                                  $100K - $200K
                                </span>
                                <span className="flex items-center gap-1">
                                  <FaMapMarkerAlt className="w-3 h-3" />
                                  New York, NY
                                </span>
                                <span className="flex items-center gap-1">
                                  <FaUsers className="w-3 h-3" />
                                  12 applicants
                                </span>
                              </div>
                              <button className="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300">
                                Applied
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Applications & Activity */}
                <div className="space-y-6">
                  {/* Your Applications */}
                  <div className="bg-black  border border-white/10 rounded-lg overflow-hidden">
                    <div className="p-6 border-b border-white/10">
                      <h3 className="text-xl font-semibold text-white">Your Applications</h3>
                      <p className="text-white/60 mt-1">Track application status</p>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        <div className="bg-gray-900 border border-white/5 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-white font-medium text-sm">AI Healthcare Platform</h4>
                            <span className="bg-gray-800 text-white px-2 py-1 rounded text-xs font-medium border border-gray-600">
                              Pending
                            </span>
                          </div>
                          <p className="text-white/60 text-xs mb-2">MedTech Innovations</p>
                          <p className="text-white/50 text-xs">Applied 2 days ago</p>
                        </div>

                        <div className="bg-gray-900 border border-white/5 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-white font-medium text-sm">Fintech Security Solutions</h4>
                            <span className="bg-gray-800 text-white px-2 py-1 rounded text-xs font-medium border border-gray-600">
                              Accepted
                            </span>
                          </div>
                          <p className="text-white/60 text-xs mb-2">SecureBank</p>
                          <p className="text-white/50 text-xs">Accepted 1 week ago</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Partnership Types */}
                  <div className="bg-black  border border-white/10 rounded-lg overflow-hidden">
                    <div className="p-6 border-b border-white/10">
                      <h3 className="text-xl font-semibold text-white">Partnership Types</h3>
                      <p className="text-white/60 mt-1">Available collaboration models</p>
                    </div>
                    <div className="p-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                          <div className="flex items-center gap-3">
                            <FaHandshake className="w-5 h-5 text-white" />
                            <span className="text-white font-medium text-sm">Partnership</span>
                          </div>
                          <span className="text-white/60 text-xs">3 available</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                          <div className="flex items-center gap-3">
                            <FaBuilding className="w-5 h-5 text-white" />
                            <span className="text-white font-medium text-sm">Joint Venture</span>
                          </div>
                          <span className="text-white/60 text-xs">2 available</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                          <div className="flex items-center gap-3">
                            <FaFileContract className="w-5 h-5 text-white" />
                            <span className="text-white font-medium text-sm">Subcontract</span>
                          </div>
                          <span className="text-white/60 text-xs">1 available</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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