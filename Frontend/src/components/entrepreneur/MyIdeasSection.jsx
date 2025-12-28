import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import IdeaCard from "../IdeaCard";
import {
  FaPlus,
  FaLightbulb,
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";
import { entrepreneurAPI, ideasAPI } from "../../services/api";
import { useNotifications } from "../../hooks/useNotifications";

const MyIdeasSection = ({ showTitle = true }) => {
  const navigate = useNavigate();
  const [myIdeas, setMyIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingIdea, setEditingIdea] = useState(null);
  const [editIdea, setEditIdea] = useState({
    title: "",
    description: "",
    category: "",
    elevatorPitch: "",
    targetAudience: "",
    problemStatement: "",
    solution: "",
  });

  const { addNotification, toastNotifications, removeToastNotification } =
    useNotifications();

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
        const transformedIdeas = response.data.map((idea) => ({
          id: idea.id || idea._id,
          title: idea.title,
          status: getIdeaStatus(idea),
          funding: idea.fundingReceived
            ? `$${(idea.fundingReceived / 1000).toFixed(0)}K`
            : "$0",
          investors: idea.interestedInvestors?.length || idea.investors || 0,
          views: idea.views || 0,
          description: idea.description,
          category: idea.category,
          createdAt: idea.createdAt,
          stage: idea.stage,
          budget: idea.budget,
        }));

        console.log("Transformed ideas:", transformedIdeas); // Debug log
        setMyIdeas(transformedIdeas);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching ideas:", err);
      setError("Failed to load your ideas. Please try again.");

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
    } else if (
      idea.analysisResult &&
      idea.analysisResult.status === "completed"
    ) {
      return "Under Review";
    } else if (idea.stage === "Concept") {
      return "Seeking Investment";
    } else {
      return "Active";
    }
  };

  // Handle edit idea
  const handleEditIdea = async (idea) => {
    try {
      // Fetch full idea details to get all fields
      const response = await ideasAPI.getIdeaById(idea.id);
      const fullIdea = response.data || response;

      setEditingIdea(fullIdea);
      setEditIdea({
        title: fullIdea.title || "",
        description: fullIdea.description || "",
        category: fullIdea.category || "",
        elevatorPitch: fullIdea.elevatorPitch || "",
        targetAudience: fullIdea.targetAudience || "",
        problemStatement: fullIdea.problemStatement || "",
        solution: fullIdea.solution || "",
      });
      setShowEditModal(true);
    } catch (error) {
      console.error("Error loading idea details:", error);
      addNotification("Failed to load idea details", "error");
    }
  };

  // Handle update idea
  const handleUpdateIdea = async (e) => {
    e.preventDefault();
    try {
      const ideaData = {
        title: editIdea.title.trim(),
        description: editIdea.description.trim(),
        category: editIdea.category.trim(),
        elevatorPitch: editIdea.elevatorPitch.trim(),
        targetAudience: editIdea.targetAudience.trim(),
        problemStatement: editIdea.problemStatement.trim(),
        solution: editIdea.solution.trim(),
      };

      const ideaId = editingIdea._id || editingIdea.id;
      const response = await ideasAPI.updateIdea(ideaId, ideaData);
      addNotification(`"${editIdea.title}" updated successfully!`, "success");
      setShowEditModal(false);
      setEditingIdea(null);
      setEditIdea({
        title: "",
        description: "",
        category: "",
        elevatorPitch: "",
        targetAudience: "",
        problemStatement: "",
        solution: "",
      });
      // Refresh the ideas list after a short delay
      setTimeout(() => fetchMyIdeas(), 500);
    } catch (error) {
      console.error("Error updating idea:", error);
      const errorMessage = error.message || "Failed to update idea";
      addNotification(errorMessage, "error");
    }
  };

  // Handle delete idea
  const handleDeleteIdea = async (ideaId, ideaTitle) => {
    const confirmMessage = `Are you sure you want to delete "${ideaTitle}"?\n\nThis action cannot be undone and will permanently remove the idea from your portfolio.`;

    if (window.confirm(confirmMessage)) {
      try {
        const response = await ideasAPI.deleteIdea(ideaId);
        addNotification(`"${ideaTitle}" has been deleted.`, "error");
        // Immediately remove from local state for instant feedback
        setMyIdeas((prev) => prev.filter((idea) => idea.id !== ideaId));
        // Also refresh from server
        setTimeout(() => fetchMyIdeas(), 500);
      } catch (error) {
        console.error("Error deleting idea:", error);
        const errorMessage = error.message || `Failed to delete "${ideaTitle}"`;
        addNotification(errorMessage, "error");
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Funded":
        return "text-white/90 bg-white/20";
      case "In Development":
        return "text-white/90 bg-white/20";
      case "Seeking Investment":
        return "text-white/70 bg-white/20";
      case "Under Review":
        return "text-white/90 bg-white/20";
      case "Active":
        return "text-white/80 bg-white/20";
      default:
        return "text-white/40 bg-white/[0.05] border border-white/10";
    }
  };

  const handleAddNewIdea = () => {
    // Navigate to idea submission page
    navigate("/submit-idea");
  };

  return (
    <div className="space-y-6">
      {showTitle && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaLightbulb className="w-5 h-5 text-white/70" />
            <h3 className="text-xl font-bold text-white">My Ideas</h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleAddNewIdea}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-white/90 rounded-lg transition-colors duration-200"
            >
              <FaPlus className="w-4 h-4" />
              Add New Idea
            </button>
          </div>
        </div>
      )}

      {/* Add New Idea Controls when title is hidden */}
      {!showTitle && (
        <div className="flex justify-end mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleAddNewIdea}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-white/90 rounded-lg transition-colors duration-200"
            >
              <FaPlus className="w-4 h-4" />
              Add New Idea
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <FaSpinner className="w-8 h-8 text-gray-600 mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-semibold text-white mb-2">
            Loading your ideas...
          </h3>
          <p className="text-gray-400">Please wait while we fetch your ideas</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <div className="bg-white/20 border border-white rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white/80 mb-2">
              Error Loading Ideas
            </h3>
            <p className="text-white/80 mb-4">{error}</p>
            <button
              onClick={fetchMyIdeas}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors duration-200"
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
              showInterestButton={false}
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

      {/* Toast Notifications */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toastNotifications.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg backdrop-blur-xl border animate-slide-up min-w-[300px] max-w-md ${
              toast.type === "success"
                ? "bg-white/10/10 border-white/30 text-white/90"
                : toast.type === "error"
                ? "bg-white/10 border-white/30 text-white/80"
                : toast.type === "warning"
                ? "bg-white/10 border-white/30 text-white/70"
                : "bg-white/20/10 border-white/30 text-white/90"
            }`}
          >
            {toast.type === "success" && (
              <FaCheckCircle className="w-5 h-5 flex-shrink-0 text-green-400" />
            )}
            {toast.type === "error" && (
              <FaExclamationCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
            )}
            {toast.type === "warning" && (
              <FaExclamationCircle className="w-5 h-5 flex-shrink-0 text-yellow-400" />
            )}
            {toast.type === "info" && (
              <FaInfoCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="flex-1 font-medium">{toast.message}</span>
            <button
              onClick={() => removeToastNotification(toast.id)}
              className="hover:opacity-70 transition-opacity"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Edit Idea Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-black border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-black to-white/[0.02] rounded-2xl pointer-events-none"></div>
            <div className="relative z-10 p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white font-manrope">
                    Edit Idea
                  </h2>
                  <p className="text-white/60 text-sm font-manrope mt-1">
                    Update your idea details and information
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingIdea(null);
                  }}
                  className="p-2 hover:bg-white/[0.08] rounded-lg transition-colors text-white/70 hover:text-white"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={handleUpdateIdea}
                className="space-y-6 max-h-[60vh] overflow-y-auto pr-2"
              >
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-white font-manrope mb-2">
                      Title <span className="text-white/80">*</span>
                    </label>
                    <input
                      type="text"
                      value={editIdea.title}
                      onChange={(e) =>
                        setEditIdea({ ...editIdea, title: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg focus:ring-2 focus:ring-white/20 focus:border-white/30 text-white font-manrope placeholder-white/40 backdrop-blur-sm transition-all duration-300"
                      placeholder="Enter a compelling title for your idea"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white font-manrope mb-2">
                      Elevator Pitch <span className="text-white/80">*</span>
                    </label>
                    <textarea
                      value={editIdea.elevatorPitch}
                      onChange={(e) =>
                        setEditIdea({
                          ...editIdea,
                          elevatorPitch: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg focus:ring-2 focus:ring-white/20 focus:border-white/30 text-white font-manrope placeholder-white/40 backdrop-blur-sm transition-all duration-300 resize-none"
                      placeholder="A brief and compelling pitch of your idea"
                      rows="2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white font-manrope mb-2">
                      Detailed Description{" "}
                      <span className="text-white/80">*</span>
                    </label>
                    <textarea
                      value={editIdea.description}
                      onChange={(e) =>
                        setEditIdea({
                          ...editIdea,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg focus:ring-2 focus:ring-white/20 focus:border-white/30 text-white font-manrope placeholder-white/40 backdrop-blur-sm transition-all duration-300 resize-none"
                      placeholder="Provide a comprehensive description of your innovative idea"
                      rows="4"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white font-manrope mb-2">
                        Category <span className="text-white/80">*</span>
                      </label>
                      <input
                        type="text"
                        value={editIdea.category}
                        onChange={(e) =>
                          setEditIdea({ ...editIdea, category: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg focus:ring-2 focus:ring-white/20 focus:border-white/30 text-white font-manrope placeholder-white/40 backdrop-blur-sm transition-all duration-300"
                        placeholder="e.g., Technology, Health, Education"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white font-manrope mb-2">
                        Target Audience <span className="text-white/80">*</span>
                      </label>
                      <input
                        type="text"
                        value={editIdea.targetAudience}
                        onChange={(e) =>
                          setEditIdea({
                            ...editIdea,
                            targetAudience: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg focus:ring-2 focus:ring-white/20 focus:border-white/30 text-white font-manrope placeholder-white/40 backdrop-blur-sm transition-all duration-300"
                        placeholder="Who is your target audience?"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white font-manrope mb-2">
                      Problem Statement <span className="text-white/80">*</span>
                    </label>
                    <textarea
                      value={editIdea.problemStatement}
                      onChange={(e) =>
                        setEditIdea({
                          ...editIdea,
                          problemStatement: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg focus:ring-2 focus:ring-white/20 focus:border-white/30 text-white font-manrope placeholder-white/40 backdrop-blur-sm transition-all duration-300 resize-none"
                      placeholder="What specific problem does your idea address?"
                      rows="3"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white font-manrope mb-2">
                      Solution <span className="text-white/80">*</span>
                    </label>
                    <textarea
                      value={editIdea.solution}
                      onChange={(e) =>
                        setEditIdea({ ...editIdea, solution: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg focus:ring-2 focus:ring-white/20 focus:border-white/30 text-white font-manrope placeholder-white/40 backdrop-blur-sm transition-all duration-300 resize-none"
                      placeholder="How does your idea solve the identified problem?"
                      rows="3"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-6 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingIdea(null);
                    }}
                    className="flex-1 px-6 py-3 bg-white/[0.05] hover:bg-white/[0.08] rounded-lg transition-all duration-300 text-white font-manrope border border-white/10 hover:border-white/20"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-300 text-white font-manrope shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    Update Idea
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyIdeasSection;
