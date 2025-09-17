import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import StartSmartIcon from "/w_startSmart_icon.png";
import {
  FaUsers,
  FaUserShield,
  FaTrash,
  FaLightbulb,
  FaSignOutAlt,
  FaSpinner,
  FaChartBar,
  FaEdit,
  FaTrophy,
  FaPlus,
  FaTachometerAlt,
  FaBars,
  FaTimes,
  FaCalendarAlt,
  FaListUl,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaFilter,
  FaSearch,
} from "react-icons/fa";

const AdminDashboard = () => {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [users, setUsers] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [activities, setActivities] = useState([]);
  const [ideathons, setIdeathons] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Get section from URL params, default to 'dashboard'
  const urlParams = new URLSearchParams(location.search);
  const initialSection = urlParams.get('section') || 'dashboard';
  const [activeSection, setActiveSection] = useState(initialSection);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalIdeas: 0,
    totalActivities: 0,
    recentSignups: 0,
    totalIdeathons: 0,
  });

  const token = localStorage.getItem("token");
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

  // Sidebar navigation items
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaTachometerAlt },
    { id: 'users', label: 'Manage Users', icon: FaUsers },
    { id: 'ideas', label: 'Manage Ideas', icon: FaLightbulb },
    { id: 'ideathons', label: 'Ideathons', icon: FaTrophy },
    { id: 'activities', label: 'Activities', icon: FaUserShield },
  ];

  // Helper function to get ideathon status
  const getIdeathonStatus = (ideathon) => {
    const now = new Date();
    const startDate = new Date(ideathon.startDate);
    const endDate = new Date(ideathon.endDate);
    
    if (now < startDate) {
      return { status: 'upcoming', label: 'Upcoming', color: 'gray' };
    } else if (now >= startDate && now <= endDate) {
      return { status: 'active', label: 'Active', color: 'green' };
    } else {
      return { status: 'expired', label: 'Expired', color: 'red' };
    }
  };

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

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

  // Fetch ideathons with better error handling
  const fetchIdeathons = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/api/ideathons`, {
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
        await fetchActivities();
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

  // Fetch activities with better error handling
  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/api/admin/activities`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error(`Failed to load activities: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      const activitiesArray = Array.isArray(data) ? data : [];
      setActivities(activitiesArray);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalActivities: activitiesArray.length,
      }));
    } catch (err) {
      setError(`Error loading activities: ${err.message}`);
      console.error("Fetch activities error:", err);
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
      await fetchActivities();
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
      await fetchActivities();
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
      await fetchActivities();
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
        fetchActivities(),
      ]);
    }
  }, [user]);

  // Ideathon form component
  const IdeathonForm = ({ onSubmit, onCancel, isModal = false, initialData = null }) => {
    const [formData, setFormData] = useState({
      title: initialData?.title || '',
      theme: initialData?.theme || '',
      fundingPrizes: initialData?.fundingPrizes || '',
      startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().slice(0, 16) : '',
      endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().slice(0, 16) : ''
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
          endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().slice(0, 16) : ''
        });
      }
    }, [initialData]);

    const validateForm = () => {
      const errors = {};
      
      if (!formData.title.trim()) {
        errors.title = 'Title is required';
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
        setFormData({ title: '', theme: '', fundingPrizes: '', startDate: '', endDate: '' });
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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

        <div className="bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:from-white/[0.12] hover:to-white/[0.08] transition-all duration-300 group shadow-xl animate-fade-in-up delay-400 hover:scale-105 hover:-translate-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm font-manrope font-medium">Activities</p>
              <p className="text-white text-2xl font-bold font-manrope group-hover:scale-110 transition-transform duration-300">{stats.totalActivities}</p>
            </div>
            <div className="p-3 bg-white/10 rounded-lg group-hover:bg-white/20 transition-all duration-300">
              <FaChartBar className="text-white text-2xl" />
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
                    className="px-3 py-2 bg-white/[0.05] border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40 focus:bg-white/[0.08] transition-all duration-300"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="analyzed">Analyzed</option>
                  </select>
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-2">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-2 bg-white/[0.05] border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40 focus:bg-white/[0.08] transition-all duration-300"
                  >
                    <option value="all">All Categories</option>
                    {uniqueCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
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

    // Handle ESC key to close modal
    useEffect(() => {
      const handleEscape = (e) => {
        if (e.key === 'Escape' && showForm) {
          setShowForm(false);
          setEditingIdeathon(null);
        }
      };

      if (showForm) {
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
      }
    }, [showForm]);

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

        {/* Modal Overlay */}
        {showForm && (
          <div 
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowForm(false);
                setEditingIdeathon(null);
              }
            }}
          >
            <div className="bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <FaTrophy className="text-white" />
                  <h3 className="text-2xl font-bold text-white">{editingIdeathon ? 'Edit Ideathon' : 'Create New Ideathon'}</h3>
                </div>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingIdeathon(null);
                  }}
                  className="p-2 text-white/70 hover:text-white transition-colors hover:bg-white/10 rounded-lg"
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
        )}

        <div className="bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
            <FaTrophy className="text-white" />
            All Ideathons ({ideathons.length})
          </h3>
          
          {ideathons.length === 0 ? (
            <div className="p-12 text-center">
              <FaTrophy className="text-6xl text-white/30 mx-auto mb-4" />
              <h4 className="font-manrope font-bold text-white text-xl mb-2">No ideathons found</h4>
              <p className="text-white/70 font-manrope">Create your first ideathon to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {ideathons.map((ideathon) => {
                const statusInfo = getIdeathonStatus(ideathon);
                return (
                  <div key={ideathon._id} className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 rounded-xl p-6 hover:from-white/[0.08] hover:to-white/[0.04] transition-all duration-300 shadow-lg">
                    {/* Header with title and status */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-manrope font-bold text-white text-lg">{ideathon.title}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                            statusInfo.color === 'green' ? 'bg-gray-700 text-gray-300' :
                            statusInfo.color === 'gray' ? 'bg-gray-700 text-gray-300' :
                            'bg-red-900/30 text-red-400'
                          }`}>
                            {statusInfo.label}
                          </span>
                        </div>
                        {ideathon.theme && (
                          <p className="text-gray-400 text-sm font-manrope mb-3 bg-gray-800/50 px-3 py-1 rounded">
                            <span className="font-medium">Theme:</span> {ideathon.theme}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingIdeathon(ideathon);
                            setShowForm(true);
                          }}
                          disabled={isLoading}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg font-manrope font-medium hover:bg-gray-700 transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
                        >
                          <FaEdit />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteIdeathon(ideathon._id)}
                          disabled={isLoading}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg font-manrope font-medium hover:bg-red-700 transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
                        >
                          <FaTrash /> 
                          Delete
                        </button>
                      </div>
                    </div>
                    
                    {/* Date information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-3 text-gray-300 bg-gray-800/50 p-3 rounded border border-gray-700">
                        <FaCalendarAlt className="text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase">Start Date</p>
                          <p className="text-sm font-manrope font-semibold">{new Date(ideathon.startDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-gray-300 bg-gray-800/50 p-3 rounded border border-gray-700">
                        <FaCalendarAlt className="text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase">End Date</p>
                          <p className="text-sm font-manrope font-semibold">{new Date(ideathon.endDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Funding prizes */}
                    {ideathon.fundingPrizes && (
                      <div className="mb-4 p-4 bg-gray-800/50 border border-gray-700 rounded">
                        <div className="flex items-center gap-2 mb-2">
                          <FaTrophy className="text-gray-400 text-sm" />
                          <p className="text-xs text-gray-400 font-bold uppercase">Prize Pool</p>
                        </div>
                        <p className="text-white font-manrope font-medium">{ideathon.fundingPrizes}</p>
                      </div>
                    )}

                    {/* Created date */}
                    <div className="pt-4 border-t border-gray-700">
                      <p className="text-xs text-gray-500 font-manrope">
                        <span className="font-medium">Created:</span> {ideathon.createdAt ? new Date(ideathon.createdAt).toLocaleDateString() : 'Unknown'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  const ActivitiesSection = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl">
        <div className="p-6 border-b border-white/10">
          <div className="relative">
            <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
              <FaUserShield className="text-white" /> Recent Admin Activities ({activities.length})
            </h2>
            {/* Floating particles */}
            <div className="absolute top-2 right-4 w-1 h-1 bg-white/60 rounded-full animate-ping"></div>
            <div className="absolute bottom-2 right-8 w-1 h-1 bg-white/50 rounded-full animate-bounce"></div>
          </div>
        </div>
        
        {activities.length === 0 ? (
          <div className="p-12 text-center">
            <FaUserShield className="text-6xl mb-4 mx-auto text-white/30" />
            <p className="font-manrope text-white/70 text-lg">No activities found</p>
          </div>
        ) : (
          <div className="p-6">
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {activities.map((a) => (
                <div
                  key={a._id}
                  className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 rounded-xl p-4 hover:from-white/[0.08] hover:to-white/[0.04] transition-all duration-300 shadow-lg hover:scale-105 hover:-translate-y-1 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold font-manrope text-white">{a.actionType || 'Unknown Action'}</p>
                    <p className="text-sm text-white/70 font-manrope">{a.details || 'No details available'}</p>
                  </div>
                  <span className="text-xs text-white/60 font-manrope whitespace-nowrap ml-4">
                    {a.createdAt ? new Date(a.createdAt).toLocaleString() : 'Unknown date'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

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

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 min-w-64 max-w-64 h-screen bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-white/[0.06] backdrop-blur-xl border-r border-white/10 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:w-64 lg:min-w-64 lg:max-w-64 lg:h-screen flex flex-col`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/10 flex-shrink-0 w-full">
          <Link to="/admin/dashboard" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-300 min-w-0">
            <img src={StartSmartIcon} alt="StartSmart Logo" className="w-6 h-6 flex-shrink-0" />
            <span className="font-manrope font-medium truncate">Start Smart</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/70 hover:text-white flex-shrink-0"
          >
            <FaTimes />
          </button>
        </div>
        
        <nav className="mt-4 flex-1 overflow-y-auto w-full">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-300 relative overflow-hidden group ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-white/[0.15] to-white/[0.08] text-white border-r-2 border-white shadow-lg transform scale-105'
                    : 'text-white/70 hover:text-white hover:bg-white/[0.08] hover:translate-x-2 hover:scale-102'
                }`}
              >
                <Icon className={`text-lg flex-shrink-0 transition-all duration-300 ${
                  activeSection === item.id ? 'text-white scale-110' : 'group-hover:scale-110'
                }`} />
                <span className="font-manrope transition-all duration-300 truncate flex-1 min-w-0">{item.label}</span>
                {activeSection === item.id && (
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-white rounded-l animate-pulse"></div>
                )}
                {/* Hover effect shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 flex-shrink-0 w-full">
          <button
            onClick={() => logout('/admin/login')}
            className="w-full flex items-center gap-3 px-4 py-3 bg-red-600 text-white rounded-lg font-manrope font-medium hover:bg-red-700 transition-all duration-300"
          >
            <FaSignOutAlt />
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
        <div className="flex-1 relative z-10 p-6 overflow-y-auto">
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
          {activeSection === 'activities' && <ActivitiesSection />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
