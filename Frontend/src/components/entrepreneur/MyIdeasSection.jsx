import React from "react";
import IdeaCard from "./IdeaCard";
import { FaPlus, FaLightbulb } from "react-icons/fa";

const MyIdeasSection = ({ showTitle = true }) => {
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
        return "text-green-400 bg-green-900/20";
      case "Seeking Investment":
        return "text-yellow-400 bg-yellow-900/20";
      case "Under Review":
        return "text-purple-400 bg-purple-900/20";
      default:
        return "text-gray-400 bg-gray-900/20";
    }
  };

  return (
    <div className="space-y-6">
      {showTitle && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaLightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="text-xl font-bold text-white">
              My Ideas
            </h3>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-gray-200 rounded-lg transition-colors duration-200">
            <FaPlus className="w-4 h-4" />
            Add New Idea
          </button>
        </div>
      )}

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

      {myIdeas.length === 0 && (
        <div className="text-center py-12">
          <FaLightbulb className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            No ideas yet
          </h3>
          <p className="text-gray-400 mb-4">
            Start your entrepreneurial journey by submitting your first idea
          </p>
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black hover:bg-gray-200 rounded-lg transition-colors duration-200">
            <FaPlus className="w-4 h-4" />
            Submit Your First Idea
          </button>
        </div>
      )}
    </div>
  );
};

export default MyIdeasSection;
