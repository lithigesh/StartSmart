import React from "react";
import { FaSearch, FaHeart } from "react-icons/fa";

const InvestorWelcomeSection = ({ 
  availableIdeas, 
  totalInvestments, 
  scrollToBrowseIdeas, 
  scrollToInterestedIdeas 
}) => {
  return (
    <div className="mb-8">
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 right-4 w-1 h-1 bg-white/40 rounded-full animate-ping"></div>
          <div className="absolute bottom-6 left-8 w-1 h-1 bg-white/35 rounded-full animate-bounce"></div>
        </div>

        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-manrope font-bold text-white mb-4">
            Ready to invest in the future?
          </h2>
          <p className="text-white/70 font-manrope mb-6 max-w-2xl">
            Explore curated startup ideas, analyze opportunities, and build
            your investment portfolio with promising entrepreneurs. Discover
            the next big innovation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={scrollToBrowseIdeas}
              className="btn rounded-lg px-6 py-3 font-manrope font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 bg-white text-black hover:bg-white/90"
            >
              <FaSearch className="w-4 h-4" />
              Browse Ideas ({availableIdeas})
            </button>
            <button
              onClick={scrollToInterestedIdeas}
              className="btn rounded-lg px-6 py-3 font-manrope font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 bg-white/10 text-white hover:bg-white/20 border border-white/20"
            >
              <FaHeart className="w-4 h-4" />
              My Interests ({totalInvestments})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorWelcomeSection;
