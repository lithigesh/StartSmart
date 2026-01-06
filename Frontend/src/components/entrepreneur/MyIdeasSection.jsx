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

  // Handle edit idea - Navigate to edit page instead of opening modal
  const handleEditIdea = (idea) => {
    navigate(`/edit-idea/${idea._id || idea.id}`);
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
    </div>
  );
};

export default MyIdeasSection;
