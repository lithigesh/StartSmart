import React from "react";
import { useAuth } from "../context/AuthContext";
import InvestorDashboard from "./InvestorDashboard";
import EntrepreneurDashboard from "./EntrepreneurDashboard";

const DashboardPage = () => {
  const { user } = useAuth();

  // Render the appropriate dashboard based on user role
  if (user?.role === "investor") {
    return <InvestorDashboard />;
  } else if (user?.role === "entrepreneur") {
    return <EntrepreneurDashboard />;
  }

  // Default fallback (shouldn't normally reach here if authentication is working)
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white text-center">
        <h2 className="text-2xl font-manrope font-bold mb-4">
          Loading Dashboard...
        </h2>
        <p className="text-white/60">
          Please wait while we set up your personalized dashboard.
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;
