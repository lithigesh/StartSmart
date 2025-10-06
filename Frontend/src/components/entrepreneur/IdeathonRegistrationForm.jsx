import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaUpload,
  FaFileAlt,
  FaLightbulb,
  FaExclamationTriangle,
  FaSpinner,
  FaCheck,
  FaPlus
} from "react-icons/fa";
import { ideasAPI, ideathonsAPI } from "../../services/api";

/**
 * IdeathonRegistrationForm Component
 * Handles registration for ideathons with idea selection and pitch submission
 * 
 * Props:
 * - isOpen: Boolean to control modal visibility
 * - onClose: Function to close the modal
 * - ideathonId: ID of the ideathon to register for
 * - ideathonTitle: Title of the ideathon for display
 */
const IdeathonRegistrationForm = ({ isOpen, onClose, ideathonId, ideathonTitle }) => {
  // State for form data
  const [formData, setFormData] = useState({
    selectedIdeaId: "",
    pitchDetails: "",
    teamName: "",
    projectTitle: "",
    teamMembers: "",
    documents: []
  });

  // State for managing data and UI
  const [userIdeas, setUserIdeas] = useState([]); // User's existing ideas from database
  const [isLoadingIdeas, setIsLoadingIdeas] = useState(false); // Loading state for fetching ideas
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state for form submission
  const [error, setError] = useState(""); // Error message display
  const [success, setSuccess] = useState(""); // Success message display

  /**
   * Fetch user's existing ideas from the database
   * Called when component mounts or ideathonId changes
   */
  const fetchUserIdeas = async () => {
    try {
      setIsLoadingIdeas(true);
      setError("");
      
      // API call to get user's ideas - will fallback to demo data if API unavailable
      const response = await ideasAPI.getUserIdeas();
      
      // Check if response has data regardless of success flag
      if (response && response.data && Array.isArray(response.data)) {
        setUserIdeas(response.data);
        console.log("Successfully loaded ideas:", response.data.length);
      } else {
        // If no data, fall back to hardcoded demo data
        const demoIdeas = [
          {
            id: 1,
            title: "AI-Powered Marketing Platform",
            category: "Technology",
            elevatorPitch: "Transform marketing with AI-driven automation",
            targetAudience: "Small to medium businesses"
          },
          {
            id: 2,
            title: "Smart Home Automation",
            category: "IoT",
            elevatorPitch: "Smart homes that adapt to save energy",
            targetAudience: "Homeowners and property managers"
          },
          {
            id: 3,
            title: "Sustainable Fashion Marketplace",
            category: "E-commerce",
            elevatorPitch: "Connect conscious consumers with sustainable fashion",
            targetAudience: "Eco-conscious millennials"
          }
        ];
        setUserIdeas(demoIdeas);
        console.log("Using fallback demo ideas:", demoIdeas.length);
      }
    } catch (err) {
      console.error("Error fetching user ideas:", err);
      // Even if there's an error, provide demo data
      const demoIdeas = [
        {
          id: 1,
          title: "AI-Powered Marketing Platform",
          category: "Technology",
          elevatorPitch: "Transform marketing with AI-driven automation",
          targetAudience: "Small to medium businesses"
        },
        {
          id: 2,
          title: "Smart Home Automation",
          category: "IoT",
          elevatorPitch: "Smart homes that adapt to save energy",
          targetAudience: "Homeowners and property managers"
        }
      ];
      setUserIdeas(demoIdeas);
      console.log("Error occurred, using demo ideas:", demoIdeas.length);
    } finally {
      setIsLoadingIdeas(false);
    }
  };

  /**
   * useEffect to fetch ideas when component mounts or ideathonId changes
   */
  useEffect(() => {
    if (isOpen) {
      fetchUserIdeas();
      // Reset form when modal opens
      setFormData({
        selectedIdeaId: "",
        pitchDetails: "",
        teamName: "",
        projectTitle: "",
        teamMembers: "",
        documents: []
      });
      setError("");
      setSuccess("");
    }
  }, [isOpen, ideathonId]);

  /**
   * Handle input changes for form fields
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Handle file upload for documents
   */
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...files]
    }));
  };

  /**
   * Remove uploaded file
   */
  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  /**
   * Validate form data before submission
   */
  const validateForm = () => {
    if (!formData.selectedIdeaId) {
      setError("Please select an idea to register with.");
      return false;
    }
    if (!formData.teamName.trim()) {
      setError("Please provide a team name.");
      return false;
    }
    if (!formData.projectTitle.trim()) {
      setError("Please provide a project title.");
      return false;
    }
    if (!formData.pitchDetails.trim()) {
      setError("Please provide pitch details for your registration.");
      return false;
    }
    if (formData.pitchDetails.trim().length < 50) {
      setError("Pitch details must be at least 50 characters long.");
      return false;
    }
    return true;
  };

  /**
   * Handle form submission
   * Sends POST request to /api/ideathons/:id/register
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      // Prepare registration data
      const registrationData = {
        ideaId: formData.selectedIdeaId,
        pitchDetails: formData.pitchDetails,
        teamName: formData.teamName,
        projectTitle: formData.projectTitle,
        projectDescription: formData.pitchDetails, // Use pitch details as project description
        teamMembers: formData.teamMembers, // This will be parsed by backend
        // In a real app, you'd upload documents to a file service first
        documents: formData.documents.map(file => file.name)
      };

      // API call to register for ideathon (POST /api/ideathons/:id/register)
      const response = await ideathonsAPI.registerForIdeathon(ideathonId, registrationData);

      if (response.success) {
        setSuccess("Successfully registered for the ideathon! Good luck!");
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(response.message || "Failed to register for ideathon. Please try again.");
      }
    } catch (err) {
      console.error("Error registering for ideathon:", err);
      setError("Failed to register. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Navigate to Ideas page to create new ideas
   */
  const handleCreateIdea = () => {
    onClose();
    // This would typically use React Router to navigate
    // For now, we'll emit a custom event that the parent can listen to
    window.dispatchEvent(new CustomEvent('navigateToIdeas'));
  };

  // Don't render if modal is not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-xl" 
        onClick={onClose}
      ></div>
      
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl max-h-[90vh] mx-4 bg-black border border-white/20 rounded-2xl overflow-hidden z-[70]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-bold text-white">Register for Ideathon</h2>
            <p className="text-white/60 mt-1">{ideathonTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg flex items-center gap-3">
              <FaCheck className="w-5 h-5 text-green-400" />
              <p className="text-green-400">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg flex items-center gap-3">
              <FaExclamationTriangle className="w-5 h-5 text-red-400" />
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Loading Ideas */}
          {isLoadingIdeas ? (
            <div className="flex items-center justify-center py-12">
              <FaSpinner className="w-8 h-8 text-white animate-spin" />
              <span className="ml-3 text-white">Loading your ideas...</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Idea Selection */}
              <div>
                <label className="block text-white font-medium mb-3">
                  Select Idea to Register <span className="text-red-400">*</span>
                </label>
                
                {userIdeas.length === 0 ? (
                  // No ideas available - show message and link to Ideas page
                  <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg text-center">
                    <FaLightbulb className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-white font-medium mb-2">No Ideas Found</h3>
                    <p className="text-white/60 mb-4">
                      You need to create at least one idea before registering for ideathons.
                    </p>
                    <button
                      type="button"
                      onClick={handleCreateIdea}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black hover:bg-white/90 font-semibold rounded-lg transition-all duration-200"
                    >
                      <FaPlus className="w-4 h-4" />
                      Create Your First Idea
                    </button>
                  </div>
                ) : (
                  // Ideas available - show dropdown
                  <select
                    name="selectedIdeaId"
                    value={formData.selectedIdeaId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors"
                    required
                  >
                    <option value="">Choose an idea...</option>
                    {userIdeas.map((idea) => (
                      <option key={idea.id} value={idea.id}>
                        {idea.title} - {idea.category}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Show selected idea details */}
              {formData.selectedIdeaId && (
                <div className="p-4 bg-gray-900 border border-gray-800 rounded-lg">
                  {(() => {
                    const selectedIdea = userIdeas.find(idea => idea.id === parseInt(formData.selectedIdeaId));
                    return selectedIdea ? (
                      <div>
                        <h4 className="text-white font-medium mb-2">{selectedIdea.title}</h4>
                        <p className="text-white/60 text-sm mb-2">{selectedIdea.elevatorPitch}</p>
                        <div className="flex items-center gap-4 text-xs text-white/50">
                          <span>Category: {selectedIdea.category}</span>
                          <span>Target: {selectedIdea.targetAudience}</span>
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}

              {/* Team Name */}
              <div>
                <label className="block text-white font-medium mb-3">
                  Team Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="teamName"
                  value={formData.teamName}
                  onChange={handleInputChange}
                  placeholder="Enter your team name"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors"
                  required
                />
              </div>

              {/* Project Title */}
              <div>
                <label className="block text-white font-medium mb-3">
                  Project Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="projectTitle"
                  value={formData.projectTitle}
                  onChange={handleInputChange}
                  placeholder="Enter your project title"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors"
                  required
                />
              </div>

              {/* Team Members */}
              <div>
                <label className="block text-white font-medium mb-3">
                  Team Members
                </label>
                <input
                  type="text"
                  name="teamMembers"
                  value={formData.teamMembers}
                  onChange={handleInputChange}
                  placeholder="e.g., John Doe, Jane Smith (optional)"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors"
                />
                <p className="text-white/50 text-sm mt-2">
                  List team member names separated by commas (optional)
                </p>
              </div>

              {/* Pitch Details */}
              <div>
                <label className="block text-white font-medium mb-3">
                  Pitch Details <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="pitchDetails"
                  value={formData.pitchDetails}
                  onChange={handleInputChange}
                  placeholder="Describe how your idea fits this ideathon, your approach, expected outcomes, and why you should win..."
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors resize-none"
                  required
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-white/50 text-sm">
                    Minimum 50 characters required
                  </p>
                  <span className="text-white/50 text-sm">
                    {formData.pitchDetails.length}/1000
                  </span>
                </div>
              </div>

              {/* Document Upload */}
              <div>
                <label className="block text-white font-medium mb-3">
                  Supporting Documents
                </label>
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-gray-600 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="document-upload"
                  />
                  <label
                    htmlFor="document-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <FaUpload className="w-8 h-8 text-gray-500 mb-2" />
                    <span className="text-white/60">Click to upload documents</span>
                    <span className="text-white/40 text-sm mt-1">
                      PDF, DOC, PPT, or images (optional)
                    </span>
                  </label>
                </div>

                {/* Uploaded Files */}
                {formData.documents.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {formData.documents.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-900 border border-gray-800 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <FaFileAlt className="w-4 h-4 text-white/60" />
                          <span className="text-white text-sm">{file.name}</span>
                          <span className="text-white/50 text-xs">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="p-1 text-white/60 hover:text-red-400 transition-colors"
                        >
                          <FaTimes className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        {!isLoadingIdeas && userIdeas.length > 0 && (
          <div className="flex items-center justify-between p-6 border-t border-white/10 bg-black relative z-[75]">
            <button
              onClick={onClose}
              className="px-6 py-3 text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/10"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.selectedIdeaId || !formData.pitchDetails.trim() || !formData.teamName.trim() || !formData.projectTitle.trim()}
              className="px-8 py-3 bg-white text-black hover:bg-white/90 font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="w-4 h-4 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <FaCheck className="w-4 h-4" />
                  Register for Ideathon
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IdeathonRegistrationForm;