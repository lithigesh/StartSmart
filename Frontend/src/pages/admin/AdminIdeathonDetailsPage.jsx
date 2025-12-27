import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  FaTrophy, 
  FaEdit, 
  FaTrash, 
  FaUsers,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTimes,
  FaArrowLeft,
  FaBuilding,
  FaGavel,
  FaEnvelope,
  FaPlus
} from 'react-icons/fa';
import { API_BASE } from '../../services/api';

const AdminIdeathonDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ideathon, setIdeathon] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [editingRegistration, setEditingRegistration] = useState(null);
  
  const [registrationFormData, setRegistrationFormData] = useState({
    ideathonId: id,
    userId: '',
    ideaId: '',
    teamName: '',
    teamMembers: [],
    projectTitle: '',
    projectDescription: '',
    techStack: '',
    githubRepo: '',
    additionalInfo: ''
  });

  const [newTeamMember, setNewTeamMember] = useState({ name: '', email: '', role: '' });

  const token = localStorage.getItem('adminToken') || localStorage.getItem('token');

  const memberRoles = [
    'Team Lead',
    'Developer',
    'Designer',
    'Data Scientist',
    'Business Analyst',
    'Marketing Specialist',
    'Other'
  ];

  useEffect(() => {
    fetchIdeathonDetails();
    fetchRegistrations();
    fetchUsers();
  }, [id]);

  const fetchIdeathonDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/ideathons/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch ideathon details');
      const data = await response.json();
      setIdeathon(data.data || data);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'Failed to fetch ideathon details');
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrations = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/ideathons/registrations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const allRegs = data.data || [];
        setRegistrations(allRegs.filter(r => r.ideathon && r.ideathon._id === id));
      }
    } catch (err) {
      console.error('Failed to fetch registrations:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const handleCreateRegistration = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/api/ideathons/${id}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ideaId: registrationFormData.ideaId || null,
          teamName: registrationFormData.teamName,
          projectTitle: registrationFormData.projectTitle,
          projectDescription: registrationFormData.projectDescription,
          pitchDetails: registrationFormData.projectDescription,
          teamMembers: registrationFormData.teamMembers,
          techStack: registrationFormData.techStack,
          githubRepo: registrationFormData.githubRepo,
          additionalInfo: registrationFormData.additionalInfo,
          userId: registrationFormData.userId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create registration');
      }

      await fetchRegistrations();
      setShowRegistrationModal(false);
      resetRegistrationForm();
      toast.success('Team registered successfully!');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message);
      toast.error(err.message || 'Failed to register team');
    }
  };

  const handleEditRegistration = (registration) => {
    setEditingRegistration(registration);
    setRegistrationFormData({
      ideathonId: id,
      userId: registration.registeredBy?._id || '',
      ideaId: registration.idea?._id || '',
      teamName: registration.teamName || '',
      teamMembers: registration.teamMembers || [],
      projectTitle: registration.projectTitle || '',
      projectDescription: registration.projectDescription || '',
      techStack: registration.techStack || '',
      githubRepo: registration.githubRepo || '',
      additionalInfo: registration.additionalInfo || ''
    });
    setShowRegistrationModal(true);
  };

  const handleUpdateRegistration = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/api/ideathons/registrations/${editingRegistration._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          teamName: registrationFormData.teamName,
          projectTitle: registrationFormData.projectTitle,
          projectDescription: registrationFormData.projectDescription,
          pitchDetails: registrationFormData.projectDescription,
          teamMembers: registrationFormData.teamMembers,
          techStack: registrationFormData.techStack,
          githubRepo: registrationFormData.githubRepo,
          additionalInfo: registrationFormData.additionalInfo
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update registration');
      }

      await fetchRegistrations();
      setShowRegistrationModal(false);
      setEditingRegistration(null);
      resetRegistrationForm();
      toast.success('Registration updated successfully!');
    } catch (err) {
      console.error('Update error:', err);
      setError(err.message);
      toast.error(err.message || 'Failed to update registration');
    }
  };

  const handleDeleteRegistration = async (registrationId) => {
    if (!window.confirm('Are you sure you want to delete this registration?')) return;
    
    try {
      const response = await fetch(`${API_BASE}/api/ideathons/registrations/${registrationId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to delete registration');

      await fetchRegistrations();
      toast.success('Registration deleted successfully!');
    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'Failed to delete registration');
    }
  };

  const resetRegistrationForm = () => {
    setRegistrationFormData({
      ideathonId: id,
      userId: '',
      ideaId: '',
      teamName: '',
      teamMembers: [],
      projectTitle: '',
      projectDescription: '',
      techStack: '',
      githubRepo: '',
      additionalInfo: ''
    });
    setNewTeamMember({ name: '', email: '', role: '' });
  };

  const addTeamMember = () => {
    if (newTeamMember.name && newTeamMember.email && newTeamMember.role) {
      setRegistrationFormData({
        ...registrationFormData,
        teamMembers: [...registrationFormData.teamMembers, newTeamMember]
      });
      setNewTeamMember({ name: '', email: '', role: '' });
    }
  };

  const removeTeamMember = (index) => {
    const updatedMembers = registrationFormData.teamMembers.filter((_, i) => i !== index);
    setRegistrationFormData({ ...registrationFormData, teamMembers: updatedMembers });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getIdeathonStatus = () => {
    if (!ideathon) return { label: 'Unknown', color: 'gray' };
    const now = new Date();
    const start = new Date(ideathon.startDate);
    const end = new Date(ideathon.endDate);
    
    if (now < start) return { label: 'Upcoming', color: 'white' };
    if (now >= start && now <= end) return { label: 'Active', color: 'green' };
    return { label: 'Completed', color: 'gray' };
  };

  const getStatusColor = (statusInfo) => {
    switch (statusInfo.color) {
      case 'green': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'white': return 'bg-white/10 text-white/80 border-white/20';
      case 'gray': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!ideathon) {
    return (
      <div className="text-center py-12">
        <p className="text-white/70 text-lg">Ideathon not found</p>
      </div>
    );
  }

  const status = getIdeathonStatus();

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/admin/registration-master')}
        className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
      >
        <FaArrowLeft />
        <span>Back to Registration Master</span>
      </button>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Ideathon Header */}
      <div className="bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-3xl font-bold text-white">{ideathon.title}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(status)}`}>
                {status.label}
              </span>
            </div>
            {ideathon.theme && (
              <p className="text-white/70 text-lg mb-4">{ideathon.theme}</p>
            )}
          </div>
          <button
            onClick={() => {
              setEditingRegistration(null);
              resetRegistrationForm();
              setShowRegistrationModal(true);
            }}
            className="px-6 py-3 bg-gradient-to-r from-green-500/80 to-green-600/80 text-white rounded-lg font-medium hover:from-green-400/90 hover:to-green-500/90 transition-all duration-300 flex items-center gap-3 backdrop-blur-sm border border-green-400/30"
          >
            <FaPlus className="text-sm" />
            Register Team
          </button>
        </div>

        {/* Ideathon Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FaCalendarAlt className="text-white/60" />
              <p className="text-white/50 text-xs font-semibold uppercase">Start Date</p>
            </div>
            <p className="text-white text-lg font-medium">{formatDate(ideathon.startDate)}</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FaCalendarAlt className="text-white/60" />
              <p className="text-white/50 text-xs font-semibold uppercase">End Date</p>
            </div>
            <p className="text-white text-lg font-medium">{formatDate(ideathon.endDate)}</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FaMapMarkerAlt className="text-white/60" />
              <p className="text-white/50 text-xs font-semibold uppercase">Location</p>
            </div>
            <p className="text-white text-lg font-medium">{ideathon.location || 'Not specified'}</p>
          </div>

          {ideathon.organizers && (
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FaBuilding className="text-white/60" />
                <p className="text-white/50 text-xs font-semibold uppercase">Organizers</p>
              </div>
              <p className="text-white text-sm">{ideathon.organizers}</p>
            </div>
          )}

          {ideathon.fundingPrizes && (
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 md:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <FaTrophy className="text-yellow-400" />
                <p className="text-white/50 text-xs font-semibold uppercase">Prize Pool</p>
              </div>
              <p className="text-white text-sm">{ideathon.fundingPrizes}</p>
            </div>
          )}

          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FaUsers className="text-white/60" />
              <p className="text-white/50 text-xs font-semibold uppercase">Registrations</p>
            </div>
            <p className="text-white text-2xl font-bold">{registrations.length}</p>
          </div>
        </div>

        {ideathon.description && (
          <div className="mb-6">
            <p className="text-white/50 text-xs font-semibold uppercase mb-2">Description</p>
            <p className="text-white/80">{ideathon.description}</p>
          </div>
        )}

        {ideathon.submissionFormat && ideathon.submissionFormat.length > 0 && (
          <div className="mb-6">
            <p className="text-white/50 text-xs font-semibold uppercase mb-2">Submission Format</p>
            <div className="flex flex-wrap gap-2">
              {ideathon.submissionFormat.map((format, idx) => (
                <span key={idx} className="px-3 py-1 bg-white/10 text-white/80 border border-white/20 rounded-full text-sm">
                  {format}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ideathon.eligibilityCriteria && (
            <div>
              <p className="text-white/50 text-xs font-semibold uppercase mb-2">Eligibility Criteria</p>
              <p className="text-white/80 text-sm">{ideathon.eligibilityCriteria}</p>
            </div>
          )}

          {ideathon.judgingCriteria && (
            <div>
              <p className="text-white/50 text-xs font-semibold uppercase mb-2">Judging Criteria</p>
              <p className="text-white/80 text-sm">{ideathon.judgingCriteria}</p>
            </div>
          )}
        </div>

        {ideathon.contactInformation && (
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-2">
              <FaEnvelope className="text-white/60" />
              <p className="text-white/50 text-xs font-semibold uppercase">Contact Information</p>
            </div>
            <p className="text-white/80 text-sm">{ideathon.contactInformation}</p>
          </div>
        )}
      </div>

      {/* Registrations Section */}
      <div className="bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
          <FaUsers className="text-white/60" />
          Registrations ({registrations.length})
        </h2>

        {registrations.length === 0 ? (
          <div className="text-center py-12">
            <FaUsers className="text-6xl text-white/30 mx-auto mb-4" />
            <p className="text-white/70 text-lg">No registrations yet for this ideathon</p>
          </div>
        ) : (
          <div className="space-y-4">
            {registrations.map((registration) => (
              <div key={registration._id} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/8 transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-xl font-bold text-white">{registration.teamName}</h4>
                      <span className="px-3 py-1 bg-white/10 text-white/80 border border-white/20 rounded-full text-xs font-semibold">
                        {registration.teamMembers?.length || 0} Members
                      </span>
                    </div>
                    <p className="text-white/60 text-sm mb-1">Team Lead: {registration.registeredBy?.name}</p>
                    <p className="text-white/60 text-sm">Contact: {registration.registeredBy?.email || registration.entrepreneur?.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditRegistration(registration)}
                      className="enhanced-button p-2 bg-white/10 text-white/80 border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-300"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteRegistration(registration._id)}
                      className="enhanced-button p-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all duration-300"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-white/50 text-xs font-semibold uppercase mb-1">Project Title</p>
                    <p className="text-white font-medium">{registration.projectTitle}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs font-semibold uppercase mb-1">Tech Stack</p>
                    <p className="text-white">{registration.techStack || 'Not specified'}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-white/50 text-xs font-semibold uppercase mb-1">Project Description</p>
                  <p className="text-white/80 text-sm">{registration.projectDescription}</p>
                </div>

                {registration.githubRepo && (
                  <div className="mb-4">
                    <p className="text-white/50 text-xs font-semibold uppercase mb-1">GitHub Repository</p>
                    <a href={registration.githubRepo} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm underline">
                      {registration.githubRepo}
                    </a>
                  </div>
                )}

                {registration.teamMembers && registration.teamMembers.length > 0 && (
                  <div className="mb-4">
                    <p className="text-white/50 text-xs font-semibold uppercase mb-2">Team Members</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {registration.teamMembers.map((member, idx) => (
                        <div key={idx} className="bg-white/5 border border-white/10 rounded-lg p-3">
                          <p className="text-white font-medium text-sm">{member.name}</p>
                          <p className="text-white/60 text-xs">{member.email}</p>
                          <p className="text-white/50 text-xs">{member.role}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {registration.additionalInfo && (
                  <div>
                    <p className="text-white/50 text-xs font-semibold uppercase mb-1">Additional Information</p>
                    <p className="text-white/80 text-sm">{registration.additionalInfo}</p>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-white/50 text-xs">
                    Registered on {formatDateTime(registration.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Registration Modal */}
      {showRegistrationModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90"
             style={{ 
               backdropFilter: 'blur(20px)',
               WebkitBackdropFilter: 'blur(20px)',
             }}>
          <div className="bg-gradient-to-br from-white/[0.15] via-white/[0.08] to-white/[0.12] backdrop-blur-xl border border-white/20 rounded-2xl p-8 w-full max-w-3xl max-h-[95vh] overflow-y-auto shadow-2xl custom-scrollbar ml-0 md:ml-32">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">
                {editingRegistration ? 'Edit Registration' : 'Register Team'}
              </h3>
              <button
                onClick={() => {
                  setShowRegistrationModal(false);
                  setEditingRegistration(null);
                  resetRegistrationForm();
                }}
                className="enhanced-button p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={editingRegistration ? handleUpdateRegistration : handleCreateRegistration} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">Team Lead *</label>
                  <select
                    value={registrationFormData.userId}
                    onChange={(e) => setRegistrationFormData({ ...registrationFormData, userId: e.target.value })}
                    className="enhanced-dropdown w-full px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50"
                    required
                    disabled={editingRegistration}
                  >
                    <option value="" className="bg-gray-800 text-white">Select Team Lead</option>
                    {(users || []).filter(u => u.role === 'entrepreneur').map(user => (
                      <option key={user._id} value={user._id} className="bg-gray-800 text-white">
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">Team Name *</label>
                  <input
                    type="text"
                    value={registrationFormData.teamName}
                    onChange={(e) => setRegistrationFormData({ ...registrationFormData, teamName: e.target.value })}
                    className="w-full px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">Project Title *</label>
                  <input
                    type="text"
                    value={registrationFormData.projectTitle}
                    onChange={(e) => setRegistrationFormData({ ...registrationFormData, projectTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">Tech Stack</label>
                  <input
                    type="text"
                    value={registrationFormData.techStack}
                    onChange={(e) => setRegistrationFormData({ ...registrationFormData, techStack: e.target.value })}
                    placeholder="e.g., React, Node.js, MongoDB"
                    className="w-full px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Project Description *</label>
                <textarea
                  value={registrationFormData.projectDescription}
                  onChange={(e) => setRegistrationFormData({ ...registrationFormData, projectDescription: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50"
                  required
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">GitHub Repository</label>
                <input
                  type="url"
                  value={registrationFormData.githubRepo}
                  onChange={(e) => setRegistrationFormData({ ...registrationFormData, githubRepo: e.target.value })}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50"
                />
              </div>

              {/* Team Members */}
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Team Members</label>
                
                {/* Add Team Member */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                  <input
                    type="text"
                    placeholder="Member Name"
                    value={newTeamMember.name}
                    onChange={(e) => setNewTeamMember({ ...newTeamMember, name: e.target.value })}
                    className="px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={newTeamMember.email}
                    onChange={(e) => setNewTeamMember({ ...newTeamMember, email: e.target.value })}
                    className="px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50"
                  />
                  <select
                    value={newTeamMember.role}
                    onChange={(e) => setNewTeamMember({ ...newTeamMember, role: e.target.value })}
                    className="enhanced-dropdown px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50"
                  >
                    <option value="" className="bg-gray-800 text-white">Select Role</option>
                    {memberRoles.map(role => (
                      <option key={role} value={role} className="bg-gray-800 text-white">{role}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={addTeamMember}
                    className="enhanced-button px-4 py-2 bg-green-500/80 text-white rounded-lg hover:bg-green-600/80 transition-all duration-300"
                  >
                    Add
                  </button>
                </div>

                {/* Team Members List */}
                {registrationFormData.teamMembers.length > 0 && (
                  <div className="space-y-2">
                    {registrationFormData.teamMembers.map((member, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                        <div>
                          <span className="text-white font-medium">{member.name}</span>
                          <span className="text-white/70 ml-2">({member.email})</span>
                          <span className="text-white/50 ml-2">- {member.role}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeTeamMember(index)}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Additional Information</label>
                <textarea
                  value={registrationFormData.additionalInfo}
                  onChange={(e) => setRegistrationFormData({ ...registrationFormData, additionalInfo: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowRegistrationModal(false);
                    setEditingRegistration(null);
                    resetRegistrationForm();
                  }}
                  className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="enhanced-button px-6 py-2 bg-gradient-to-r from-blue-500/80 to-blue-600/80 text-white rounded-lg hover:from-blue-400/90 hover:to-blue-500/90 transition-all duration-300 backdrop-blur-sm border border-blue-400/30"
                >
                  {editingRegistration ? 'Update Registration' : 'Register Team'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminIdeathonDetailsPage;
