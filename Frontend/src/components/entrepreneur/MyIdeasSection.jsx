import React from "react";
import IdeaCard from "./IdeaCard";
import { FaPlus } from "react-icons/fa";

const MyIdeasSection = () => {
  const myIdeas = [
    {
      title: "AI-Powered Healthcare Platform",
      status: "Funded",
      funding: "$15K",
      investors: 3,
      views: 127,
    },
    {
      title: "Sustainable Food Delivery",
      status: "Seeking Investment",
      funding: "$0",
      investors: 0,
      views: 89,
    },
    {
      title: "EdTech Learning Assistant",
      status: "Under Review",
      funding: "$10K",
      investors: 2,
      views: 156,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Funded":
        return "text-green-400 bg-green-400/10";
      case "Seeking Investment":
        return "text-yellow-400 bg-yellow-400/10";
      case "Under Review":
        return "text-blue-400 bg-blue-400/10";
      default:
        return "text-gray-400 bg-gray-400/10";
    }
  };

  return (
    <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden mb-8">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-manrope font-bold text-white">
            My Ideas
          </h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300 hover:scale-105 font-manrope">
            <FaPlus className="w-4 h-4" />
            Add New Idea
          </button>
        </div>

        <div className="space-y-4">
          {myIdeas.map((idea, index) => (
            <IdeaCard 
              key={index} 
              idea={idea} 
              index={index} 
              getStatusColor={getStatusColor} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyIdeasSection;
