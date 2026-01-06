import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ErrorBoundary from "../../components/ErrorBoundary";
import LoadingSpinner from "../../components/LoadingSpinner";
import IdeaMasterForm from "./components/IdeaMasterForm";
import toast from "react-hot-toast";
import { Lightbulb } from "lucide-react";
import { ideasAPI } from "../../services/api";

const IdeaSubmissionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: ideaId } = useParams();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(ideaId ? true : false);

  // Get ideathon ID from location state if redirected from ideathon registration
  const fromIdeathonId = location.state?.fromIdeathon;
  const [ideaData, setIdeaData] = useState(null);

  // Fetch idea data when in edit mode
  useEffect(() => {
    if (isEditMode && ideaId) {
      const fetchIdeaData = async () => {
        try {
          setIsLoading(true);
          const response = await ideasAPI.getIdeaById(ideaId);
          const data = response.data || response;
          setIdeaData(data);
        } catch (err) {
          console.error("Error loading idea:", err);
          toast.error("Failed to load idea details");
          // Redirect back if idea not found
          setTimeout(() => {
            navigate("/entrepreneur/my-ideas");
          }, 2000);
        } finally {
          setIsLoading(false);
        }
      };
      fetchIdeaData();
    }
  }, [ideaId, isEditMode, navigate]);

  // Determine if this is edit mode based on URL params
  useEffect(() => {
    if (ideaId) {
      setIsEditMode(true);
    }
  }, [ideaId]);

  // Handle successful form submission
  const handleFormSuccess = (result) => {
    if (result.success && result.data) {
      // Show success toast with transparency
      toast.success(isEditMode ? "Idea updated successfully!" : "Idea submitted successfully!", {
        duration: 3000,
        position: "bottom-right",
        style: {
          background: "rgba(16, 185, 129, 0.9)",
          color: "#fff",
          borderRadius: "12px",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        },
      });

      // Navigate back to ideathon registration if coming from there, otherwise to my ideas
      setTimeout(() => {
        if (fromIdeathonId) {
          navigate(`/entrepreneur/ideathon/${fromIdeathonId}/register`);
        } else {
          // Navigate to my ideas for all creation and edit modes
          navigate("/entrepreneur/my-ideas");
        }
      }, 1500);
    }
  };

  // Handle form submission errors
  const handleFormError = (error) => {
    toast.error(error || "Failed to submit idea", {
      duration: 4000,
      position: "bottom-right",
      style: {
        background: "rgba(239, 68, 68, 0.9)",
        color: "#fff",
        borderRadius: "12px",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
      },
    });
  };

  if (!user || user.role !== "entrepreneur") {
    return <LoadingSpinner fullScreen message="Loading..." />;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-black">
        {/* Header */}
        <div className="bg-black/95 backdrop-blur-xl border-b border-white/20 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-5 sm:py-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 flex items-center gap-3">
                    <Lightbulb className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-yellow-400 flex-shrink-0" />
                    {isEditMode ? "Edit Your Idea" : "Submit Your Idea"}
                  </h1>
                  <p className="mt-2 text-gray-300 text-base sm:text-lg">
                    {isEditMode
                      ? "Update your innovative concept and keep your idea fresh"
                      : "Share your innovative concept and start your entrepreneurial journey"}
                  </p>
                </div>
                <button
                  onClick={() => navigate(-1)}
                  className="w-full sm:w-auto px-6 py-3 text-gray-300 hover:text-white focus:outline-none transition-all hover:scale-105 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10"
                >
                  ← Back
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin inline-block w-8 h-8 border-4 border-white/20 border-t-white rounded-full mb-4"></div>
              <p className="text-white/70">Loading idea details...</p>
            </div>
          ) : (
            <IdeaMasterForm
              ideaId={ideaId}
              isEditMode={isEditMode}
              initialData={ideaData || {}}
              onSuccess={handleFormSuccess}
              onError={handleFormError}
            />
          )}
        </div>

        {/* Footer */}
        <div className="bg-black/95 border-t border-white/10 py-6 mt-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-400 text-sm">
              Need help? Contact our support team or check the FAQ section
            </p>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default IdeaSubmissionPage;
