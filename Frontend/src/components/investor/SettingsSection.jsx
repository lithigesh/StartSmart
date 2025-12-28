import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../hooks/useNotifications";
import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSave,
  FaEdit,
  FaCheck,
  FaTimes,
  FaInfoCircle,
} from "react-icons/fa";

const SettingsSection = () => {
  const { user, updateUser } = useAuth();
  const { addNotification } = useNotifications();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");

    // Validation
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsUpdatingProfile(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/update-profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      // Update user in context
      updateUser(data.user);

      setSuccess("Profile updated successfully!");
      addNotification({
        type: "success",
        message: "Profile updated successfully",
      });

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setErrors({ general: error.message });
      addNotification({
        type: "error",
        message: error.message || "Failed to update profile",
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");

    // Validation
    const newErrors = {};
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }
    if (!passwordData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }
    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (passwordData.currentPassword === passwordData.newPassword) {
      newErrors.newPassword =
        "New password must be different from current password";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsUpdatingPassword(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/update-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update password");
      }

      setSuccess("Password updated successfully!");
      addNotification({
        type: "success",
        message: "Password updated successfully",
      });

      // Clear password fields
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setErrors({ password: error.message });
      addNotification({
        type: "error",
        message: error.message || "Failed to update password",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2 font-manrope">
          Account Settings
        </h2>
        <p className="text-white/60 font-manrope">
          Manage your account preferences and security settings
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-500/20 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg flex items-center gap-2">
          <FaCheck className="w-5 h-5" />
          <span>{success}</span>
        </div>
      )}

      {/* General Error Message */}
      {errors.general && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg flex items-center gap-2">
          <FaInfoCircle className="w-5 h-5" />
          <span>{errors.general}</span>
        </div>
      )}

      {/* Account Information */}
      <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <FaInfoCircle className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg font-manrope">
              Account Information
            </h3>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white/60 text-sm mb-1 font-manrope">
              Account Type
            </label>
            <p className="text-white font-medium font-manrope capitalize">
              {user?.role || "N/A"}
            </p>
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-1 font-manrope">
              Member Since
            </label>
            <p className="text-white font-medium font-manrope">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Profile Settings */}
      <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <FaUser className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg font-manrope">
              Profile Information
            </h3>
            <p className="text-white/60 text-sm font-manrope">
              Update your personal information
            </p>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2 font-manrope">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={`w-full px-4 py-3 bg-white/[0.03] border ${
                errors.name ? "border-red-500" : "border-white/20"
              } rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-manrope`}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2 font-manrope">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={`w-full px-4 py-3 bg-white/[0.03] border ${
                errors.email ? "border-red-500" : "border-white/20"
              } rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-manrope`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isUpdatingProfile}
            className="w-full bg-green-500/20 text-green-400 hover:bg-green-500/30 disabled:bg-gray-500/20 disabled:text-gray-400 disabled:cursor-not-allowed px-4 py-3 rounded-lg transition-colors duration-300 font-manrope font-medium flex items-center justify-center gap-2"
          >
            {isUpdatingProfile ? (
              <>
                <div className="w-5 h-5 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                Updating...
              </>
            ) : (
              <>
                <FaSave className="w-4 h-4" />
                Update Profile
              </>
            )}
          </button>
        </form>
      </div>

      {/* Security Settings */}
      <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
            <FaLock className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg font-manrope">
              Change Password
            </h3>
            <p className="text-white/60 text-sm font-manrope">
              Update your password to keep your account secure
            </p>
          </div>
        </div>

        {/* Password Error Message */}
        {errors.password && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg flex items-center gap-2 mb-4">
            <FaInfoCircle className="w-5 h-5" />
            <span>{errors.password}</span>
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2 font-manrope">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) =>
                  handlePasswordChange("currentPassword", e.target.value)
                }
                className={`w-full px-4 py-3 pr-12 bg-white/[0.03] border ${
                  errors.currentPassword ? "border-red-500" : "border-white/20"
                } rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-manrope`}
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords((prev) => ({
                    ...prev,
                    current: !prev.current,
                  }))
                }
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60"
              >
                {showPasswords.current ? (
                  <FaEyeSlash className="w-4 h-4" />
                ) : (
                  <FaEye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-red-400 text-sm mt-1">
                {errors.currentPassword}
              </p>
            )}
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2 font-manrope">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) =>
                  handlePasswordChange("newPassword", e.target.value)
                }
                className={`w-full px-4 py-3 pr-12 bg-white/[0.03] border ${
                  errors.newPassword ? "border-red-500" : "border-white/20"
                } rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-manrope`}
                placeholder="Enter new password (min 6 characters)"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
                }
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60"
              >
                {showPasswords.new ? (
                  <FaEyeSlash className="w-4 h-4" />
                ) : (
                  <FaEye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-red-400 text-sm mt-1">{errors.newPassword}</p>
            )}
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2 font-manrope">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  handlePasswordChange("confirmPassword", e.target.value)
                }
                className={`w-full px-4 py-3 pr-12 bg-white/[0.03] border ${
                  errors.confirmPassword ? "border-red-500" : "border-white/20"
                } rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-manrope`}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords((prev) => ({
                    ...prev,
                    confirm: !prev.confirm,
                  }))
                }
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60"
              >
                {showPasswords.confirm ? (
                  <FaEyeSlash className="w-4 h-4" />
                ) : (
                  <FaEye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isUpdatingPassword}
            className="w-full bg-green-500/20 text-green-400 hover:bg-green-500/30 disabled:bg-gray-500/20 disabled:text-gray-400 disabled:cursor-not-allowed px-4 py-3 rounded-lg transition-colors duration-300 font-manrope font-medium flex items-center justify-center gap-2"
          >
            {isUpdatingPassword ? (
              <>
                <div className="w-5 h-5 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                Updating...
              </>
            ) : (
              <>
                <FaLock className="w-4 h-4" />
                Update Password
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsSection;
