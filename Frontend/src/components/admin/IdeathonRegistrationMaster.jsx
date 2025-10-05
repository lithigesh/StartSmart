import React, { useState, useEffect } from 'react';
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
  FaExclamationTriangle
} from 'react-icons/fa';
import { API_BASE } from '../../services/api';

const IdeathonRegistrationMaster = () => {
  const [ideathons, setIdeathons] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(null);
  const [editingIdeathon, setEditingIdeathon] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [selectedIdeathon, setSelectedIdeathon] = useState('all');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    theme: '',
    startDate: '',
    endDate: '',
    location: 'Online',
    organizers: '',
    fundingPrizes: '',
    submissionFormat: [],
    eligibilityCriteria: '',
    judgingCriteria: '',
    contactInformation: ''
  });

  const [registrationFormData, setRegistrationFormData] = useState({
    ideathonId: '',
    userId: '',
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

  const submissionFormats = [
    'Pitch Deck',
    'Working Prototype',
    'Business Plan',
    'Video Demo',
    'Code Repository',
    'Research Paper'
  ];

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
    fetchIdeathons();
    fetchRegistrations();
    fetchUsers();
  }, []);

  const fetchIdeathons = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/ideathons`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch ideathons');
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
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setRegistrations(data.data || []);
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

  const handleCreateIdeathon = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/api/ideathons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          submissionFormat: formData.submissionFormat
        })
      });

      if (!response.ok) throw new Error('Failed to create ideathon');

      await fetchIdeathons();
      setShowCreateForm(false);
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateIdeathon = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/api/ideathons/${editingIdeathon._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to update ideathon');

      await fetchIdeathons();
      setEditingIdeathon(null);
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteIdeathon = async (id) => {
    if (!window.confirm('Are you sure you want to delete this ideathon?')) return;
    
    try {
      const response = await fetch(`${API_BASE}/api/ideathons/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to delete ideathon');

      await fetchIdeathons();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateRegistration = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/api/ideathons/${registrationFormData.ideathonId}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...registrationFormData,
          registeredBy: registrationFormData.userId
        })
      });

      if (!response.ok) throw new Error('Failed to create registration');

      await fetchRegistrations();
      setShowRegistrationModal(null);
      resetRegistrationForm();
      
      // Show success message
      setSuccessMessage('Team registered successfully!');
      setTimeout(() => setSuccessMessage(''), 5000); // Clear message after 5 seconds
      
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      theme: '',
      startDate: '',
      endDate: '',
      location: 'Online',
      organizers: '',
      fundingPrizes: '',
      submissionFormat: [],
      eligibilityCriteria: '',
      judgingCriteria: '',
      contactInformation: ''
    });
  };

  const resetRegistrationForm = () => {
    setRegistrationFormData({
      ideathonId: '',
      userId: '',
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

  const handleSubmissionFormatChange = (format, checked) => {
    if (checked) {
      setFormData({
        ...formData,
        submissionFormat: [...formData.submissionFormat, format]
      });
    } else {
      setFormData({
        ...formData,
        submissionFormat: formData.submissionFormat.filter(f => f !== format)
      });
    }
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

  const getIdeathonStatus = (ideathon) => {
    const now = new Date();
    const start = new Date(ideathon.startDate);
    const end = new Date(ideathon.endDate);
    
    if (now < start) return { label: 'Upcoming', color: 'blue' };
    if (now >= start && now <= end) return { label: 'Active', color: 'green' };
    return { label: 'Completed', color: 'gray' };
  };

  const getStatusColor = (statusInfo) => {
    switch (statusInfo.color) {
      case 'green': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'blue': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'gray': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const filteredIdeathons = (ideathons || []).filter(ideathon => {
    const matchesSearch = !searchTerm || 
      ideathon.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ideathon.theme?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ideathon.organizers?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = locationFilter === 'all' || ideathon.location === locationFilter;
    
    const status = getIdeathonStatus(ideathon);
    const matchesStatus = statusFilter === 'all' || status.label.toLowerCase() === statusFilter;
    
    return matchesSearch && matchesLocation && matchesStatus;
  });

  const filteredRegistrations = (registrations || []).filter(registration => {
    return selectedIdeathon === 'all' || (registration.ideathon && registration.ideathon._id === selectedIdeathon);
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
          <FaTrophy className="text-purple-400" />
          Ideathon Registration Master
        </h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowRegistrationModal({})}
            className="enhanced-button px-6 py-3 bg-gradient-to-r from-blue-500/80 to-blue-600/80 text-white rounded-lg font-medium hover:from-blue-400/90 hover:to-blue-500/90 transition-all duration-300 flex items-center gap-3 backdrop-blur-sm border border-blue-400/30"
          >
            <FaUsers className="text-sm" />
            Register Team
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Success Message Display */}
      {successMessage && (
        <div className="bg-green-500/20 border border-green-500/30 text-green-400 p-4 rounded-lg flex items-center gap-3">
          <FaCheckCircle className="text-green-400" />
          {successMessage}
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
            <label className="block text-white/70 text-sm font-medium mb-2">Search</label>
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
            <label className="block text-white/70 text-sm font-medium mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="enhanced-dropdown w-full px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50 focus:bg-white/[0.12] transition-all duration-300"
            >
              <option value="all" className="bg-gray-800 text-white">All Status</option>
              <option value="upcoming" className="bg-gray-800 text-white">Upcoming</option>
              <option value="active" className="bg-gray-800 text-white">Active</option>
              <option value="completed" className="bg-gray-800 text-white">Completed</option>
            </select>
          </div>
          
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">Location</label>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="enhanced-dropdown w-full px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50 focus:bg-white/[0.12] transition-all duration-300"
            >
              <option value="all" className="bg-gray-800 text-white">All Locations</option>
              <option value="Online" className="bg-gray-800 text-white">Online</option>
              <option value="Offline" className="bg-gray-800 text-white">Offline</option>
              <option value="Hybrid" className="bg-gray-800 text-white">Hybrid</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setLocationFilter('all');
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
          const registrationCount = registrations.filter(r => r.ideathon && r.ideathon._id === ideathon._id).length;
          
          return (
            <div key={ideathon._id} className="bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl hover:from-white/[0.12] hover:to-white/[0.08] transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{ideathon.title}</h3>
                  <p className="text-white/70 text-sm mb-2">{ideathon.theme}</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                    {status.label}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-white/70 text-sm">
                  <FaCalendarAlt className="mr-2" />
                  {formatDate(ideathon.startDate)} - {formatDate(ideathon.endDate)}
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
                    <FaTrophy className="text-yellow-400 text-sm" />
                    <span className="text-white/70 text-xs font-semibold uppercase">Prize Pool</span>
                  </div>
                  <p className="text-white font-medium text-sm">{ideathon.fundingPrizes}</p>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setRegistrationFormData({
                      ...registrationFormData,
                      ideathonId: ideathon._id
                    });
                    setShowRegistrationModal({});
                  }}
                  className="enhanced-button flex-1 px-3 py-2 bg-gradient-to-r from-green-500/80 to-green-600/80 text-white rounded-lg font-medium hover:from-green-400/90 hover:to-green-500/90 transition-all duration-300 flex items-center justify-center gap-2 text-sm backdrop-blur-sm border border-green-400/30"
                >
                  <FaUsers className="text-xs" />
                  Register Team
                </button>
                <button
                  className="enhanced-button flex-1 px-3 py-2 bg-gradient-to-r from-blue-500/80 to-blue-600/80 text-white rounded-lg font-medium hover:from-blue-400/90 hover:to-blue-500/90 transition-all duration-300 flex items-center justify-center gap-2 text-sm backdrop-blur-sm border border-blue-400/30"
                >
                  <FaEye className="text-xs" />
                  View ({registrationCount})
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Registrations Section */}
      {registrations.length > 0 && (
        <div className="bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <FaUsers className="text-blue-400" />
              Registrations
            </h3>
            <select
              value={selectedIdeathon}
              onChange={(e) => setSelectedIdeathon(e.target.value)}
              className="enhanced-dropdown px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50"
            >
              <option value="all" className="bg-gray-800 text-white">All Ideathons</option>
              {(ideathons || []).map(ideathon => (
                <option key={ideathon._id} value={ideathon._id} className="bg-gray-800 text-white">
                  {ideathon.title}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase">Team</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase">Ideathon</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase">Project</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase">Members</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredRegistrations.map((registration) => (
                  <tr key={registration._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="text-white font-medium">{registration.teamName}</div>
                      <div className="text-white/60 text-sm">{registration.registeredBy?.name}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-white">{registration.ideathon?.title}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-white">{registration.projectTitle}</div>
                      <div className="text-white/60 text-sm">{registration.techStack}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-white">{registration.teamMembers?.length || 0} members</div>
                    </td>
                    <td className="px-4 py-3 text-white/70 text-sm">
                      {formatDateTime(registration.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create/Edit Ideathon Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4"
             style={{ 
               background: 'rgba(0, 0, 0, 0.8)',
               backdropFilter: 'blur(20px)',
               WebkitBackdropFilter: 'blur(20px)',
             }}>
          <div className="bg-gradient-to-br from-white/[0.15] via-white/[0.08] to-white/[0.12] backdrop-blur-xl border border-white/20 rounded-2xl p-8 w-full max-w-4xl max-h-[95vh] overflow-y-auto shadow-2xl custom-scrollbar">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">
                {editingIdeathon ? 'Edit Ideathon' : 'Create New Ideathon'}
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

            <form onSubmit={editingIdeathon ? handleUpdateIdeathon : handleCreateIdeathon} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-white/70 text-sm font-medium mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">Theme</label>
                  <input
                    type="text"
                    value={formData.theme}
                    onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                    className="w-full px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50"
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">Location</label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="enhanced-dropdown w-full px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50"
                  >
                    <option value="Online" className="bg-gray-800 text-white">Online</option>
                    <option value="Offline" className="bg-gray-800 text-white">Offline</option>
                    <option value="Hybrid" className="bg-gray-800 text-white">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">Start Date *</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">End Date *</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">Organizers *</label>
                  <textarea
                    value={formData.organizers}
                    onChange={(e) => setFormData({ ...formData, organizers: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">Prize Pool</label>
                  <input
                    type="text"
                    value={formData.fundingPrizes}
                    onChange={(e) => setFormData({ ...formData, fundingPrizes: e.target.value })}
                    placeholder="e.g., $10,000 in prizes"
                    className="w-full px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Submission Format (Select multiple)</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {submissionFormats.map((format) => (
                    <label key={format} className="flex items-center space-x-2 text-white/70">
                      <input
                        type="checkbox"
                        checked={formData.submissionFormat.includes(format)}
                        onChange={(e) => handleSubmissionFormatChange(format, e.target.checked)}
                        className="rounded bg-white/10 border-white/30 text-blue-500 focus:ring-blue-500"
                      />
                      <span className="text-sm">{format}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">Eligibility Criteria</label>
                  <textarea
                    value={formData.eligibilityCriteria}
                    onChange={(e) => setFormData({ ...formData, eligibilityCriteria: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50"
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">Judging Criteria</label>
                  <textarea
                    value={formData.judgingCriteria}
                    onChange={(e) => setFormData({ ...formData, judgingCriteria: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Contact Information</label>
                <textarea
                  value={formData.contactInformation}
                  onChange={(e) => setFormData({ ...formData, contactInformation: e.target.value })}
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
                  className="enhanced-button px-6 py-2 bg-gradient-to-r from-purple-500/80 to-purple-600/80 text-white rounded-lg hover:from-purple-400/90 hover:to-purple-500/90 transition-all duration-300 backdrop-blur-sm border border-purple-400/30"
                >
                  {editingIdeathon ? 'Update Ideathon' : 'Create Ideathon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {showRegistrationModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4"
             style={{ 
               background: 'rgba(0, 0, 0, 0.8)',
               backdropFilter: 'blur(20px)',
               WebkitBackdropFilter: 'blur(20px)',
             }}>
          <div className="bg-gradient-to-br from-white/[0.15] via-white/[0.08] to-white/[0.12] backdrop-blur-xl border border-white/20 rounded-2xl p-8 w-full max-w-3xl max-h-[95vh] overflow-y-auto shadow-2xl custom-scrollbar">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Register Team for Ideathon</h3>
              <button
                onClick={() => {
                  setShowRegistrationModal(null);
                  resetRegistrationForm();
                }}
                className="enhanced-button p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleCreateRegistration} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">Ideathon *</label>
                  <select
                    value={registrationFormData.ideathonId}
                    onChange={(e) => setRegistrationFormData({ ...registrationFormData, ideathonId: e.target.value })}
                    className="enhanced-dropdown w-full px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50"
                    required
                  >
                    <option value="" className="bg-gray-800 text-white">Select Ideathon</option>
                    {(ideathons || []).map(ideathon => (
                      <option key={ideathon._id} value={ideathon._id} className="bg-gray-800 text-white">
                        {ideathon.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">Team Lead *</label>
                  <select
                    value={registrationFormData.userId}
                    onChange={(e) => setRegistrationFormData({ ...registrationFormData, userId: e.target.value })}
                    className="enhanced-dropdown w-full px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50"
                    required
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    setShowRegistrationModal(null);
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
                  Register Team
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