import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaBriefcase,
  FaLightbulb,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import StartSmartIcon from "/w_startSmart_icon.png";

const RegisterPage = () => {
  const location = useLocation();
  const preSelectedRole = location.state?.role || "";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: preSelectedRole,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { register, isAuthenticated, error, clearErrors } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    clearErrors();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === "password" || e.target.name === "confirmPassword") {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const { confirmPassword, ...submitData } = formData;
      await register(submitData);

      // Show success message
      setSuccessMessage(
        "Account created successfully! Redirecting to login..."
      );

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate("/login", {
          replace: true,
          state: {
            message:
              "Account created successfully! Please sign in with your credentials.",
            email: formData.email,
          },
        });
      }, 2000);
    } catch (err) {
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    {
      value: "entrepreneur",
      label: "Entrepreneur",
      icon: <FaLightbulb />,
      description: "I have innovative ideas to share",
    },
    {
      value: "investor",
      label: "Investor",
      icon: <FaBriefcase />,
      description: "I want to invest in promising startups",
    },
  ];

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden py-8">
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
      <div className="w-full max-w-lg mx-auto px-4 z-10">
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
              Back to StartSmart
            </span>
          </Link>
        </div>

        {/* Register Form Card */}
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
                Join StartSmart
              </h1>
              <p className="font-manrope text-white/70">
                Create your account and start your journey
              </p>
              {preSelectedRole && (
                <div className="mt-4 px-4 py-2 bg-white/10 border border-white/20 rounded-lg">
                  <p className="text-white/80 text-sm font-manrope capitalize">
                    Signing up as {preSelectedRole}
                  </p>
                </div>
              )}
            </div>

            {/* Error/Success messages */}
            {(error || passwordError) && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm font-manrope">
                  {error || passwordError}
                </p>
              </div>
            )}

            {successMessage && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-green-400 text-sm font-manrope">
                  {successMessage}
                </p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="block text-white/90 font-manrope font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/[0.05] border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300 font-manrope"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-white/90 font-manrope font-medium">
                  Email Address
                </label>
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

              {/* Role Selection */}
              <div className="space-y-3">
                <label className="block text-white/90 font-manrope font-medium">
                  I am a...
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {roles.map((role) => (
                    <div
                      key={role.value}
                      className={`relative cursor-pointer transition-all duration-300 ${
                        formData.role === role.value
                          ? "scale-105"
                          : "hover:scale-102"
                      }`}
                      onClick={() =>
                        setFormData({ ...formData, role: role.value })
                      }
                    >
                      <input
                        type="radio"
                        name="role"
                        value={role.value}
                        checked={formData.role === role.value}
                        onChange={handleChange}
                        className="sr-only"
                        required
                      />
                      <div
                        className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                          formData.role === role.value
                            ? "border-white/40 bg-white/[0.08]"
                            : "border-white/20 bg-white/[0.03] hover:border-white/30 hover:bg-white/[0.05]"
                        }`}
                      >
                        <div className="flex flex-col items-center text-center space-y-2">
                          <div
                            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-300 ${
                              formData.role === role.value
                                ? "bg-white/20 text-white"
                                : "bg-white/10 text-white/70"
                            }`}
                          >
                            {role.icon}
                          </div>
                          <div>
                            <h3
                              className={`font-manrope font-medium transition-colors duration-300 ${
                                formData.role === role.value
                                  ? "text-white"
                                  : "text-white/80"
                              }`}
                            >
                              {role.label}
                            </h3>
                            <p
                              className={`text-xs font-manrope transition-colors duration-300 ${
                                formData.role === role.value
                                  ? "text-white/80"
                                  : "text-white/60"
                              }`}
                            >
                              {role.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
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
                    placeholder="Create a password"
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

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label className="block text-white/90 font-manrope font-medium">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/[0.05] border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300 font-manrope pr-12"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors duration-300"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || successMessage}
                className="w-full relative overflow-hidden btn btn-lg rounded-lg bg-white text-black hover:bg-gray-100 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl group focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>

                <span className="relative z-10 font-manrope font-medium flex items-center justify-center gap-2">
                  {successMessage ? (
                    <>
                      <div className="w-5 h-5 border-2 border-green-600/30 border-t-green-600 rounded-full animate-spin"></div>
                      Redirecting...
                    </>
                  ) : isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <FaArrowRight className="w-4 h-4 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-white/70 font-manrope">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-white hover:text-white/80 font-medium transition-colors duration-300 underline underline-offset-4 hover:underline-offset-2"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
