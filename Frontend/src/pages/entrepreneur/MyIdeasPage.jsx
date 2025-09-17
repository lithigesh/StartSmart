import React, { useState, useEffect } from "react";
import { FaLightbulb, FaPlus, FaSearch, FaFilter, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import SideBar from "../../components/entrepreneur/SideBar";
import DashboardHeader from "../../components/entrepreneur/DashboardHeader";
import IdeaSubmissionForm from "../../components/entrepreneur/IdeaSubmissionForm";
import { ideasAPI } from "../../services/api";

const MyIdeasPage = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Dummy data for now
  const dummyIdeas = [
    {
      _id: "1",
      title: "AI-Powered Smart Home Assistant",
      description: "An intelligent home automation system that learns user preferences and optimizes energy consumption.",
      category: "Technology",
      status: "analyzed",
      createdAt: "2025-09-01T10:00:00Z",
      analysis: {
        score: 85,
        swot: {
          strengths: "Innovative AI technology, growing smart home market",
          weaknesses: "High competition, technical complexity",
          opportunities: "IoT expansion, energy efficiency trends",
          threats: "Big tech competitors, privacy concerns"
        }
      }
    },
    {
      _id: "2",
      title: "Sustainable Packaging Solutions",
      description: "Biodegradable packaging made from agricultural waste for e-commerce companies.",
      category: "Environmental",
      status: "submitted",
      createdAt: "2025-09-05T14:30:00Z",
      analysis: {
        score: 92,
        swot: {
          strengths: "Eco-friendly, cost-effective materials",
          weaknesses: "Limited scalability initially",
          opportunities: "Growing environmental awareness",
          threats: "Regulatory changes, material sourcing"
        }
      }
    },
    {
      _id: "3",
      title: "Digital Health Platform for Rural Areas",
      description: "Telemedicine platform connecting rural patients with urban healthcare providers.",
      category: "Healthcare",
      status: "draft",
      createdAt: "2025-09-10T09:15:00Z",
      analysis: null
    }
  ];

  useEffect(() => {
    loadIdeas();
  }, []);

  const loadIdeas = async () => {
    try {
      setLoading(true);
      // For now, use dummy data
      // In the future: const response = await ideasAPI.getUserIdeas();
      setTimeout(() => {
        setIdeas(dummyIdeas);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error loading ideas:", error);
      setIdeas(dummyIdeas);
      setLoading(false);
    }
  };

  const handleSubmitIdea = async (formData) => {
    try {
      const ideaData = {
        title: formData.title,
        description: formData.detailedDescription,
        category: formData.category
      };
      
      await ideasAPI.submitIdea(ideaData);
      alert("Idea submitted successfully!");
      setIsFormOpen(false);
      loadIdeas(); // Reload ideas
    } catch (error) {
      console.error("Error submitting idea:", error);
      alert("Error submitting idea. Please try again.");
    }
  };

  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         idea.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || idea.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "draft": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "submitted": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "analyzed": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "funding_requested": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "closed": return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const categories = ["all", "Technology", "Healthcare", "Education", "Environmental", "Fintech", "E-commerce"];

  return (
    <div className="min-h-screen bg-black flex">
      <SideBar />
      
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">My Ideas</h1>
                  <p className="text-white/60">Manage and track your submitted startup ideas</p>
                </div>
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  <FaPlus className="w-4 h-4" />
                  Submit New Idea
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search ideas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white"
                  />
                </div>
                <div className="relative">
                  <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="pl-10 pr-8 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white"
                  >
                    {categories.map(category => (
                      <option key={category} value={category} className="bg-gray-800">
                        {category === "all" ? "All Categories" : category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Ideas Grid */}
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredIdeas.map((idea) => (
                  <div key={idea._id} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <FaLightbulb className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold text-lg">{idea.title}</h3>
                          <p className="text-white/60 text-sm">{idea.category}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getStatusColor(idea.status)}`}>
                        {idea.status.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <p className="text-white/70 text-sm mb-4 line-clamp-3">
                      {idea.description}
                    </p>
                    
                    {idea.analysis && (
                      <div className="mb-4 p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white/70 text-sm">AI Analysis Score</span>
                          <span className="text-green-400 font-bold">{idea.analysis.score}/100</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                            style={{ width: `${idea.analysis.score}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-white/50 text-xs">
                        {new Date(idea.createdAt).toLocaleDateString()}
                      </span>
                      <div className="flex gap-2">
                        <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                          <FaEye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-white/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredIdeas.length === 0 && !loading && (
              <div className="text-center py-12">
                <FaLightbulb className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No ideas found</h3>
                <p className="text-white/60 mb-6">
                  {searchTerm || filterCategory !== "all" 
                    ? "Try adjusting your search or filter criteria" 
                    : "Start by submitting your first startup idea"}
                </p>
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  Submit Your First Idea
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Idea Submission Form */}
      <IdeaSubmissionForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmitIdea}
      />
    </div>
  );
};

export default MyIdeasPage;