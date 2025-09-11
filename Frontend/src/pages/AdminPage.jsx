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
} from "react-icons/fa";

const AdminPage = () => {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const API_BASE = "http://localhost:5001/api/admin";

  // Redirect if not admin
  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "admin")) {
      navigate("/");
    }
  }, [isAuthenticated, loading, user, navigate]);

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch ideas (reuse public endpoint /api/ideas if needed)
  const fetchIdeas = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/ideas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load ideas");
      const data = await res.json();
      setIdeas(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch activities
  const fetchActivities = async () => {
    try {
      const res = await fetch(`${API_BASE}/activities`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load activities");
      const data = await res.json();
      setActivities(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Change role
  const handleChangeRole = async (id, newRole) => {
    try {
      await fetch(`${API_BASE}/users/${id}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      fetchUsers();
      fetchActivities();
    } catch {
      setError("Error changing role");
    }
  };

  // Delete user
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await fetch(`${API_BASE}/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
      fetchActivities();
    } catch {
      setError("Error deleting user");
    }
  };

  // Delete idea
  const handleDeleteIdea = async (id) => {
    if (!window.confirm("Are you sure you want to delete this idea?")) return;
    try {
      await fetch(`${API_BASE}/ideas/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setIdeas((prev) => prev.filter((idea) => idea._id !== id));
      fetchActivities();
    } catch {
      setError("Error deleting idea");
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchUsers();
      fetchIdeas();
      fetchActivities();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Animated background (copied from LoginPage) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/5 rounded-full animate-pulse blur-xl"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-white/3 rounded-full animate-spin blur-2xl"></div>
        <div className="absolute top-1/2 left-1/6 w-16 h-16 bg-white/4 rounded-full animate-ping blur-lg"></div>
      </div>

      {/* Main content */}
      <div className="w-full max-w-6xl mx-auto px-4 z-10">
        {/* Back to home link */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-300 group"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <img src={StartSmartIcon} alt="StartSmart Logo" className="w-6 h-6" />
            </div>
            <span className="font-manrope font-medium group-hover:translate-x-1 transition-transform duration-300">
              Back to Start Smart
            </span>
          </Link>
        </div>

        {/* Admin Dashboard Card */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="font-manrope font-bold text-3xl text-white mb-2">
                Admin Dashboard
              </h1>
              <p className="font-manrope text-white/70">
                Welcome, {user?.name || "Admin"}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm font-manrope">{error}</p>
              </div>
            )}

            {/* Users Section */}
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FaUsers /> Manage Users
            </h2>
            <div className="overflow-x-auto mb-8">
              <table className="min-w-full text-left text-white/80">
                <thead>
                  <tr className="text-white/60">
                    <th className="p-2">Name</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Role</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-b border-white/10">
                      <td className="p-2">{u.name}</td>
                      <td className="p-2">{u.email}</td>
                      <td className="p-2">{u.role}</td>
                      <td className="p-2 flex gap-2">
                        {["entrepreneur", "investor", "admin"].map(
                          (role) =>
                            role !== u.role && (
                              <button
                                key={role}
                                onClick={() => handleChangeRole(u._id, role)}
                                className="px-3 py-1 bg-blue-500/80 rounded hover:bg-blue-600"
                              >
                                Make {role}
                              </button>
                            )
                        )}
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="px-3 py-1 bg-red-500/80 rounded hover:bg-red-600 flex items-center gap-1"
                        >
                          <FaTrash /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Ideas Section */}
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FaLightbulb /> Manage Ideas
            </h2>
            <div className="overflow-x-auto mb-8">
              <table className="min-w-full text-left text-white/80">
                <thead>
                  <tr className="text-white/60">
                    <th className="p-2">Title</th>
                    <th className="p-2">Category</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ideas.map((idea) => (
                    <tr key={idea._id} className="border-b border-white/10">
                      <td className="p-2">{idea.title}</td>
                      <td className="p-2">{idea.category}</td>
                      <td className="p-2">{idea.status}</td>
                      <td className="p-2">
                        <button
                          onClick={() => handleDeleteIdea(idea._id)}
                          className="px-3 py-1 bg-red-500/80 rounded hover:bg-red-600 flex items-center gap-1"
                        >
                          <FaTrash /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Activities Section */}
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FaUserShield /> Admin Activities
            </h2>
            <ul className="space-y-3">
              {activities.map((a) => (
                <li
                  key={a._id}
                  className="bg-white/5 p-4 rounded-lg flex justify-between"
                >
                  <div>
                    <p className="font-semibold">{a.actionType}</p>
                    <p className="text-sm text-gray-400">{a.details}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(a.createdAt).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>

            {/* Logout */}
            <div className="mt-8 text-center">
              <button
                onClick={logout}
                className="px-6 py-3 bg-red-500/80 text-white rounded-lg font-manrope font-medium hover:bg-red-600 transition"
              >
                <FaSignOutAlt className="inline-block mr-2" /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
