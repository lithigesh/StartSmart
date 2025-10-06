// pages/entrepreneur/EntrepreneurLayout.jsx
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import DashboardHeader from "../../components/entrepreneur/DashboardHeader";
import SideBar from "../../components/entrepreneur/SideBar";

const EntrepreneurLayout = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    typeof window !== "undefined" ? window.innerWidth < 1024 : false
  );

  const handleSectionChange = (section) => {
    setActiveSection(section);
    // Navigate to the appropriate route based on section
    const routeMap = {
      overview: '/entrepreneur',
      'my-ideas': '/entrepreneur/my-ideas',
      funding: '/entrepreneur/funding',
      investors: '/entrepreneur/investors',
      analytics: '/entrepreneur/analytics',
      ideathons: '/entrepreneur/ideathons',
      collaborations: '/entrepreneur/collaborations',
      notifications: '/entrepreneur/notifications',
      feedback: '/entrepreneur/feedback',
      settings: '/entrepreneur/settings'
    };
    
    if (routeMap[section]) {
      window.location.href = routeMap[section];
    }
  };

  // Update active section based on current path
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/entrepreneur' || path === '/entrepreneur/dashboard') {
      setActiveSection('overview');
    } else if (path.includes('/my-ideas')) {
      setActiveSection('my-ideas');
    } else if (path.includes('/funding')) {
      setActiveSection('funding');
    } else if (path.includes('/investors')) {
      setActiveSection('investors');
    } else if (path.includes('/analytics')) {
      setActiveSection('analytics');
    } else if (path.includes('/ideathons')) {
      setActiveSection('ideathons');
    } else if (path.includes('/collaborations')) {
      setActiveSection('collaborations');
    } else if (path.includes('/notifications')) {
      setActiveSection('notifications');
    } else if (path.includes('/feedback')) {
      setActiveSection('feedback');
    } else if (path.includes('/settings')) {
      setActiveSection('settings');
    }
  }, [window.location.pathname]);

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarCollapsed(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      {/* Sidebar */}
      <SideBar 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Main Content */}
      <div className="lg:ml-72">
        {/* Header */}
        <DashboardHeader onSectionChange={handleSectionChange} />

        {/* Page Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default EntrepreneurLayout;