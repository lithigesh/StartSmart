import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  FaTimes,
  FaUpload,
  FaFileAlt,
  FaLightbulb,
  FaExclamationTriangle,
  FaSpinner,
  FaCheck,
  FaPlus,
} from "react-icons/fa";
import RegistrationSuccessScreen from "./RegistrationSuccessScreen";
import { ideasAPI } from "../../services/ideas.api";
import { API_URL } from "../../config/config";
import { ideathonRegistrationAPI } from "../../services/ideathonRegistration";

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
const IdeathonRegistrationForm = ({
  isOpen,
  onClose,
  ideathonId,
  ideathonTitle,
  onSuccess,
}) => {
  // State for form data
  const defaultFormData = {
    selectedIdeaId: "",
    teamName: "",
    email: "",
    phoneNumber: "",
    githubUrl: "",
    projectTitle: "",
    teamMembers: "",
    abstractDetails: "",
    problemStatement: "",
    pitchDetails: "",
    documents: [],
    confirmation: false,
  };

  const [formData, setFormData] = useState(defaultFormData);

  // State for managing data and UI
  const [userIdeas, setUserIdeas] = useState([]); // User's existing ideas from database
  const [isLoadingIdeas, setIsLoadingIdeas] = useState(false); // Loading state for fetching ideas
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state for form submission
  const [error, setError] = useState(""); // Error message display
  const [success, setSuccess] = useState(""); // Success message display
  const [registrationSuccess, setRegistrationSuccess] = useState(false); // Track registration success
  const [registrationData, setRegistrationData] = useState(null); // Store registration data for success screen

  /**
   * Fetch user's existing ideas from the database
   * Called when component mounts or ideathonId changes
   */
  const fetchUserIdeas = async () => {
    try {
      setIsLoadingIdeas(true);
      setError("");

      console.log("Fetching user ideas...");
      // API call to get user's ideas
      const response = await ideasAPI.getUserIdeas();

      console.log("API Response:", response);

      // Check if response has data regardless of success flag
      if (
        response &&
        response.data &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        // Ensure each idea has an _id field (some might have just id)
        const normalizedIdeas = response.data.map((idea) => ({
          ...idea,
          _id: idea._id || idea.id,
        }));
        setUserIdeas(normalizedIdeas);
        console.log(
          "Successfully loaded ideas:",
          normalizedIdeas.length,
          normalizedIdeas
        );
      } else if (response && Array.isArray(response) && response.length > 0) {
        // Handle case where response is directly an array
        const normalizedIdeas = response.map((idea) => ({
          ...idea,
          _id: idea._id || idea.id,
        }));
        setUserIdeas(normalizedIdeas);
        console.log(
          "Successfully loaded ideas (direct array):",
          normalizedIdeas.length,
          normalizedIdeas
        );
      } else {
        // No ideas found
        console.log("No ideas found in response");
        setUserIdeas([]);
      }
    } catch (err) {
      console.error("Error fetching user ideas:", err);
      // Set empty array on error to show "No ideas" message
      setUserIdeas([]);
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
      setFormData(defaultFormData);
      setError("");
      setSuccess("");
      setRegistrationSuccess(false);
      setRegistrationData(null);
    }
  }, [isOpen, ideathonId]);

  /**
   * Handle input changes for form fields
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Handle file upload for documents
   */
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, ...files],
    }));
  };

  /**
   * Remove uploaded file
   */
  const removeFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  /**
   * Validate form data before submission
   */
  const validateForm = () => {
    const {
      selectedIdeaId,
      teamName,
      email,
      phoneNumber,
      githubUrl,
      projectTitle,
      abstractDetails,
      problemStatement,
      pitchDetails,
      confirmation,
    } = formData;

    // Clear any previous error
    setError("");

    // Helper function to safely trim strings
    const safeTrim = (str) => str?.trim() || "";

    if (!selectedIdeaId) {
      setError("Please select an idea to register with.");
      return false;
    }
    if (!safeTrim(teamName)) {
      setError("Please provide a team name.");
      return false;
    }
    if (!safeTrim(email)) {
      setError("Please provide a contact email.");
      return false;
    }
    if (!email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError("Please provide a valid email address.");
      return false;
    }
    if (!safeTrim(phoneNumber)) {
      setError("Please provide a contact phone number.");
      return false;
    }
    if (!phoneNumber?.match(/^\d{10}$/)) {
      setError("Please provide a valid 10-digit phone number.");
      return false;
    }
    if (
      githubUrl &&
      !githubUrl.match(/^https:\/\/github\.com\/[\w-]+\/[\w-]+$/)
    ) {
      setError(
        "Please provide a valid GitHub repository URL or leave it empty."
      );
      return false;
    }
    if (!safeTrim(projectTitle)) {
      setError("Please provide a project title.");
      return false;
    }
    if (!safeTrim(abstractDetails)) {
      setError("Please provide a project abstract.");
      return false;
    }
    if (safeTrim(abstractDetails).length < 100) {
      setError("Project abstract must be at least 100 characters long.");
      return false;
    }
    if (!safeTrim(problemStatement)) {
      setError("Please provide a problem statement.");
      return false;
    }
    if (safeTrim(problemStatement).length < 50) {
      setError("Problem statement must be at least 50 characters long.");
      return false;
    }
    if (!safeTrim(pitchDetails)) {
      setError("Please provide pitch details for your registration.");
      return false;
    }
    if (safeTrim(pitchDetails).length < 50) {
      setError("Pitch details must be at least 50 characters long.");
      return false;
    }
    if (!confirmation) {
      setError(
        "Please confirm that you agree to the ideathon rules and guidelines."
      );
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
    console.log("Form submission started");

    try {
      setIsSubmitting(true);
      setError("");
      setSuccess("");

      // Perform full form validation
      if (!validateForm()) {
        setIsSubmitting(false);
        return;
      }

      // Get JWT token
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to register");
        setIsSubmitting(false);
        return;
      }

      // Prepare registration data
      const registrationData = {
        idea: formData.selectedIdeaId, // Changed from ideaId to idea to match backend schema
        teamName: formData.teamName.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        githubUrl: formData.githubUrl.trim(),
        projectTitle: formData.projectTitle.trim(),
        abstractDetails: formData.abstractDetails.trim(),
        problemStatement: formData.problemStatement.trim(),
        pitchDetails: formData.pitchDetails.trim(),
        teamMembers: formData.teamMembers
          ? formData.teamMembers.split(",").map((name) => ({
              name: name.trim(),
              email: formData.email.trim(),
              role: "Team Member",
            }))
          : [],
      };

      console.log("Sending registration with data:", registrationData);

      let response;
      try {
        response = await fetch(
          `${API_URL}/api/ideathons/${ideathonId}/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(registrationData),
            credentials: "include", // Include cookies if needed
          }
        );
      } catch (networkError) {
        console.error("Network error:", networkError);
        throw new Error(
          "Unable to connect to server. Please check your internet connection and try again."
        );
      }

      let responseData;
      try {
        const text = await response.text();
        try {
          responseData = JSON.parse(text);
        } catch (e) {
          console.error("Invalid JSON response:", text);
          throw new Error(
            "Server returned an invalid response. Please try again."
          );
        }
      } catch (parseError) {
        console.error("Response parsing error:", parseError);
        throw new Error("Error processing server response. Please try again.");
      }

      if (!response.ok) {
        const errorMessage =
          responseData?.message || response.statusText || "Registration failed";

        // Check if the error is "Already registered"
        if (errorMessage.toLowerCase().includes("already registered")) {
          toast.info("Already registered for this ideathon");
          onClose();
          return;
        }

        throw new Error(errorMessage);
      }

      // Handle success
      const successData = {
        teamName: formData.teamName,
        teamMembers: formData.teamMembers || "",
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        pitchDetails: formData.pitchDetails,
        githubUrl: formData.githubUrl || "",
        projectTitle: formData.projectTitle,
        abstractDetails: formData.abstractDetails,
        problemStatement: formData.problemStatement,
        selectedIdea: userIdeas.find(
          (idea) => idea.id === parseInt(formData.selectedIdeaId)
        ),
        registrationId: responseData.data?._id,
      };

      console.log("Registration successful!", successData);

      // Show success toast
      toast.success("Successfully registered for the ideathon!");

      setSuccess("Successfully registered for the ideathon!");
      setRegistrationData(successData);
      setRegistrationSuccess(true);
      setFormData(defaultFormData);

      // Notify parent component of success
      if (onSuccess) {
        console.log("Calling onSuccess callback");
        onSuccess(successData);
      }
    } catch (error) {
      console.error("Registration error:", error);

      // Check if the error message contains "already registered"
      const errorMessage =
        error.message || "Registration failed. Please try again.";
      if (errorMessage.toLowerCase().includes("already registered")) {
        toast.info("Already registered for this ideathon");
        onClose();
        return;
      }

      setError(errorMessage);
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
    window.dispatchEvent(new CustomEvent("navigateToIdeas"));
  };

  // Don't render if modal is not open
  if (!isOpen) return null;

  // Show success screen if registration is successful
  if (registrationSuccess && registrationData) {
    return (
      <RegistrationSuccessScreen
        registrationData={registrationData}
        ideathonTitle={ideathonTitle}
        onClose={() => {
          onClose();
          setRegistrationSuccess(false);
          setRegistrationData(null);
          setFormData(defaultFormData);
        }}
      />
    );
  }

  return (
    <div className="w-full">
      {/* Modal Content */}
      <div className="w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Register for Ideathon
            </h2>
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
            <div className="mb-6 p-4 bg-white/20 border border-white/30 rounded-lg flex items-center gap-3">
              <FaCheck className="w-5 h-5 text-white/90" />
              <p className="text-white/90">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-white/20 border border-white/30 rounded-lg flex items-center gap-3">
              <FaExclamationTriangle className="w-5 h-5 text-yellow-400" />
              <p className="text-white/80">{error}</p>
            </div>
          )}

          {/* Loading Ideas */}
          {isLoadingIdeas ? (
            <div className="flex items-center justify-center py-12">
              <FaSpinner className="w-8 h-8 text-white animate-spin" />
              <span className="ml-3 text-white">Loading your ideas...</span>
            </div>
          ) : (
            <form className="space-y-6">
              {/* Idea Selection */}
              <div>
                <label className="block text-white font-medium mb-3">
                  Select Idea to Register{" "}
                  <span className="text-white/80">*</span>
                </label>

                {userIdeas.length === 0 ? (
                  // No ideas available - show message and link to Ideas page
                  <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg text-center">
                    <FaLightbulb className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-white font-medium mb-2">
                      No Ideas Found
                    </h3>
                    <p className="text-white/60 mb-4">
                      You need to create at least one idea before registering
                      for ideathons.
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
                      <option key={idea._id} value={idea._id}>
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
                    const selectedIdea = userIdeas.find(
                      (idea) => idea._id === formData.selectedIdeaId
                    );
                    return selectedIdea ? (
                      <div>
                        <h4 className="text-white font-medium mb-2">
                          {selectedIdea.title}
                        </h4>
                        <p className="text-white/60 text-sm mb-2">
                          {selectedIdea.elevatorPitch}
                        </p>
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
                  Team Name <span className="text-white/80">*</span>
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

              {/* Email */}
              <div>
                <label className="block text-white font-medium mb-3">
                  Email <span className="text-white/80">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter team lead's email"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors"
                  required
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-white font-medium mb-3">
                  Phone Number <span className="text-white/80">*</span>
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Enter contact number"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors"
                  required
                />
              </div>

              {/* GitHub URL */}
              <div>
                <label className="block text-white font-medium mb-3">
                  GitHub Repository URL
                </label>
                <input
                  type="url"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleInputChange}
                  placeholder="https://github.com/username/repository"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors"
                />
                <p className="text-white/50 text-sm mt-2">
                  Add your project repository URL (if available)
                </p>
              </div>

              {/* Project Title */}
              <div>
                <label className="block text-white font-medium mb-3">
                  Project Title <span className="text-white/80">*</span>
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

              {/* Abstract */}
              <div>
                <label className="block text-white font-medium mb-3">
                  Project Abstract <span className="text-white/80">*</span>
                </label>
                <textarea
                  name="abstractDetails"
                  value={formData.abstractDetails}
                  onChange={handleInputChange}
                  placeholder="Provide a brief overview of your project..."
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors resize-none"
                  required
                />
                <p className="text-white/50 text-sm mt-2">
                  A brief summary of your project idea (100-200 words)
                </p>
              </div>

              {/* Problem Statement */}
              <div>
                <label className="block text-white font-medium mb-3">
                  Problem Statement <span className="text-white/80">*</span>
                </label>
                <textarea
                  name="problemStatement"
                  value={formData.problemStatement}
                  onChange={handleInputChange}
                  placeholder="Describe the problem your project aims to solve..."
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors resize-none"
                  required
                />
                <p className="text-white/50 text-sm mt-2">
                  Clearly state the problem you're addressing
                </p>
              </div>

              {/* Pitch Details */}
              <div>
                <label className="block text-white font-medium mb-3">
                  Pitch Details <span className="text-white/80">*</span>
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
                    <span className="text-white/60">
                      Click to upload documents
                    </span>
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
                          <span className="text-white text-sm">
                            {file.name}
                          </span>
                          <span className="text-white/50 text-xs">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="p-1 text-white/60 hover:text-white/80 transition-colors"
                        >
                          <FaTimes className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Confirmation Checkbox */}
              <div className="mt-6 p-4 bg-white/20 border border-white/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="pt-1">
                    <input
                      type="checkbox"
                      id="confirmation"
                      name="confirmation"
                      checked={formData.confirmation}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          confirmation: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 rounded border-gray-600 text-white/90 focus:ring-white focus:ring-offset-gray-900 bg-gray-900"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="confirmation"
                      className="block text-white font-medium mb-2"
                    >
                      Confirmation <span className="text-white/80">*</span>
                    </label>
                    <p className="text-white/70 text-sm leading-relaxed">
                      I confirm that all the information provided above is
                      accurate and complete. I understand and agree to the
                      ideathon rules and guidelines. I acknowledge that my team
                      is committed to participating in this event.
                    </p>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        {!isLoadingIdeas && userIdeas.length > 0 && (
          <div className="flex items-center justify-between p-6 border-t border-white/10 bg-black relative z-[75]">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/10"
            >
              Cancel
            </button>

            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-8 py-3 font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2
                ${
                  isSubmitting
                    ? "bg-white/20/50 text-white cursor-not-allowed"
                    : "bg-white/20 text-white hover:bg-white/20 cursor-pointer"
                }`}
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
