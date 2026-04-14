import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowUp } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useBackendStatus } from "../context/BackendStatusContext";
import { useTextSplit } from "../hooks/useTextSplit";

export const HeroSection = () => {
  const { isAuthenticated, user, getRoleDashboardUrl } = useAuth();
  const { isAwake, isWakingUp, triggerWakeup } = useBackendStatus();
  const isConnecting = !isAwake && isWakingUp;
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

  const handleAction = (callback) => {
    if (!isAwake) {
      triggerWakeup();
      return false; // Indicate that we should stop here
    }
    callback();
    return true;
  };

  const handleSubmitIdea = () => {
    handleAction(() => {
        if (isAuthenticated) {
            const dashboardUrl = getRoleDashboardUrl(user);
            navigate(dashboardUrl);
        } else {
            navigate("/register", { state: { role: "entrepreneur" } });
        }
    });
  };

  const handleExploreAsInvestor = () => {
    handleAction(() => {
        if (isAuthenticated) {
            const dashboardUrl = getRoleDashboardUrl(user);
            navigate(dashboardUrl);
        } else {
            navigate("/register", { state: { role: "investor" } });
        }
    });
  };

  const handleMyDashboard = () => {
    handleAction(() => {
        const dashboardUrl = getRoleDashboardUrl(user);
        navigate(dashboardUrl);
    });
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
            </h1>
          </div>

          <p className="relative w-full max-w-[735px] font-manrope font-normal text-text-secondary text-xs sm:text-sm md:text-base text-center tracking-[-0.29px] leading-5 sm:leading-6 md:leading-7 px-4">
            The comprehensive ecosystem where entrepreneurs submit innovative
            ideas and investors discover the next big opportunity. Powered by AI
            analysis and intelligent matching.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center mt-2 sm:mt-4 w-full sm:w-auto px-4 sm:px-0">
            {isAuthenticated ? (
              <button
                onClick={handleMyDashboard}
                className="relative overflow-hidden btn btn-lg rounded-[55px] gap-2 w-full sm:w-auto shadow-lg bg-white text-black hover:bg-gray-100 border-white transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-y-1 hover:shadow-xl group focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              >
                <div className="absolute inset-0 -top-1 -bottom-1 bg-gradient-to-r from-transparent via-white/30 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
                <span className="relative z-10 font-poppins font-medium text-base">
                  My Dashboard
                </span>
                <FaArrowUp className="relative z-10 w-6 h-6 transition-transform duration-300 ease-in-out group-hover:rotate-12 group-hover:scale-110" />
              </button>
            ) : (
              <>
                <button
                  onClick={handleSubmitIdea}
                  className="relative overflow-hidden btn btn-lg rounded-[55px] gap-2 w-full sm:w-auto shadow-lg bg-white text-black hover:bg-gray-100 border-white transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-y-1 hover:shadow-xl group focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                >
                  <div className="absolute inset-0 -top-1 -bottom-1 bg-gradient-to-r from-transparent via-white/30 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
                  <span className="relative z-10 font-poppins font-medium text-base">
                    Submit Your Idea
                  </span>
                  <FaArrowUp className="relative z-10 w-6 h-6 transition-transform duration-300 ease-in-out group-hover:rotate-12 group-hover:scale-110" />
                </button>

                <button
                  onClick={handleExploreAsInvestor}
                  className="relative overflow-hidden btn btn-outline btn-lg rounded-[55px] gap-2 w-full sm:w-auto border-white text-white hover:bg-white hover:text-black transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-y-1 hover:shadow-xl group focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                >
                  <span className="relative z-10 font-poppins font-medium text-sm sm:text-base">
                    Explore as Investor
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none z-20"></div>
    </div>
  );
};
