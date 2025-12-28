import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowUp } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useTextSplit } from "../hooks/useTextSplit";

export const HeroSection = () => {
  const { isAuthenticated, user, getRoleDashboardUrl } = useAuth();
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const { isVisible: textVisible, items: titleWords } = useTextSplit(
    "Connect Ideas with Investment",
    { delay: 200, staggerDelay: 80, type: "words" }
  );

  useEffect(() => {
    setIsLoaded(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmitIdea = () => {
    if (isAuthenticated) {
      const dashboardUrl = getRoleDashboardUrl(user);
      navigate(dashboardUrl);
    } else {
      navigate("/register", { state: { role: "entrepreneur" } });
    }
  };

  const handleExploreAsInvestor = () => {
    if (isAuthenticated) {
      const dashboardUrl = getRoleDashboardUrl(user);
      navigate(dashboardUrl);
    } else {
      navigate("/register", { state: { role: "investor" } });
    }
  };

  const handleMyDashboard = () => {
    const dashboardUrl = getRoleDashboardUrl(user);
    navigate(dashboardUrl);
  };

  return (
    <div className="relative w-full flex items-center justify-center min-h-screen sm:h-screen overflow-hidden">
      <div
        className={`flex flex-col w-full max-w-[878px] items-center gap-6 sm:gap-8 md:gap-12 px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-32 pt-20 sm:pt-24 md:pt-32 transition-all duration-1000 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
        style={{
          transform: isLoaded
            ? `translateY(${scrollY * 0.3}px)`
            : "translateY(40px)",
          opacity: isLoaded ? Math.max(0, 1 - scrollY / 500) : 0,
        }}
      >
        <div className="flex flex-col items-center gap-5 sm:gap-7 relative w-full">
          <div className="inline-flex flex-col items-center gap-2 relative">
            <h1 className="relative w-full max-w-[674.68px] font-manrope font-medium text-text-primary text-2xl sm:text-3xl md:text-5xl lg:text-[64px] text-center tracking-[-0.64px] leading-tight sm:leading-tight md:leading-[74px] px-2">
              <span className="inline-flex flex-wrap justify-center gap-x-2 sm:gap-x-3 md:gap-x-4 gap-y-1 sm:gap-y-2">
                {titleWords.map((word, i) => (
                  <span
                    key={i}
                    className="inline-block"
                    style={{
                      opacity: textVisible ? 1 : 0,
                      transform: textVisible
                        ? "translateY(0)"
                        : "translateY(20px)",
                      transition: `opacity 0.6s ease-out ${word.delay}ms, transform 0.6s ease-out ${word.delay}ms`,
                    }}
                  >
                    {word.content}
                  </span>
                ))}
              </span>
              {/* Floating particles around text */}
              <div className="absolute -top-4 -left-4 w-2 h-2 bg-white/30 rounded-full animate-bounce hidden sm:block"></div>
              <div className="absolute -top-2 right-8 w-1 h-1 bg-white/40 rounded-full animate-ping hidden sm:block"></div>
              <div className="absolute -bottom-3 left-12 w-1.5 h-1.5 bg-white/20 rounded-full animate-pulse hidden sm:block"></div>
              <div className="absolute -bottom-1 -right-2 w-1 h-1 bg-white/35 rounded-full animate-bounce hidden sm:block"></div>
            </h1>
          </div>

          <p className="relative w-full max-w-[735px] font-manrope font-normal text-text-secondary text-xs sm:text-sm md:text-base text-center tracking-[-0.29px] leading-5 sm:leading-6 md:leading-7 px-4">
            The comprehensive ecosystem where entrepreneurs submit innovative
            ideas and investors discover the next big opportunity. Powered by AI
            analysis and intelligent matching.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center mt-2 sm:mt-4 w-full sm:w-auto px-4 sm:px-0">
            {isAuthenticated ? (
              // Show only "My Dashboard" button for authenticated users
              <button
                onClick={handleMyDashboard}
                className="relative overflow-hidden btn btn-lg rounded-[55px] gap-2 w-full sm:w-auto shadow-lg bg-white text-black hover:bg-gray-100 border-white transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-y-1 hover:shadow-xl group focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 will-change-transform"
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 -top-1 -bottom-1 bg-gradient-to-r from-transparent via-white/30 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>

                {/* Glitter particles */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute top-2 left-4 w-1 h-1 bg-white rounded-full animate-ping"></div>
                  <div className="absolute top-4 right-6 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-100"></div>
                  <div className="absolute bottom-3 left-8 w-1 h-1 bg-white rounded-full animate-ping delay-200"></div>
                  <div className="absolute bottom-2 right-4 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-300"></div>
                </div>

                {/* Ripple effect */}
                <div className="absolute inset-0 rounded-[55px] bg-white/10 scale-0 group-hover:scale-100 group-hover:opacity-0 opacity-50 transition-all duration-500 ease-out"></div>

                <span className="relative z-10 font-poppins font-medium text-base">
                  My Dashboard
                </span>
                <FaArrowUp className="relative z-10 w-6 h-6 transition-transform duration-300 ease-in-out group-hover:rotate-12 group-hover:scale-110" />
              </button>
            ) : (
              // Show both buttons for non-authenticated users
              <>
                <button
                  onClick={handleSubmitIdea}
                  className="relative overflow-hidden btn btn-lg rounded-[55px] gap-2 w-full sm:w-auto shadow-lg bg-white text-black hover:bg-gray-100 border-white transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-y-1 hover:shadow-xl group focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 will-change-transform"
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -top-1 -bottom-1 bg-gradient-to-r from-transparent via-white/30 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>

                  {/* Glitter particles */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute top-2 left-4 w-1 h-1 bg-white rounded-full animate-ping"></div>
                    <div className="absolute top-4 right-6 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-100"></div>
                    <div className="absolute bottom-3 left-8 w-1 h-1 bg-white rounded-full animate-ping delay-200"></div>
                    <div className="absolute bottom-2 right-4 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-300"></div>
                  </div>

                  {/* Ripple effect */}
                  <div className="absolute inset-0 rounded-[55px] bg-white/10 scale-0 group-hover:scale-100 group-hover:opacity-0 opacity-50 transition-all duration-500 ease-out"></div>

                  <span className="relative z-10 font-poppins font-medium text-base">
                    Submit Your Idea
                  </span>
                  <FaArrowUp className="relative z-10 w-6 h-6 transition-transform duration-300 ease-in-out group-hover:rotate-12 group-hover:scale-110" />
                </button>

                <button
                  onClick={handleExploreAsInvestor}
                  className="relative overflow-hidden btn btn-outline btn-lg rounded-[55px] gap-2 w-full sm:w-auto border-white text-white hover:bg-white hover:text-black transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-y-1 hover:shadow-xl group focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 will-change-transform"
                >
                  {/* Border glow effect */}
                  <div className="absolute inset-0 rounded-[55px] border-2 border-white/50 scale-110 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 ease-out"></div>

                  {/* Sliding border animation */}
                  <div className="absolute inset-0 rounded-[55px] bg-gradient-to-r from-transparent via-white/20 to-transparent transform rotate-0 group-hover:rotate-180 transition-transform duration-1000 ease-out opacity-0 group-hover:opacity-100"></div>

                  {/* Sparkle effects */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute top-3 left-6 w-1 h-1 bg-white rounded-full animate-bounce"></div>
                    <div className="absolute top-5 right-8 w-0.5 h-0.5 bg-white rounded-full animate-ping delay-150"></div>
                    <div className="absolute bottom-4 left-10 w-1 h-1 bg-white rounded-full animate-pulse delay-75"></div>
                    <div className="absolute bottom-2 right-6 w-0.5 h-0.5 bg-white rounded-full animate-bounce delay-300"></div>
                    <div className="absolute top-2 left-1/2 w-0.5 h-0.5 bg-white rounded-full animate-ping delay-200"></div>
                  </div>

                  {/* Gradient sweep */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-800 ease-in-out"></div>

                  {/* Pulsing background */}
                  <div className="absolute inset-0 rounded-[55px] bg-white/5 scale-95 group-hover:scale-105 opacity-0 group-hover:opacity-100 transition-all duration-400 ease-out"></div>

                  <span className="relative z-10 font-poppins font-medium text-sm sm:text-base">
                    Explore as Investor
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-50 pointer-events-none"></div>

      {/* Smooth bottom transition */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none z-20"></div>

      {/* Parallax Layer 1 - Slowest (background orbs) - disabled on mobile */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block"
        style={{
          transform: `translateY(${scrollY * 0.1}px)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/5 rounded-full animate-float blur-3xl"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-white/3 rounded-full animate-float-slow blur-2xl"></div>
        <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-white/4 rounded-full animate-float-slow blur-2xl delay-700"></div>
      </div>

      {/* Parallax Layer 2 - Medium speed (medium orbs) - disabled on mobile */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block"
        style={{
          transform: `translateY(${scrollY * 0.2}px)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        <div className="absolute top-1/2 left-1/6 w-16 h-16 bg-white/4 rounded-full animate-pulse blur-lg"></div>
        <div className="absolute bottom-1/4 left-1/3 w-28 h-28 bg-white/3 rounded-full animate-float blur-3xl delay-1000"></div>
      </div>

      {/* Parallax Layer 3 - Fastest (particles) - disabled on mobile */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block"
        style={{
          transform: `translateY(${scrollY * 0.4}px)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        <div className="absolute top-16 left-16 w-1 h-1 bg-white/60 rounded-full animate-particle-1"></div>
        <div className="absolute top-32 right-24 w-0.5 h-0.5 bg-white/40 rounded-full animate-particle-2"></div>
        <div className="absolute bottom-32 left-32 w-1.5 h-1.5 bg-white/30 rounded-full animate-particle-3"></div>
        <div className="absolute bottom-16 right-16 w-1 h-1 bg-white/50 rounded-full animate-particle-4"></div>
        <div className="absolute top-24 left-1/2 w-1 h-1 bg-white/55 rounded-full animate-particle-1 delay-500"></div>
        <div className="absolute bottom-24 right-1/3 w-0.5 h-0.5 bg-white/45 rounded-full animate-particle-2 delay-700"></div>
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-white/35 rounded-full animate-particle-3 delay-300"></div>
        <div className="absolute bottom-1/3 left-1/4 w-1 h-1 bg-white/50 rounded-full animate-particle-4 delay-900"></div>
      </div>

      {/* Parallax Layer 4 - Grid pattern (slowest) - disabled on mobile */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none opacity-30 hidden sm:block"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.05) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
          transform: `translateY(${scrollY * 0.05}px)`,
          transition: "transform 0.1s ease-out",
        }}
      ></div>
    </div>
  );
};
