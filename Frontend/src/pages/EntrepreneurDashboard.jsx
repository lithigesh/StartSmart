import React, { useState } from "react";
import DashboardHeader from "../components/entrepreneur/DashboardHeader";
import SideBar from "../components/entrepreneur/SideBar";
import WelcomeSection from "../components/entrepreneur/WelcomeSection";
import DashboardCardsGrid from "../components/entrepreneur/DashboardCardsGrid";
import MyIdeasSection from "../components/entrepreneur/MyIdeasSection";
import RecentActivitySection from "../components/entrepreneur/RecentActivitySection";

const EntrepreneurDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <SideBar 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <DashboardHeader />

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Welcome Section */}
            <WelcomeSection />

            {/* Dashboard Cards Grid */}
            <DashboardCardsGrid />

            {/* My Ideas Section */}
            <MyIdeasSection />

            {/* Recent Activity Section */}
            <RecentActivitySection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntrepreneurDashboard;
