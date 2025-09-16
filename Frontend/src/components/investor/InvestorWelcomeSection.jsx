import React from "react";
import { FaSearch, FaHeart } from "react-icons/fa";

const InvestorWelcomeSection = () => {
  return (
    <div className="mb-8">
      <div className="p-8 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 right-4 w-1 h-1 bg-white/60 rounded-full animate-ping"></div>
          <div className="absolute bottom-6 left-8 w-1 h-1 bg-white/50 rounded-full animate-bounce"></div>
        </div>

        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-manrope font-bold text-white mb-4">
            Ready to invest in the future?
          </h2>
          <p className="text-white/70 font-manrope mb-6 max-w-2xl">
            Explore curated startup ideas, analyze opportunities, and build your
            investment portfolio with promising entrepreneurs. Discover the next
            big innovation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvestorWelcomeSection;
