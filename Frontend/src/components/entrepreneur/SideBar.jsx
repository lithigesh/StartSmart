import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../hooks/useNotifications";
import {
  FaHome,
  FaLightbulb,
  FaDollarSign,
  FaBriefcase,
  FaChartBar,
  FaTrophy,
  FaUsers,
  FaCog,
  FaBell,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUser,
  FaChevronLeft,
  FaChevronRight,
  FaComment,
} from "react-icons/fa";

const SideBar = ({
  activeSection,
  onSectionChange,
  isCollapsed,
  setIsCollapsed,
}) => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    {
      id: "overview",
      label: "Overview",
      icon: <FaHome className="w-5 h-5" />,
      path: "/entrepreneur",
    },
    {
      id: "my-ideas",
      label: "My Ideas",
      icon: <FaLightbulb className="w-5 h-5" />,
      badge: "3",
      path: "/entrepreneur/my-ideas",
    },
    {
      id: "funding",
      label: "Funding",
      icon: <FaDollarSign className="w-5 h-5" />,
      path: "/entrepreneur/funding",
    },
    {
      id: "investors",
      label: "Investors",
      icon: <FaBriefcase className="w-5 h-5" />,
      badge: "8",
      path: "/entrepreneur/investors",
    },
    {
      id: "ideathons",
      label: "Ideathons",
      icon: <FaTrophy className="w-5 h-5" />,
      path: "/entrepreneur/ideathons",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <FaBell className="w-5 h-5" />,
      badge: unreadCount > 0 ? unreadCount : null,
      path: "/entrepreneur/notifications",
    },
    {
      id: "feedback",
      label: "App Feedback",
      icon: <FaComment className="w-5 h-5" />,
      path: "/entrepreneur/feedback",
    },
  ];

  const handleLogout = () => {
    logout();
  };

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed && setIsCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsCollapsed]);

  // Helper function for mobile auto-collapse
  const handleNavigation = (item) => {
    navigate(item.path);
    onSectionChange && onSectionChange(item.id);
    // Auto-collapse on mobile after selection
    if (window.innerWidth < 1024) {
      setIsCollapsed && setIsCollapsed(true);
    }
  };

  const SidebarItem = ({ item, isActive, onClick }) => (
    <button
      onClick={() => onClick(item)}
      className={`
        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative
        ${
          isActive
            ? "bg-white text-black shadow-sm"
            : "text-white/70 hover:text-white hover:bg-white/20"
        }
        ${isCollapsed ? "justify-center" : "justify-start"}
      `}
      title={isCollapsed ? item.label : ""}
    >
      <div className="flex-shrink-0 relative">
        {item.icon}
        {item.badge && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
            {item.badge > 9 ? "9+" : item.badge}
          </span>
        )}
      </div>

      {!isCollapsed && (
        <span className="font-medium text-sm">
          {item.label}
        </span>
      )}

      {/* Tooltip for collapsed state */}
      {isCollapsed && (
        <div className="absolute left-full ml-2 bg-white text-black px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
          {item.label}
        </div>
      )}
    </button>
  );

  return (
    <>
      {/* Mobile Menu Button - Show when sidebar is collapsed on mobile */}
      {isCollapsed && (
        <button
          onClick={() => setIsCollapsed && setIsCollapsed(false)}
          className="lg:hidden fixed top-4 left-4 z-50 bg-white text-black p-2 rounded-lg shadow-lg"
        >
          <FaBars className="w-5 h-5" />
        </button>
      )}

      {/* Mobile overlay */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsCollapsed && setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed left-0 top-0 h-full bg-black border-r border-white/10 z-50 transition-all duration-300 flex flex-col
        ${isCollapsed ? "w-16" : "w-72"}
        lg:translate-x-0
        ${isCollapsed ? "-translate-x-full lg:translate-x-0" : "translate-x-0"}
      `}
      >
        {/* Header */}
        <div className="flex items-center h-16 px-4 border-b border-white/10">
          <div className="flex items-center justify-between w-full">
            {!isCollapsed && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-black">
                  <span className="font-bold text-sm">SS</span>
                </div>
                <div>
                  <h2 className="text-white font-semibold text-sm">
                    StartSmart
                  </h2>
                  <p className="text-white/50 text-xs">Entrepreneur</p>
                </div>
              </div>
            )}

            {/* Desktop collapse/expand button */}
            <button
              onClick={() => setIsCollapsed && setIsCollapsed(!isCollapsed)}
              className="hidden lg:block p-1.5 text-white/70 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200"
            >
              {isCollapsed ? (
                <FaChevronRight className="w-4 h-4" />
              ) : (
                <FaChevronLeft className="w-4 h-4" />
              )}
            </button>

            {/* Mobile close button */}
            <button
              onClick={() => setIsCollapsed && setIsCollapsed(true)}
              className="lg:hidden p-2 text-white/70 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* User Profile - Show when not collapsed */}
        {!isCollapsed && (
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
                <span className="font-semibold text-sm">
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-sm truncate">
                  {user?.name || "Entrepreneur"}
                </h3>
                <p className="text-white/60 text-xs truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-4">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <SidebarItem
                  key={item.id}
                  item={item}
                  isActive={activeSection === item.id}
                  onClick={handleNavigation}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
              text-red-400 hover:text-red-300 hover:bg-red-900/20
              ${isCollapsed ? "justify-center" : "justify-start"}
            `}
          >
            <FaSignOutAlt className="w-5 h-5" />
            {!isCollapsed && (
              <span className="font-medium text-sm">Logout</span>
            )}
          </button>
        </div>

        {/* Collapsed User Profile */}
        {isCollapsed && (
          <div className="p-4 border-t border-white/10">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white mx-auto">
              <span className="font-semibold text-xs">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SideBar;