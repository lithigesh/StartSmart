import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../hooks/useNotifications";
import {
  FaUser,
  FaSignOutAlt,
  FaCog,
  FaBell,
} from "react-icons/fa";

const InvestorDashboardHeader = ({ showNotifications, setShowNotifications }) => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="bg-white/[0.03] backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white">
              <FaUser className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-white font-manrope font-semibold text-lg">
                Welcome, {user?.name}
              </h1>
              <p className="text-white/60 text-sm capitalize font-manrope">
                Investor Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-white/70 hover:text-white transition-colors duration-300 hover:bg-white/10 rounded-lg"
            >
              <FaBell className="w-5 h-5" />
              {/* Notification badge */}
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
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
  );
};

export default InvestorDashboardHeader;
