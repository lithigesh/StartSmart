import React, { useState, useEffect } from "react";
import { userAPI, notificationAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../hooks/useNotifications";
import { 
  FaUser, 
  FaBell,
  FaShield,
  FaGlobe,
  FaSave,
  FaEdit,
  FaCamera,
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaTimes,
  FaTrash,
  FaKey,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBuilding,
  FaLinkedin,
  FaGithub,
  FaTwitter,
  FaGlobe as FaWebsite
} from "react-icons/fa";
import EmptyState from "../components/EmptyState";
import ErrorBoundary from "../components/ErrorBoundary";

const SettingsPage = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  
  // State management
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  
  // Profile settings
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    location: "",
    company: "",
    title: "",
    website: "",
    linkedin: "",
    github: "",
    twitter: "",
    profileImage: ""
  });
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    weeklyDigest: true,
    ideaUpdates: true,
    fundingAlerts: true,
    mentorshipRequests: true,
    systemUpdates: true,
    securityAlerts: true
  });
  
  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public", // public, private, connections
    showEmail: false,
    showPhone: false,
    showLocation: true,
    allowMessaging: true,
    allowConnections: true,
    showOnlineStatus: true
  });
  
  // Password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    loadSettingsData();
  }, []);

  const loadSettingsData = async () => {
    try {
      setLoading(true);
      
      // Load user profile and settings
      const [profileResponse, notificationResponse, privacyResponse] = await Promise.all([
        userAPI.getProfile().catch(() => ({ data: user || {} })),
        notificationAPI?.getSettings().catch(() => ({ data: {} })),
        userAPI.getPrivacySettings().catch(() => ({ data: {} }))
      ]);
      
      // Set profile data from user context or API
      const profile = profileResponse.data || user || {};
      setProfileData({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        bio: profile.bio || "",
        location: profile.location || "",
        company: profile.company || "",
        title: profile.title || "",
        website: profile.website || "",
        linkedin: profile.social?.linkedin || "",
        github: profile.social?.github || "",
        twitter: profile.social?.twitter || "",
        profileImage: profile.profileImage || ""
      });
      
      // Set notification settings
      const notifications = notificationResponse.data || {};
      setNotificationSettings(prev => ({ ...prev, ...notifications }));
      
      // Set privacy settings
      const privacy = privacyResponse.data || {};
      setPrivacySettings(prev => ({ ...prev, ...privacy }));
      
    } catch (err) {
      console.error("Error loading settings:", err);
      addNotification("Failed to load some settings", "warning");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    setUnsavedChanges(true);
  };

  const handleNotificationChange = (setting, value) => {
    setNotificationSettings(prev => ({ ...prev, [setting]: value }));
    setUnsavedChanges(true);
  };

  const handlePrivacyChange = (setting, value) => {
    setPrivacySettings(prev => ({ ...prev, [setting]: value }));
    setUnsavedChanges(true);
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      
      const updateData = {
        ...profileData,
        social: {
          linkedin: profileData.linkedin,
          github: profileData.github,
          twitter: profileData.twitter
        }
      };
      
      const response = await userAPI.updateProfile(updateData);
      
      // Profile updated successfully
      // Note: User context will be updated on next page refresh
      
      setUnsavedChanges(false);
      addNotification("Profile updated successfully!", "success");
    } catch (err) {
      console.error("Error updating profile:", err);
      addNotification(err.message || "Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      setLoading(true);
      
      await notificationAPI.updateSettings(notificationSettings);
      
      setUnsavedChanges(false);
      addNotification("Notification settings updated!", "success");
    } catch (err) {
      console.error("Error updating notifications:", err);
      addNotification("Failed to update notification settings", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePrivacy = async () => {
    try {
      setLoading(true);
      
      await userAPI.updatePrivacySettings(privacySettings);
      
      setUnsavedChanges(false);
      addNotification("Privacy settings updated!", "success");
    } catch (err) {
      console.error("Error updating privacy settings:", err);
      addNotification("Failed to update privacy settings", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addNotification("New passwords don't match", "error");
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      addNotification("Password must be at least 8 characters", "error");
      return;
    }
    
    try {
      setLoading(true);
      
      await userAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      
      addNotification("Password changed successfully!", "success");
    } catch (err) {
      console.error("Error changing password:", err);
      addNotification(err.message || "Failed to change password", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('profileImage', file);
      
      const response = await userAPI.uploadProfileImage(formData);
      
      setProfileData(prev => ({ ...prev, profileImage: response.data.profileImage }));
      // Note: User context will be updated on next page refresh
      
      addNotification("Profile image updated!", "success");
    } catch (err) {
      console.error("Error uploading image:", err);
      addNotification("Failed to upload image", "error");
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: FaUser },
    { id: "notifications", label: "Notifications", icon: FaBell },
    { id: "privacy", label: "Privacy", icon: FaShield },
    { id: "security", label: "Security", icon: FaKey }
  ];

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <div className="border-b border-gray-800 bg-black/50 backdrop-blur-xl sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Settings
                </h1>
                <p className="text-gray-400 mt-1">
                  Manage your account preferences and security settings
                </p>
              </div>
              {unsavedChanges && (
                <div className="flex items-center gap-2 px-4 py-2 bg-yellow-600/20 border border-yellow-600/30 rounded-lg">
                  <FaEdit className="text-yellow-400" />
                  <span className="text-yellow-400 text-sm">Unsaved changes</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 backdrop-blur-sm sticky top-32">
                <nav className="space-y-2">
                  {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                          activeTab === tab.id
                            ? "bg-blue-600/20 text-blue-400 border border-blue-600/30"
                            : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                        }`}
                      >
                        <Icon className="text-lg" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
                {/* Profile Tab */}
                {activeTab === "profile" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-semibold text-white">Profile Information</h2>
                      <button
                        onClick={handleSaveProfile}
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-600/30 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        <FaSave className="text-sm" />
                        {loading ? "Saving..." : "Save Changes"}
                      </button>
                    </div>

                    {/* Profile Image */}
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <img
                          src={profileData.profileImage || `https://ui-avatars.com/api/?name=${profileData.name}&background=1f2937&color=ffffff&size=128`}
                          alt="Profile"
                          className="w-32 h-32 rounded-full object-cover border-4 border-gray-700"
                        />
                        <label className="absolute bottom-2 right-2 p-2 bg-blue-600 hover:bg-blue-700 rounded-full cursor-pointer transition-colors">
                          <FaCamera className="text-white" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0])}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">{profileData.name}</h3>
                        <p className="text-gray-400">{profileData.email}</p>
                        <p className="text-blue-400">{profileData.title} {profileData.company && `at ${profileData.company}`}</p>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Full Name</label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => handleProfileChange("name", e.target.value)}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Email</label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => handleProfileChange("email", e.target.value)}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Phone</label>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => handleProfileChange("phone", e.target.value)}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Location</label>
                        <input
                          type="text"
                          value={profileData.location}
                          onChange={(e) => handleProfileChange("location", e.target.value)}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Job Title</label>
                        <input
                          type="text"
                          value={profileData.title}
                          onChange={(e) => handleProfileChange("title", e.target.value)}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Company</label>
                        <input
                          type="text"
                          value={profileData.company}
                          onChange={(e) => handleProfileChange("company", e.target.value)}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Bio</label>
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => handleProfileChange("bio", e.target.value)}
                        rows={4}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    {/* Social Links */}
                    <div>
                      <h3 className="text-lg font-medium text-white mb-4">Social Links</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-400 text-sm mb-2">Website</label>
                          <div className="relative">
                            <FaWebsite className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                              type="url"
                              value={profileData.website}
                              onChange={(e) => handleProfileChange("website", e.target.value)}
                              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                              placeholder="https://yourwebsite.com"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-gray-400 text-sm mb-2">LinkedIn</label>
                          <div className="relative">
                            <FaLinkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                              type="url"
                              value={profileData.linkedin}
                              onChange={(e) => handleProfileChange("linkedin", e.target.value)}
                              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                              placeholder="https://linkedin.com/in/username"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-gray-400 text-sm mb-2">GitHub</label>
                          <div className="relative">
                            <FaGithub className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                              type="url"
                              value={profileData.github}
                              onChange={(e) => handleProfileChange("github", e.target.value)}
                              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                              placeholder="https://github.com/username"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-gray-400 text-sm mb-2">Twitter</label>
                          <div className="relative">
                            <FaTwitter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                              type="url"
                              value={profileData.twitter}
                              onChange={(e) => handleProfileChange("twitter", e.target.value)}
                              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                              placeholder="https://twitter.com/username"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === "notifications" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-semibold text-white">Notification Preferences</h2>
                      <button
                        onClick={handleSaveNotifications}
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-600/30 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        <FaSave className="text-sm" />
                        {loading ? "Saving..." : "Save Changes"}
                      </button>
                    </div>

                    <div className="space-y-6">
                      {/* General Notifications */}
                      <div>
                        <h3 className="text-lg font-medium text-white mb-4">General</h3>
                        <div className="space-y-4">
                          {[
                            { key: "emailNotifications", label: "Email Notifications", description: "Receive notifications via email" },
                            { key: "pushNotifications", label: "Push Notifications", description: "Receive browser push notifications" },
                            { key: "weeklyDigest", label: "Weekly Digest", description: "Weekly summary of your activity" }
                          ].map(setting => (
                            <div key={setting.key} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                              <div>
                                <p className="text-white font-medium">{setting.label}</p>
                                <p className="text-gray-400 text-sm">{setting.description}</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={notificationSettings[setting.key]}
                                  onChange={(e) => handleNotificationChange(setting.key, e.target.checked)}
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Activity Notifications */}
                      <div>
                        <h3 className="text-lg font-medium text-white mb-4">Activity</h3>
                        <div className="space-y-4">
                          {[
                            { key: "ideaUpdates", label: "Idea Updates", description: "New comments and interactions on your ideas" },
                            { key: "fundingAlerts", label: "Funding Alerts", description: "Updates on your funding requests" },
                            { key: "mentorshipRequests", label: "Mentorship Requests", description: "New mentorship connections and messages" }
                          ].map(setting => (
                            <div key={setting.key} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                              <div>
                                <p className="text-white font-medium">{setting.label}</p>
                                <p className="text-gray-400 text-sm">{setting.description}</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={notificationSettings[setting.key]}
                                  onChange={(e) => handleNotificationChange(setting.key, e.target.checked)}
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* System Notifications */}
                      <div>
                        <h3 className="text-lg font-medium text-white mb-4">System</h3>
                        <div className="space-y-4">
                          {[
                            { key: "systemUpdates", label: "System Updates", description: "Platform updates and new features" },
                            { key: "securityAlerts", label: "Security Alerts", description: "Important security notifications" },
                            { key: "marketingEmails", label: "Marketing Emails", description: "News and promotional content" }
                          ].map(setting => (
                            <div key={setting.key} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                              <div>
                                <p className="text-white font-medium">{setting.label}</p>
                                <p className="text-gray-400 text-sm">{setting.description}</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={notificationSettings[setting.key]}
                                  onChange={(e) => handleNotificationChange(setting.key, e.target.checked)}
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Privacy Tab */}
                {activeTab === "privacy" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-semibold text-white">Privacy Settings</h2>
                      <button
                        onClick={handleSavePrivacy}
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-600/30 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        <FaSave className="text-sm" />
                        {loading ? "Saving..." : "Save Changes"}
                      </button>
                    </div>

                    <div className="space-y-6">
                      {/* Profile Visibility */}
                      <div>
                        <h3 className="text-lg font-medium text-white mb-4">Profile Visibility</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-gray-400 text-sm mb-2">Who can see your profile?</label>
                            <select
                              value={privacySettings.profileVisibility}
                              onChange={(e) => handlePrivacyChange("profileVisibility", e.target.value)}
                              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                            >
                              <option value="public">Everyone</option>
                              <option value="connections">Connections Only</option>
                              <option value="private">Private</option>
                            </select>
                          </div>
                          
                          {[
                            { key: "showEmail", label: "Show Email Address", description: "Display email on your public profile" },
                            { key: "showPhone", label: "Show Phone Number", description: "Display phone number on your profile" },
                            { key: "showLocation", label: "Show Location", description: "Display your location information" },
                            { key: "showOnlineStatus", label: "Show Online Status", description: "Let others see when you're online" }
                          ].map(setting => (
                            <div key={setting.key} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                              <div>
                                <p className="text-white font-medium">{setting.label}</p>
                                <p className="text-gray-400 text-sm">{setting.description}</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={privacySettings[setting.key]}
                                  onChange={(e) => handlePrivacyChange(setting.key, e.target.checked)}
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Communication Settings */}
                      <div>
                        <h3 className="text-lg font-medium text-white mb-4">Communication</h3>
                        <div className="space-y-4">
                          {[
                            { key: "allowMessaging", label: "Allow Direct Messages", description: "Let other users send you messages" },
                            { key: "allowConnections", label: "Allow Connection Requests", description: "Let others send you connection requests" }
                          ].map(setting => (
                            <div key={setting.key} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                              <div>
                                <p className="text-white font-medium">{setting.label}</p>
                                <p className="text-gray-400 text-sm">{setting.description}</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={privacySettings[setting.key]}
                                  onChange={(e) => handlePrivacyChange(setting.key, e.target.checked)}
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === "security" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-white">Security Settings</h2>

                    {/* Change Password */}
                    <div className="bg-gray-800/50 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-white mb-4">Change Password</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-gray-400 text-sm mb-2">Current Password</label>
                          <div className="relative">
                            <input
                              type={showPasswords.current ? "text" : "password"}
                              value={passwordData.currentPassword}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pr-12 text-white focus:border-blue-500 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                              {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-gray-400 text-sm mb-2">New Password</label>
                          <div className="relative">
                            <input
                              type={showPasswords.new ? "text" : "password"}
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pr-12 text-white focus:border-blue-500 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                              {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-gray-400 text-sm mb-2">Confirm New Password</label>
                          <div className="relative">
                            <input
                              type={showPasswords.confirm ? "text" : "password"}
                              value={passwordData.confirmPassword}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pr-12 text-white focus:border-blue-500 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                              {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                            </button>
                          </div>
                        </div>
                        
                        <button
                          onClick={handleChangePassword}
                          disabled={loading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                          className="px-6 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-600/30 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                          <FaKey className="text-sm" />
                          {loading ? "Changing..." : "Change Password"}
                        </button>
                      </div>
                    </div>

                    {/* Account Actions */}
                    <div className="bg-gray-800/50 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-white mb-4">Account Actions</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-yellow-600/10 border border-yellow-600/30 rounded-lg">
                          <div>
                            <p className="text-white font-medium">Download Your Data</p>
                            <p className="text-gray-400 text-sm">Export all your account data</p>
                          </div>
                          <button className="px-4 py-2 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 border border-yellow-600/30 rounded-lg transition-colors">
                            Download
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-red-600/10 border border-red-600/30 rounded-lg">
                          <div>
                            <p className="text-white font-medium">Delete Account</p>
                            <p className="text-gray-400 text-sm">Permanently delete your account and all data</p>
                          </div>
                          <button className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30 rounded-lg transition-colors flex items-center gap-2">
                            <FaTrash className="text-sm" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default SettingsPage;