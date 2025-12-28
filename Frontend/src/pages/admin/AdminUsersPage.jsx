import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaTrash, FaSpinner, FaEdit } from "react-icons/fa";

const AdminUsersPage = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    recentSignups: 0,
  });

  const token = localStorage.getItem("token");
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

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
        throw new Error(
          `Failed to load users: ${res.status} ${res.statusText}`
        );
      }
      const data = await res.json();
      const usersArray = Array.isArray(data) ? data : [];
      // Filter out admin users from display
      const nonAdminUsers = usersArray.filter((user) => user.role !== "admin");
      setUsers(nonAdminUsers);

      // Update stats
      setStats((prev) => ({
        ...prev,
        totalUsers: nonAdminUsers.length,
        recentSignups: nonAdminUsers.filter((u) => {
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

  // Change role with confirmation
  const handleChangeRole = async (id, newRole) => {
    if (
      !window.confirm(
        `Are you sure you want to change this user's role to ${newRole}?`
      )
    ) {
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
        throw new Error(
          `Failed to change role: ${res.status} ${res.statusText}`
        );
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
    const user = users.find((u) => u._id === id);
    if (
      !window.confirm(
        `Are you sure you want to delete user "${
          user?.name || "Unknown"
        }"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error(
          `Failed to delete user: ${res.status} ${res.statusText}`
        );
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

  useEffect(() => {
    if (user?.role === "admin") {
      fetchUsers();
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
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-gradient-to-r from-white/30 to-white/20 border border-white/30 rounded-lg backdrop-blur-sm">
          <p className="text-white/80 text-sm font-manrope">{error}</p>
        </div>
      )}

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
                <div
                  key={u._id}
                  className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 rounded-xl p-6 hover:from-white/[0.08] hover:to-white/[0.04] transition-all duration-300 shadow-lg hover:scale-105 hover:-translate-y-1"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-manrope font-semibold text-white text-lg mb-1 truncate">
                        {u.name || "N/A"}
                      </h3>
                      <p className="text-sm text-white/70 font-manrope truncate">
                        {u.email || "N/A"}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ml-3 ${
                        u.role === "admin"
                          ? "bg-white/30 text-white/80"
                          : u.role === "investor"
                          ? "bg-gray-700 text-gray-300"
                          : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {u.role || "N/A"}
                    </span>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-gray-500 font-manrope">
                      Joined:{" "}
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString()
                        : "Unknown"}
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
                      className="px-3 py-1 bg-white/20 text-white rounded-lg text-xs font-manrope hover:bg-white/30 transition-colors duration-300 disabled:opacity-50 flex items-center gap-1"
                    >
                      <FaTrash className="text-red-400" /> Delete
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

export default AdminUsersPage;
