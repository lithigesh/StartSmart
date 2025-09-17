import React, { useState, useEffect } from "react";
import IdeaCard from "./IdeaCard";
import { FaPlus, FaLightbulb, FaSpinner } from "react-icons/fa";
import { entrepreneurAPI } from "../../services/api";

const MyIdeasSection = ({ showTitle = true }) => {
  const [myIdeas, setMyIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user's ideas on component mount
  useEffect(() => {
    fetchMyIdeas();
  }, []);

  const fetchMyIdeas = async () => {
    try {
      setLoading(true);
      setError(null);
      const ideas = await entrepreneurAPI.getMyIdeas();
      
      // Transform the API data to match the component's expected format
      const transformedIdeas = ideas.map(idea => ({
        id: idea._id,
        title: idea.title,
        status: getIdeaStatus(idea),
        funding: idea.fundingReceived ? `$${(idea.fundingReceived / 1000).toFixed(0)}K` : '$0',
        investors: idea.interestedInvestors?.length || 0,
        views: idea.views || 0,
        description: idea.description,
        category: idea.category,
        createdAt: idea.createdAt
      }));
      
      setMyIdeas(transformedIdeas);
    } catch (err) {
      console.error('Error fetching ideas:', err);
      setError('Failed to load your ideas. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Determine idea status based on API data
  const getIdeaStatus = (idea) => {
    if (idea.fundingReceived && idea.fundingReceived > 0) {
      return "Funded";
    } else if (idea.analysisResult && idea.analysisResult.status === 'completed') {
      return "Under Review";
    } else {
      return "Seeking Investment";
    }
  };

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

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <FaSpinner className="w-8 h-8 text-gray-600 mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-semibold text-white mb-2">
            Loading your ideas...
          </h3>
          <p className="text-gray-400">
            Please wait while we fetch your ideas
          </p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-400 mb-2">
              Error Loading Ideas
            </h3>
            <p className="text-red-300 mb-4">{error}</p>
            <button 
              onClick={fetchMyIdeas}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Ideas List */}
      {!loading && !error && (
        <div className="space-y-4">
          {myIdeas.map((idea, index) => (
            <IdeaCard 
              key={idea.id || index} 
              idea={idea} 
              index={index} 
              getStatusColor={getStatusColor} 
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && myIdeas.length === 0 && (
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
