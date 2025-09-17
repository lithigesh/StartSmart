import React from "react";
import { FaCog, FaUser, FaBell, FaLock, FaGlobe, FaToggleOn, FaToggleOff } from "react-icons/fa";
import SideBar from "../../components/entrepreneur/SideBar";
import DashboardHeader from "../../components/entrepreneur/DashboardHeader";

const SettingsPage = () => {
  return (
    <div className="min-h-screen bg-black flex">
      <SideBar />
      
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
              <p className="text-white/60">Manage your account preferences and privacy settings</p>
            </div>

            <div className="space-y-6">
              {/* Profile Settings */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <FaUser className="text-blue-400" />
                  Profile Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Full Name</label>
                    <input type="text" defaultValue="John Entrepreneur" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white" />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Email</label>
                    <input type="email" defaultValue="john@startup.com" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white" />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Bio</label>
                    <textarea rows="3" placeholder="Tell us about yourself..." className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white"></textarea>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <FaBell className="text-yellow-400" />
                  Notification Preferences
                </h3>
                <div className="space-y-4">
                  {[
                    { label: "Email notifications for new investor interest", enabled: true },
                    { label: "Push notifications for funding updates", enabled: true },
                    { label: "Weekly analytics summary", enabled: false },
                    { label: "Ideathon and event notifications", enabled: true }
                  ].map((setting, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-white">{setting.label}</span>
                      {setting.enabled ? (
                        <FaToggleOn className="text-green-400 text-2xl cursor-pointer" />
                      ) : (
                        <FaToggleOff className="text-white/40 text-2xl cursor-pointer" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <FaLock className="text-red-400" />
                  Privacy & Security
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Make profile visible to investors</span>
                    <FaToggleOn className="text-green-400 text-2xl cursor-pointer" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Allow direct messages from investors</span>
                    <FaToggleOn className="text-green-400 text-2xl cursor-pointer" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Show idea statistics publicly</span>
                    <FaToggleOff className="text-white/40 text-2xl cursor-pointer" />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">
                  Save Changes
                </button>
                <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-medium">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;