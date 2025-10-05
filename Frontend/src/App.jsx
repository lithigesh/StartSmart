import React, { Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedRoute from "./components/RoleBasedRoute";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import InvestorDashboard from "./pages/InvestorDashboard.jsx";
import EntrepreneurDashboardPage from "./pages/EntrepreneurDashboardPage.jsx";
import IdeaDetailPage from "./pages/IdeaDetailPage.jsx";
import AdminLoginPage from "./pages/AdminLoginPage.jsx";
import AdminDashboardLayout from "./pages/AdminDashboardLayout.jsx";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage.jsx";
import AdminUsersPage from "./pages/admin/AdminUsersPage.jsx";
import AdminIdeasPage from "./pages/admin/AdminIdeasPage.jsx";
import AdminIdeathonsPage from "./pages/admin/AdminIdeathonsPage.jsx";
import AdminRegistrationMasterPage from "./pages/admin/AdminRegistrationMasterPage.jsx";
import AdminFeedbackPage from "./pages/admin/AdminFeedbackPage.jsx";
import AdminSustainabilityPage from "./pages/admin/AdminSustainabilityPage.jsx";

import {
  NotFoundPage,
  ServerErrorPage,
  UnauthorizedPage,
  NetworkErrorPage,
} from "./pages/errors";

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="text-white text-xl">Loading...</div>
  </div>
);

const App = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/investor/dashboard"
                element={
                  <RoleBasedRoute allowedRole="investor">
                    <InvestorDashboard />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/entrepreneur/dashboard"
                element={
                  <RoleBasedRoute allowedRole="entrepreneur">
                    <EntrepreneurDashboardPage />
                  </RoleBasedRoute>
                }
              />
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={<AdminLoginPage />} />
              <Route
                path="/admin"
                element={
                  <RoleBasedRoute allowedRole="admin">
                    <AdminDashboardLayout />
                  </RoleBasedRoute>
                }
              >
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="ideas" element={<AdminIdeasPage />} />
                <Route path="ideathons" element={<AdminIdeathonsPage />} />
                <Route path="registration-master" element={<AdminRegistrationMasterPage />} />
                <Route path="feedback" element={<AdminFeedbackPage />} />
                <Route path="sustainability" element={<AdminSustainabilityPage />} />
                <Route index element={<AdminDashboardPage />} />
              </Route>
              <Route
                path="/admin/idea/:id"
                element={
                  <RoleBasedRoute allowedRole="admin">
                    <IdeaDetailPage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/idea/:ideaId"
                element={
                  <ProtectedRoute>
                    <IdeaDetailPage />
                  </ProtectedRoute>
                }
              />
              {/* Error Pages */}
              <Route path="/error/500" element={<ServerErrorPage />} />
              <Route path="/error/401" element={<UnauthorizedPage />} />
              <Route path="/error/network" element={<NetworkErrorPage />} />
              {/* Catch all unmatched routes */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <Analytics />
          </BrowserRouter>
        </AuthProvider>
      </Suspense>
    </ErrorBoundary>
  );
};

export default App;
