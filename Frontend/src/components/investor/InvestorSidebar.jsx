import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../hooks/useNotifications";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaLightbulb,
  FaHeart,
  FaUser,
  FaCog,
  FaBell,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaSearch,
  FaBalanceScale,
  FaBook,
  FaBriefcase,
} from "react-icons/fa";

const InvestorSidebar = ({
  activeSection,
  setActiveSection,
  isCollapsed,
  setIsCollapsed,
}) => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const navigationItems = [
    {
      id: "overview",
      label: "Overview",
      icon: <FaHome className="w-5 h-5" />,
      description: "Dashboard overview",
    },
    {
      id: "portfolio",
      label: "Portfolio Analytics",
      icon: <FaBriefcase className="w-5 h-5" />,
      description: "View portfolio insights",
    },
    {
      id: "browse-ideas",
      label: "Browse Ideas",
      icon: <FaLightbulb className="w-5 h-5" />,
      description: "Explore startup ideas",
    },
    {
      id: "my-interests",
      label: "My Interests",
      icon: <FaHeart className="w-5 h-5" />,
      description: "Ideas you're interested in",
    },
    {
      id: "deals",
      label: "Deal Management",
      icon: <FaBriefcase className="w-5 h-5" />,
      description: "Manage investment deals",
    },
    {
      id: "comparisons",
      label: "Comparisons",
      icon: <FaBalanceScale className="w-5 h-5" />,
      description: "Compare ideas side-by-side",
    },
    {
      id: "market-research",
      label: "Market Research",
      icon: <FaBook className="w-5 h-5" />,
      description: "Your research notes",
    },
  ];

  const bottomItems = [
    {
      id: "notifications",
      label: "Notifications",
      icon: <FaBell className="w-5 h-5" />,
      badge: unreadCount > 0 ? unreadCount : null,
      description: "Your notifications",
    },
    {
      id: "settings",
      label: "Account",
      icon: <FaCog className="w-5 h-5" />,
      description: "Account details",
    },
  ];

  const handleLogout = () => {
    logout();
  };

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        // On mobile, start with sidebar hidden
        setIsCollapsed(true);
      } else {
        // On desktop, sidebar is visible but can be minimized
        setIsCollapsed(false);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsCollapsed]);

  // Helper function for mobile auto-collapse
  const handleNavigation = (item) => {
    // Handle external navigation (new pages)
    if (item.external && item.path) {
      navigate(item.path);
    } else {
      // Handle internal section switching
      setActiveSection(item.id);
    }

    // Auto-collapse on mobile after selection
    if (window.innerWidth < 1024) {
      setIsCollapsed(true);
    }
  };

  const SidebarItem = ({ item, isActive, onClick }) => {
    const showCollapsedView = isCollapsed && window.innerWidth >= 1024;

    return (
      <button
        onClick={() => onClick(item)}
        className={`
          w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group relative overflow-hidden min-h-[44px] touch-manipulation
          ${
            isActive
              ? "bg-white/20 border-l-4 border-white text-white"
              : "text-white/70 hover:text-white hover:bg-white/10 hover:scale-105"
          }
        `}
        title={showCollapsedView ? item.label : ""}
      >
        {/* Glass morphism hover effect */}
        {!isActive && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        )}

        <div className="flex-shrink-0 relative z-10">
          {item.icon}
          {item.badge && (
            <span className="absolute -top-2 -right-2 bg-white/20 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold font-manrope">
              {item.badge > 9 ? "9+" : item.badge}
            </span>
          )}
        </div>

        {!showCollapsedView && (
          <div className="flex-1 text-left relative z-10">
            <div className="font-manrope font-medium">{item.label}</div>
            <div className="text-xs text-white/50 font-manrope">
              {item.description}
            </div>
          </div>
        )}

        {showCollapsedView && (
          <div className="absolute left-full ml-2 bg-black/90 backdrop-blur-xl border border-white/20 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 font-manrope whitespace-nowrap">
            {item.label}
          </div>
        )}
      </button>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && window.innerWidth < 1024 && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed left-0 top-0 h-full bg-white/[0.03] backdrop-blur-xl border-r border-white/10 z-50 transition-all duration-300 flex flex-col
        w-72
        ${
          isCollapsed
            ? "-translate-x-full lg:translate-x-0 lg:w-20"
            : "translate-x-0"
        }
      `}
      >
        {/* Glass morphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] pointer-events-none"></div>
        {/* Header */}
        <div className="flex items-center h-16 px-4 border-b border-white/10 relative z-10">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              {!isCollapsed && (
                <>
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-white">
                    <FaUser className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-white font-manrope font-semibold text-sm">
                      {user?.name}
                    </h2>
                    <p className="text-white/60 text-xs font-manrope">
                      Investor
                    </p>
                  </div>
                </>
              )}
              {isCollapsed && (
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-white">
                  <FaUser className="w-5 h-5" />
                </div>
              )}
            </div>

            {/* Close button (mobile only, shown when sidebar is open) */}
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-3 text-white/70 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-300 hover:scale-105 min-h-[44px] min-w-[44px] flex items-center justify-center lg:hidden"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 relative z-10">
          <div className="px-4">
            {!isCollapsed && (
              <h3 className="text-white/50 text-xs font-manrope font-semibold uppercase tracking-wider mb-3">
                Navigation
              </h3>
            )}
            {isCollapsed && window.innerWidth >= 1024 && (
              <div className="h-6 mb-3"></div>
            )}
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

          <div className="px-4 mt-8">
            {!isCollapsed && (
              <h3 className="text-white/50 text-xs font-manrope font-semibold uppercase tracking-wider mb-3">
                Tools
              </h3>
            )}
            {isCollapsed && window.innerWidth >= 1024 && (
              <div className="h-6 mb-3"></div>
            )}
            <div className="space-y-2">
              {bottomItems.map((item) => (
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

        {/* Logout Section */}
        <div className="p-4 border-t border-white/10 relative z-10">
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group relative overflow-hidden min-h-[44px] touch-manipulation
              text-white/80 hover:text-white/80 hover:bg-white/20 hover:scale-105
              ${
                isCollapsed && window.innerWidth >= 1024 ? "justify-center" : ""
              }
            `}
          >
            <FaSignOutAlt className="w-5 h-5" />
            {(!isCollapsed || window.innerWidth < 1024) && (
              <span className="font-manrope font-medium">Logout</span>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default InvestorSidebar;
