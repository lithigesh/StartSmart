import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleBasedRoute = ({ children, allowedRole }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Show loading while authentication is being checked
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-manrope">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to appropriate login
  if (!isAuthenticated) {
    if (allowedRole === "admin") {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated but no user data, show loading
  if (isAuthenticated && !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-manrope">Loading user data...</p>
        </div>
      </div>
    );
  }

  // Check if user has the required role
  if (user && user.role === allowedRole) {
    return children;
  }

  // Handle role mismatch - redirect admin requests to admin login, others to unauthorized
  if (allowedRole === "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  // For non-admin routes, redirect to unauthorized page
  return <Navigate to="/error/401" replace />;
};

export default RoleBasedRoute;
