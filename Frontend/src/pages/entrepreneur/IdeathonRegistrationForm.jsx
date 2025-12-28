import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import IdeaSubmissionForm from "../../components/entrepreneur/IdeaSubmissionForm";
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
import { ideasAPI, ideathonsAPI } from "../../services/api";

/**
 * IdeathonRegistrationForm Component
 * Handles registration for ideathons with idea selection and pitch submission
 */

/**
 * IdeathonRegistrationForm Component
 * Handles registration for ideathons with idea selection and pitch submission
 * Also handles updating existing registrations within the deadline
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Controls modal visibility
 * @param {Function} props.onClose - Function to close the modal
 * @param {string} props.ideathonId - ID of the ideathon to register for
 * @param {string} props.ideathonTitle - Title of the ideathon for display
 * @param {boolean} props.isUpdate - Indicates if this is an update operation
 * @param {Object} props.existingData - Existing registration data for updates
 */
function IdeathonRegistrationForm({
  isOpen,
  onClose,
  ideathonId,
  ideathonTitle,
  isUpdate = false,
  existingData = null,
}) {
  // State for form data
  const [formData, setFormData] = useState({
    selectedIdeaId: "",
    pitchDetails: "",
    teamName: "",
    teamMembers: "",
    mobileNumber: "",
    email: "",
    githubUrl: "",
    documents: [],
    acceptedTerms: false,
  });

  // State for managing data and UI
  const [userIdeas, setUserIdeas] = useState([]); // User's existing ideas from database
  const [isLoadingIdeas, setIsLoadingIdeas] = useState(false); // Loading state for fetching ideas
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state for form submission
  const [error, setError] = useState(""); // Error message display
  const [success, setSuccess] = useState(""); // Success message display
  const [ideathonDetails, setIdeathonDetails] = useState(null); // Ideathon details
  const [registrationStatus, setRegistrationStatus] = useState(null); // Registration status
  const [hasRegistered, setHasRegistered] = useState(false); // Whether user has registered

  /**
   * Fetch ideathon details including registration controls
   */
  const fetchIdeathonDetails = async () => {
    try {
      // Get ideathon details from API
      const response = await ideathonsAPI.getIdeathonDetails(ideathonId);
      if (response.success && response.data) {
        setIdeathonDetails(response.data);
      }
    } catch (err) {
      console.error("Error fetching ideathon details:", err);
    }
  };

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
            targetAudience: "Small to medium businesses",
          },
          {
            id: 2,
            title: "Smart Home Automation",
            category: "IoT",
            elevatorPitch: "Smart homes that adapt to save energy",
            targetAudience: "Homeowners and property managers",
          },
          {
            id: 3,
            title: "Sustainable Fashion Marketplace",
            category: "E-commerce",
            elevatorPitch:
              "Connect conscious consumers with sustainable fashion",
            targetAudience: "Eco-conscious millennials",
          },
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
          targetAudience: "Small to medium businesses",
        },
        {
          id: 2,
          title: "Smart Home Automation",
          category: "IoT",
          elevatorPitch: "Smart homes that adapt to save energy",
          targetAudience: "Homeowners and property managers",
        },
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
      console.log("Form opened, fetching user ideas and details");
      fetchUserIdeas();
      fetchIdeathonDetails();

      // If updating and we have existing data, populate the form
      if (isUpdate && existingData) {
        setFormData({
          selectedIdeaId: existingData.selectedIdeaId || "",
          pitchDetails: existingData.pitchDetails || "",
          teamName: existingData.teamName || "",
          teamMembers: existingData.teamMembers || "",
          mobileNumber: existingData.mobileNumber || "",
          email: existingData.email || "",
          documents: existingData.documents || [],
        });
      } else {
        // Reset form for new registration
        setFormData({
          selectedIdeaId: "",
          pitchDetails: "",
          teamName: "",
          teamMembers: "",
          mobileNumber: "",
          email: "",
          documents: [],
        });
      }
      setError("");
      setSuccess("");
    }
  }, [isOpen, ideathonId, isUpdate, existingData]);

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
    console.log("Starting form validation");

    // Single Registration Control
    if (hasRegistered && !isUpdate) {
      setError("You have already registered for this ideathon.");
      return false;
    }

    // Deadline Control
    if (ideathonDetails) {
      console.log("Checking deadlines:", {
        startDate: ideathonDetails.startDate,
        registrationDeadline: ideathonDetails.registrationDeadline,
        currentDate: new Date(),
      });

      const now = new Date();
      if (now < new Date(ideathonDetails.startDate)) {
        setError("Registration has not started yet.");
        return false;
      }
      if (now > new Date(ideathonDetails.registrationDeadline)) {
        setError("Registration deadline has passed.");
        return false;
      }
    }

    // Duplicate Idea Control
    if (!isUpdate) {
      const isDuplicateIdea = false; // This would be an API check in production
      if (isDuplicateIdea) {
        setError("This idea has already been submitted to this ideathon.");
        return false;
      }
    }

    // Eligibility Control
    if (ideathonDetails?.eligibilityCriteria) {
      const age = parseInt(formData.age);
      if (
        isNaN(age) ||
        age < ideathonDetails.eligibilityCriteria.minAge ||
        age > ideathonDetails.eligibilityCriteria.maxAge
      ) {
        setError(
          `Age must be between ${ideathonDetails.eligibilityCriteria.minAge} and ${ideathonDetails.eligibilityCriteria.maxAge} years.`
        );
        return false;
      }

      const teamSize = parseInt(formData.teamSize);
      if (
        isNaN(teamSize) ||
        teamSize < ideathonDetails.eligibilityCriteria.minTeamSize ||
        teamSize > ideathonDetails.eligibilityCriteria.maxTeamSize
      ) {
        setError(
          `Team size must be between ${ideathonDetails.eligibilityCriteria.minTeamSize} and ${ideathonDetails.eligibilityCriteria.maxTeamSize} members.`
        );
        return false;
      }
    }

    // Validate required fields
    if (!formData.selectedIdeaId) {
      setError("Please select an idea to register with.");
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
    if (!formData.teamName.trim()) {
      setError("Please provide a team name.");
      return false;
    }
    if (!formData.acceptedTerms) {
      setError("Please accept the terms and conditions to proceed.");
      return false;
    }
    if (!formData.mobileNumber) {
      setError("Please provide a mobile number.");
      return false;
    }
    // Validate mobile number - must be exactly 10 digits
    if (!/^[0-9]{10}$/.test(formData.mobileNumber)) {
      setError("Mobile number must be exactly 10 digits.");
      return false;
    }
    if (!formData.email) {
      setError("Please provide an email address.");
      return false;
    }
    // Validate email must end with .com
    if (!formData.email.toLowerCase().endsWith(".com")) {
      setError("Email address must end with .com");
      return false;
    }

    // Validate GitHub URL
    if (formData.githubUrl) {
      const githubUrlRegex =
        /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-._]+\/?$/;
      if (!githubUrlRegex.test(formData.githubUrl)) {
        setError(
          "Please enter a valid GitHub repository URL (e.g., https://github.com/username/repository)"
        );
        return false;
      }
    }

    return true;
  };

  /**
   * Send acknowledgment email/notification
   */
  const sendAcknowledgment = async (registrationData) => {
    try {
      // This would be an API call in production
      console.log("Sending acknowledgment for registration:", registrationData);
      // Mock email content
      const emailContent = {
        to: formData.email,
        subject: `Registration Confirmation - ${ideathonTitle}`,
        body: `
          Dear ${formData.teamName},
          
          Your registration for ${ideathonTitle} has been successfully received.
          Registration ID: ${Date.now()}
          Idea: ${
            userIdeas.find((i) => i.id === parseInt(formData.selectedIdeaId))
              ?.title
          }
          
          You can track your registration status in your dashboard.
          
          Best regards,
          StartSmart Team
        `,
      };
      console.log("Acknowledgment email:", emailContent);
    } catch (err) {
      console.error("Error sending acknowledgment:", err);
    }
  };

  /**
   * Handle form submission
   * Sends POST/PUT request to /api/ideathons/:id/register
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form submission started");

    // Validate form data
    if (!validateForm()) {
      console.log("Form validation failed");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      // Prepare registration data matching backend expectations
      const registrationData = {
        ideaId: formData.selectedIdeaId,
        pitchDetails: formData.pitchDetails,
        teamName: formData.teamName,
        projectTitle: formData.teamName, // Backend requires projectTitle
        projectDescription: formData.pitchDetails, // Map pitchDetails to projectDescription
        techStack: "", // Optional field
        githubRepo: formData.githubUrl || "", // Map githubUrl to githubRepo
        teamMembers: formData.teamMembers.map((member) => ({
          name: member.name,
          email: member.email || formData.email,
          role: member.role || "Team Member",
        })),
        additionalInfo: formData.mobileNumber
          ? `Mobile: ${formData.mobileNumber}`
          : "", // Include mobile in additionalInfo
      };

      console.log("Registration data:", registrationData);
      console.log("IdeathonId:", ideathonId);

      // API call based on operation type
      const response = isUpdate
        ? await ideathonsAPI.updateIdeathonRegistration(
            ideathonId,
            registrationData
          )
        : await ideathonsAPI.registerForIdeathon(ideathonId, registrationData);

      if (response.success) {
        // Show success toast
        toast.success(
          isUpdate
            ? "Registration updated successfully!"
            : "Successfully registered for ideathon!"
        );

        // Close the modal
        onClose();

        // If onSuccess callback is provided, call it
        if (typeof onSuccess === "function") {
          onSuccess();
        }
      } else {
        // Check if the error is "Already registered"
        if (
          response.message &&
          response.message.toLowerCase().includes("already registered")
        ) {
          toast.info("Already registered for this ideathon");
          onClose();
        } else {
          setError(
            response.message ||
              (isUpdate
                ? "Failed to update registration. Please try again."
                : "Failed to register for ideathon. Please try again.")
          );
        }
      }
    } catch (err) {
      console.error(
        isUpdate ? "Error updating registration:" : "Error registering:",
        err
      );

      // Check if the error message contains "already registered"
      const errorMessage = err.message || err.toString();
      if (errorMessage.toLowerCase().includes("already registered")) {
        toast.info("Already registered for this ideathon");
        onClose();
      } else {
        setError(
          isUpdate
            ? "Failed to update. Please check your connection and try again."
            : "Failed to register. Please check your connection and try again."
        );
      }
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

  // State for showing success view
  const [showSuccessView, setShowSuccessView] = useState(false);
  const [successData, setSuccessData] = useState(null);

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
            <h2 className="text-2xl font-bold text-white">
              {isUpdate
                ? "Update Registration Details"
                : "Register for Ideathon"}
            </h2>
            <p className="text-white/60 mt-1">{ideathonTitle}</p>
            {isUpdate && updateDeadline && (
              <div className="mt-2 px-3 py-2 bg-yellow-900/20 border border-yellow-500/30 rounded-md">
                <p className="text-yellow-400 text-sm">
                  Updates allowed until:{" "}
                  {new Date(updateDeadline).toLocaleDateString()}{" "}
                  {new Date(updateDeadline).toLocaleTimeString()}
                </p>
              </div>
            )}
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
          {/* Progress Tracker */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-white/60 mb-2">
              <span>Progress</span>
              <span>
                {(() => {
                  const requiredFields = [
                    "selectedIdeaId",
                    "teamName",
                    "mobileNumber",
                    "email",
                    "pitchDetails",
                  ];
                  const completedFields = requiredFields.filter(
                    (field) =>
                      formData[field] &&
                      (field === "pitchDetails"
                        ? formData[field].length >= 50
                        : true)
                  );
                  return `${completedFields.length}/${requiredFields.length} required fields`;
                })()}
              </span>
            </div>
            <div className="h-2 bg-white/[0.08] rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                style={{
                  width: (() => {
                    const requiredFields = [
                      "selectedIdeaId",
                      "teamName",
                      "mobileNumber",
                      "email",
                      "pitchDetails",
                    ];
                    const completedFields = requiredFields.filter(
                      (field) =>
                        formData[field] &&
                        (field === "pitchDetails"
                          ? formData[field].length >= 50
                          : true)
                    );
                    return `${
                      (completedFields.length / requiredFields.length) * 100
                    }%`;
                  })(),
                }}
              />
            </div>
          </div>

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
                  Select Idea to Register{" "}
                  <span className="text-red-400">*</span>
                </label>

                {userIdeas.length === 0 ? (
                  // No ideas available - show message and link to Ideas page
                  <div className="p-6 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-lg text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-lg pointer-events-none"></div>
                    <div className="relative z-10">
                      <FaLightbulb className="w-12 h-12 text-white/30 mx-auto mb-4" />
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
                  </div>
                ) : (
                  // Ideas available - show dropdown
                  <select
                    name="selectedIdeaId"
                    value={formData.selectedIdeaId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/[0.05] backdrop-blur-sm border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors"
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
                <div className="p-4 bg-white/[0.05] backdrop-blur-sm border border-white/10 rounded-lg">
                  {(() => {
                    const selectedIdea = userIdeas.find(
                      (idea) => idea.id === parseInt(formData.selectedIdeaId)
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
                  Team Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="teamName"
                  value={formData.teamName}
                  onChange={handleInputChange}
                  placeholder="Enter your team name"
                  className="w-full px-4 py-3 bg-white/[0.05] backdrop-blur-sm border border-white/10 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors"
                  required
                />
              </div>

              {/* Registration Status */}
              {registrationStatus && (
                <div
                  className={`p-4 rounded-lg ${
                    registrationStatus === "shortlisted"
                      ? "bg-green-900/20 border border-green-500/30"
                      : registrationStatus === "rejected"
                      ? "bg-red-900/20 border border-red-500/30"
                      : "bg-yellow-900/20 border border-yellow-500/30"
                  }`}
                >
                  <h4
                    className={`font-medium mb-1 ${
                      registrationStatus === "shortlisted"
                        ? "text-green-400"
                        : registrationStatus === "rejected"
                        ? "text-red-400"
                        : "text-yellow-400"
                    }`}
                  >
                    Registration Status:{" "}
                    {registrationStatus.charAt(0).toUpperCase() +
                      registrationStatus.slice(1)}
                  </h4>
                  <p className="text-white/60 text-sm">
                    {registrationStatus === "shortlisted"
                      ? "Congratulations! Your idea has been shortlisted."
                      : registrationStatus === "rejected"
                      ? "Unfortunately, your idea was not selected this time."
                      : "Your registration is being reviewed by our team."}
                  </p>
                </div>
              )}

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
                  className="w-full px-4 py-3 bg-white/[0.05] backdrop-blur-sm border border-white/10 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors"
                />
                <p className="text-white/50 text-sm mt-2">
                  List team member names separated by commas (optional)
                </p>
              </div>

              {/* Age */}
              <div>
                <label className="block text-white font-medium mb-3">
                  Age <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="Enter your age"
                  min={ideathonDetails?.eligibilityCriteria?.minAge || 18}
                  max={ideathonDetails?.eligibilityCriteria?.maxAge || 35}
                  className="w-full px-4 py-3 bg-white/[0.05] backdrop-blur-sm border border-white/10 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors"
                  required
                />
                <p className="text-white/50 text-sm mt-2">
                  Age requirement:{" "}
                  {ideathonDetails?.eligibilityCriteria?.minAge || 18} -{" "}
                  {ideathonDetails?.eligibilityCriteria?.maxAge || 35} years
                </p>
              </div>

              {/* Team Size */}
              <div>
                <label className="block text-white font-medium mb-3">
                  Team Size <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  name="teamSize"
                  value={formData.teamSize}
                  onChange={handleInputChange}
                  placeholder="Enter team size"
                  min={ideathonDetails?.eligibilityCriteria?.minTeamSize || 1}
                  max={ideathonDetails?.eligibilityCriteria?.maxTeamSize || 5}
                  className="w-full px-4 py-3 bg-white/[0.05] backdrop-blur-sm border border-white/10 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors"
                  required
                />
                <p className="text-white/50 text-sm mt-2">
                  Team size limit:{" "}
                  {ideathonDetails?.eligibilityCriteria?.minTeamSize || 1} -{" "}
                  {ideathonDetails?.eligibilityCriteria?.maxTeamSize || 5}{" "}
                  members
                </p>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-white font-medium mb-3">
                  Mobile Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={(e) => {
                    // Only allow numbers
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    setFormData((prev) => ({
                      ...prev,
                      mobileNumber: value,
                    }));
                  }}
                  placeholder="Enter 10-digit mobile number"
                  className="w-full px-4 py-3 bg-white/[0.05] backdrop-blur-sm border border-white/10 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors"
                  maxLength="10"
                  required
                />
                <p className="text-white/50 text-sm mt-2">
                  Enter 10 digits mobile number (numbers only)
                </p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-white font-medium mb-3">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address (must end with .com)"
                  className="w-full px-4 py-3 bg-white/[0.05] backdrop-blur-sm border border-white/10 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors"
                  required
                />
                <p className="text-white/50 text-sm mt-2">
                  Email must end with .com
                </p>
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
                  className="w-full px-4 py-3 bg-white/[0.05] backdrop-blur-sm border border-white/10 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors"
                />
                <p className="text-white/50 text-sm mt-2">
                  Add your project's GitHub repository URL (optional)
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
                  className="w-full px-4 py-3 bg-white/[0.05] backdrop-blur-sm border border-white/10 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors resize-none"
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
                <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-white/30 transition-colors bg-white/[0.02]">
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
                    <FaUpload className="w-8 h-8 text-white/30 mb-2" />
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
                        className="flex items-center justify-between p-3 bg-white/[0.05] border border-white/10 rounded-lg backdrop-blur-sm"
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
                          className="p-1 text-white/60 hover:text-red-400 transition-colors"
                        >
                          <FaTimes className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Terms and Conditions Checkbox */}
              <div className="mt-8">
                <label className="flex items-start space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="acceptedTerms"
                    checked={formData.acceptedTerms}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        acceptedTerms: e.target.checked,
                      }))
                    }
                    className="mt-1 h-4 w-4 rounded border-white/20 bg-white/[0.05] text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                    required
                  />
                  <span className="text-sm text-white/70 group-hover:text-white/90">
                    I confirm that all provided information is accurate and
                    true. I understand that my submitted idea and personal
                    information will be used for ideathon registration purposes.
                    I agree to the{" "}
                    <button
                      type="button"
                      onClick={() =>
                        window.open("/terms-and-conditions", "_blank")
                      }
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      Terms and Conditions
                    </button>
                  </span>
                </label>
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
              disabled={
                isSubmitting ||
                !formData.selectedIdeaId ||
                !formData.pitchDetails.trim() ||
                !formData.teamName.trim() ||
                !formData.acceptedTerms
              }
              className="px-8 py-3 bg-white text-black hover:bg-white/90 font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="w-4 h-4 animate-spin" />
                  {isUpdate ? "Saving Changes..." : "Registering..."}
                </>
              ) : (
                <>
                  <FaCheck className="w-4 h-4" />
                  {isUpdate ? "Save Changes" : "Register for Ideathon"}
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default IdeathonRegistrationForm;
