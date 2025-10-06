import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaLightbulb, FaPlus, FaEye, FaEdit, FaTrash, FaDollarSign, FaUsers, FaCalendarAlt } from "react-icons/fa";
import SideBar from "../components/entrepreneur/SideBar";
import Header from "../components/Header";
import { ideasAPI } from "../services/api";
import { useNotifications } from "../hooks/useNotifications";

const IdeasPage = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingIdea, setEditingIdea] = useState(null);
  const [newIdea, setNewIdea] = useState({
    title: "",
    description: "",
    category: "",
    stage: "Planning",
    fundingGoal: "",
  });
  const [editIdea, setEditIdea] = useState({
    title: "",
    description: "",
    category: "",
    stage: "Planning",
    fundingGoal: "",
  });
  
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  useEffect(() => {
    loadIdeas();
  }, []);

  const loadIdeas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ideasAPI.getUserIdeas();
      setIdeas(response.data || []);
    } catch (err) {
      console.error("Error loading ideas:", err);
      setError(err.message);
      addNotification("Failed to load ideas", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIdea = async (e) => {
    e.preventDefault();
    try {
      const ideaData = {
        ...newIdea,
        fundingGoal: parseFloat(newIdea.fundingGoal) || 0,
      };
      
      await ideasAPI.createIdea(ideaData);
      addNotification("Idea created successfully!", "success");
      setShowCreateModal(false);
      setNewIdea({
        title: "",
        description: "",
        category: "",
        stage: "Planning",
        fundingGoal: "",
      });
      loadIdeas();
    } catch (error) {
      console.error("Error creating idea:", error);
      addNotification("Failed to create idea", "error");
    }
  };

  const handleDeleteIdea = async (ideaId, ideaTitle) => {
    const confirmMessage = `Are you sure you want to delete "${ideaTitle}"?\n\nThis action cannot be undone and will permanently remove the idea from your portfolio.`;
    
    if (window.confirm(confirmMessage)) {
      try {
        await ideasAPI.deleteIdea(ideaId);
        addNotification(`"${ideaTitle}" deleted successfully!`, "success");
        loadIdeas();
      } catch (error) {
        console.error("Error deleting idea:", error);
        addNotification(`Failed to delete "${ideaTitle}". Please try again.`, "error");
      }
    }
  };

  const handleEditIdea = (idea) => {
    setEditingIdea(idea);
    setEditIdea({
      title: idea.title,
      description: idea.description,
      category: idea.category,
      stage: idea.stage,
      fundingGoal: idea.fundingGoal || "",
    });
    setShowEditModal(true);
  };

  const handleUpdateIdea = async (e) => {
    e.preventDefault();
    try {
      const ideaData = {
        ...editIdea,
        fundingGoal: parseFloat(editIdea.fundingGoal) || 0,
      };
      
      await ideasAPI.updateIdea(editingIdea.id || editingIdea._id, ideaData);
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
      loadIdeas();
    } catch (error) {
      console.error("Error updating idea:", error);
      addNotification("Failed to update idea", "error");
    }
  };

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
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
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
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-400 mb-4">Error loading ideas: {error}</p>
                <button
                  onClick={loadIdeas}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : ideas.length === 0 ? (
              <div className="text-center py-12">
                <FaLightbulb className="mx-auto text-6xl text-gray-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Ideas Yet</h3>
                <p className="text-gray-400 mb-6">Start by creating your first innovative idea!</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 rounded-xl font-medium transition-all duration-200"
                >
                  Create Your First Idea
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ideas.map((idea) => (
                  <div key={idea.id} className="glass-card p-6 rounded-xl hover:shadow-xl transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-white truncate">{idea.title}</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/idea/${idea.id}`)}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                          title="View Details"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditIdea(idea)}
                          className="text-yellow-400 hover:text-yellow-300 transition-colors"
                          title="Edit Idea"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteIdea(idea.id, idea.title)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                          title="Delete Idea"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
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
            )}
          </div>
        </main>
      </div>

      {/* Create Idea Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-card p-8 rounded-xl max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-6">Create New Idea</h2>
            <form onSubmit={handleCreateIdea} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={newIdea.title}
                  onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter idea title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={newIdea.description}
                  onChange={(e) => setNewIdea({ ...newIdea, description: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your idea"
                  rows="4"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <input
                  type="text"
                  value={newIdea.category}
                  onChange={(e) => setNewIdea({ ...newIdea, category: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Technology, Health, Education"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Stage</label>
                <select
                  value={newIdea.stage}
                  onChange={(e) => setNewIdea({ ...newIdea, stage: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Planning">Planning</option>
                  <option value="Development">Development</option>
                  <option value="Testing">Testing</option>
                  <option value="Launch">Launch</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Funding Goal ($)</label>
                <input
                  type="number"
                  value={newIdea.fundingGoal}
                  onChange={(e) => setNewIdea({ ...newIdea, fundingGoal: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter funding goal"
                  min="0"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-all"
                >
                  Create Idea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Idea Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-card p-8 rounded-xl max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-6">Edit Idea</h2>
            <form onSubmit={handleUpdateIdea} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={editIdea.title}
                  onChange={(e) => setEditIdea({ ...editIdea, title: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter idea title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={editIdea.description}
                  onChange={(e) => setEditIdea({ ...editIdea, description: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your idea"
                  rows="4"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <input
                  type="text"
                  value={editIdea.category}
                  onChange={(e) => setEditIdea({ ...editIdea, category: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Technology, Health, Education"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Stage</label>
                <select
                  value={editIdea.stage}
                  onChange={(e) => setEditIdea({ ...editIdea, stage: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Planning">Planning</option>
                  <option value="Development">Development</option>
                  <option value="Testing">Testing</option>
                  <option value="Launch">Launch</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Funding Goal ($)</label>
                <input
                  type="number"
                  value={editIdea.fundingGoal}
                  onChange={(e) => setEditIdea({ ...editIdea, fundingGoal: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 rounded-lg transition-all"
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

export default IdeasPage;