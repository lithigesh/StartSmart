import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
} from "react-icons/fa";

const AdminDashboard = () => {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalIdeas: 0,
    totalActivities: 0,
    recentSignups: 0,
  });

  const token = localStorage.getItem("token");
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

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
      setUsers(usersArray);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalUsers: usersArray.length,
        recentSignups: usersArray.filter(u => {
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
      const res = await fetch(`${API_BASE}/api/ideas`, {
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
        fetchActivities(),
      ]);
    }
  }, [user]);

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
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/5 rounded-full animate-pulse blur-xl"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-white/3 rounded-full animate-spin blur-2xl"></div>
        <div className="absolute top-1/2 left-1/6 w-16 h-16 bg-white/4 rounded-full animate-ping blur-lg"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-300 group"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <img src={StartSmartIcon} alt="StartSmart Logo" className="w-6 h-6" />
            </div>
            <span className="font-manrope font-medium group-hover:translate-x-1 transition-transform duration-300">
              Start Smart
            </span>
          </Link>

          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500/80 text-white rounded-lg font-manrope font-medium hover:bg-red-600 transition-all duration-300 flex items-center gap-2"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>

        {/* Dashboard Header */}
        <div className="text-center mb-8">
          <h1 className="font-manrope font-bold text-4xl text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="font-manrope text-white/70 text-lg">
            Welcome back, {user?.name || "Admin"}
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg max-w-4xl mx-auto">
            <p className="text-red-400 text-sm font-manrope text-center">{error}</p>
          </div>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-blue-400 text-sm font-manrope">
              <FaSpinner className="animate-spin" />
              Loading data...
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm font-manrope">Total Users</p>
                <p className="text-white text-2xl font-bold font-manrope">{stats.totalUsers}</p>
              </div>
              <FaUsers className="text-blue-400 text-2xl" />
            </div>
          </div>

          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm font-manrope">Total Ideas</p>
                <p className="text-white text-2xl font-bold font-manrope">{stats.totalIdeas}</p>
              </div>
              <FaLightbulb className="text-yellow-400 text-2xl" />
            </div>
          </div>

          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm font-manrope">Activities</p>
                <p className="text-white text-2xl font-bold font-manrope">{stats.totalActivities}</p>
              </div>
              <FaChartBar className="text-green-400 text-2xl" />
            </div>
          </div>

          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm font-manrope">New Signups</p>
                <p className="text-white text-2xl font-bold font-manrope">{stats.recentSignups}</p>
              </div>
              <FaUserShield className="text-purple-400 text-2xl" />
            </div>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Users Section */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FaUsers /> Manage Users ({users.length})
            </h2>
            
            {users.length === 0 ? (
              <div className="p-6 text-center text-white/60">
                <FaUsers className="text-4xl mb-2 mx-auto opacity-50" />
                <p className="font-manrope">No users found</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {users.slice(0, 10).map((u) => (
                  <div key={u._id} className="bg-white/5 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-manrope font-medium text-white">{u.name || 'N/A'}</h3>
                        <p className="text-sm text-white/60 font-manrope">{u.email || 'N/A'}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-manrope ${
                        u.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                        u.role === 'investor' ? 'bg-green-500/20 text-green-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {u.role || 'N/A'}
                      </span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {["entrepreneur", "investor", "admin"].map(
                        (role) =>
                          role !== u.role && (
                            <button
                              key={role}
                              onClick={() => handleChangeRole(u._id, role)}
                              disabled={isLoading}
                              className="px-2 py-1 bg-blue-500/60 text-white rounded text-xs font-manrope hover:bg-blue-600 transition-colors disabled:opacity-50"
                            >
                              → {role}
                            </button>
                          )
                      )}
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        disabled={isLoading}
                        className="px-2 py-1 bg-red-500/60 text-white rounded text-xs font-manrope hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-1"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                ))}
                {users.length > 10 && (
                  <p className="text-center text-white/50 text-sm font-manrope">
                    And {users.length - 10} more users...
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Ideas Section */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FaLightbulb /> Manage Ideas ({ideas.length})
            </h2>
            
            {ideas.length === 0 ? (
              <div className="p-6 text-center text-white/60">
                <FaLightbulb className="text-4xl mb-2 mx-auto opacity-50" />
                <p className="font-manrope">No ideas found</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {ideas.slice(0, 10).map((idea) => (
                  <div key={idea._id} className="bg-white/5 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-manrope font-medium text-white">{idea.title || 'N/A'}</h3>
                        <p className="text-sm text-white/60 font-manrope">{idea.category || 'N/A'}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-manrope ${
                        idea.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                        idea.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {idea.status || 'pending'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-white/50 font-manrope">
                        By: {idea.author?.name || 'Unknown'}
                      </p>
                      <button
                        onClick={() => handleDeleteIdea(idea._id)}
                        disabled={isLoading}
                        className="px-2 py-1 bg-red-500/60 text-white rounded text-xs font-manrope hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-1"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                ))}
                {ideas.length > 10 && (
                  <p className="text-center text-white/50 text-sm font-manrope">
                    And {ideas.length - 10} more ideas...
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Activities Section */}
        <div className="mt-8 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <FaUserShield /> Recent Admin Activities ({activities.length})
          </h2>
          
          {activities.length === 0 ? (
            <div className="p-6 text-center text-white/60">
              <FaUserShield className="text-4xl mb-2 mx-auto opacity-50" />
              <p className="font-manrope">No activities found</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {activities.slice(0, 15).map((a) => (
                <div
                  key={a._id}
                  className="bg-white/5 p-4 rounded-lg flex justify-between items-center hover:bg-white/10 transition-colors"
                >
                  <div>
                    <p className="font-semibold font-manrope text-white">{a.actionType || 'Unknown Action'}</p>
                    <p className="text-sm text-white/60 font-manrope">{a.details || 'No details available'}</p>
                  </div>
                  <span className="text-xs text-white/50 font-manrope whitespace-nowrap ml-4">
                    {a.createdAt ? new Date(a.createdAt).toLocaleString() : 'Unknown date'}
                  </span>
                </div>
              ))}
              {activities.length > 15 && (
                <p className="text-center text-white/50 text-sm font-manrope">
                  And {activities.length - 15} more activities...
                </p>
              )}
            </div>
          )}
        </div>

        {/* Admin Contact Info */}
        <div className="mt-8 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Admin Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-manrope">
            <div className="bg-white/5 p-4 rounded-lg">
              <p className="text-white/60 mb-1">Current Admin Email:</p>
              <p className="text-white">{user?.email || 'Not specified'}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <p className="text-white/60 mb-1">Support Email:</p>
              <p className="text-white">admin@startsmart.com</p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <p className="text-white/60 mb-1">Last Login:</p>
              <p className="text-white">{new Date().toLocaleString()}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <p className="text-white/60 mb-1">Admin Level:</p>
              <p className="text-white">Super Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
