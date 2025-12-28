import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaTrophy,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaUsers,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaSearch,
  FaFilter,
  FaDownload,
  FaTimes,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { API_BASE } from "../../services/api";

const IdeathonRegistrationMaster = () => {
  const navigate = useNavigate();
  const [ideathons, setIdeathons] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(null);
  const [editingIdeathon, setEditingIdeathon] = useState(null);
  const [editingRegistration, setEditingRegistration] = useState(null);

  // Filters and search
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [selectedIdeathon, setSelectedIdeathon] = useState("all");

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    theme: "",
    startDate: "",
    endDate: "",
    location: "Online",
    organizers: "",
    fundingPrizes: "",
    submissionFormat: [],
    eligibilityCriteria: "",
    judgingCriteria: "",
    contactInformation: "",
  });

  const [registrationFormData, setRegistrationFormData] = useState({
    ideathonId: "",
    userId: "",
    ideaId: "",
    teamName: "",
    teamMembers: [],
    projectTitle: "",
    projectDescription: "",
    techStack: "",
    githubRepo: "",
    additionalInfo: "",
  });

  const [newTeamMember, setNewTeamMember] = useState({
    name: "",
    email: "",
    role: "",
  });

  const token =
    localStorage.getItem("adminToken") || localStorage.getItem("token");

  const submissionFormats = [
    "Pitch Deck",
    "Working Prototype",
    "Business Plan",
    "Video Demo",
    "Code Repository",
    "Research Paper",
  ];

  const memberRoles = [
    "Team Lead",
    "Developer",
    "Designer",
    "Data Scientist",
    "Business Analyst",
    "Marketing Specialist",
    "Other",
  ];

  useEffect(() => {
    fetchIdeathons();
    fetchRegistrations();
    fetchUsers();
  }, []);

  const fetchIdeathons = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/ideathons`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch ideathons");
      const data = await response.json();
      setIdeathons(data.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrations = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/ideathons/registrations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setRegistrations(data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch registrations:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const handleCreateIdeathon = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/api/ideathons`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          submissionFormat: formData.submissionFormat,
        }),
      });

      if (!response.ok) throw new Error("Failed to create ideathon");

      await fetchIdeathons();
      setShowCreateForm(false);
      resetForm();
      toast.success("Ideathon created successfully!");
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Failed to create ideathon");
    }
  };

  const handleUpdateIdeathon = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${API_BASE}/api/ideathons/${editingIdeathon._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to update ideathon");

      await fetchIdeathons();
      setEditingIdeathon(null);
      setShowCreateForm(false);
      resetForm();
      toast.success("Ideathon updated successfully!");
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Failed to update ideathon");
    }
  };

  const handleDeleteIdeathon = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ideathon?"))
      return;

    try {
      const response = await fetch(`${API_BASE}/api/ideathons/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to delete ideathon");

      await fetchIdeathons();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateRegistration = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${API_BASE}/api/ideathons/${registrationFormData.ideathonId}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ideaId: registrationFormData.ideaId || null, // Optional since admin can register without specific idea
            teamName: registrationFormData.teamName,
            projectTitle: registrationFormData.projectTitle,
            projectDescription: registrationFormData.projectDescription,
            pitchDetails: registrationFormData.projectDescription, // Use project description as pitch details
            teamMembers: registrationFormData.teamMembers,
            techStack: registrationFormData.techStack,
            githubRepo: registrationFormData.githubRepo,
            additionalInfo: registrationFormData.additionalInfo,
            userId: registrationFormData.userId,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Registration error:", errorData);
        throw new Error(errorData.message || "Failed to create registration");
      }

      await fetchRegistrations();
      setShowRegistrationModal(null);
      resetRegistrationForm();
      toast.success("Team registered successfully!");
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message);
      toast.error(err.message || "Failed to register team");
    }
  };

  const handleEditRegistration = (registration) => {
    setEditingRegistration(registration);
    setRegistrationFormData({
      ideathonId: registration.ideathon?._id || "",
      userId: registration.registeredBy?._id || "",
      ideaId: registration.idea?._id || "",
      teamName: registration.teamName || "",
      teamMembers: registration.teamMembers || [],
      projectTitle: registration.projectTitle || "",
      projectDescription: registration.projectDescription || "",
      techStack: registration.techStack || "",
      githubRepo: registration.githubRepo || "",
      additionalInfo: registration.additionalInfo || "",
    });
    setShowRegistrationModal({});
  };

  const handleUpdateRegistration = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${API_BASE}/api/ideathons/registrations/${editingRegistration._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            teamName: registrationFormData.teamName,
            projectTitle: registrationFormData.projectTitle,
            projectDescription: registrationFormData.projectDescription,
            pitchDetails: registrationFormData.projectDescription,
            teamMembers: registrationFormData.teamMembers,
            techStack: registrationFormData.techStack,
            githubRepo: registrationFormData.githubRepo,
            additionalInfo: registrationFormData.additionalInfo,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update registration");
      }

      await fetchRegistrations();
      setShowRegistrationModal(null);
      setEditingRegistration(null);
      resetRegistrationForm();
      toast.success("Registration updated successfully!");
    } catch (err) {
      console.error("Update error:", err);
      setError(err.message);
      toast.error(err.message || "Failed to update registration");
    }
  };

  const handleDeleteRegistration = async (registrationId) => {
    if (!window.confirm("Are you sure you want to delete this registration?"))
      return;

    try {
      const response = await fetch(
        `${API_BASE}/api/ideathons/registrations/${registrationId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to delete registration");

      await fetchRegistrations();
      toast.success("Registration deleted successfully!");
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Failed to delete registration");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      theme: "",
      startDate: "",
      endDate: "",
      location: "Online",
      organizers: "",
      fundingPrizes: "",
      submissionFormat: [],
      eligibilityCriteria: "",
      judgingCriteria: "",
      contactInformation: "",
    });
  };

  const resetRegistrationForm = () => {
    setRegistrationFormData({
      ideathonId: "",
      userId: "",
      ideaId: "",
      teamName: "",
      teamMembers: [],
      projectTitle: "",
      projectDescription: "",
      techStack: "",
      githubRepo: "",
      additionalInfo: "",
    });
    setNewTeamMember({ name: "", email: "", role: "" });
  };

  const addTeamMember = () => {
    if (newTeamMember.name && newTeamMember.email && newTeamMember.role) {
      setRegistrationFormData({
        ...registrationFormData,
        teamMembers: [...registrationFormData.teamMembers, newTeamMember],
      });
      setNewTeamMember({ name: "", email: "", role: "" });
    }
  };

  const removeTeamMember = (index) => {
    const updatedMembers = registrationFormData.teamMembers.filter(
      (_, i) => i !== index
    );
    setRegistrationFormData({
      ...registrationFormData,
      teamMembers: updatedMembers,
    });
  };

  const handleSubmissionFormatChange = (format, checked) => {
    if (checked) {
      setFormData({
        ...formData,
        submissionFormat: [...formData.submissionFormat, format],
      });
    } else {
      setFormData({
        ...formData,
        submissionFormat: formData.submissionFormat.filter((f) => f !== format),
      });
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getIdeathonStatus = (ideathon) => {
    const now = new Date();
    const start = new Date(ideathon.startDate);
    const end = new Date(ideathon.endDate);

    if (now < start) return { label: "Upcoming", color: "blue" };
    if (now >= start && now <= end) return { label: "Active", color: "green" };
    return { label: "Completed", color: "gray" };
  };

  const getStatusColor = (statusInfo) => {
    switch (statusInfo.color) {
      case "green":
        return "bg-white/10/20 text-white/90 border-white/30";
      case "blue":
        return "bg-white/20/20 text-white/90 border-white/30";
      case "gray":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const filteredIdeathons = (ideathons || []).filter((ideathon) => {
    const matchesSearch =
      !searchTerm ||
      ideathon.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ideathon.theme?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ideathon.organizers?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocation =
      locationFilter === "all" || ideathon.location === locationFilter;

    const status = getIdeathonStatus(ideathon);
    const matchesStatus =
      statusFilter === "all" || status.label.toLowerCase() === statusFilter;

    return matchesSearch && matchesLocation && matchesStatus;
  });

  const filteredRegistrations = (registrations || []).filter((registration) => {
    return (
      selectedIdeathon === "all" ||
      (registration.ideathon && registration.ideathon._id === selectedIdeathon)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
          <FaTrophy className="text-white/90" />
          Ideathon Management
        </h2>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-white/20 border border-white/30 text-white/80 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-3">
          <FaFilter className="text-white" />
          Filters & Search
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              Search
            </label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
              <input
                type="text"
                placeholder="Search ideathons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/50 focus:bg-white/[0.12] transition-all duration-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="enhanced-dropdown w-full px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50 focus:bg-white/[0.12] transition-all duration-300"
            >
              <option value="all" className="bg-gray-800 text-white">
                All Status
              </option>
              <option value="upcoming" className="bg-gray-800 text-white">
                Upcoming
              </option>
              <option value="active" className="bg-gray-800 text-white">
                Active
              </option>
              <option value="completed" className="bg-gray-800 text-white">
                Completed
              </option>
            </select>
          </div>

          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              Location
            </label>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="enhanced-dropdown w-full px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50 focus:bg-white/[0.12] transition-all duration-300"
            >
              <option value="all" className="bg-gray-800 text-white">
                All Locations
              </option>
              <option value="Online" className="bg-gray-800 text-white">
                Online
              </option>
              <option value="Offline" className="bg-gray-800 text-white">
                Offline
              </option>
              <option value="Hybrid" className="bg-gray-800 text-white">
                Hybrid
              </option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setLocationFilter("all");
              }}
              className="enhanced-button px-4 py-2 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Ideathons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIdeathons.map((ideathon) => {
          const status = getIdeathonStatus(ideathon);
          const registrationCount = registrations.filter(
            (r) => r.ideathon && r.ideathon._id === ideathon._id
          ).length;

          return (
            <div
              key={ideathon._id}
              className="bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl hover:from-white/[0.12] hover:to-white/[0.08] transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {ideathon.title}
                  </h3>
                  <p className="text-white/70 text-sm mb-2">{ideathon.theme}</p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                      status
                    )}`}
                  >
                    {status.label}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-white/70 text-sm">
                  <FaCalendarAlt className="mr-2" />
                  {formatDate(ideathon.startDate)} -{" "}
                  {formatDate(ideathon.endDate)}
                </div>
                <div className="flex items-center text-white/70 text-sm">
                  <FaMapMarkerAlt className="mr-2" />
                  {ideathon.location}
                </div>
                <div className="flex items-center text-white/70 text-sm">
                  <FaUsers className="mr-2" />
                  {registrationCount} Registrations
                </div>
              </div>

              {ideathon.fundingPrizes && (
                <div className="mb-4 p-3 bg-white/5 border border-white/10 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <FaTrophy className="text-white/70 text-sm" />
                    <span className="text-white/70 text-xs font-semibold uppercase">
                      Prize Pool
                    </span>
                  </div>
                  <p className="text-white font-medium text-sm">
                    {ideathon.fundingPrizes}
                  </p>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigate(`/admin/ideathon/${ideathon._id}`)}
                  className="enhanced-button w-full px-3 py-2 bg-gradient-to-r from-white/500/80 to-white/600/80 text-white rounded-lg font-medium hover:from-white/400/90 hover:to-white/500/90 transition-all duration-300 flex items-center justify-center gap-2 text-sm backdrop-blur-sm border border-white/30"
                >
                  <FaEye className="text-xs" />
                  View Details ({registrationCount})
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create/Edit Ideathon Modal */}
      {showCreateForm && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90"
          style={{
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          <div className="bg-gradient-to-br from-white/[0.15] via-white/[0.08] to-white/[0.12] backdrop-blur-xl border border-white/20 rounded-2xl p-8 w-full max-w-4xl max-h-[95vh] overflow-y-auto shadow-2xl custom-scrollbar ml-0 md:ml-32">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">
                {editingIdeathon ? "Edit Ideathon" : "Create New Ideathon"}
              </h3>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingIdeathon(null);
                  resetForm();
                }}
                className="enhanced-button p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
              >
                <FaTimes />
              </button>
            </div>

            <form
              onSubmit={
                editingIdeathon ? handleUpdateIdeathon : handleCreateIdeathon
              }
              className="space-y-6"
            >
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Theme
                  </label>
                  <input
                    type="text"
                    value={formData.theme}
                    onChange={(e) =>
                      setFormData({ ...formData, theme: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50"
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Location
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="enhanced-dropdown w-full px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50"
                  >
                    <option value="Online" className="bg-gray-800 text-white">
                      Online
                    </option>
                    <option value="Offline" className="bg-gray-800 text-white">
                      Offline
                    </option>
                    <option value="Hybrid" className="bg-gray-800 text-white">
                      Hybrid
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  className="w-full px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Organizers *
                  </label>
                  <textarea
                    value={formData.organizers}
                    onChange={(e) =>
                      setFormData({ ...formData, organizers: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Prize Pool
                  </label>
                  <input
                    type="text"
                    value={formData.fundingPrizes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fundingPrizes: e.target.value,
                      })
                    }
                    placeholder="e.g., $10,000 in prizes"
                    className="w-full px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Submission Format (Select multiple)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {submissionFormats.map((format) => (
                    <label
                      key={format}
                      className="flex items-center space-x-2 text-white/70"
                    >
                      <input
                        type="checkbox"
                        checked={formData.submissionFormat.includes(format)}
                        onChange={(e) =>
                          handleSubmissionFormatChange(format, e.target.checked)
                        }
                        className="rounded bg-white/10 border-white/30 text-white/90 focus:ring-white"
                      />
                      <span className="text-sm">{format}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Eligibility Criteria
                  </label>
                  <textarea
                    value={formData.eligibilityCriteria}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        eligibilityCriteria: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50"
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Judging Criteria
                  </label>
                  <textarea
                    value={formData.judgingCriteria}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        judgingCriteria: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Contact Information
                </label>
                <textarea
                  value={formData.contactInformation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contactInformation: e.target.value,
                    })
                  }
                  rows={2}
                  placeholder="Contact email, phone, or other details"
                  className="w-full px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingIdeathon(null);
                    resetForm();
                  }}
                  className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="enhanced-button px-6 py-2 bg-gradient-to-r from-white/20 to-white/30 text-white rounded-lg hover:from-white/30 hover:to-white/40 transition-all duration-300 backdrop-blur-sm border border-white/30"
                >
                  {editingIdeathon ? "Update Ideathon" : "Create Ideathon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdeathonRegistrationMaster;
