import React from "react";
import { useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";

const InvestorDashboardHeader = ({ onToggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <div className="bg-black/95 backdrop-blur-xl border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            {/* Mobile sidebar toggle */}
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-3 text-white/70 hover:text-white transition-all duration-300 hover:bg-white/20 rounded-lg hover:scale-105 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
            >
              <FaBars className="w-5 h-5" />
            </button>

            {/* Logo */}
            <button
              onClick={handleLogoClick}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-300"
            >
              <img
                src="/w_startSmart_icon.png"
                alt="StartSmart Logo"
                className="h-8 w-auto"
              />
              <span className="text-white font-bold text-xl font-manrope hidden sm:block">
                StartSmart
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorDashboardHeader;
