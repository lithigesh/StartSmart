import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaLightbulb,
  FaDollarSign,
  FaBriefcase,
  FaChartBar,
  FaTrophy,
  FaUsers,
  FaCog,
  FaQuestionCircle,
  FaChevronLeft,
  FaChevronRight,
  FaBell,
  FaHome
} from "react-icons/fa";

const SideBar = ({ activeSection = "dashboard", onSectionChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <FaHome />,
      path: "/entrepreneur/dashboard"
    },
    {
      id: "ideas",
      label: "My Ideas",
      icon: <FaLightbulb />,
      path: "/entrepreneur/ideas",
      badge: "3"
    },
    {
      id: "funding",
      label: "Funding",
      icon: <FaDollarSign />,
      path: "/entrepreneur/funding",
      badge: "$25K"
    },
    {
      id: "investors",
      label: "Investors",
      icon: <FaBriefcase />,
      path: "/entrepreneur/investors",
      badge: "8"
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: <FaChartBar />,
      path: "/entrepreneur/analytics"
    },
    {
      id: "ideathons",
      label: "Ideathons",
      icon: <FaTrophy />,
      path: "/entrepreneur/ideathons",
      badge: "2"
    },
    {
      id: "collaborations",
      label: "Collaborations",
      icon: <FaUsers />,
      path: "/entrepreneur/collaborations"
    },
  ];

  const bottomItems = [
    {
      id: "settings",
      label: "Settings",
      icon: <FaCog />,
      path: "/entrepreneur/settings"
    },
    {
      id: "help",
      label: "Help & Support",
      icon: <FaQuestionCircle />,
      path: "/entrepreneur/help"
    }
  ];

  const handleItemClick = (item) => {
    navigate(item.path);
    if (onSectionChange) {
      onSectionChange(item.id);
    }
  };

  // Determine active section based on current path
  const getActiveSection = () => {
    const currentPath = location.pathname;
    const activeItem = [...navigationItems, ...bottomItems].find(item => item.path === currentPath);
    return activeItem ? activeItem.id : activeSection;
  };

  return (
    <div className={`bg-black border-r border-white/10 transition-all duration-300 flex flex-col ${
      isCollapsed ? "w-16" : "w-64"
    }`}>
      {/* Sidebar Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <FaLightbulb className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold text-lg">StartSmart</span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            {isCollapsed ? <FaChevronRight className="w-4 h-4" /> : <FaChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          {navigationItems.map((item) => {
            const isActive = getActiveSection() === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all duration-200 group ${
                  isActive
                    ? "bg-white/20 text-white border border-white/30"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`${
                    isActive ? "text-white" : "text-white/70 group-hover:text-white"
                  } transition-colors`}>
                    {item.icon}
                  </div>
                  {!isCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </div>
                {!isCollapsed && item.badge && (
                  <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                    isActive
                      ? "bg-white/30 text-white"
                      : "bg-white/20 text-white/80"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Items */}
      <div className="border-t border-white/10 p-2">
        <nav className="space-y-1">
          {bottomItems.map((item) => {
            const isActive = getActiveSection() === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group ${
                  isActive
                    ? "bg-white/20 text-white border border-white/30"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <div className={`${
                  isActive ? "text-white" : "text-white/70 group-hover:text-white"
                } transition-colors`}>
                  {item.icon}
                </div>
                {!isCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Collapse indicator when collapsed */}
      {isCollapsed && (
        <div className="px-2 py-4">
          <div className="w-full h-px bg-white/10"></div>
        </div>
      )}
    </div>
  );
};

export default SideBar;