import React from "react";
import { useAuth } from "../context/AuthContext";
import {
  FaLightbulb,
  FaSignOutAlt,
  FaCog,
  FaBell,
  FaChartLine,
  FaBriefcase,
  FaPlus,
  FaEye,
  FaDollarSign,
} from "react-icons/fa";

const EntrepreneurDashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const dashboardCards = [
    {
      title: "My Ideas",
      description: "View and manage your submitted ideas",
      icon: <FaLightbulb />,
      count: "3",
      color: "text-yellow-400",
    },
    {
      title: "Funding Received",
      description: "Track your funding progress and investments",
      icon: <FaDollarSign />,
      count: "$25K",
      color: "text-green-400",
    },
    {
      title: "Investor Interest",
      description: "See who's interested in your ideas",
      icon: <FaBriefcase />,
      count: "8",
      color: "text-blue-400",
    },
    {
      title: "Notifications",
      description: "Stay updated with latest activities",
      icon: <FaBell />,
      count: "5",
      color: "text-purple-400",
    },
  ];

  const myIdeas = [
    {
      title: "AI-Powered Healthcare Platform",
      status: "Funded",
      funding: "$15K",
      investors: 3,
      views: 127,
    },
    {
      title: "Sustainable Food Delivery",
      status: "Seeking Investment",
      funding: "$0",
      investors: 0,
      views: 89,
    },
    {
      title: "EdTech Learning Assistant",
      status: "Under Review",
      funding: "$10K",
      investors: 2,
      views: 156,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Funded":
        return "text-green-400 bg-green-400/10";
      case "Seeking Investment":
        return "text-yellow-400 bg-yellow-400/10";
      case "Under Review":
        return "text-blue-400 bg-blue-400/10";
      default:
        return "text-gray-400 bg-gray-400/10";
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-white/[0.03] backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-yellow-400">
                <FaLightbulb className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-white font-manrope font-semibold text-lg">
                  Welcome, {user?.name}
                </h1>
                <p className="text-white/60 text-sm capitalize font-manrope">
                  Entrepreneur Dashboard
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 text-white/70 hover:text-white transition-colors duration-300 hover:bg-white/10 rounded-lg">
                <FaCog className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300 hover:scale-105 font-manrope"
              >
                <FaSignOutAlt className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>

            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-4 right-4 w-1 h-1 bg-white/40 rounded-full animate-ping"></div>
              <div className="absolute bottom-6 left-8 w-1 h-1 bg-white/35 rounded-full animate-bounce"></div>
            </div>

            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-manrope font-bold text-white mb-4">
                Ready to innovate?
              </h2>
              <p className="text-white/70 font-manrope mb-6 max-w-2xl">
                Your dashboard to manage ideas, track progress, and connect with
                investors. Start by submitting your next big idea and watch it
                transform into reality.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="btn bg-white text-black hover:bg-gray-100 rounded-lg px-6 py-3 font-manrope font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2">
                  <FaPlus className="w-4 h-4" />
                  Submit New Idea
                </button>
                <button className="btn btn-outline border-white text-white hover:bg-white hover:text-black rounded-lg px-6 py-3 font-manrope font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2">
                  <FaChartLine className="w-4 h-4" />
                  View Analytics
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardCards.map((card, index) => (
            <div
              key={index}
              className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300 hover:scale-105 cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-white/[0.02] rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center ${card.color} group-hover:scale-110 transition-transform duration-300`}
                  >
                    {card.icon}
                  </div>
                  <span
                    className={`text-2xl font-bold ${card.color} font-manrope`}
                  >
                    {card.count}
                  </span>
                </div>

                <h3 className="text-white font-manrope font-semibold text-lg mb-2 group-hover:text-gray-200 transition-colors duration-300">
                  {card.title}
                </h3>
                <p className="text-white/60 text-sm font-manrope group-hover:text-white/80 transition-colors duration-300">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* My Ideas Section */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-manrope font-bold text-white">
                My Ideas
              </h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300 hover:scale-105 font-manrope">
                <FaPlus className="w-4 h-4" />
                Add New Idea
              </button>
            </div>

            <div className="space-y-4">
              {myIdeas.map((idea, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/10 rounded-lg hover:bg-white/[0.05] transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <FaLightbulb className="w-4 h-4 text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-white font-manrope font-medium">
                        {idea.title}
                      </p>
                      <div className="flex items-center gap-4 mt-1">
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-manrope ${getStatusColor(
                            idea.status
                          )}`}
                        >
                          {idea.status}
                        </span>
                        <span className="text-white/60 text-sm font-manrope">
                          {idea.views} views
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-manrope font-semibold">
                      {idea.funding}
                    </p>
                    <p className="text-white/60 text-sm font-manrope">
                      {idea.investors} investors
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>

          <div className="relative z-10">
            <h3 className="text-xl font-manrope font-bold text-white mb-6">
              Recent Activity
            </h3>

            <div className="space-y-4">
              {[
                {
                  message: "New investor interest in 'AI Healthcare Platform'",
                  time: "2 hours ago",
                  icon: <FaBriefcase className="w-4 h-4 text-green-400" />,
                },
                {
                  message:
                    "Your idea 'Sustainable Food Delivery' received 15 new views",
                  time: "4 hours ago",
                  icon: <FaEye className="w-4 h-4 text-blue-400" />,
                },
                {
                  message:
                    "Funding milestone reached: $15K for EdTech Learning Assistant",
                  time: "1 day ago",
                  icon: <FaDollarSign className="w-4 h-4 text-yellow-400" />,
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/10 rounded-lg hover:bg-white/[0.05] transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-manrope font-medium">
                      {item.message}
                    </p>
                    <p className="text-white/60 text-sm font-manrope">
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntrepreneurDashboard;
