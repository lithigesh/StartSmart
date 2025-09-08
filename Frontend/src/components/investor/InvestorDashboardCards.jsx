import React from "react";

const InvestorDashboardCards = ({ dashboardCards }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {dashboardCards.map((card, index) => (
        <div
          key={index}
          className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300 hover:scale-105 cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-white/[0.02] rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center ${card.color} group-hover:scale-110 transition-transform duration-300`}
              >
                {card.icon}
              </div>
              <span
                className={`text-2xl font-bold ${card.color} font-manrope`}
              >
                {card.count}
              </span>
            </div>

            <h3 className="text-white font-manrope font-semibold text-lg mb-2 group-hover:text-gray-200 transition-colors duration-300">
              {card.title}
            </h3>
            <p className="text-white/60 text-sm font-manrope group-hover:text-white/80 transition-colors duration-300">
              {card.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InvestorDashboardCards;
