import React from "react";
import { useAuth } from "../../context/AuthContext";
import { FaLightbulb, FaSignOutAlt, FaCog } from "react-icons/fa";

const DashboardHeader = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
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
  );
};

export default DashboardHeader;
