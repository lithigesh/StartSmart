import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import { ideasAPI, ideathonsAPI } from "../../services/api";
import {
  FaArrowLeft,
  FaUpload,
  FaFileAlt,
  FaLightbulb,
  FaExclamationTriangle,
  FaSpinner,
  FaCheck,
  FaPlus,
  FaTrophy,
  FaCalendarAlt,
  FaUsers,
} from "react-icons/fa";

/**
 * IdeathonRegistrationPage Component
 * Standalone page for registering to an ideathon
 */
const IdeathonRegistrationPage = () => {
  const { id: ideathonId, registrationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Determine if this is edit mode
  const isEditMode = !!registrationId;

  // State for form data
  const [formData, setFormData] = useState({
    selectedIdeaId: "",
    pitchDetails: "",
    projectTitle: "",
    teamName: "",
    teamMembers: "",
    mobileNumber: "",
    email: user?.email || "",
    githubUrl: "",
    acceptedTerms: false,
  });

  // State for managing data and UI
  const [userIdeas, setUserIdeas] = useState([]);
  const [isLoadingIdeas, setIsLoadingIdeas] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [ideathonDetails, setIdeathonDetails] = useState(null);
  const [isLoadingIdeathon, setIsLoadingIdeathon] = useState(true);

  useEffect(() => {
    if (ideathonId) {
      fetchIdeathonDetails();
      fetchUserIdeas();
      if (isEditMode) {
        fetchRegistrationData();
      }
    }
  }, [ideathonId, registrationId]);

  // Fetch ideathon details
  const fetchIdeathonDetails = async () => {
    try {
      setIsLoadingIdeathon(true);
      const token = localStorage.getItem("token");
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

      const response = await fetch(`${API_BASE}/api/ideathons/${ideathonId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch ideathon details");
      }

      const data = await response.json();
      setIdeathonDetails(data.data || data);
    } catch (err) {
      console.error("Error fetching ideathon details:", err);
      toast.error("Failed to load ideathon details");
    } finally {
      setIsLoadingIdeathon(false);
    }
  };

  // Fetch user's existing ideas
  const fetchUserIdeas = async () => {
    try {
      setIsLoadingIdeas(true);
      const response = await ideasAPI.getUserIdeas();
      if (response && response.data && Array.isArray(response.data)) {
        setUserIdeas(response.data);
      }
    } catch (err) {
      console.error("Error fetching user ideas:", err);
    } finally {
      setIsLoadingIdeas(false);
    }
  };

  // Fetch existing registration data for edit mode
  const fetchRegistrationData = async () => {
    try {
      const token = localStorage.getItem("token");
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

      const response = await fetch(
        `${API_BASE}/api/ideathons/${ideathonId}/registrations/${registrationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch registration data");
      }

      const data = await response.json();
      const registration = data.data || data;

      // Populate form with existing data
      setFormData((prev) => ({
        ...prev,
        selectedIdeaId: registration.idea?._id || registration.ideaId || "",
        pitchDetails: registration.pitchDetails || "",
        projectTitle: registration.projectTitle || "",
        teamName: registration.teamName || "",
        teamMembers: Array.isArray(registration.teamMembers)
          ? registration.teamMembers.map((m) => m.name || m).join("\n")
          : registration.teamMembers || "",
        mobileNumber: registration.mobileNumber || "",
        email: registration.email || user?.email || "",
        githubUrl: registration.githubUrl || "",
        acceptedTerms: true, // Already accepted during registration
      }));
    } catch (err) {
      console.error("Error fetching registration data:", err);
      toast.error("Failed to load registration data");
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.selectedIdeaId) {
      toast.error("Please select an idea");
      return;
    }
    if (!formData.teamName.trim()) {
      toast.error("Please enter your team name");
      return;
    }
    if (!formData.projectTitle.trim()) {
      toast.error("Please enter your project title");
      return;
    }
    if (!formData.pitchDetails.trim()) {
      toast.error("Please provide pitch details");
      return;
    }
    if (!formData.acceptedTerms) {
      toast.error("Please accept the terms and conditions");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const token = localStorage.getItem("token");
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

      // Parse team members from newline-separated or comma-separated text
      let parsedTeamMembers = [];
      if (formData.teamMembers && formData.teamMembers.trim()) {
        const memberLines = formData.teamMembers
          .split(/[\n,]/)
          .map((name) => name.trim())
          .filter((name) => name);
        parsedTeamMembers = memberLines.map((name) => ({
          name: name,
          email: formData.email, // Use the contact email for all team members
          role: "Team Member",
        }));
      }

      // Prepare JSON data for submission
      const submissionData = {
        ideaId: formData.selectedIdeaId,
        pitchDetails: formData.pitchDetails,
        projectTitle: formData.projectTitle,
        projectDescription: formData.pitchDetails,
        teamName: formData.teamName,
        teamMembers: parsedTeamMembers,
        mobileNumber: formData.mobileNumber,
        email: formData.email,
        githubUrl: formData.githubUrl,
      };

      let url;
      let method;

      if (isEditMode) {
        // Update existing registration
        url = `${API_BASE}/api/ideathons/${ideathonId}/registrations/${registrationId}`;
        method = "PUT";
      } else {
        // Create new registration
        url = `${API_BASE}/api/ideathons/${ideathonId}/register`;
        method = "POST";
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Operation failed");
      }

      const result = await response.json();

      toast.success(
        isEditMode
          ? "Successfully updated registration!"
          : "Successfully registered for ideathon!"
      );
      setTimeout(() => {
        navigate(`/entrepreneur/ideathon/${ideathonId}`);
      }, 1500);
    } catch (err) {
      console.error("Error submitting registration:", err);
      setError(err.message || "Failed to register. Please try again.");
      toast.error(err.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingIdeathon) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-white/70">Loading ideathon details...</p>
        </div>
      </div>
    );
  }

  if (!ideathonDetails) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <p className="text-white/70 mb-4">Ideathon not found</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 sm:mb-6 flex items-center gap-2 text-white/70 hover:text-white transition-all duration-300 p-2 -ml-2 rounded-lg hover:bg-white/5 min-h-[44px]"
        >
          <FaArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-sm sm:text-base">Back</span>
        </button>

        {/* Header */}
        <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.04] border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-2xl">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-yellow-400/10 rounded-lg flex-shrink-0">
              <FaTrophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 break-words">
                {isEditMode ? "Edit Registration" : "Register for"}{" "}
                {ideathonDetails.title}
              </h1>
              <p className="text-sm sm:text-base text-white/70 mb-3 sm:mb-4 line-clamp-3 sm:line-clamp-none">
                {ideathonDetails.description}
              </p>
              <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-white/60">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-white/40 w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="break-words">
                    {new Date(ideathonDetails.startDate).toLocaleDateString()} -{" "}
                    {new Date(ideathonDetails.endDate).toLocaleDateString()}
                  </span>
                </div>
                {ideathonDetails.maxParticipants && (
                  <div className="flex items-center gap-2">
                    <FaUsers className="text-white/40 w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span>
                      Max {ideathonDetails.maxParticipants} participants
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Select Idea */}
          <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.04] border border-white/10 rounded-xl p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <FaLightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 flex-shrink-0" />
                <h2 className="text-lg sm:text-xl font-semibold text-white">
                  Select Your Idea
                </h2>
              </div>
              <button
                type="button"
                onClick={() => navigate("/submit-idea", { state: { fromIdeathon: ideathonId } })}
                className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 bg-yellow-400/10 text-yellow-400 rounded-lg hover:bg-yellow-400/20 transition-all border border-yellow-400/20 text-sm sm:text-base min-h-[44px] sm:min-h-0 whitespace-nowrap"
              >
                <FaPlus className="w-4 h-4" />
                <span>New Idea</span>
              </button>
            </div>

            {isLoadingIdeas ? (
              <div className="text-center py-8">
                <FaSpinner className="w-8 h-8 text-white/70 animate-spin mx-auto mb-2" />
                <p className="text-white/60">Loading your ideas...</p>
              </div>
            ) : userIdeas.length === 0 ? (
              <div className="text-center py-8">
                <FaExclamationTriangle className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-white/60">
                  No ideas found. Create a new idea to register.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {userIdeas.map((idea) => (
                  <label
                    key={idea._id || idea.id}
                    className={`block p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.selectedIdeaId === (idea._id || idea.id)
                        ? "border-yellow-400 bg-yellow-400/10"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                  >
                    <input
                      type="radio"
                      name="selectedIdeaId"
                      value={idea._id || idea.id}
                      checked={
                        formData.selectedIdeaId === (idea._id || idea.id)
                      }
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="flex items-start gap-3">
                      <FaCheck
                        className={`w-5 h-5 mt-1 ${
                          formData.selectedIdeaId === (idea._id || idea.id)
                            ? "text-yellow-400"
                            : "text-white/20"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold mb-1 text-sm sm:text-base break-words">
                          {idea.title}
                        </h3>
                        <p className="text-white/60 text-xs sm:text-sm mb-2 line-clamp-2">
                          {idea.elevatorPitch}
                        </p>
                        {idea.category && (
                          <span className="inline-block px-3 py-1 bg-white/10 text-white/70 text-xs rounded-full">
                            {idea.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Pitch Details */}
          <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.04] border border-white/10 rounded-xl p-4 sm:p-6">
            <label className="block mb-2 text-white font-semibold text-sm sm:text-base">
              Pitch Details <span className="text-red-400">*</span>
            </label>
            <textarea
              name="pitchDetails"
              value={formData.pitchDetails}
              onChange={handleChange}
              placeholder="Describe your pitch, innovation, and implementation plan..."
              rows={6}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20"
              required
            />
          </div>

          {/* Project Title */}
          <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.04] border border-white/10 rounded-xl p-4 sm:p-6">
            <label className="block mb-2 text-white font-semibold text-sm sm:text-base">
              Project Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="projectTitle"
              value={formData.projectTitle}
              onChange={handleChange}
              placeholder="Give your project a catchy title"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20"
              required
            />
          </div>

          {/* Team Information */}
          <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.04] border border-white/10 rounded-xl p-4 sm:p-6 space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">
              Team Information
            </h2>

            <div>
              <label className="block mb-2 text-white font-semibold text-sm sm:text-base">
                Team Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="teamName"
                value={formData.teamName}
                onChange={handleChange}
                placeholder="Enter your team name"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 text-sm sm:text-base"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-white font-semibold">
                Team Members
              </label>
              <textarea
                name="teamMembers"
                value={formData.teamMembers}
                onChange={handleChange}
                placeholder="List team member names (one per line)"
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-white font-semibold">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  placeholder="Enter mobile number"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20"
                />
              </div>

              <div>
                <label className="block mb-2 text-white font-semibold">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-white font-semibold">
                GitHub URL
              </label>
              <input
                type="url"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleChange}
                placeholder="https://github.com/your-repo"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20"
              />
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.04] border border-white/10 rounded-xl p-4 sm:p-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="acceptedTerms"
                checked={formData.acceptedTerms}
                onChange={handleChange}
                className="mt-0.5 sm:mt-1 w-5 h-5 rounded border-white/20 bg-white/5 text-yellow-400 focus:ring-2 focus:ring-yellow-400/20 flex-shrink-0"
                required
              />
              <span className="text-white/80 text-xs sm:text-sm">
                I accept the terms and conditions and understand that all
                information provided is accurate. I agree to participate in
                accordance with the ideathon rules and regulations.
              </span>
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
              <FaExclamationTriangle className="text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full sm:flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-all border border-white/10 text-sm sm:text-base min-h-[48px] font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-yellow-400/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base min-h-[48px]"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  {isEditMode ? "Updating..." : "Submitting..."}
                </>
              ) : (
                <>
                  <FaCheck />
                  {isEditMode ? "Update Registration" : "Register for Ideathon"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IdeathonRegistrationPage;
