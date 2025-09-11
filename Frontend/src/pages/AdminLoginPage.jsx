import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import StartSmartIcon from "/w_startSmart_icon.png";
import {
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSpinner,
  FaUserShield,
  FaSignInAlt,
} from "react-icons/fa";

const AdminLoginPage = () => {
  const { user, isAuthenticated, loading, loadUser } = useAuth();
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    email: "admin@startsmart.com", // Pre-fill for testing
    password: "StartSmart@Admin2025", // Pre-fill for testing
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Redirect if already authenticated as admin
  useEffect(() => {
    if (isAuthenticated && user && user.role === "admin" && !loading) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [isAuthenticated, loading, user, navigate]);

  // Handle admin login
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    console.log("Admin login attempt:", { email: credentials.email, API_BASE });

    try {
      const response = await fetch(`${API_BASE}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      const data = await response.json();
      console.log("Admin login response:", { status: response.status, data });

      if (!response.ok) {
        throw new Error(data.message || "Admin login failed");
      }

      console.log("Admin login successful, storing data and redirecting...");

      // Store authentication data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Update auth context
      if (loadUser) {
        await loadUser();
      }

      // Navigate to admin dashboard immediately
      navigate("/admin/dashboard", { replace: true });
      
    } catch (err) {
      console.error("Admin login error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
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
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-red-500/5 rounded-full animate-pulse blur-xl"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-red-500/3 rounded-full animate-spin blur-2xl"></div>
        <div className="absolute top-1/2 left-1/6 w-16 h-16 bg-red-500/4 rounded-full animate-ping blur-lg"></div>
      </div>

      <div className="w-full max-w-md mx-auto px-4 z-10">
        {/* Back to home link */}
        <div className="mb-8 text-center">
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

        {/* Login form container */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/[0.08] via-white/[0.02] to-red-500/[0.06] rounded-2xl pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUserShield className="text-red-400 text-2xl" />
              </div>
              <h1 className="font-manrope font-bold text-2xl text-white mb-2">
                Admin Access
              </h1>
              <p className="font-manrope text-white/70">
                Enter admin credentials to access the dashboard
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm font-manrope text-center">{error}</p>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-6">
              <div>
                <label className="block text-white/80 text-sm font-manrope mb-2">
                  Admin Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleInputChange}
                  placeholder="admin@startsmart.com"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 font-manrope focus:outline-none focus:border-red-500/50 focus:bg-white/10 transition-all duration-300"
                  required
                  disabled={isLoading}
                />
                <p className="mt-1 text-white/50 text-xs font-manrope">
                  Use the admin email from server configuration
                </p>
              </div>

              <div className="relative">
                <label className="block text-white/80 text-sm font-manrope mb-2">
                  Admin Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  placeholder="Enter admin password"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 font-manrope focus:outline-none focus:border-red-500/50 focus:bg-white/10 transition-all duration-300 pr-12"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-10 text-white/50 hover:text-white/70 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                <p className="mt-1 text-white/50 text-xs font-manrope">
                  Use the admin password from server configuration
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading || !credentials.email.trim() || !credentials.password.trim()}
                className="w-full px-6 py-3 bg-red-500/80 text-white rounded-lg font-manrope font-medium hover:bg-red-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <FaSignInAlt />
                    Access Admin Dashboard
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-white/50 text-sm font-manrope">
                Server-side admin authentication only
              </p>
            </div>

            {/* Link to regular login */}
            <div className="mt-4 text-center">
              <Link
                to="/login"
                className="text-red-400 hover:text-red-300 text-sm font-manrope transition-colors"
              >
                Regular User Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
