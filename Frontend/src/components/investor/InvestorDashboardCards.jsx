import React from "react";

const InvestorDashboardCards = ({ dashboardCards }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
      {dashboardCards.map((card, index) => (
        <div
          key={index}
          onClick={card.onClick}
          className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/[0.05] hover:border-white/30 transition-all duration-300 hover:scale-105 cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center ${card.color} group-hover:scale-110 transition-transform duration-300`}
              >
                {card.icon}
              </div>
              <span className={`text-2xl font-bold ${card.color} font-manrope`}>
                {card.count}
              </span>
            </div>

            <h3 className="text-white font-manrope font-semibold text-base sm:text-lg mb-2 group-hover:text-white/90 transition-colors duration-300">
              {card.title}
            </h3>
            <p className="text-white/60 text-xs sm:text-sm font-manrope group-hover:text-white/80 transition-colors duration-300">
              {card.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InvestorDashboardCards;
