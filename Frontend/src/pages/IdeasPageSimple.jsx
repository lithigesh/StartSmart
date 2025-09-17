import React, { useState } from "react";
import { FaLightbulb, FaPlus, FaEye, FaDollarSign, FaUsers, FaCalendarAlt } from "react-icons/fa";
import SideBar from "../components/entrepreneur/SideBar";
import Header from "../components/Header";

const IdeasPage = () => {
  const [ideas] = useState([
    {
      id: 1,
      title: "AI-Powered Personal Assistant",
      description: "An intelligent assistant that learns from user behavior and helps with daily tasks",
      category: "Technology",
      stage: "Development",
      fundingGoal: 50000,
      currentFunding: 15000,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 2,
      title: "Sustainable Food Delivery",
      description: "Eco-friendly food delivery using electric vehicles and sustainable packaging",
      category: "Food & Beverage",
      stage: "Planning",
      fundingGoal: 25000,
      currentFunding: 0,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 3,
      title: "Smart Home Energy Manager",
      description: "IoT solution for optimizing home energy consumption and reducing costs",
      category: "Green Tech",
      stage: "Testing",
      fundingGoal: 35000,
      currentFunding: 8000,
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]);

  const getStageColor = (stage) => {
    switch (stage) {
      case "Planning":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Development":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Testing":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "Launch":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="flex">
        <SideBar />
        <main className="flex-1 ml-64 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                  <FaLightbulb className="text-yellow-400" />
                  My Ideas
                </h1>
                <p className="text-gray-400">
                  Manage and track your innovative ideas
                </p>
              </div>
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl">
                <FaPlus className="w-4 h-4" />
                Create New Idea
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="glass-card p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Ideas</p>
                    <p className="text-2xl font-bold">{ideas.length}</p>
                  </div>
                  <FaLightbulb className="text-yellow-400 text-2xl" />
                </div>
              </div>
              <div className="glass-card p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">In Development</p>
                    <p className="text-2xl font-bold">
                      {ideas.filter(idea => idea.stage === "Development").length}
                    </p>
                  </div>
                  <FaUsers className="text-blue-400 text-2xl" />
                </div>
              </div>
              <div className="glass-card p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Funding Goal</p>
                    <p className="text-2xl font-bold">
                      ${ideas.reduce((sum, idea) => sum + (idea.fundingGoal || 0), 0).toLocaleString()}
                    </p>
                  </div>
                  <FaDollarSign className="text-green-400 text-2xl" />
                </div>
              </div>
              <div className="glass-card p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Launched</p>
                    <p className="text-2xl font-bold">
                      {ideas.filter(idea => idea.stage === "Launch").length}
                    </p>
                  </div>
                  <FaCalendarAlt className="text-purple-400 text-2xl" />
                </div>
              </div>
            </div>

            {/* Ideas Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ideas.map((idea) => (
                <div key={idea.id} className="glass-card p-6 rounded-xl hover:shadow-xl transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-white truncate">{idea.title}</h3>
                    <button className="text-blue-400 hover:text-blue-300 transition-colors" title="View Details">
                      <FaEye className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {idea.description}
                  </p>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Category</span>
                      <span className="text-white text-sm font-medium">{idea.category}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Stage</span>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getStageColor(idea.stage)}`}>
                        {idea.stage}
                      </span>
                    </div>

                    {idea.fundingGoal > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Funding Goal</span>
                        <span className="text-green-400 text-sm font-medium">
                          ${idea.fundingGoal?.toLocaleString()}
                        </span>
                      </div>
                    )}

                    {idea.currentFunding > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Current Funding</span>
                        <span className="text-green-400 text-sm font-medium">
                          ${idea.currentFunding?.toLocaleString()}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Created</span>
                      <span className="text-white text-sm">
                        {new Date(idea.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default IdeasPage;