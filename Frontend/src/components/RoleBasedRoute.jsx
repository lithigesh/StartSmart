import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleBasedRoute = ({ children, allowedRole, redirectTo = "/error/401" }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  // Give some time for auth state to settle after login
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setHasCheckedAuth(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  console.log("RoleBasedRoute Debug:", {
    allowedRole,
    user,
    userRole: user?.role,
    loading,
    isAuthenticated,
    hasCheckedAuth,
    pathname: location.pathname
  });

  // Show loading while authentication is being checked or during the grace period
  if (loading || !hasCheckedAuth) {
    console.log("RoleBasedRoute: Still loading authentication...");
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-manrope">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log("RoleBasedRoute: Not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated but no user data, show loading
  if (isAuthenticated && !user) {
    console.log("RoleBasedRoute: Authenticated but no user data, showing loading");
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
    console.log("RoleBasedRoute: Role match, rendering children");
    return children;
  }

  // Redirect to unauthorized page if user doesn't have the required role
  console.log("RoleBasedRoute: Role mismatch, redirecting to 401");
  console.log("Expected role:", allowedRole, "User role:", user?.role);
  return <Navigate to={redirectTo} replace />;
};

export default RoleBasedRoute;
