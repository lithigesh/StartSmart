import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  FaUser,
  FaBell,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSave,
  FaEdit,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

const SettingsSection = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState({
    profile: false,
    notifications: false,
    security: false,
  });

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    emailNotifications: true,
    pushNotifications: true,
    investmentAlerts: true,
    weeklyDigest: false,
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = (section) => {
    // Here you would typically make an API call to save the settings
    console.log(`Saving ${section} settings:`, formData);
    setIsEditing((prev) => ({
      ...prev,
      [section]: false,
    }));
    // Show success message
  };

  const handleCancel = (section) => {
    // Reset form data to original values
    setFormData((prev) => ({
      ...prev,
      name: user?.name || "",
      email: user?.email || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
    setIsEditing((prev) => ({
      ...prev,
      [section]: false,
    }));
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

      {/* Profile Settings */}
      <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
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
          {!isEditing.profile ? (
            <button
              onClick={() =>
                setIsEditing((prev) => ({ ...prev, profile: true }))
              }
              className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg transition-colors duration-300 font-manrope"
            >
              <FaEdit className="w-4 h-4" />
              Edit
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSave("profile")}
                className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg transition-colors duration-300 font-manrope"
              >
                <FaCheck className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={() => handleCancel("profile")}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors duration-300 font-manrope"
              >
                <FaTimes className="w-4 h-4" />
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2 font-manrope">
              Full Name
            </label>
            {isEditing.profile ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-manrope"
              />
            ) : (
              <p className="text-white bg-white/[0.03] px-4 py-3 rounded-lg font-manrope">
                {formData.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2 font-manrope">
              Email Address
            </label>
            {isEditing.profile ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-manrope"
              />
            ) : (
              <p className="text-white bg-white/[0.03] px-4 py-3 rounded-lg font-manrope">
                {formData.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2 font-manrope">
              Phone Number
            </label>
            {isEditing.profile ? (
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Enter phone number"
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-manrope"
              />
            ) : (
              <p className="text-white bg-white/[0.03] px-4 py-3 rounded-lg font-manrope">
                {formData.phone || "Not provided"}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-white/80 text-sm font-medium mb-2 font-manrope">
              Bio
            </label>
            {isEditing.profile ? (
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Tell us about yourself and your investment interests"
                rows={3}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none font-manrope"
              />
            ) : (
              <p className="text-white bg-white/[0.03] px-4 py-3 rounded-lg min-h-[80px] font-manrope">
                {formData.bio || "No bio provided"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
            <FaBell className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg font-manrope">
              Notification Preferences
            </h3>
            <p className="text-white/60 text-sm font-manrope">
              Customize how you receive notifications
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            {
              key: "emailNotifications",
              label: "Email Notifications",
              description: "Receive notifications via email",
            },
            {
              key: "pushNotifications",
              label: "Push Notifications",
              description: "Receive real-time push notifications",
            },
            {
              key: "investmentAlerts",
              label: "Investment Alerts",
              description: "Get notified about new investment opportunities",
            },
            {
              key: "weeklyDigest",
              label: "Weekly Digest",
              description: "Receive a weekly summary of activities",
            },
          ].map((setting) => (
            <div
              key={setting.key}
              className="flex items-center justify-between p-4 bg-white/[0.03] rounded-lg hover:bg-white/[0.05] transition-all duration-300"
            >
              <div>
                <h4 className="text-white font-medium font-manrope">
                  {setting.label}
                </h4>
                <p className="text-white/60 text-sm font-manrope">
                  {setting.description}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData[setting.key]}
                  onChange={(e) =>
                    handleInputChange(setting.key, e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <FaLock className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg font-manrope">
                Security Settings
              </h3>
              <p className="text-white/60 text-sm font-manrope">
                Manage your password and security preferences
              </p>
            </div>
          </div>
          {!isEditing.security ? (
            <button
              onClick={() =>
                setIsEditing((prev) => ({ ...prev, security: true }))
              }
              className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg transition-colors duration-300 font-manrope"
            >
              <FaEdit className="w-4 h-4" />
              Change Password
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSave("security")}
                className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg transition-colors duration-300 font-manrope"
              >
                <FaCheck className="w-4 h-4" />
                Update
              </button>
              <button
                onClick={() => handleCancel("security")}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 rounded-lg transition-colors duration-300 font-manrope"
              >
                <FaTimes className="w-4 h-4" />
                Cancel
              </button>
            </div>
          )}
        </div>

        {isEditing.security && (
          <div className="space-y-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2 font-manrope">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={(e) =>
                    handleInputChange("currentPassword", e.target.value)
                  }
                  placeholder="Enter current password"
                  className="w-full px-4 py-3 pr-12 bg-white/[0.03] border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-manrope"
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
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2 font-manrope">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) =>
                    handleInputChange("newPassword", e.target.value)
                  }
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 pr-12 bg-white/[0.03] border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-manrope"
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
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2 font-manrope">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 pr-12 bg-white/[0.03] border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-manrope"
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsSection;
