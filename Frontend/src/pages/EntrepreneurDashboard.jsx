import React from "react";
import DashboardHeader from "../components/entrepreneur/DashboardHeader";
import WelcomeSection from "../components/entrepreneur/WelcomeSection";
import DashboardCardsGrid from "../components/entrepreneur/DashboardCardsGrid";
import MyIdeasSection from "../components/entrepreneur/MyIdeasSection";
import RecentActivitySection from "../components/entrepreneur/RecentActivitySection";

const EntrepreneurDashboard = () => {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <DashboardHeader />

      {/* Main Content */}
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
  );
};

export default EntrepreneurDashboard;
