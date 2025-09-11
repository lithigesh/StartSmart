import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// This component redirects to the appropriate admin page based on authentication status
const AdminPage = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || user?.role !== "admin") {
        // Not authenticated or not admin -> redirect to admin login
        navigate("/admin/login", { replace: true });
      } else {
        // Authenticated admin -> redirect to dashboard
        navigate("/admin/dashboard", { replace: true });
      }
    }
  }, [isAuthenticated, loading, user, navigate]);

  // Show loading while determining where to redirect
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin w-8 h-8 border-2 border-white/20 border-t-white rounded-full mx-auto mb-4"></div>
        <p className="font-manrope">Redirecting...</p>
      </div>
    </div>
  );
};

export default AdminPage;
