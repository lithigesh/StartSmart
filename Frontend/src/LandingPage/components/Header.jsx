import React from "react";
import { FaArrowUp } from "react-icons/fa";

const APP_CONFIG = {
  name: "StartSmart",
  tagline: "Smarter Beginning for Smarter Startups",
  description:
    "StartSmart is a full-stack AI-powered platform designed to help entrepreneurs evaluate, refine, and fund their startup ideas, while also providing investors and mentors with a structured way to discover, assess, and support potential ventures.",
  copyright: "© 2025 — StartSmart",
};

export const Header = () => {
  return (
    <nav className="relative z-50 w-full bg-black/80 backdrop-blur-md border-b border-white/10 supports-[backdrop-filter]:bg-black/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-white rounded-lg flex items-center justify-center shadow-lg">
              <svg
                className="w-5 h-5 lg:w-6 lg:h-6 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                />
              </svg>
            </div>
            <span className="text-white font-semibold text-lg lg:text-xl [font-family:'Manrope',Helvetica] whitespace-nowrap">
              {APP_CONFIG.name}
            </span>
          </div>

          <div className="hidden lg:flex items-center space-x-6">
            <button className="btn btn-sm rounded-full gap-2 shadow-lg hover:shadow-xl bg-white text-black hover:bg-gray-100 border-white">
              <span className="[font-family:'Poppins',Helvetica]">Sign Up</span>
              <FaArrowUp className="w-4 h-4" />
            </button>
          </div>

          <div className="lg:hidden flex items-center">
            <button className="btn btn-sm rounded-full gap-2 bg-white text-black hover:bg-gray-100 border-white">
              <span className="[font-family:'Poppins',Helvetica]">Sign Up</span>
              <FaArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
