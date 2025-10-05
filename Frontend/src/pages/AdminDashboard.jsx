import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation, Routes, Route, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import StartSmartIcon from "/w_startSmart_icon.png";
import '../styles/AdminEnhancements.css';
import {
  FaUsers,
  FaLightbulb,
  FaSignOutAlt,
  FaSpinner,
  FaChartBar,
  FaEdit,
  FaTrophy,
  FaTachometerAlt,
  FaBars,
  FaTimes,
  FaLeaf,
} from "react-icons/fa";
import AnalyticsDashboard from '../components/admin/AnalyticsDashboard';

const AdminDashboard = () => {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get current active path for sidebar highlighting
  const currentPath = location.pathname;

  // Sidebar navigation items with routes
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaTachometerAlt, path: '/admin/dashboard' },
    { id: 'users', label: 'Manage Users', icon: FaUsers, path: '/admin/users' },
    { id: 'ideas', label: 'Manage Ideas', icon: FaLightbulb, path: '/admin/ideas' },
    { id: 'ideathons', label: 'Ideathons', icon: FaTrophy, path: '/admin/ideathons' },
    { id: 'registration-master', label: 'Registration Master', icon: FaTrophy, path: '/admin/registration-master' },
    { id: 'feedback', label: 'Ideas Feedback', icon: FaEdit, path: '/admin/feedback' },
    { id: 'sustainability', label: 'Ideas Sustainability', icon: FaLeaf, path: '/admin/sustainability' },
  ];



  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "admin")) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, loading, user, navigate]);

  // Fetch users with better error handling
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error(`Failed to load users: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      const usersArray = Array.isArray(data) ? data : [];
      // Filter out admin users from display
      const nonAdminUsers = usersArray.filter(user => user.role !== 'admin');
      setUsers(nonAdminUsers);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalUsers: nonAdminUsers.length,
        recentSignups: nonAdminUsers.filter(u => {
          const signupDate = new Date(u.createdAt);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return signupDate > weekAgo;
        }).length,
      }));
    } catch (err) {
      setError(`Error loading users: ${err.message}`);
      console.error("Fetch users error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch ideas with better error handling
  const fetchIdeas = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/api/admin/ideas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error(`Failed to load ideas: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      const ideasArray = Array.isArray(data) ? data : [];
      setIdeas(ideasArray);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalIdeas: ideasArray.length,
      }));
    } catch (err) {
      setError(`Error loading ideas: ${err.message}`);
      console.error("Fetch ideas error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch ideathons with better error handling and search/filter support
  const fetchIdeathons = async (params = {}) => {
    try {
      setIsLoading(true);
      
      // Build query parameters
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...params
      });

      // Add search and filter parameters
      if (searchTerm) queryParams.append('search', searchTerm);
      if (statusFilter && statusFilter !== 'all') queryParams.append('status', statusFilter);
      if (locationFilter && locationFilter !== 'all') queryParams.append('location', locationFilter);
      if (themeFilter && themeFilter !== 'all') queryParams.append('theme', themeFilter);

      const res = await fetch(`${API_BASE}/api/ideathons?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error(`Failed to load ideathons: ${res.status} ${res.statusText}`);
      }
      const response = await res.json();
      
      // Handle new API response format
      let ideathonsArray = [];
      if (response.success && response.data) {
        ideathonsArray = Array.isArray(response.data) ? response.data : [];
        setTotalPages(response.totalPages || 1);
        setCurrentPage(response.currentPage || 1);
        
        // Update filter options
        if (response.filters) {
          setFilterOptions({
            statusOptions: response.filters.statusOptions || [],
            locationOptions: response.filters.locationOptions || [],
            themeOptions: response.filters.themeOptions || []
          });
        }
      } else if (Array.isArray(response)) {
        ideathonsArray = response; // Fallback for old format
      }
      
      setIdeathons(ideathonsArray);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalIdeathons: ideathonsArray.length,
      }));
    } catch (err) {
      setError(`Error loading ideathons: ${err.message}`);
      console.error("Fetch ideathons error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Create new ideathon
  const handleCreateIdeathon = async (ideathonData) => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/api/ideathons`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(ideathonData),
      });
      
      const response = await res.json();
      
      if (!res.ok) {
        throw new Error(response.message || `Failed to create ideathon: ${res.status} ${res.statusText}`);
      }
      
      if (response.success) {
        await fetchIdeathons();
        setError(null);
        return true; // Success
      } else {
        throw new Error(response.message || 'Failed to create ideathon');
      }
    } catch (err) {
      setError(`Error creating ideathon: ${err.message}`);
      console.error("Create ideathon error:", err);
      return false; // Failure
    } finally {
      setIsLoading(false);
    }
  };

  // Edit ideathon
  const handleEditIdeathon = async (ideathonId, ideathonData) => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/api/ideathons/${ideathonId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(ideathonData),
      });
      
      const response = await res.json();
      
      if (!res.ok) {
        throw new Error(response.message || `Failed to update ideathon: ${res.status} ${res.statusText}`);
      }
      
      if (response.success) {
        await fetchIdeathons();
        setError(null);
        return true; // Success
      } else {
        throw new Error(response.message || 'Failed to update ideathon');
      }
    } catch (err) {
      setError(`Error updating ideathon: ${err.message}`);
      console.error("Update ideathon error:", err);
      return false; // Failure
    } finally {
      setIsLoading(false);
    }
  };

  // Delete ideathon with confirmation
  const handleDeleteIdeathon = async (id) => {
    const ideathon = ideathons.find(i => i._id === id);
    if (!window.confirm(`Are you sure you want to delete ideathon "${ideathon?.title || 'Unknown'}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/api/ideathons/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const response = await res.json();
      
      if (!res.ok) {
        throw new Error(response.message || `Failed to delete ideathon: ${res.status} ${res.statusText}`);
      }
      
      if (response.success) {
        await fetchIdeathons();

        setError(null);
      } else {
        throw new Error(response.message || 'Failed to delete ideathon');
      }
    } catch (err) {
      setError(`Error deleting ideathon: ${err.message}`);
      console.error("Delete ideathon error:", err);
    } finally {
      setIsLoading(false);
    }
  };



  // Change role with confirmation
  const handleChangeRole = async (id, newRole) => {
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      return;
    }
    
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/api/admin/users/${id}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      
      if (!res.ok) {
        throw new Error(`Failed to change role: ${res.status} ${res.statusText}`);
      }
      
      await fetchUsers();
      setError(null);
    } catch (err) {
      setError(`Error changing role: ${err.message}`);
      console.error("Change role error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete user with enhanced confirmation
  const handleDeleteUser = async (id) => {
    const user = users.find(u => u._id === id);
    if (!window.confirm(`Are you sure you want to delete user "${user?.name || 'Unknown'}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) {
        throw new Error(`Failed to delete user: ${res.status} ${res.statusText}`);
      }
      
      await fetchUsers();
      setError(null);
    } catch (err) {
      setError(`Error deleting user: ${err.message}`);
      console.error("Delete user error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete idea with enhanced confirmation
  const handleDeleteIdea = async (id) => {
    const idea = ideas.find(i => i._id === id);
    if (!window.confirm(`Are you sure you want to delete idea "${idea?.title || 'Unknown'}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/api/admin/ideas/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) {
        throw new Error(`Failed to delete idea: ${res.status} ${res.statusText}`);
      }
      
      setIdeas((prev) => prev.filter((idea) => idea._id !== id));
      setError(null);
    } catch (err) {
      setError(`Error deleting idea: ${err.message}`);
      console.error("Delete idea error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load all data when component mounts
  useEffect(() => {
    if (user?.role === "admin") {
      Promise.all([
        fetchUsers(),
        fetchIdeas(),
        fetchIdeathons(),
      ]);
    }
  }, [user]);

  // Effect for search and filter changes
  useEffect(() => {
    if (user?.role === "admin") {
      const timeoutId = setTimeout(() => {
        setCurrentPage(1); // Reset to first page when searching
        fetchIdeathons();
      }, 500); // Debounce search

      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm, statusFilter, locationFilter, themeFilter]);

  // Effect for pagination changes
  useEffect(() => {
    if (user?.role === "admin" && currentPage > 1) {
      fetchIdeathons();
    }
  }, [currentPage]);

  // Ideathon form component
  const IdeathonForm = ({ onSubmit, onCancel, isModal = false, initialData = null }) => {
    const [formData, setFormData] = useState({
      title: initialData?.title || '',
      theme: initialData?.theme || '',
      fundingPrizes: initialData?.fundingPrizes || '',
      startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().slice(0, 16) : '',
      endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().slice(0, 16) : '',
      description: initialData?.description || '',
      organizers: initialData?.organizers || '',
      submissionFormat: initialData?.submissionFormat || [],
      eligibilityCriteria: initialData?.eligibilityCriteria || '',
      judgingCriteria: initialData?.judgingCriteria || '',
      location: initialData?.location || 'Online',
      contactInformation: initialData?.contactInformation || ''
    });
    const [formErrors, setFormErrors] = useState({});

    // Update form data when initialData changes (for editing)
    useEffect(() => {
      if (initialData) {
        setFormData({
          title: initialData.title || '',
          theme: initialData.theme || '',
          fundingPrizes: initialData.fundingPrizes || '',
          startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().slice(0, 16) : '',
          endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().slice(0, 16) : '',
          description: initialData.description || '',
          organizers: initialData.organizers || '',
          submissionFormat: initialData.submissionFormat || [],
          eligibilityCriteria: initialData.eligibilityCriteria || '',
          judgingCriteria: initialData.judgingCriteria || '',
          location: initialData.location || 'Online',
          contactInformation: initialData.contactInformation || ''
        });
      }
    }, [initialData]);

    const validateForm = () => {
      const errors = {};
      
      if (!formData.title.trim()) {
        errors.title = 'Title is required';
      }
      
      if (!formData.description.trim()) {
        errors.description = 'Description is required';
      }
      
      if (!formData.organizers.trim()) {
        errors.organizers = 'Organizers/Host Institution is required';
      }
      
      if (!formData.submissionFormat || formData.submissionFormat.length === 0) {
        errors.submissionFormat = 'At least one submission format is required';
      }
      
      if (!formData.startDate) {
        errors.startDate = 'Start date is required';
      }
      
      if (!formData.endDate) {
        errors.endDate = 'End date is required';
      }
      
      if (formData.startDate && formData.endDate) {
        if (new Date(formData.startDate) >= new Date(formData.endDate)) {
          errors.endDate = 'End date must be after start date';
        }
      }

      setFormErrors(errors);
      return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (!validateForm()) {
        return;
      }

      // Convert dates to ISO format for backend
      const submitData = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString()
      };

      const success = await onSubmit(submitData);
      if (success) {
        setFormData({ 
          title: '', 
          theme: '', 
          fundingPrizes: '', 
          startDate: '', 
          endDate: '',
          description: '',
          organizers: '',
          submissionFormat: [],
          eligibilityCriteria: '',
          judgingCriteria: '',
          location: 'Online',
          contactInformation: ''
        });
        setFormErrors({});
      }
    };

    return (
      <div className={isModal ? "" : "bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6 shadow-xl"}>
        {!isModal && <h3 className="text-lg font-semibold text-white mb-4">{initialData ? 'Edit Ideathon' : 'Create New Ideathon'}</h3>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/70 text-sm font-manrope mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-3 py-2 bg-white/[0.05] border ${formErrors.title ? 'border-red-500' : 'border-white/20'} rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/[0.08] transition-all duration-300`}
              placeholder="Enter ideathon title"
            />
            {formErrors.title && <p className="text-red-400 text-xs mt-1">{formErrors.title}</p>}
          </div>
          
          <div>
            <label className="block text-white/70 text-sm font-manrope mb-2">Theme</label>
            <input
              type="text"
              value={formData.theme}
              onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
              className="w-full px-3 py-2 bg-white/[0.05] border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/[0.08] transition-all duration-300"
              placeholder="e.g., Green Innovation, AI Healthcare"
            />
          </div>
          
          <div>
            <label className="block text-white/70 text-sm font-manrope mb-2">Funding Prizes</label>
            <input
              type="text"
              value={formData.fundingPrizes}
              onChange={(e) => setFormData({ ...formData, fundingPrizes: e.target.value })}
              className="w-full px-3 py-2 bg-white/[0.05] border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/[0.08] transition-all duration-300"
              placeholder="e.g., 1st: $50,000, 2nd: $25,000"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/70 text-sm font-manrope mb-2">Start Date *</label>
              <input
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className={`w-full px-3 py-2 bg-white/[0.05] border ${formErrors.startDate ? 'border-red-500' : 'border-white/20'} rounded-lg text-white focus:outline-none focus:border-white/40 focus:bg-white/[0.08] transition-all duration-300`}
              />
              {formErrors.startDate && <p className="text-red-400 text-xs mt-1">{formErrors.startDate}</p>}
            </div>
            <div>
              <label className="block text-white/70 text-sm font-manrope mb-2">End Date *</label>
              <input
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className={`w-full px-3 py-2 bg-white/[0.05] border ${formErrors.endDate ? 'border-red-500' : 'border-white/20'} rounded-lg text-white focus:outline-none focus:border-white/40 focus:bg-white/[0.08] transition-all duration-300`}
              />
              {formErrors.endDate && <p className="text-red-400 text-xs mt-1">{formErrors.endDate}</p>}
            </div>
          </div>

          {/* Details Section */}
          <div className="border-t border-white/10 pt-4 mt-6">
            <h4 className="text-white font-semibold mb-4">Details</h4>
            
            <div>
              <label className="block text-white/70 text-sm font-manrope mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className={`w-full px-3 py-2 bg-white/[0.05] border ${formErrors.description ? 'border-red-500' : 'border-white/20'} rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/[0.08] transition-all duration-300 resize-vertical`}
                placeholder="Provide overview, objectives, and problem statement..."
              />
              {formErrors.description && <p className="text-red-400 text-xs mt-1">{formErrors.description}</p>}
            </div>

            <div>
              <label className="block text-white/70 text-sm font-manrope mb-2">Organizers / Host Institution *</label>
              <input
                type="text"
                value={formData.organizers}
                onChange={(e) => setFormData({ ...formData, organizers: e.target.value })}
                className={`w-full px-3 py-2 bg-white/[0.05] border ${formErrors.organizers ? 'border-red-500' : 'border-white/20'} rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/[0.08] transition-all duration-300`}
                placeholder="e.g., MIT, Google, StartSmart Inc."
              />
              {formErrors.organizers && <p className="text-red-400 text-xs mt-1">{formErrors.organizers}</p>}
            </div>
          </div>

          {/* Participation Section */}
          <div className="border-t border-white/10 pt-4 mt-6">
            <h4 className="text-white font-semibold mb-4">Participation</h4>
            
            <div>
              <label className="block text-white/70 text-sm font-manrope mb-2">Submission Format * (Select multiple)</label>
              <div className="space-y-2">
                {['Pitch Deck', 'Prototype', 'Code Repository', 'Business Document', 'Video Presentation', 'Demo', 'Research Paper'].map((format) => (
                  <label key={format} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.submissionFormat.includes(format)}
                      onChange={(e) => {
                        const newFormats = e.target.checked 
                          ? [...formData.submissionFormat, format]
                          : formData.submissionFormat.filter(f => f !== format);
                        setFormData({ ...formData, submissionFormat: newFormats });
                      }}
                      className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/40 focus:ring-2"
                    />
                    <span className="text-white/80 text-sm">{format}</span>
                  </label>
                ))}
              </div>
              {formErrors.submissionFormat && <p className="text-red-400 text-xs mt-1">{formErrors.submissionFormat}</p>}
            </div>

            <div>
              <label className="block text-white/70 text-sm font-manrope mb-2">Eligibility Criteria</label>
              <textarea
                value={formData.eligibilityCriteria}
                onChange={(e) => setFormData({ ...formData, eligibilityCriteria: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 bg-white/[0.05] border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/[0.08] transition-all duration-300 resize-vertical"
                placeholder="Specify who can participate (students, professionals, startups)..."
              />
            </div>

            <div>
              <label className="block text-white/70 text-sm font-manrope mb-2">Judging Criteria</label>
              <textarea
                value={formData.judgingCriteria}
                onChange={(e) => setFormData({ ...formData, judgingCriteria: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 bg-white/[0.05] border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/[0.08] transition-all duration-300 resize-vertical"
                placeholder="Outline parameters like innovation, feasibility, impact, scalability..."
              />
            </div>
          </div>

          {/* Logistics Section */}
          <div className="border-t border-white/10 pt-4 mt-6">
            <h4 className="text-white font-semibold mb-4">Logistics</h4>
            
            <div>
              <label className="block text-white/70 text-sm font-manrope mb-2">Location</label>
              <select
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="enhanced-dropdown w-full px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50 focus:bg-white/[0.12] transition-all duration-300 backdrop-blur-sm hover:bg-white/[0.10] cursor-pointer"
              >
                <option value="Online" className="bg-gray-800 text-white">Online</option>
                <option value="Offline" className="bg-gray-800 text-white">Offline</option>
                <option value="Hybrid" className="bg-gray-800 text-white">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-white/70 text-sm font-manrope mb-2">Contact Information</label>
              <textarea
                value={formData.contactInformation}
                onChange={(e) => setFormData({ ...formData, contactInformation: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 bg-white/[0.05] border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/[0.08] transition-all duration-300 resize-vertical"
                placeholder="Email address or phone number for participant queries..."
              />
            </div>
          </div>
          
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-gradient-to-r from-white to-white/90 text-black rounded-lg font-manrope font-medium hover:from-white/90 hover:to-white/80 transition-all duration-300 disabled:opacity-50 flex items-center gap-3 shadow-lg hover:shadow-xl hover:scale-105"
            >
              {isLoading ? <FaSpinner className="animate-spin text-sm" /> : (initialData ? <FaEdit className="text-sm" /> : <FaPlus className="text-sm" />)}
              {isLoading ? (initialData ? 'Updating...' : 'Creating...') : (initialData ? 'Update Ideathon' : 'Create Ideathon')}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-6 py-3 bg-white/10 text-white rounded-lg font-manrope font-medium hover:bg-white/20 transition-all duration-300 disabled:opacity-50 flex items-center gap-2 border border-white/20"
            >
              <FaTimes className="text-sm" />
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  };

  // Section Components
  const DashboardOverview = () => (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:from-white/[0.12] hover:to-white/[0.08] transition-all duration-300 group shadow-xl animate-fade-in-up delay-100 hover:scale-105 hover:-translate-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm font-manrope font-medium">Total Users</p>
              <p className="text-white text-2xl font-bold font-manrope group-hover:scale-110 transition-transform duration-300">{stats.totalUsers}</p>
            </div>
            <div className="p-3 bg-white/10 rounded-lg group-hover:bg-white/20 transition-all duration-300">
              <FaUsers className="text-white text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:from-white/[0.12] hover:to-white/[0.08] transition-all duration-300 group shadow-xl animate-fade-in-up delay-200 hover:scale-105 hover:-translate-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm font-manrope font-medium">Total Ideas</p>
              <p className="text-white text-2xl font-bold font-manrope group-hover:scale-110 transition-transform duration-300">{stats.totalIdeas}</p>
            </div>
            <div className="p-3 bg-white/10 rounded-lg group-hover:bg-white/20 transition-all duration-300">
              <FaLightbulb className="text-white text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:from-white/[0.12] hover:to-white/[0.08] transition-all duration-300 group shadow-xl animate-fade-in-up delay-300 hover:scale-105 hover:-translate-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm font-manrope font-medium">Ideathons</p>
              <p className="text-white text-2xl font-bold font-manrope group-hover:scale-110 transition-transform duration-300">{stats.totalIdeathons}</p>
            </div>
            <div className="p-3 bg-white/10 rounded-lg group-hover:bg-white/20 transition-all duration-300">
              <FaTrophy className="text-white text-2xl" />
            </div>
          </div>
        </div>



        <div className="bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:from-white/[0.12] hover:to-white/[0.08] transition-all duration-300 group shadow-xl animate-fade-in-up delay-500 hover:scale-105 hover:-translate-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm font-manrope font-medium">New Signups</p>
              <p className="text-white text-2xl font-bold font-manrope group-hover:scale-110 transition-transform duration-300">{stats.recentSignups}</p>
            </div>
            <div className="p-3 bg-white/10 rounded-lg group-hover:bg-white/20 transition-all duration-300">
              <FaUserShield className="text-white text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Users */}
      <div className="bg-white/5 border border-white/20 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <FaUsers className="text-white" />
          Recent Users
        </h2>
        <div className="space-y-3">
          {users.slice(0, 5).map((u) => (
            <div key={u._id} className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300">
              <div>
                <p className="font-manrope text-white font-medium">{u.name}</p>
                <p className="text-sm text-gray-400">{u.email}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                u.role === 'admin' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                u.role === 'investor' ? 'bg-gray-500/20 text-gray-400 border-gray-500/30' :
                'bg-gray-500/20 text-gray-400 border-gray-500/30'
              }`}>
                {u.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const UsersSection = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl">
        <div className="p-6 border-b border-white/10">
          <div className="relative">
            <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
              <FaUsers className="text-white" /> All Users ({users.length})
            </h2>
            {/* Floating particles */}
            <div className="absolute top-2 right-4 w-1 h-1 bg-white/60 rounded-full animate-ping"></div>
            <div className="absolute bottom-2 right-8 w-1 h-1 bg-white/50 rounded-full animate-bounce"></div>
          </div>
        </div>
        
        {users.length === 0 ? (
          <div className="p-12 text-center">
            <FaUsers className="text-6xl mb-4 mx-auto text-white/30" />
            <p className="font-manrope text-white/70 text-lg">No users found</p>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 max-h-96 overflow-y-auto">
              {users.map((u) => (
                <div key={u._id} className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 rounded-xl p-6 hover:from-white/[0.08] hover:to-white/[0.04] transition-all duration-300 shadow-lg hover:scale-105 hover:-translate-y-1">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-manrope font-semibold text-white text-lg mb-1 truncate">{u.name || 'N/A'}</h3>
                      <p className="text-sm text-white/70 font-manrope truncate">{u.email || 'N/A'}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ml-3 ${
                      u.role === 'admin' ? 'bg-red-900/30 text-red-400' :
                      u.role === 'investor' ? 'bg-gray-700 text-gray-300' :
                      'bg-gray-700 text-gray-300'
                    }`}>
                      {u.role || 'N/A'}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 font-manrope">
                      Joined: {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>
                  
                  <div className="flex gap-2 flex-wrap">
                    {["entrepreneur", "investor"].map(
                      (role) =>
                        role !== u.role && (
                          <button
                            key={role}
                            onClick={() => handleChangeRole(u._id, role)}
                            disabled={isLoading}
                            className="px-3 py-1 bg-white text-black rounded-lg text-xs font-manrope hover:bg-gray-200 transition-colors duration-300 disabled:opacity-50"
                          >
                            → {role}
                          </button>
                        )
                    )}
                    <button
                      onClick={() => handleDeleteUser(u._id)}
                      disabled={isLoading}
                      className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-manrope hover:bg-red-700 transition-colors duration-300 disabled:opacity-50 flex items-center gap-1"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const IdeasSection = () => {
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Get unique categories from ideas
    const uniqueCategories = [...new Set(ideas.map(idea => idea.category).filter(Boolean))];
    
    // Filter and sort ideas
    const filteredAndSortedIdeas = ideas
      .filter(idea => {
        const matchesStatus = filterStatus === 'all' || idea.status === filterStatus;
        const matchesCategory = filterCategory === 'all' || idea.category === filterCategory;
        const matchesSearch = !searchTerm || 
          idea.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          idea.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          idea.owner?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesStatus && matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        let aValue, bValue;
        
        switch (sortBy) {
          case 'title':
            aValue = a.title || '';
            bValue = b.title || '';
            break;
          case 'category':
            aValue = a.category || '';
            bValue = b.category || '';
            break;
          case 'status':
            aValue = a.status || '';
            bValue = b.status || '';
            break;
          case 'owner':
            aValue = a.owner?.name || '';
            bValue = b.owner?.name || '';
            break;
          case 'createdAt':
          default:
            aValue = new Date(a.createdAt || 0);
            bValue = new Date(b.createdAt || 0);
            break;
        }
        
        if (sortBy === 'createdAt') {
          return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        } else {
          const comparison = aValue.toString().localeCompare(bValue.toString());
          return sortOrder === 'asc' ? comparison : -comparison;
        }
      });

    const handleSort = (field) => {
      if (sortBy === field) {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
      } else {
        setSortBy(field);
        setSortOrder('asc');
      }
    };

    const getSortIcon = (field) => {
      if (sortBy !== field) return <FaSort className="w-3 h-3 opacity-50" />;
      return sortOrder === 'asc' ? 
        <FaSortUp className="w-3 h-3 text-white" /> : 
        <FaSortDown className="w-3 h-3 text-white" />;
    };

    const resetFilters = () => {
      setSortBy('createdAt');
      setSortOrder('desc');
      setFilterStatus('all');
      setFilterCategory('all');
      setSearchTerm('');
    };

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl">
          <div className="p-6 border-b border-white/10">
            <div className="relative">
              <h2 className="text-2xl font-semibold text-white flex items-center gap-3 mb-6">
                <FaLightbulb className="text-white" /> All Ideas ({filteredAndSortedIdeas.length} of {ideas.length})
              </h2>
              {/* Floating particles */}
              <div className="absolute top-2 right-4 w-1 h-1 bg-white/60 rounded-full animate-ping"></div>
              <div className="absolute bottom-2 right-8 w-1 h-1 bg-white/50 rounded-full animate-bounce"></div>
            </div>

            {/* Search and Filters */}
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search ideas by title, description, or owner..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/[0.05] border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/[0.08] transition-all duration-300"
                />
              </div>

              {/* Filters and Sorting */}
              <div className="flex flex-wrap gap-4 items-center">
                {/* Status Filter */}
                <div className="flex items-center gap-2">
                  <FaFilter className="text-white/70 w-4 h-4" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="enhanced-dropdown px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50 focus:bg-white/[0.12] transition-all duration-300 backdrop-blur-sm hover:bg-white/[0.10] cursor-pointer"
                  >
                    <option value="all" className="bg-gray-800 text-white">All Status</option>
                    <option value="pending" className="bg-gray-800 text-white">Pending</option>
                    <option value="approved" className="bg-gray-800 text-white">Approved</option>
                    <option value="rejected" className="bg-gray-800 text-white">Rejected</option>
                    <option value="analyzed" className="bg-gray-800 text-white">Analyzed</option>
                  </select>
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-2">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="enhanced-dropdown px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50 focus:bg-white/[0.12] transition-all duration-300 backdrop-blur-sm hover:bg-white/[0.10] cursor-pointer"
                  >
                    <option value="all" className="bg-gray-800 text-white">All Categories</option>
                    {uniqueCategories.map(category => (
                      <option key={category} value={category} className="bg-gray-800 text-white">{category}</option>
                    ))}
                  </select>
                </div>

                {/* Sort Options */}
                <div className="flex items-center gap-2">
                  <span className="text-white/70 text-sm font-manrope">Sort by:</span>
                  <div className="flex gap-1">
                    {[
                      { field: 'createdAt', label: 'Date' },
                      { field: 'title', label: 'Title' },
                      { field: 'category', label: 'Category' },
                      { field: 'status', label: 'Status' },
                      { field: 'owner', label: 'Owner' }
                    ].map(({ field, label }) => (
                      <button
                        key={field}
                        onClick={() => handleSort(field)}
                        className={`px-3 py-2 rounded-lg text-sm font-manrope flex items-center gap-1 transition-all duration-300 ${
                          sortBy === field 
                            ? 'bg-white/20 text-white border border-white/30' 
                            : 'bg-white/[0.05] text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                        }`}
                      >
                        {label}
                        {getSortIcon(field)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reset Filters */}
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-white/10 text-white/70 rounded-lg text-sm font-manrope hover:bg-white/20 hover:text-white transition-all duration-300 border border-white/20"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
          
          {filteredAndSortedIdeas.length === 0 ? (
            <div className="p-12 text-center">
              <FaLightbulb className="text-6xl mb-4 mx-auto text-white/30" />
              <p className="font-manrope text-white/70 text-lg">
                {ideas.length === 0 ? 'No ideas found' : 'No ideas match your filters'}
              </p>
              {ideas.length > 0 && (
                <button
                  onClick={resetFilters}
                  className="mt-4 px-6 py-2 bg-white/20 text-white rounded-lg font-manrope hover:bg-white/30 transition-all duration-300"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedIdeas.map((idea) => (
                  <div key={idea._id} className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 rounded-xl p-6 hover:from-white/[0.08] hover:to-white/[0.04] transition-all duration-300 shadow-lg hover:scale-105 hover:-translate-y-1 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-manrope font-semibold text-white text-lg mb-1">{idea.title || 'N/A'}</h3>
                        <p className="text-sm text-white/70 font-manrope">{idea.category || 'N/A'}</p>
                      </div>
                      <span className={
                        idea.status === 'approved' 
                          ? 'px-3 py-1 rounded-full text-xs font-semibold ml-3 bg-gray-700 text-gray-300'
                          : idea.status === 'rejected' 
                            ? 'px-3 py-1 rounded-full text-xs font-semibold ml-3 bg-red-900/30 text-red-400'
                            : 'px-3 py-1 rounded-full text-xs font-semibold ml-3 bg-gray-800 text-gray-400'
                      }>
                        {idea.status || 'pending'}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-300 font-manrope mb-4 line-clamp-3">
                      {idea.description ? idea.description.substring(0, 150) + '...' : 'No description'}
                    </p>
                    
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-xs text-gray-500 font-manrope">
                        By: {idea.owner?.name || 'Unknown'}
                      </p>
                      <p className="text-xs text-gray-500 font-manrope">
                        {idea.createdAt ? new Date(idea.createdAt).toLocaleDateString() : 'Unknown date'}
                      </p>
                    </div>
                    
                    <div className="flex gap-3 mt-auto">
                      <button
                        onClick={() => navigate(`/admin/idea/${idea._id}`)}
                        className="flex-1 px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors duration-300"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleDeleteIdea(idea._id)}
                        disabled={isLoading}
                        className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors duration-300 disabled:opacity-50 flex items-center gap-2"
                      >
                        <FaTrash className="text-sm" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const IdeathonsSection = () => {
    const [showForm, setShowForm] = useState(false);
    const [editingIdeathon, setEditingIdeathon] = useState(null);
    const [viewingIdeathon, setViewingIdeathon] = useState(null);

    // Handle ESC key to close modal
    useEffect(() => {
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          if (showForm) {
            setShowForm(false);
            setEditingIdeathon(null);
          }
          if (viewingIdeathon) {
            setViewingIdeathon(null);
          }
        }
      };

      if (showForm || viewingIdeathon) {
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
      }
    }, [showForm, viewingIdeathon]);

    // Format date helper
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    // Get status color helper
    const getStatusColor = (statusInfo) => {
      switch (statusInfo.color) {
        case 'green': return 'bg-green-500/20 text-green-400 border-green-500/30';
        case 'blue': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        case 'gray': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
            <FaTrophy className="text-white" />
            Ideathon Management
          </h2>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-white text-black rounded-lg font-manrope font-medium hover:bg-gray-200 transition-all duration-300 flex items-center gap-3"
          >
            <FaPlus className="text-sm" />
            Create New Ideathon
          </button>
        </div>

        {/* Create/Edit Modal */}
        {showForm && (
          <div 
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            style={{ 
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowForm(false);
                setEditingIdeathon(null);
              }
            }}
          >
            <div 
              className="relative w-full max-w-2xl max-h-[95vh] overflow-hidden rounded-2xl shadow-2xl animate-scaleIn"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 50%, rgba(255, 255, 255, 0.12) 100%)',
                backdropFilter: 'blur(25px)',
                WebkitBackdropFilter: 'blur(25px)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1)',
              }}
            >
              <div className="overflow-y-auto max-h-[95vh] custom-scrollbar">
                <div className="p-8">
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                      <FaTrophy className="text-white text-xl" />
                      <h3 className="text-2xl font-bold text-white">{editingIdeathon ? 'Edit Ideathon' : 'Create New Ideathon'}</h3>
                    </div>
                    <button
                      onClick={() => {
                        setShowForm(false);
                        setEditingIdeathon(null);
                      }}
                      className="enhanced-button p-3 text-white/70 hover:text-white transition-all duration-300 hover:bg-white/15 rounded-xl backdrop-blur-sm border border-white/10"
                    >
                      <FaTimes className="text-xl" />
                    </button>
                  </div>
                  
                  <IdeathonForm
                onSubmit={async (data) => {
                  const success = editingIdeathon 
                    ? await handleEditIdeathon(editingIdeathon._id, data)
                    : await handleCreateIdeathon(data);
                  if (success) {
                    setShowForm(false);
                    setEditingIdeathon(null);
                  }
                }}
                onCancel={() => {
                  setShowForm(false);
                  setEditingIdeathon(null);
                }}
                isModal={true}
                initialData={editingIdeathon}
              />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Details Modal */}
        {viewingIdeathon && (
          <div 
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            style={{ 
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setViewingIdeathon(null);
              }
            }}
          >
            <div 
              className="relative w-full max-w-2xl max-h-[95vh] overflow-hidden rounded-2xl shadow-2xl animate-scaleIn"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 50%, rgba(255, 255, 255, 0.12) 100%)',
                backdropFilter: 'blur(25px)',
                WebkitBackdropFilter: 'blur(25px)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1)',
              }}
            >
              <div className="overflow-y-auto max-h-[95vh] custom-scrollbar">
                <div className="p-8">
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                      <FaTrophy className="text-white text-xl" />
                      <h3 className="text-2xl font-bold text-white">Ideathon Details</h3>
                    </div>
                    <button
                      onClick={() => setViewingIdeathon(null)}
                      className="enhanced-button p-3 text-white/70 hover:text-white transition-all duration-300 hover:bg-white/15 rounded-xl backdrop-blur-sm border border-white/10"
                    >
                      <FaTimes className="text-xl" />
                    </button>
                  </div>
              
              <div className="space-y-6">
                {/* Header Information */}
                <div className="bg-white/5 border border-white/20 rounded-xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-white mb-2">{viewingIdeathon.title}</h1>
                      {viewingIdeathon.theme && (
                        <p className="text-lg text-white/80 mb-2">
                          <span className="font-semibold">Theme:</span> {viewingIdeathon.theme}
                        </p>
                      )}
                      <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(getIdeathonStatus(viewingIdeathon))}`}>
                        {getIdeathonStatus(viewingIdeathon).label}
                      </span>
                    </div>
                    {viewingIdeathon.fundingPrizes && (
                      <div className="text-right">
                        <p className="text-white/70 text-sm">Prize Pool</p>
                        <p className="text-white font-bold text-lg">{viewingIdeathon.fundingPrizes}</p>
                      </div>
                    )}
                  </div>
                  
                  {viewingIdeathon.description && (
                    <div className="mt-4">
                      <h4 className="text-white font-semibold mb-2">Description</h4>
                      <p className="text-white/80 leading-relaxed">{viewingIdeathon.description}</p>
                    </div>
                  )}
                </div>

                {/* Key Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Dates */}
                  <div className="bg-white/5 border border-white/20 rounded-xl p-6">
                    <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                      <FaCalendarAlt className="text-white/70" />
                      Event Schedule
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-white/70 text-sm">Start Date</p>
                        <p className="text-white font-medium">{formatDate(viewingIdeathon.startDate)}</p>
                      </div>
                      <div>
                        <p className="text-white/70 text-sm">End Date</p>
                        <p className="text-white font-medium">{formatDate(viewingIdeathon.endDate)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Organization */}
                  <div className="bg-white/5 border border-white/20 rounded-xl p-6">
                    <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                      <FaBuilding className="text-white/70" />
                      Organization
                    </h4>
                    <div className="space-y-3">
                      {viewingIdeathon.organizers && (
                        <div>
                          <p className="text-white/70 text-sm">Organizers</p>
                          <p className="text-white font-medium">{viewingIdeathon.organizers}</p>
                        </div>
                      )}
                      {viewingIdeathon.location && (
                        <div>
                          <p className="text-white/70 text-sm">Location</p>
                          <p className="text-white font-medium">{viewingIdeathon.location}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Participation Details */}
                <div className="bg-white/5 border border-white/20 rounded-xl p-6">
                  <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <FaUsers className="text-white/70" />
                    Participation Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {viewingIdeathon.submissionFormat && viewingIdeathon.submissionFormat.length > 0 && (
                      <div>
                        <p className="text-white/70 text-sm mb-2">Submission Format</p>
                        <div className="flex flex-wrap gap-2">
                          {viewingIdeathon.submissionFormat.map((format, index) => (
                            <span key={index} className="px-3 py-1 bg-white/10 text-white text-sm rounded-full">
                              {format}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {viewingIdeathon.eligibilityCriteria && (
                      <div>
                        <p className="text-white/70 text-sm mb-2">Eligibility Criteria</p>
                        <p className="text-white/80">{viewingIdeathon.eligibilityCriteria}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {viewingIdeathon.judgingCriteria && (
                    <div className="bg-white/5 border border-white/20 rounded-xl p-6">
                      <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <FaGavel className="text-white/70" />
                        Judging Criteria
                      </h4>
                      <p className="text-white/80 leading-relaxed">{viewingIdeathon.judgingCriteria}</p>
                    </div>
                  )}
                  {viewingIdeathon.contactInformation && (
                    <div className="bg-white/5 border border-white/20 rounded-xl p-6">
                      <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <FaEnvelope className="text-white/70" />
                        Contact Information
                      </h4>
                      <p className="text-white/80 leading-relaxed">{viewingIdeathon.contactInformation}</p>
                    </div>
                  )}
                </div>

                {/* Created Information */}
                <div className="bg-white/5 border border-white/20 rounded-xl p-4">
                  <p className="text-white/70 text-sm">
                    Created on {formatDate(viewingIdeathon.createdAt)} 
                    {viewingIdeathon.createdBy?.name && ` by ${viewingIdeathon.createdBy.name}`}
                  </p>
                </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-3">
            <FaSearch className="text-white" />
            Search & Filter
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="lg:col-span-2">
              <label className="block text-white/70 text-sm font-manrope mb-2">Search Ideathons</label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                <input
                  type="text"
                  placeholder="Search by title, theme, or organizer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/[0.05] border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/[0.08] transition-all duration-300"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-white/70 text-sm font-manrope mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="enhanced-dropdown w-full px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50 focus:bg-white/[0.12] transition-all duration-300 backdrop-blur-sm hover:bg-white/[0.10] cursor-pointer"
              >
                <option value="all" className="bg-gray-800 text-white">All Status</option>
                {filterOptions.statusOptions.map((status) => (
                  <option key={status} value={status} className="bg-gray-800 text-white">
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-white/70 text-sm font-manrope mb-2">Location</label>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="enhanced-dropdown w-full px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50 focus:bg-white/[0.12] transition-all duration-300 backdrop-blur-sm hover:bg-white/[0.10] cursor-pointer"
              >
                <option value="all" className="bg-gray-800 text-white">All Locations</option>
                {filterOptions.locationOptions.map((location) => (
                  <option key={location} value={location} className="bg-gray-800 text-white">
                    {location}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          {(searchTerm || statusFilter !== 'all' || locationFilter !== 'all' || themeFilter !== 'all') && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setLocationFilter('all');
                  setThemeFilter('all');
                }}
                className="px-4 py-2 bg-white/10 text-white rounded-lg font-manrope font-medium hover:bg-white/20 transition-all duration-300 flex items-center gap-2 border border-white/20"
              >
                <FaTimes className="text-sm" />
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Ideathons Grid */}
        <div className="bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-white flex items-center gap-3">
              <FaTrophy className="text-white" />
              All Ideathons ({ideathons.length})
            </h3>
            
            {/* Pagination Info */}
            {totalPages > 1 && (
              <div className="text-white/70 text-sm">
                Page {currentPage} of {totalPages}
              </div>
            )}
          </div>
          
          {ideathons.length === 0 ? (
            <div className="p-12 text-center">
              <FaTrophy className="text-6xl text-white/30 mx-auto mb-4" />
              <h4 className="font-manrope font-bold text-white text-xl mb-2">No ideathons found</h4>
              <p className="text-white/70 font-manrope">Create your first ideathon to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ideathons.map((ideathon) => {
                const statusInfo = getIdeathonStatus(ideathon);
                return (
                  <div key={ideathon._id} className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 rounded-xl p-6 hover:from-white/[0.08] hover:to-white/[0.04] transition-all duration-300 shadow-lg hover:scale-105 hover:-translate-y-1 flex flex-col h-full">
                    {/* Status Badge */}
                    <div className="flex justify-end mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(statusInfo)}`}>
                        {statusInfo.label}
                      </span>
                    </div>

                    {/* Title and Theme */}
                    <div className="mb-4">
                      <h4 className="font-manrope font-bold text-white text-xl mb-2 line-clamp-2">{ideathon.title}</h4>
                      {ideathon.theme && (
                        <p className="text-white/70 text-sm bg-white/5 px-3 py-1 rounded-lg border border-white/10">
                          <span className="font-medium">Theme:</span> {ideathon.theme}
                        </p>
                      )}
                    </div>

                    {/* Organizers */}
                    {ideathon.organizers && (
                      <div className="mb-4 flex items-center gap-2">
                        <FaBuilding className="text-white/50 text-sm" />
                        <p className="text-white/80 text-sm truncate">{ideathon.organizers}</p>
                      </div>
                    )}

                    {/* Date Range */}
                    <div className="mb-4 space-y-2">
                      <div className="flex items-center gap-2 text-white/70 text-sm">
                        <FaCalendarAlt className="text-white/50" />
                        <span>Start: {formatDate(ideathon.startDate)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/70 text-sm">
                        <FaCalendarAlt className="text-white/50" />
                        <span>End: {formatDate(ideathon.endDate)}</span>
                      </div>
                    </div>

                    {/* Prize Pool */}
                    {ideathon.fundingPrizes && (
                      <div className="mb-4 p-3 bg-white/5 border border-white/10 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <FaTrophy className="text-yellow-400 text-sm" />
                          <span className="text-white/70 text-xs font-semibold uppercase">Prize Pool</span>
                        </div>
                        <p className="text-white font-medium text-sm">{ideathon.fundingPrizes}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-auto pt-4 space-y-3">
                      <button
                        onClick={() => setViewingIdeathon(ideathon)}
                        className="enhanced-button w-full px-4 py-2 bg-gradient-to-r from-white/20 to-white/10 text-white border border-white/20 rounded-lg font-manrope font-medium hover:from-white/30 hover:to-white/20 hover:border-white/30 transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-sm"
                      >
                        <FaEye className="text-sm" />
                        View Details
                      </button>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingIdeathon(ideathon);
                            setShowForm(true);
                          }}
                          disabled={isLoading}
                          className="enhanced-button flex-1 px-3 py-2 bg-gradient-to-r from-blue-500/80 to-blue-600/80 text-white rounded-lg font-manrope font-medium hover:from-blue-400/90 hover:to-blue-500/90 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 text-sm backdrop-blur-sm border border-blue-400/30"
                        >
                          <FaEdit className="text-xs" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteIdeathon(ideathon._id)}
                          disabled={isLoading}
                          className="enhanced-button flex-1 px-3 py-2 bg-gradient-to-r from-red-500/80 to-red-600/80 text-white rounded-lg font-manrope font-medium hover:from-red-400/90 hover:to-red-500/90 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 text-sm backdrop-blur-sm border border-red-400/30"
                        >
                          <FaTrash className="text-xs" /> 
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 bg-white/10 text-white rounded-lg font-manrope font-medium hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <FaArrowLeft className="text-sm" />
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`px-3 py-2 rounded-lg font-manrope font-medium transition-all duration-300 ${
                        currentPage === pageNumber
                          ? 'bg-white text-black'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 bg-white/10 text-white rounded-lg font-manrope font-medium hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Next
                <FaArrowRight className="text-sm" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };



  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <FaSpinner className="animate-spin text-4xl mb-4 mx-auto" />
          <p className="font-manrope">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black flex overflow-hidden">
      {/* Animated background - matching landing page style */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/[0.03] rounded-full animate-pulse blur-xl"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-white/[0.02] rounded-full animate-spin blur-2xl"></div>
        <div className="absolute top-1/2 left-1/6 w-16 h-16 bg-white/[0.04] rounded-full animate-ping blur-lg"></div>
        <div className="absolute bottom-1/4 right-1/3 w-20 h-20 bg-white/[0.02] rounded-full animate-bounce blur-xl"></div>
        <div className="absolute top-1/6 right-1/6 w-12 h-12 bg-white/[0.025] rounded-full animate-pulse blur-lg"></div>
        <div className="absolute bottom-1/3 left-1/3 w-28 h-28 bg-white/[0.015] rounded-full animate-spin blur-2xl"></div>
        <div className="absolute top-2/3 left-1/5 w-8 h-8 bg-white/[0.035] rounded-full animate-ping blur-md"></div>
        <div className="absolute bottom-1/6 right-1/5 w-14 h-14 bg-white/[0.02] rounded-full animate-bounce blur-xl"></div>
      </div>

      {/* Sidebar - Enhanced with lighter theme and wider width */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 min-w-72 max-w-72 h-screen bg-gradient-to-b from-white/[0.15] via-white/[0.08] to-white/[0.12] backdrop-blur-xl border-r border-white/20 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:w-72 lg:min-w-72 lg:max-w-72 lg:h-screen flex flex-col shadow-2xl`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/20 flex-shrink-0 w-full">
          <Link to="/admin/dashboard" className="inline-flex items-center gap-3 text-white/80 hover:text-white transition-colors duration-300 min-w-0">
            <img src={StartSmartIcon} alt="StartSmart Logo" className="w-7 h-7 flex-shrink-0" />
            <span className="font-manrope font-semibold text-lg truncate">StartSmart</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/70 hover:text-white flex-shrink-0"
          >
            <FaTimes />
          </button>
        </div>
        
        <nav className="mt-6 flex-1 overflow-y-auto w-full px-3 custom-scrollbar">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-4 py-4 text-left transition-all duration-300 relative overflow-hidden group rounded-xl mb-2 ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-white/[0.25] to-white/[0.15] text-white border border-white/30 shadow-xl transform scale-105'
                    : 'text-white/80 hover:text-white hover:bg-white/[0.12] hover:translate-x-1 hover:scale-102 hover:shadow-lg'
                }`}
              >
                <Icon className={`text-xl flex-shrink-0 transition-all duration-300 ${
                  activeSection === item.id ? 'text-white scale-110' : 'group-hover:scale-110 group-hover:rotate-6'
                }`} />
                <span className="font-manrope font-medium transition-all duration-300 truncate flex-1 min-w-0 text-base">{item.label}</span>
                {activeSection === item.id && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
                {/* Enhanced hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/20 flex-shrink-0 w-full">
          <button
            onClick={() => logout('/admin/login')}
            className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-gradient-to-r from-red-600/80 to-red-700/80 text-white rounded-xl font-manrope font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <FaSignOutAlt className="text-lg" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-gradient-to-r from-white/[0.08] to-white/[0.04] backdrop-blur-xl border-b border-white/10 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white/70 hover:text-white transition-colors duration-300"
          >
            <FaBars />
          </button>
          <h1 className="font-manrope font-bold text-white">Admin Dashboard</h1>
          <div className="w-6"></div>
        </div>

        {/* Content area */}
        <div className="flex-1 relative z-10 p-6 overflow-y-auto flex justify-center">
          <div className="w-full max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 p-6 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl">
              <div className="relative">
                <h1 className="font-manrope font-bold text-3xl text-white mb-2">
                  {sidebarItems.find(item => item.id === activeSection)?.label || 'Admin Dashboard'}
                </h1>
                <p className="font-manrope text-white/70">
                  Welcome back, {user?.name || "Admin"}
                </p>
                {/* Floating particles */}
                <div className="absolute top-2 right-4 w-1 h-1 bg-white/60 rounded-full animate-ping"></div>
                <div className="absolute bottom-2 right-8 w-1 h-1 bg-white/50 rounded-full animate-bounce"></div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-gradient-to-r from-red-900/30 to-red-800/20 border border-red-500/30 rounded-lg backdrop-blur-sm">
                <p className="text-red-400 text-sm font-manrope">{error}</p>
              </div>
            )}

            {/* Loading indicator */}
            {isLoading && (
              <div className="mb-6 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                <div className="flex items-center justify-center gap-2 text-gray-400 text-sm font-manrope">
                  <FaSpinner className="animate-spin" />
                  Loading data...
                </div>
              </div>
            )}

            {/* Dynamic Content Based on Active Section */}
            {activeSection === 'dashboard' && <DashboardOverview />}
            {activeSection === 'users' && <UsersSection />}
            {activeSection === 'ideas' && <IdeasSection />}
            {activeSection === 'ideathons' && <IdeathonsSection />}
            {activeSection === 'analytics' && <AnalyticsDashboard />}
            {activeSection === 'registration-master' && <IdeathonRegistrationMaster />}
            {activeSection === 'feedback' && <FeedbackFormsSection />}
            {activeSection === 'sustainability' && <SustainabilityScoringSection />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
