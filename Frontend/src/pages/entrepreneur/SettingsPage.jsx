// pages/entrepreneur/SettingsPage.jsx
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../hooks/useNotifications";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaSave,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaUserCircle,
  FaCalendar,
} from "react-icons/fa";

const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const { addNotification } = useNotifications();

  const [profileData, setProfileData] = useState({
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

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");

    if (!profileData.name.trim()) {
      setProfileError("Name is required");
      return;
    }

    if (!profileData.email.trim()) {
      setProfileError("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileData.email)) {
      setProfileError("Please enter a valid email address");
      return;
    }

    setIsUpdatingProfile(true);

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:5001"
        }/api/auth/update-profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            name: profileData.name,
            email: profileData.email,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setProfileSuccess("Profile updated successfully!");
        updateUser(data.user);
        addNotification("Profile updated successfully", "success");
        setTimeout(() => setProfileSuccess(""), 3000);
      } else {
        setProfileError(data.message || "Failed to update profile");
      }
    } catch (error) {
      setProfileError("An error occurred. Please try again.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!passwordData.currentPassword) {
      setPasswordError("Current password is required");
      return;
    }

    if (!passwordData.newPassword) {
      setPasswordError("New password is required");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      setPasswordError("New password must be different from current password");
      return;
    }

    setIsUpdatingPassword(true);

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:5001"
        }/api/auth/update-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setPasswordSuccess("Password updated successfully!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        addNotification("Password updated successfully", "success");
        setTimeout(() => setPasswordSuccess(""), 3000);
      } else {
        setPasswordError(data.message || "Failed to update password");
      }
    } catch (error) {
      setPasswordError("An error occurred. Please try again.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Section */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 relative overflow-hidden animate-fade-in">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white font-manrope mb-2">
            Account Settings
          </h1>
          <p className="text-sm sm:text-base text-white/60 font-manrope">
            Manage your account information and security settings
          </p>
        </div>
      </div>

      {/* Account Information Card */}
      <div
        className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 relative overflow-hidden animate-slide-up"
        style={{ animationDelay: "100ms" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white/20/20 flex items-center justify-center flex-shrink-0">
              <FaInfoCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white/90" />
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white font-manrope">
              Account Information
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-white/[0.02] rounded-lg p-3 sm:p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <FaUserCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white/60" />
                <span className="text-white/60 text-xs sm:text-sm font-manrope">
                  Account Type
                </span>
              </div>
              <p className="text-white font-medium font-manrope capitalize">
                {user?.role}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Information Card */}
      <div
        className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 relative overflow-hidden animate-slide-up"
        style={{ animationDelay: "200ms" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white/10/20 flex items-center justify-center flex-shrink-0">
              <FaUser className="w-4 h-4 sm:w-5 sm:h-5 text-white/90" />
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white font-manrope">
              Profile Information
            </h2>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-3 sm:space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-white/80 font-medium mb-2 font-manrope text-xs sm:text-sm">
                Full Name
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-white/40 w-3 h-3 sm:w-4 sm:h-4" />
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-3 bg-white/[0.03] border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent font-manrope transition-all duration-300"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-white/80 font-medium mb-2 font-manrope text-sm">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-3 bg-white/[0.03] border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent font-manrope transition-all duration-300"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            {/* Error/Success Messages */}
            {profileError && (
              <div className="flex items-center gap-2 p-4 bg-white/10 border border-white/30 rounded-lg text-white/80 text-sm font-manrope animate-shake">
                <FaExclamationTriangle className="w-5 h-5 flex-shrink-0" />
                <span>{profileError}</span>
              </div>
            )}

            {profileSuccess && (
              <div className="flex items-center gap-2 p-4 bg-white/10/10 border border-white/30 rounded-lg text-white/90 text-sm font-manrope animate-fade-in">
                <FaCheckCircle className="w-5 h-5 flex-shrink-0" />
                <span>{profileSuccess}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white/10/20 hover:bg-white/10/30 disabled:bg-gray-500/20 disabled:cursor-not-allowed text-white/90 disabled:text-gray-400 rounded-lg transition-all duration-300 font-medium font-manrope group hover:scale-105 transform"
            >
              {isUpdatingProfile ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </>
              ) : (
                <>
                  <FaSave className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Change Password Card */}
      <div
        className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 relative overflow-hidden animate-slide-up"
        style={{ animationDelay: "300ms" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-white/20/20 flex items-center justify-center">
              <FaLock className="w-5 h-5 text-white/90" />
            </div>
            <h2 className="text-2xl font-bold text-white font-manrope">
              Change Password
            </h2>
          </div>

          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-white/80 font-medium mb-2 font-manrope text-sm">
                Current Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
                <input
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-full pl-12 pr-12 py-3 bg-white/[0.03] border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent font-manrope transition-all duration-300"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords({
                      ...showPasswords,
                      current: !showPasswords.current,
                    })
                  }
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                >
                  {showPasswords.current ? (
                    <FaEyeSlash className="w-4 h-4" />
                  ) : (
                    <FaEye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-white/80 font-medium mb-2 font-manrope text-sm">
                New Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
                <input
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full pl-12 pr-12 py-3 bg-white/[0.03] border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent font-manrope transition-all duration-300"
                  placeholder="Enter new password (min. 6 characters)"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords({
                      ...showPasswords,
                      new: !showPasswords.new,
                    })
                  }
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                >
                  {showPasswords.new ? (
                    <FaEyeSlash className="w-4 h-4" />
                  ) : (
                    <FaEye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-white/80 font-medium mb-2 font-manrope text-sm">
                Confirm New Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full pl-12 pr-12 py-3 bg-white/[0.03] border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent font-manrope transition-all duration-300"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords({
                      ...showPasswords,
                      confirm: !showPasswords.confirm,
                    })
                  }
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                >
                  {showPasswords.confirm ? (
                    <FaEyeSlash className="w-4 h-4" />
                  ) : (
                    <FaEye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error/Success Messages */}
            {passwordError && (
              <div className="flex items-center gap-2 p-4 bg-white/10 border border-white/30 rounded-lg text-white/80 text-sm font-manrope animate-shake">
                <FaExclamationTriangle className="w-5 h-5 flex-shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            {passwordSuccess && (
              <div className="flex items-center gap-2 p-4 bg-white/10/10 border border-white/30 rounded-lg text-white/90 text-sm font-manrope animate-fade-in">
                <FaCheckCircle className="w-5 h-5 flex-shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isUpdatingPassword}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white/20/20 hover:bg-white/20/30 disabled:bg-gray-500/20 disabled:cursor-not-allowed text-white/90 disabled:text-gray-400 rounded-lg transition-all duration-300 font-medium font-manrope group hover:scale-105 transform"
            >
              {isUpdatingPassword ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/50 border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </>
              ) : (
                <>
                  <FaLock className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Update Password
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
