import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import StartSmartIcon from "/w_startSmart_icon.png";

export const Header = () => {
  const { isAuthenticated, user, logout, getRoleDashboardUrl } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getRoleColor = () => {
    switch (user?.role) {
      case "entrepreneur":
        return "text-yellow-400";
      case "investor":
        return "text-green-400";
      default:
        return "text-blue-400";
    }
  };

  const getDashboardUrl = () => {
    return user ? getRoleDashboardUrl(user) : "/";
  };

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 w-full bg-black/80 backdrop-blur-md supports-[backdrop-filter]:bg-black/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18 lg:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 md:space-x-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-lg p-1 transition-transform duration-300 hover:scale-105"
            tabIndex={0}
          >
            <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center shadow-lg">
              <img
                src={StartSmartIcon}
                alt="StartSmart Logo"
                className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10"
              />
            </div>
            <span className="text-text-primary font-semibold text-xl md:text-2xl lg:text-3xl font-manrope whitespace-nowrap">
              Start Smart
            </span>
          </Link>

          {/* Auth Controls */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              // Authenticated User Menu
              <div className="flex items-center gap-4">
                {/* User Info */}
                <Link
                  to={getDashboardUrl()}
                  className="hidden sm:flex items-center gap-3 px-4 py-2 bg-white/[0.08] backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/[0.12] hover:border-white/30 transition-all duration-300 hover:scale-105 group"
                >
                  <div
                    className={`w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center ${getRoleColor()}`}
                  >
                    <FaUser className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-text-primary font-manrope font-medium text-sm group-hover:text-gray-200 transition-colors duration-300">
                      {user?.name}
                    </p>
                    <p className="text-text-secondary text-xs capitalize font-manrope">
                      {user?.role}
                    </p>
                  </div>
                </Link>

                {/* Mobile User Button */}
                <Link
                  to={getDashboardUrl()}
                  className="sm:hidden w-10 h-10 bg-white/[0.08] backdrop-blur-sm border border-white/20 rounded-lg flex items-center justify-center hover:bg-white/[0.12] hover:border-white/30 transition-all duration-300 hover:scale-105"
                >
                  <FaUser className={`w-4 h-4 ${getRoleColor()}`} />
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-white/[0.05] border border-white/20 rounded-lg text-white/80 hover:text-white hover:bg-white/[0.10] hover:border-white/30 transition-all duration-300 hover:scale-105 group font-manrope"
                >
                  <FaSignOutAlt className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              // Guest User Buttons
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 bg-white/[0.05] border border-white/20 rounded-lg text-white/80 hover:text-white hover:bg-white/[0.10] hover:border-white/30 transition-all duration-300 hover:scale-105 group font-manrope"
                >
                  <FaSignInAlt className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>

                <Link
                  to="/register"
                  className="relative overflow-hidden flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-gray-100 rounded-lg transition-all duration-300 hover:scale-105 group font-manrope font-medium shadow-lg"
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>

                  <FaUserPlus className="w-4 h-4 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="hidden sm:inline relative z-10">
                    Sign Up
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
