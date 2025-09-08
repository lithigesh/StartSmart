import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaBriefcase,
  FaLightbulb,
  FaCheck,
  FaTimes,
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
  const [emailError, setEmailError] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [emailValid, setEmailValid] = useState(null); // null = not validated, true = valid, false = invalid
  const [passwordValid, setPasswordValid] = useState(null); // null = not validated, true = valid, false = invalid
  const [successMessage, setSuccessMessage] = useState("");

  const { register, isAuthenticated, error, clearErrors, user, getRoleDashboardUrl } = useAuth();
  const navigate = useNavigate();

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation function
  const validatePassword = (password) => {
    return password.length >= 6;
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectUrl = getRoleDashboardUrl(user);
      navigate(redirectUrl, { replace: true });
    }
  }, [isAuthenticated, navigate, user]);

  useEffect(() => {
    clearErrors();
    setSuccessMessage(""); // Clear success message when component mounts
    setPasswordError(""); // Clear password errors
    setEmailError(""); // Clear email errors
  }, []); // Remove clearErrors dependency to prevent repeated clearing

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedFormData);

    // Real-time email validation
    if (name === "email") {
      // Clear email error when user starts typing
      if (emailError) {
        setEmailError("");
      }

      if (value.length === 0) {
        setEmailValid(null); // No validation for empty field
      } else if (value.length < 3) {
        setEmailValid(null); // Don't validate too early
      } else {
        setEmailValid(validateEmail(value));
      }
    }

    // Real-time password validation
    if (name === "password") {
      if (value.length === 0) {
        setPasswordValid(null); // No validation for empty field
      } else {
        setPasswordValid(validatePassword(value));
      }
    }

    // Real-time password matching validation
    if (name === "password" || name === "confirmPassword") {
      const newPassword = updatedFormData.password;
      const newConfirmPassword = updatedFormData.confirmPassword;

      // Check if both fields have content
      if (newPassword && newConfirmPassword) {
        if (newPassword === newConfirmPassword) {
          // Passwords match - set positive indicator
          setPasswordsMatch(true);
          // Clear error only if it was a mismatch error (not length error)
          if (passwordError === "Passwords do not match") {
            setPasswordError("");
          }
        } else {
          // Passwords don't match - show error immediately
          setPasswordsMatch(false);
          setPasswordError("Passwords do not match");
        }
      } else {
        // One or both fields empty - reset states
        setPasswordsMatch(false);
        // Don't clear other types of password errors
        if (passwordError === "Passwords do not match") {
          setPasswordError("");
        }
      }
    }
  };

  // Validate passwords when user leaves the confirm password field
  const handleConfirmPasswordBlur = () => {
    if (formData.password && formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        setPasswordError("Passwords do not match");
      } else {
        setPasswordError("");
      }
    } else if (formData.confirmPassword && !formData.password) {
      setPasswordError("Please enter a password first");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setEmailError("");
    setPasswordError("");

    // Validate email format
    if (!validateEmail(formData.email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setSuccessMessage(""); // Clear any previous success message
    clearErrors(); // Clear any previous errors

    try {
      const { confirmPassword, ...submitData } = formData;
      const result = await register(submitData);

      setIsLoading(false);

      if (result.success) {
        // Check if this is actually a duplicate account scenario
        // Some backends might return success=true even for existing accounts
        if (
          result.message &&
          (result.message.toLowerCase().includes("already exists") ||
            result.message.toLowerCase().includes("already registered"))
        ) {
          // This is actually a duplicate account, not a real success
          setSuccessMessage("");
          navigate("/login", {
            replace: true,
            state: {
              error:
                "Account already exists. Please sign in with your credentials.",
              email: formData.email,
            },
          });
          return;
        }

        // Registration was genuinely successful
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
      } else {
        // Registration failed - handle different error cases
        setSuccessMessage("");
        console.log("Registration failed:", result.error);

        // Check both result.error and result.message for duplicate account indicators
        const errorMessage = result.error || result.message || "";
        const isDuplicateAccount =
          errorMessage.toLowerCase().includes("already exists") ||
          errorMessage.toLowerCase().includes("already registered") ||
          errorMessage.toLowerCase().includes("user exists") ||
          errorMessage.toLowerCase().includes("email taken");

        if (isDuplicateAccount) {
          // Account already exists, redirect to login immediately
          navigate("/login", {
            replace: true,
            state: {
              error:
                "Account already exists. Please sign in with your credentials.",
              email: formData.email,
            },
          });
        } else {
          // Other registration errors - show the error message
          // The error will be displayed via the auth context error state
        }
      }
    } catch (err) {
      console.error("Registration error:", err);
      setSuccessMessage("");
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
              Back to Start Smart
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
                Join Start Smart
              </h1>
              <p className="font-manrope text-white/70">
                Create your account and start your journey
              </p>
            </div>

            {/* Error/Success messages */}
            {emailError && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm font-manrope">
                  {emailError}
                </p>
              </div>
            )}

            {passwordError && !emailError && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm font-manrope">
                  {passwordError}
                </p>
              </div>
            )}

            {error && !passwordError && !emailError && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm font-manrope">{error}</p>
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
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/[0.05] border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 transition-all duration-300 font-manrope pr-12 ${
                      emailValid === false
                        ? "border-red-500/50 focus:ring-red-500/30 focus:border-red-500/40"
                        : emailValid === true
                        ? "border-green-500/50 focus:ring-green-500/30 focus:border-green-500/40"
                        : "border-white/20 focus:ring-white/30 focus:border-white/40"
                    }`}
                    placeholder="Enter your email"
                    required
                  />
                  {/* Email validation indicators */}
                  {emailValid !== null && formData.email && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {emailValid ? (
                        <FaCheck className="w-4 h-4 text-green-400" />
                      ) : (
                        <FaTimes className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                  )}
                </div>
                {/* Inline email validation messages */}
                {emailValid === false && formData.email && (
                  <p className="text-red-400 text-xs font-manrope mt-1 flex items-center gap-1">
                    <FaTimes className="w-3 h-3" />
                    Please enter a valid email address
                  </p>
                )}
                {emailValid === true && formData.email && (
                  <p className="text-green-400 text-xs font-manrope mt-1 flex items-center gap-1 animate-fadeIn">
                    <FaCheck className="w-3 h-3" />
                    Valid email format
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-white/90 font-manrope font-medium">
                  Password{" "}
                  <span className="text-white/60 text-sm font-normal">
                    (minimum 6 characters)
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/[0.05] border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 transition-all duration-300 font-manrope pr-12 ${
                      passwordValid === false
                        ? "border-red-500/50 focus:ring-red-500/30 focus:border-red-500/40"
                        : passwordValid === true
                        ? "border-green-500/50 focus:ring-green-500/30 focus:border-green-500/40"
                        : "border-white/20 focus:ring-white/30 focus:border-white/40"
                    }`}
                    placeholder="Create a password"
                    required
                  />
                  {/* Password validation indicators */}
                  {passwordValid !== null && formData.password && (
                    <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                      {passwordValid ? (
                        <FaCheck className="w-4 h-4 text-green-400" />
                      ) : (
                        <FaTimes className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors duration-300"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {/* Inline password validation messages */}
                {passwordValid === false && formData.password && (
                  <p className="text-red-400 text-xs font-manrope mt-1 flex items-center gap-1">
                    <FaTimes className="w-3 h-3" />
                    Password must be at least 6 characters long
                  </p>
                )}
                {passwordValid === true && formData.password && (
                  <p className="text-green-400 text-xs font-manrope mt-1 flex items-center gap-1 animate-fadeIn">
                    <FaCheck className="w-3 h-3" />
                    Password meets requirements
                  </p>
                )}
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
                    onBlur={handleConfirmPasswordBlur}
                    className={`w-full px-4 py-3 bg-white/[0.05] border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 transition-all duration-300 font-manrope pr-12 ${
                      passwordError && passwordError.includes("not match")
                        ? "border-red-500/50 focus:ring-red-500/30"
                        : passwordsMatch &&
                          formData.password &&
                          formData.confirmPassword
                        ? "border-green-500/50 focus:ring-green-500/30 focus:border-green-500/40"
                        : "border-white/20 focus:ring-white/30 focus:border-white/40"
                    }`}
                    placeholder="Confirm your password"
                    required
                  />
                  {/* Success indicator when passwords match */}
                  {passwordsMatch &&
                    formData.password &&
                    formData.confirmPassword && (
                      <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                        <FaCheck className="w-4 h-4 text-green-400" />
                      </div>
                    )}
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors duration-300"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {/* Inline success message when passwords match */}
                {passwordsMatch &&
                  formData.password &&
                  formData.confirmPassword &&
                  !passwordError && (
                    <p className="text-green-400 text-xs font-manrope mt-1 flex items-center gap-1 animate-fadeIn">
                      <FaCheck className="w-3 h-3" />
                      Passwords match
                    </p>
                  )}
                {/* Inline error message for password mismatch */}
                {passwordError && passwordError.includes("not match") && (
                  <p className="text-red-400 text-xs font-manrope mt-1">
                    {passwordError}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || successMessage}
                className="w-full relative overflow-hidden px-6 py-3 rounded-lg font-manrope font-medium text-black transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-white/50 bg-white hover:bg-gray-100 hover:scale-105 hover:shadow-xl disabled:bg-white disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                {/* Subtle shimmer effect on hover only */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent transform translate-x-[-200%] hover:translate-x-[200%] transition-transform duration-1000 ease-out pointer-events-none opacity-0 hover:opacity-100"></div>

                <span className="relative z-10 flex items-center justify-center gap-2">
                  {successMessage ? (
                    <>
                      <div className="w-5 h-5 border-2 border-green-600/30 border-t-green-600 rounded-full animate-spin"></div>
                      Redirecting...
                    </>
                  ) : isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
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
