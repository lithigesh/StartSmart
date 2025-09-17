import React from "react";
import { useAuth } from "../../context/AuthContext";
import { FaLightbulb, FaSignOutAlt, FaCog, FaBell } from "react-icons/fa";

const DashboardHeader = ({ onSectionChange }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const handleNotificationClick = () => {
    if (onSectionChange) {
      onSectionChange('notifications');
    }
  };

  const handleSettingsClick = () => {
    if (onSectionChange) {
      onSectionChange('settings');
    }
  };

  return (
    <div className="bg-black border-b border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-yellow-500">
              <FaLightbulb className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-white font-semibold text-lg">
                Welcome, {user?.name}
              </h1>
              <p className="text-gray-400 text-sm">
                Entrepreneur Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <button 
              onClick={handleNotificationClick}
              className="p-2 text-gray-400 hover:text-white transition-colors duration-200 hover:bg-gray-900 rounded-lg"
            >
              <FaBell className="w-5 h-5" />
            </button>
            
            {/* Settings */}
            <button 
              onClick={handleSettingsClick}
              className="p-2 text-gray-400 hover:text-white transition-colors duration-200 hover:bg-gray-900 rounded-lg"
            >
              <FaCog className="w-5 h-5" />
            </button>
            
            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-200 text-black rounded-lg transition-all duration-200"
            >
              <FaSignOutAlt className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
