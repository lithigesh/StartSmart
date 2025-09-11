import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaArrowRight,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import StartSmartIcon from "/w_startSmart_icon.png";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated, loading, error, clearErrors, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const successMessage = location.state?.message;
  const errorMessage = location.state?.error;
  const preFilledEmail = location.state?.email;

  // Clear errors on component mount
  useEffect(() => {
    clearErrors();
    if (preFilledEmail) {
      setFormData((prev) => ({ ...prev, email: preFilledEmail }));
    }
  }, [preFilledEmail, clearErrors]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user && !loading) {
      const dashboardUrl = user.role === "admin" ? "/admin/dashboard" 
                         : user.role === "investor" ? "/investor/dashboard" 
                         : "/entrepreneur/dashboard";
      navigate(dashboardUrl, { replace: true });
    }
  }, [isAuthenticated, user, loading, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(formData);
      
      if (result && result.success) {
        console.log("Login successful, redirecting to:", result.redirectUrl);
        // Direct navigation after successful login
        navigate(result.redirectUrl, { replace: true });
      }
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/5 rounded-full animate-pulse blur-xl"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-white/3 rounded-full animate-spin blur-2xl"></div>
        <div className="absolute top-1/2 left-1/6 w-16 h-16 bg-white/4 rounded-full animate-ping blur-lg"></div>

        {/* Moving particles */}
        <div className="absolute top-16 left-16 w-1 h-1 bg-white/60 rounded-full animate-bounce"></div>
        <div className="absolute top-32 right-24 w-0.5 h-0.5 bg-white/40 rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 left-32 w-1.5 h-1.5 bg-white/30 rounded-full animate-ping"></div>
        <div className="absolute bottom-16 right-16 w-1 h-1 bg-white/50 rounded-full animate-bounce"></div>
      </div>

      {/* Main content */}
      <div className="w-full max-w-md mx-auto px-4 z-10">
        {/* Back to home link */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-300 group"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <img
                src={StartSmartIcon}
                alt="StartSmart Logo"
                className="w-6 h-6"
              />
            </div>
            <span className="font-manrope font-medium group-hover:translate-x-1 transition-transform duration-300">
              Back to Start Smart
            </span>
          </Link>
        </div>

        {/* Login Form Card */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/20 relative overflow-hidden">
          {/* Glassmorphism overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>

          {/* Floating particles inside card */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-4 right-4 w-1 h-1 bg-white/40 rounded-full animate-ping"></div>
            <div className="absolute top-8 left-6 w-0.5 h-0.5 bg-white/30 rounded-full animate-pulse"></div>
            <div className="absolute bottom-6 right-8 w-1 h-1 bg-white/35 rounded-full animate-bounce"></div>
          </div>

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="font-manrope font-bold text-3xl text-white mb-2">
                Welcome Back
              </h1>
              <p className="font-manrope text-white/70">
                Sign in to access your Start Smart account
              </p>
            </div>

            {/* Success message */}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-green-400 text-sm font-manrope">
                  {successMessage}
                </p>
              </div>
            )}

            {/* Error message from navigation state */}
            {errorMessage && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm font-manrope">{errorMessage}</p>
              </div>
            )}

            {/* Error message from auth context */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm font-manrope">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-white/90 font-manrope font-medium">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/[0.05] border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300 font-manrope"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-white/90 font-manrope font-medium">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/[0.05] border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300 font-manrope pr-12"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors duration-300"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full relative overflow-hidden px-6 py-3 rounded-lg font-manrope font-medium text-black transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-white/50 bg-white hover:bg-gray-100 hover:scale-105 hover:shadow-xl disabled:bg-white disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                {/* Subtle shimmer effect on hover only */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent transform translate-x-[-200%] hover:translate-x-[200%] transition-transform duration-1000 ease-out pointer-events-none opacity-0 hover:opacity-100"></div>

                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In
                      <FaArrowRight className="w-4 h-4 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center space-y-3">
              <p className="text-white/70 font-manrope">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-white hover:text-white/80 font-medium transition-colors duration-300 underline underline-offset-4 hover:underline-offset-2"
                >
                  Sign up here
                </Link>
              </p>
              
              {/* Admin Login Link */}
              <div className="pt-2 border-t border-white/10">
                <p className="text-white/50 text-sm font-manrope">
                  Admin access?{" "}
                  <Link
                    to="/admin/login"
                    className="text-red-400 hover:text-red-300 font-medium transition-colors duration-300"
                  >
                    Admin Portal
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
