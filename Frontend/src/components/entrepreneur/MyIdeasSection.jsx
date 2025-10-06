import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import IdeaCard from "./IdeaCard";
import IdeasListCharts from "../charts/IdeasListCharts";
import { FaPlus, FaLightbulb, FaSpinner, FaChartBar } from "react-icons/fa";
import { entrepreneurAPI, ideasAPI } from "../../services/api";
import { useNotifications } from "../../hooks/useNotifications";

const MyIdeasSection = ({ showTitle = true }) => {
  const navigate = useNavigate();
  const [myIdeas, setMyIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingIdea, setEditingIdea] = useState(null);
  const [showCharts, setShowCharts] = useState(false);
  const [editIdea, setEditIdea] = useState({
    title: "",
    description: "",
    category: "",
    stage: "Planning",
    fundingGoal: "",
  });
  
  const { addNotification } = useNotifications();

  // Fetch user's ideas on component mount
  useEffect(() => {
    fetchMyIdeas();
  }, []);

  const fetchMyIdeas = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching user ideas..."); // Debug log
      
      const response = await ideasAPI.getUserIdeas();
      console.log("Ideas API response:", response); // Debug log
      
      if (response.success && response.data) {
        // Transform the API data to match the component's expected format
        const transformedIdeas = response.data.map(idea => ({
          id: idea.id || idea._id,
          title: idea.title,
          status: getIdeaStatus(idea),
          funding: idea.fundingReceived ? `$${(idea.fundingReceived / 1000).toFixed(0)}K` : '$0',
          investors: idea.interestedInvestors?.length || idea.investors || 0,
          views: idea.views || 0,
          description: idea.description,
          category: idea.category,
          createdAt: idea.createdAt,
          stage: idea.stage,
          budget: idea.budget
        }));
        
        console.log("Transformed ideas:", transformedIdeas); // Debug log
        setMyIdeas(transformedIdeas);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching ideas:', err);
      setError('Failed to load your ideas. Please try again.');
      
      // Fallback to empty array instead of demo data
      setMyIdeas([]);
    } finally {
      setLoading(false);
    }
  };

  // Determine idea status based on API data
  const getIdeaStatus = (idea) => {
    if (idea.fundingReceived && idea.fundingReceived > 0) {
      return "Funded";
    } else if (idea.stage === "MVP" || idea.stage === "Prototype") {
      return "In Development";
    } else if (idea.analysisResult && idea.analysisResult.status === 'completed') {
      return "Under Review";
    } else if (idea.stage === "Concept") {
      return "Seeking Investment";
    } else {
      return "Active";
    }
  };

  // Handle edit idea
  const handleEditIdea = (idea) => {
    setEditingIdea(idea);
    setEditIdea({
      title: idea.title,
      description: idea.description,
      category: idea.category,
      stage: idea.stage || "Planning",
      fundingGoal: idea.fundingGoal || "",
    });
    setShowEditModal(true);
  };

  // Handle update idea
  const handleUpdateIdea = async (e) => {
    e.preventDefault();
    try {
      const ideaData = {
        ...editIdea,
        fundingGoal: parseFloat(editIdea.fundingGoal) || 0,
      };
      
      await ideasAPI.updateIdea(editingIdea.id, ideaData);
      addNotification("Idea updated successfully!", "success");
      setShowEditModal(false);
      setEditingIdea(null);
      setEditIdea({
        title: "",
        description: "",
        category: "",
        stage: "Planning",
        fundingGoal: "",
      });
      fetchMyIdeas(); // Refresh the ideas list
    } catch (error) {
      console.error("Error updating idea:", error);
      addNotification("Failed to update idea", "error");
    }
  };

  // Handle delete idea
  const handleDeleteIdea = async (ideaId, ideaTitle) => {
    const confirmMessage = `Are you sure you want to delete "${ideaTitle}"?\n\nThis action cannot be undone and will permanently remove the idea from your portfolio.`;
    
    if (window.confirm(confirmMessage)) {
      try {
        await ideasAPI.deleteIdea(ideaId);
        addNotification(`"${ideaTitle}" deleted successfully!`, "success");
        fetchMyIdeas(); // Refresh the ideas list
      } catch (error) {
        console.error("Error deleting idea:", error);
        addNotification(`Failed to delete "${ideaTitle}". Please try again.`, "error");
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Funded":
        return "text-green-400 bg-green-900/20";
      case "In Development":
        return "text-blue-400 bg-blue-900/20";
      case "Seeking Investment":
        return "text-yellow-400 bg-yellow-900/20";
      case "Under Review":
        return "text-purple-400 bg-purple-900/20";
      case "Active":
        return "text-cyan-400 bg-cyan-900/20";
      default:
        return "text-gray-400 bg-gray-900/20";
    }
  };

  const handleAddNewIdea = () => {
    // Navigate to idea submission page
    navigate('/submit-idea');
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
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowCharts(!showCharts)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                showCharts 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              <FaChartBar className="w-4 h-4" />
              {showCharts ? 'Hide Analytics' : 'Show Analytics'}
            </button>
            <button 
              onClick={handleAddNewIdea}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-gray-200 rounded-lg transition-colors duration-200"
            >
              <FaPlus className="w-4 h-4" />
              Add New Idea
            </button>
          </div>
        </div>
      )}

      {/* Analytics Controls when title is hidden */}
      {!showTitle && (
        <div className="flex justify-end mb-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowCharts(!showCharts)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                showCharts 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              <FaChartBar className="w-4 h-4" />
              {showCharts ? 'Hide Analytics' : 'Show Analytics'}
            </button>
            <button 
              onClick={handleAddNewIdea}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-gray-200 rounded-lg transition-colors duration-200"
            >
              <FaPlus className="w-4 h-4" />
              Add New Idea
            </button>
          </div>
        </div>
      )}

      {/* Analytics Charts */}
      {showCharts && !loading && !error && myIdeas.length > 0 && (
        <div className="mb-8">
          <IdeasListCharts />
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
      {!loading && !error && myIdeas.length > 0 && (
        <div className="space-y-4">
          {myIdeas.map((idea, index) => (
            <IdeaCard 
              key={idea.id || index} 
              idea={idea} 
              index={index} 
              getStatusColor={getStatusColor}
              onEdit={handleEditIdea}
              onDelete={handleDeleteIdea}
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
          <button 
            onClick={handleAddNewIdea}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black hover:bg-gray-200 rounded-lg transition-colors duration-200"
          >
            <FaPlus className="w-4 h-4" />
            Submit Your First Idea
          </button>
        </div>
      )}

      {/* Edit Idea Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-md w-full mx-4 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Edit Idea</h2>
            <form onSubmit={handleUpdateIdea} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={editIdea.title}
                  onChange={(e) => setEditIdea({ ...editIdea, title: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  placeholder="Enter idea title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={editIdea.description}
                  onChange={(e) => setEditIdea({ ...editIdea, description: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  placeholder="Describe your idea"
                  rows="4"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <input
                  type="text"
                  value={editIdea.category}
                  onChange={(e) => setEditIdea({ ...editIdea, category: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  placeholder="e.g., Technology, Health, Education"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Stage</label>
                <select
                  value={editIdea.stage}
                  onChange={(e) => setEditIdea({ ...editIdea, stage: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                >
                  <option value="Planning">Planning</option>
                  <option value="Development">Development</option>
                  <option value="Testing">Testing</option>
                  <option value="Launch">Launch</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Funding Goal ($)</label>
                <input
                  type="number"
                  value={editIdea.fundingGoal}
                  onChange={(e) => setEditIdea({ ...editIdea, fundingGoal: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  placeholder="Enter funding goal"
                  min="0"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingIdea(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 rounded-lg transition-all text-white"
                >
                  Update Idea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyIdeasSection;
