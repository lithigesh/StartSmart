// pages/entrepreneur/SettingsPage.jsx
import React from "react";
import { FaCog } from "react-icons/fa";

const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            Settings
          </h2>
          <p className="text-white/60">
            Manage your account settings and preferences
          </p>
        </div>
        <div className="text-center py-12">
          <FaCog className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Settings Coming Soon
          </h3>
          <p className="text-white/60">
            Customize your profile, notification preferences, and account settings
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;