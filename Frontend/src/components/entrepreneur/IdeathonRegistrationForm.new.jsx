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
import { ideasAPI } from "../../services/api";
import { ideathonRegistrationAPI } from "../../services/ideathonRegistration";

const IdeathonRegistrationForm = ({ isOpen, onClose, ideathonId, ideathonTitle, onSuccess }) => {
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
  const [userIdeas, setUserIdeas] = useState([]);
  const [isLoadingIdeas, setIsLoadingIdeas] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUserIdeas();
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setFormData({
      selectedIdeaId: "",
      pitchDetails: "",
      teamName: "",
      projectTitle: "",
      teamMembers: "",
      documents: []
    });
    setError("");
    setRegistrationSuccess(false);
  };

  const fetchUserIdeas = async () => {
    try {
      setIsLoadingIdeas(true);
      setError("");
      
      const response = await ideasAPI.getUserIdeas();
      
      if (response && response.data && Array.isArray(response.data)) {
        setUserIdeas(response.data);
      }
    } catch (err) {
      console.error("Error fetching ideas:", err);
      setError("Failed to load your ideas. Please refresh and try again.");
    } finally {
      setIsLoadingIdeas(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 10 * 1024 * 1024; // 10MB max size
    
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        setError(`File ${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, ...validFiles]
      }));
      setError("");
    }
  };

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

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
    if (!formData.pitchDetails.trim() || formData.pitchDetails.length < 50) {
      setError("Please provide pitch details with at least 50 characters.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const selectedIdea = userIdeas.find(idea => idea.id === parseInt(formData.selectedIdeaId));
      if (!selectedIdea) {
        setError("Selected idea not found. Please try again.");
        return;
      }

      // Prepare registration data
      const registrationData = {
        ideaId: formData.selectedIdeaId,
        pitchDetails: formData.pitchDetails,
        teamName: formData.teamName,
        projectTitle: formData.projectTitle,
        projectDescription: formData.pitchDetails,
        teamMembers: formData.teamMembers,
        idea: selectedIdea,
        documents: formData.documents.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type
        }))
      };

      // Register for ideathon
      const response = await ideathonRegistrationAPI.register(ideathonId, registrationData);
      
      if (response.success) {
        setRegistrationSuccess(true);
        onSuccess && onSuccess(response.data);
      } else {
        let errorMessage = response.message || "Failed to register.";
        
        // Handle specific error cases
        if (response.message?.includes("already registered")) {
          errorMessage = "You are already registered for this ideathon.";
        } else if (response.message?.includes("deadline")) {
          errorMessage = "Registration deadline has passed for this ideathon.";
        } else if (response.message?.includes("login")) {
          errorMessage = "Please log in to register for this ideathon.";
        }
        
        setError(errorMessage);
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Failed to register. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateIdea = () => {
    onClose();
    window.dispatchEvent(new CustomEvent('navigateToIdeas'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-xl" 
        onClick={onClose}
      ></div>
      
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
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg flex items-center gap-3">
              <FaExclamationTriangle className="w-5 h-5 text-red-400 shrink-0" />
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {isLoadingIdeas ? (
            <div className="flex items-center justify-center py-12">
              <FaSpinner className="w-8 h-8 text-white animate-spin" />
              <span className="ml-3 text-white">Loading your ideas...</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Form fields... */}
              {/* (Previous form fields remain the same) */}
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