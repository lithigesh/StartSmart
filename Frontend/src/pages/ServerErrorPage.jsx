import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaArrowLeft, FaExclamationCircle, FaSync } from "react-icons/fa";
import StartSmartIcon from "/w_startSmart_icon.png";

const ServerErrorPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/5 rounded-full animate-pulse blur-xl"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-white/3 rounded-full animate-spin blur-2xl"></div>
        <div className="absolute top-1/2 left-1/6 w-16 h-16 bg-white/4 rounded-full animate-ping blur-lg"></div>

        {/* Moving particles */}
        <div className="absolute top-16 left-16 w-1 h-1 bg-white/60 rounded-full animate-bounce"></div>
        <div className="absolute top-32 right-24 w-0.5 h-0.5 bg-white/40 rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 left-32 w-1.5 h-1.5 bg-white/30 rounded-full animate-ping"></div>
        <div className="absolute bottom-16 right-16 w-1 h-1 bg-white/50 rounded-full animate-bounce"></div>
      </div>

      {/* Main content */}
      <div className="w-full max-w-2xl mx-auto px-4 z-10">
        {/* Error Card */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl shadow-black/20 relative overflow-hidden text-center">
          {/* Glassmorphism overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>

          {/* Floating particles inside card */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-4 right-4 w-1 h-1 bg-white/40 rounded-full animate-ping"></div>
            <div className="absolute top-8 left-6 w-0.5 h-0.5 bg-white/30 rounded-full animate-pulse"></div>
            <div className="absolute bottom-6 right-8 w-1 h-1 bg-white/35 rounded-full animate-bounce"></div>
          </div>

          <div className="relative z-10">
            {/* Logo */}
            <div className="mb-8 flex justify-center">
              <img
                src={StartSmartIcon}
                alt="StartSmart Logo"
                className="w-16 h-16 opacity-80"
              />
            </div>

            {/* 500 Icon */}
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center">
                <FaExclamationCircle className="w-10 h-10 text-orange-400" />
              </div>
            </div>

            {/* Error Message */}
            <div className="mb-8">
              <h1 className="font-manrope font-bold text-6xl md:text-7xl text-white/20 mb-4">
                500
              </h1>
              <h2 className="font-manrope font-bold text-2xl md:text-3xl text-white mb-4">
                Server Error
              </h2>
              <p className="font-manrope text-white/70 text-lg mb-2">
                Something went wrong on our end.
              </p>
              <p className="font-manrope text-white/60 text-sm">
                We're working to fix this issue. Please try again in a few moments.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                className="group relative overflow-hidden px-6 py-3 rounded-lg font-manrope font-medium text-white border border-white/20 bg-white/[0.05] hover:bg-white/[0.08] transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-white/30 hover:scale-105 hover:shadow-xl flex items-center gap-2"
              >
                <FaSync className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                Try Again
              </button>

              {/* Go Back Button */}
              <button
                onClick={handleGoBack}
                className="group relative overflow-hidden px-6 py-3 rounded-lg font-manrope font-medium text-white border border-white/20 bg-white/[0.05] hover:bg-white/[0.08] transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-white/30 hover:scale-105 hover:shadow-xl flex items-center gap-2"
              >
                <FaArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                Go Back
              </button>

              {/* Home Button */}
              <Link
                to="/"
                className="group relative overflow-hidden px-6 py-3 rounded-lg font-manrope font-medium text-black bg-white hover:bg-gray-100 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-white/50 hover:scale-105 hover:shadow-xl flex items-center gap-2"
              >
                {/* Subtle shimmer effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent transform translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out pointer-events-none opacity-0 group-hover:opacity-100"></div>
                
                <span className="relative z-10 flex items-center gap-2">
                  <FaHome className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                  Back to Home
                </span>
              </Link>
            </div>

            {/* Additional Help */}
            <div className="mt-8 pt-8 border-t border-white/10">
              <p className="font-manrope text-white/60 text-sm">
                If this problem persists, please contact our{" "}
                <Link
                  to="/"
                  className="text-white hover:text-white/80 font-medium transition-colors duration-300 underline underline-offset-4 hover:underline-offset-2"
                >
                  support team
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerErrorPage;
