import React from "react";
import DashboardCard from "./DashboardCard";
import {
  FaLightbulb,
  FaBell,
  FaBriefcase,
  FaDollarSign,
} from "react-icons/fa";

const DashboardCardsGrid = () => {
  const dashboardCards = [
    {
      title: "My Ideas",
      description: "View and manage your submitted ideas",
      icon: <FaLightbulb />,
      count: "3",
      color: "text-yellow-400",
    },
    {
      title: "Funding Received",
      description: "Track your funding progress and investments",
      icon: <FaDollarSign />,
      count: "$25K",
      color: "text-green-400",
    },
    {
      title: "Investor Interest",
      description: "See who's interested in your ideas",
      icon: <FaBriefcase />,
      count: "8",
      color: "text-purple-400",
    },
    
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {dashboardCards.map((card, index) => (
        <DashboardCard key={index} card={card} index={index} />
      ))}
    </div>
  );
};

export default DashboardCardsGrid;
