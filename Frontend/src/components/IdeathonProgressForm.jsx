import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaTimes, FaPlus, FaTrash } from "react-icons/fa";

const IdeathonProgressForm = ({ registration, onClose, onSuccess }) => {
  const [showFinalSubmission, setShowFinalSubmission] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progressData, setProgressData] = useState({
    currentProgress: registration.currentProgress || 0,
    currentStatus: registration.progressStatus || "Not Started",
    completedTasks: "",
    pendingTasks: "",
    nextMilestones: "",
    blockingIssues: "",
    teamUpdates: "",
  });
  const [finalSubmissionData, setFinalSubmissionData] = useState({
    projectSummary: "",
    technicalImplementation: "",
    challenges: "",
    futureEnhancements: "",
    teamContributions: "",
    demoVideo: "",
    githubFinalRepo: "",
    liveDemoLink: "",
  });

  const handleProgressChange = (e) => {
    const { name, value } = e.target;
    if (name === "currentProgress") {
      const progress = Math.min(100, Math.max(0, parseInt(value) || 0));
      setProgressData((prev) => ({
        ...prev,
        [name]: progress,
      }));
    } else {
      setProgressData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleProgressUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

      const response = await axios.put(
        `${API_BASE}/api/ideathons/registrations/${registration._id}/progress`,
        progressData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Progress updated successfully!", {
          duration: 3000,
          position: "top-center",
        });

        // Update local state with progress data
        const updatedRegistration = {
          ...registration,
          currentProgress: progressData.currentProgress,
          progressStatus: progressData.currentStatus,
          lastUpdated: new Date(),
        };

        onSuccess(updatedRegistration);
        onClose();
      }
    } catch (error) {
      console.error("Error updating progress:", error);
      toast.error(error.response?.data?.message || "Failed to update progress");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmissionChange = (e) => {
    const { name, value } = e.target;
    setFinalSubmissionData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFinalSubmission = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Validate required fields with specific messages
      if (!finalSubmissionData.projectSummary) {
        toast.error("Please provide a project summary");
        setLoading(false);
        return;
      }
      if (!finalSubmissionData.technicalImplementation) {
        toast.error("Please provide technical implementation details");
        setLoading(false);
        return;
      }
      if (!finalSubmissionData.githubFinalRepo) {
        toast.error("Please provide the GitHub repository URL");
        setLoading(false);
        return;
      }

      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

      const response = await axios.post(
        `${API_BASE}/api/ideathons/registrations/${registration._id}/final-submission`,
        finalSubmissionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        // Show success message with longer duration
        toast.success(
          "Final project submitted successfully! Your submission has been recorded.",
          {
            duration: 5000,
            position: "top-center",
          }
        );

        // Update local state with complete final submission data
        const updatedRegistration = {
          ...registration,
          finalSubmission: {
            ...finalSubmissionData,
            submittedAt: new Date(),
            status: "submitted",
          },
          progressStatus: "Ready for Submission",
          currentProgress: 100,
          lastUpdated: new Date(),
        };

        // First close the final submission modal
        setShowFinalSubmission(false);
        // Then update parent component and close the main modal
        setTimeout(() => {
          onSuccess(updatedRegistration);
          onClose();
        }, 500);
      }
    } catch (error) {
      console.error("Error submitting final project:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to submit final project. Please try again.",
        {
          duration: 4000,
          position: "top-center",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  // ... (keep all other existing functions and JSX)

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2">
        <div className="bg-gray-900/95 rounded-xl p-4 w-full max-w-6xl max-h-[95vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">
              Track Project Progress
            </h2>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          <form onSubmit={handleProgressUpdate} className="space-y-4">
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Project Completion (%)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  name="currentProgress"
                  value={progressData.currentProgress}
                  onChange={handleProgressChange}
                  min="0"
                  max="100"
                  className="flex-1"
                />
                <span className="text-white font-medium w-12">
                  {progressData.currentProgress}%
                </span>
              </div>
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Current Status
              </label>
              <select
                name="currentStatus"
                value={progressData.currentStatus}
                onChange={handleProgressChange}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30"
              >
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Testing">Testing</option>
                <option value="Ready for Submission">
                  Ready for Submission
                </option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Completed Tasks
                </label>
                <textarea
                  name="completedTasks"
                  value={progressData.completedTasks}
                  onChange={handleProgressChange}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/30 h-24 resize-none"
                  placeholder="List the tasks completed since last update"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Pending Tasks
                </label>
                <textarea
                  name="pendingTasks"
                  value={progressData.pendingTasks}
                  onChange={handleProgressChange}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/30 h-24 resize-none"
                  placeholder="List the tasks that are still pending"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Next Milestones
                </label>
                <textarea
                  name="nextMilestones"
                  value={progressData.nextMilestones}
                  onChange={handleProgressChange}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/30 h-20 resize-none"
                  placeholder="What are your next major milestones?"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Blocking Issues
                </label>
                <textarea
                  name="blockingIssues"
                  value={progressData.blockingIssues}
                  onChange={handleProgressChange}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/30 h-20 resize-none"
                  placeholder="Any issues blocking your progress?"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Team Updates
              </label>
              <textarea
                name="teamUpdates"
                value={progressData.teamUpdates}
                onChange={handleProgressChange}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/30 h-20 resize-none"
                placeholder="Any updates regarding team collaboration or coordination?"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 px-6 py-2.5 bg-white/20 text-white rounded-lg font-medium hover:bg-white/20 transition-colors ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Updating..." : "Update Progress"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-2.5 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>

          {registration.progressStatus === "Ready for Submission" && (
            <div className="mt-4 border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={() => setShowFinalSubmission(true)}
                className="w-full px-6 py-2.5 bg-white/20 text-white rounded-lg font-medium hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
              >
                <span className="text-lg">🚀</span>
                Submit Final Project
              </button>
              <p className="text-white/60 text-sm text-center mt-2">
                Ready to submit your final project? Click here to proceed with
                the submission.
              </p>
            </div>
          )}
        </div>
      </div>

      {showFinalSubmission && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-2">
          <div className="bg-gray-900/95 rounded-xl p-4 w-full max-w-4xl max-h-[95vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">
                Final Project Submission
              </h2>
              <button
                onClick={() => setShowFinalSubmission(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleFinalSubmission} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Project Summary *
                  </label>
                  <textarea
                    name="projectSummary"
                    value={finalSubmissionData.projectSummary}
                    onChange={handleFinalSubmissionChange}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/30 h-24 resize-none"
                    placeholder="Provide a comprehensive summary of your project"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Technical Implementation *
                  </label>
                  <textarea
                    name="technicalImplementation"
                    value={finalSubmissionData.technicalImplementation}
                    onChange={handleFinalSubmissionChange}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/30 h-24 resize-none"
                    placeholder="Describe the technical aspects and implementation details"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Challenges Faced
                  </label>
                  <textarea
                    name="challenges"
                    value={finalSubmissionData.challenges}
                    onChange={handleFinalSubmissionChange}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/30 h-20 resize-none"
                    placeholder="Describe the challenges you encountered and how you overcame them"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Future Enhancements
                  </label>
                  <textarea
                    name="futureEnhancements"
                    value={finalSubmissionData.futureEnhancements}
                    onChange={handleFinalSubmissionChange}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/30 h-20 resize-none"
                    placeholder="Describe potential future improvements and features"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Team Contributions
                </label>
                <textarea
                  name="teamContributions"
                  value={finalSubmissionData.teamContributions}
                  onChange={handleFinalSubmissionChange}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/30 h-20 resize-none"
                  placeholder="Detail the contributions of each team member"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Demo Video Link
                  </label>
                  <input
                    type="url"
                    name="demoVideo"
                    value={finalSubmissionData.demoVideo}
                    onChange={handleFinalSubmissionChange}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/30"
                    placeholder="URL to your demo video"
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    GitHub Repository *
                  </label>
                  <input
                    type="url"
                    name="githubFinalRepo"
                    value={finalSubmissionData.githubFinalRepo}
                    onChange={handleFinalSubmissionChange}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/30"
                    placeholder="URL to your GitHub repository"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Live Demo Link
                  </label>
                  <input
                    type="url"
                    name="liveDemoLink"
                    value={finalSubmissionData.liveDemoLink}
                    onChange={handleFinalSubmissionChange}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/30"
                    placeholder="URL to your live demo"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 px-6 py-2.5 bg-white/20 text-white rounded-lg font-medium hover:bg-white/20 transition-colors ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Submitting..." : "Submit Final Project"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowFinalSubmission(false)}
                  className="flex-1 px-6 py-2.5 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default IdeathonProgressForm;
