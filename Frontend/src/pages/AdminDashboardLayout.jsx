import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import StartSmartIcon from "/w_startSmart_icon.png";
import '../styles/AdminEnhancements.css';
import {
  FaUsers,
  FaLightbulb,
  FaSignOutAlt,
  FaSpinner,
  FaChartBar,
  FaEdit,
  FaTrophy,
  FaTachometerAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const AdminDashboard = () => {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get current active path for sidebar highlighting
  const currentPath = location.pathname;

  // Sidebar navigation items with routes
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaTachometerAlt, path: '/admin/dashboard' },
    { id: 'users', label: 'Manage Users', icon: FaUsers, path: '/admin/users' },
    { id: 'ideas', label: 'Manage Ideas', icon: FaLightbulb, path: '/admin/ideas' },
    { id: 'ideathons', label: 'Ideathons', icon: FaTrophy, path: '/admin/ideathons' },
    { id: 'registration-master', label: 'Registration Master', icon: FaTrophy, path: '/admin/registration-master' },
    { id: 'feedback', label: 'Ideas Feedback', icon: FaEdit, path: '/admin/feedback' },
  ];

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "admin")) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, loading, user, navigate]);

  // Get page title based on current path
  const getPageTitle = () => {
    const item = sidebarItems.find(item => item.path === currentPath);
    return item ? item.label : 'Admin Dashboard';
  };

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <FaSpinner className="animate-spin text-4xl mb-4 mx-auto" />
          <p className="font-manrope">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black flex overflow-hidden">
      {/* Animated background - matching landing page style */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/[0.03] rounded-full animate-pulse blur-xl"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-white/[0.02] rounded-full animate-spin blur-2xl"></div>
        <div className="absolute top-1/2 left-1/6 w-16 h-16 bg-white/[0.04] rounded-full animate-ping blur-lg"></div>
        <div className="absolute bottom-1/4 right-1/3 w-20 h-20 bg-white/[0.02] rounded-full animate-bounce blur-xl"></div>
        <div className="absolute top-1/6 right-1/6 w-12 h-12 bg-white/[0.025] rounded-full animate-pulse blur-lg"></div>
        <div className="absolute bottom-1/3 left-1/3 w-28 h-28 bg-white/[0.015] rounded-full animate-spin blur-2xl"></div>
        <div className="absolute top-2/3 left-1/5 w-8 h-8 bg-white/[0.035] rounded-full animate-ping blur-md"></div>
        <div className="absolute bottom-1/6 right-1/5 w-14 h-14 bg-white/[0.02] rounded-full animate-bounce blur-xl"></div>
      </div>

      {/* Sidebar - Enhanced with lighter theme and wider width */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 min-w-72 max-w-72 h-screen bg-gradient-to-b from-white/[0.15] via-white/[0.08] to-white/[0.12] backdrop-blur-xl border-r border-white/20 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:w-72 lg:min-w-72 lg:max-w-72 lg:h-screen flex flex-col shadow-2xl`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/20 flex-shrink-0 w-full">
          <Link to="/admin/dashboard" className="inline-flex items-center gap-3 text-white/80 hover:text-white transition-colors duration-300 min-w-0">
            <img src={StartSmartIcon} alt="StartSmart Logo" className="w-7 h-7 flex-shrink-0" />
            <span className="font-manrope font-semibold text-lg truncate">StartSmart</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/70 hover:text-white flex-shrink-0"
          >
            <FaTimes />
          </button>
        </div>
        
        <nav className="mt-6 flex-1 overflow-y-auto w-full px-3 custom-scrollbar">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`w-full flex items-center gap-4 px-4 py-4 text-left transition-all duration-300 relative overflow-hidden group rounded-xl mb-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-white/[0.25] to-white/[0.15] text-white border border-white/30 shadow-xl transform scale-105'
                    : 'text-white/80 hover:text-white hover:bg-white/[0.12] hover:translate-x-1 hover:scale-102 hover:shadow-lg'
                }`}
              >
                <Icon className={`text-xl flex-shrink-0 transition-all duration-300 ${
                  isActive ? 'text-white scale-110' : 'group-hover:scale-110 group-hover:rotate-6'
                }`} />
                <span className="font-manrope font-medium transition-all duration-300 truncate flex-1 min-w-0 text-base">{item.label}</span>
                {isActive && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
                {/* Enhanced hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/20 flex-shrink-0 w-full">
          <button
            onClick={() => logout('/admin/login')}
            className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-gradient-to-r from-red-600/80 to-red-700/80 text-white rounded-xl font-manrope font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <FaSignOutAlt className="text-lg" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-gradient-to-r from-white/[0.08] to-white/[0.04] backdrop-blur-xl border-b border-white/10 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white/70 hover:text-white transition-colors duration-300"
          >
            <FaBars />
          </button>
          <h1 className="font-manrope font-bold text-white">{getPageTitle()}</h1>
          <div className="w-6"></div>
        </div>

        {/* Content area */}
        <div className="flex-1 relative z-10 p-6 overflow-y-auto flex justify-center">
          <div className="w-full max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 p-6 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl">
              <div className="relative">
                <h1 className="font-manrope font-bold text-3xl text-white mb-2">
                  {getPageTitle()}
                </h1>
                <p className="font-manrope text-white/70">
                  Welcome back, {user?.name || "Admin"}
                </p>
                {/* Floating particles */}
                <div className="absolute top-2 right-4 w-1 h-1 bg-white/60 rounded-full animate-ping"></div>
                <div className="absolute bottom-2 right-8 w-1 h-1 bg-white/50 rounded-full animate-bounce"></div>
              </div>
            </div>

            {/* Route content */}
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;