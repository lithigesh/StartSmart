import React, { Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedRoute from "./components/RoleBasedRoute";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import InvestorDashboard from "./pages/InvestorDashboard.jsx";
import IdeaDetailPage from "./pages/IdeaDetailPage.jsx";
import AdminLoginPage from "./pages/AdminLoginPage.jsx";
import AdminDashboardLayout from "./pages/AdminDashboardLayout.jsx";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage.jsx";
import AdminUsersPage from "./pages/admin/AdminUsersPage.jsx";
import AdminIdeasPage from "./pages/admin/AdminIdeasPage.jsx";
import AdminIdeathonsPage from "./pages/admin/AdminIdeathonsPage.jsx";
import AdminRegistrationMasterPage from "./pages/admin/AdminRegistrationMasterPage.jsx";
import AdminIdeathonDetailsPage from "./pages/admin/AdminIdeathonDetailsPage.jsx";
import AdminFeedbackPage from "./pages/admin/AdminFeedbackPage.jsx";
import { IdeaSubmissionPage } from "./pages/IdeaSubmission";
import AppFeedbackPage from "./components/AppFeedbackPage.jsx";

// Entrepreneur PagesEntrepreneur
import EntrepreneurLayout from "./pages/entrepreneur/EntrepreneurLayout.jsx";
import OverviewPage from "./pages/entrepreneur/OverviewPage.jsx";
import EntrepreneurIdeasPage from "./pages/entrepreneur/EntrepreneurIdeaViewPage.jsx";
import MyIdeasPage from "./pages/entrepreneur/MyIdeasPage.jsx";

import FundingPage from "./pages/entrepreneur/FundingPage.jsx";
import FundingRequestPage from "./pages/entrepreneur/FundingRequestPage.jsx";
import IdeathonsPage from "./pages/entrepreneur/IdeathonsPage.jsx";
import IdeathonDetailsPage from "./pages/entrepreneur/IdeathonDetailsPage.jsx";
import IdeathonRegistrationPage from "./pages/entrepreneur/IdeathonRegistrationPage.jsx";
import NotificationsPage from "./pages/entrepreneur/NotificationsPage.jsx";
import FeedbackPage from "./pages/entrepreneur/FeedbackPage.jsx";
import SettingsPage from "./pages/entrepreneur/SettingsPage.jsx";

// Investor Pages
import InvestorDealsPage from "./pages/investor/InvestorDealsPage.jsx";
import InvestorIdeaViewPage from "./pages/investor/InvestorIdeaViewPage.jsx";
import InvestorNotificationsPage from "./pages/investor/NotificationsPage.jsx";

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
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#1f2937",
                color: "#fff",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                backdropFilter: "blur(10px)",
              },
              success: {
                iconTheme: {
                  primary: "#10b981",
                  secondary: "#fff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#fff",
                },
              },
            }}
          />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Investor Routes */}
              <Route
                path="/investor"
                element={
                  <RoleBasedRoute allowedRole="investor">
                    <InvestorDashboard />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/investor/dashboard"
                element={
                  <RoleBasedRoute allowedRole="investor">
                    <InvestorDashboard />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/investor/browse"
                element={
                  <RoleBasedRoute allowedRole="investor">
                    <InvestorDashboard />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/investor/interests"
                element={
                  <RoleBasedRoute allowedRole="investor">
                    <InvestorDashboard />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/investor/deals"
                element={
                  <RoleBasedRoute allowedRole="investor">
                    <InvestorDealsPage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/investor/notifications"
                element={
                  <RoleBasedRoute allowedRole="investor">
                    <InvestorNotificationsPage />
                  </RoleBasedRoute>
                }
              />

              {/* Entrepreneur Routes with Layout */}
              <Route
                path="/entrepreneur"
                element={
                  <RoleBasedRoute allowedRole="entrepreneur">
                    <EntrepreneurLayout />
                  </RoleBasedRoute>
                }
              >
                <Route index element={<OverviewPage />} />
                <Route path="dashboard" element={<OverviewPage />} />
                <Route path="my-ideas" element={<MyIdeasPage />} />
                <Route path="funding" element={<FundingPage />} />
                <Route path="ideathons" element={<IdeathonsPage />} />
                <Route path="ideathon/:id" element={<IdeathonDetailsPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="feedback" element={<FeedbackPage />} />
              </Route>

              {/* Funding Request - Full Screen (outside layout) */}
              <Route
                path="/entrepreneur/request-funding"
                element={
                  <RoleBasedRoute allowedRole="entrepreneur">
                    <FundingRequestPage />
                  </RoleBasedRoute>
                }
              />

              {/* Edit Funding Request - Full Screen (outside layout) */}
              <Route
                path="/entrepreneur/edit-funding/:id"
                element={
                  <RoleBasedRoute allowedRole="entrepreneur">
                    <FundingRequestPage isEditMode={true} />
                  </RoleBasedRoute>
                }
              />

              {/* View Funding Request Details - Full Screen (outside layout) */}
              <Route
                path="/entrepreneur/view-funding/:id"
                element={
                  <RoleBasedRoute allowedRole="entrepreneur">
                    <FundingRequestPage isViewMode={true} />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/submit-idea"
                element={
                  <RoleBasedRoute allowedRole="entrepreneur">
                    <IdeaSubmissionPage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/edit-idea/:id"
                element={
                  <RoleBasedRoute allowedRole="entrepreneur">
                    <IdeaSubmissionPage />
                  </RoleBasedRoute>
                }
              />
              {/* Ideathon Registration - Full Screen (outside layout) */}
              <Route
                path="/entrepreneur/ideathon/:id/register"
                element={
                  <RoleBasedRoute allowedRole="entrepreneur">
                    <IdeathonRegistrationPage />
                  </RoleBasedRoute>
                }
              />
              {/* Ideathon Registration Edit - Full Screen (outside layout) */}
              <Route
                path="/entrepreneur/ideathon/:id/register/:registrationId"
                element={
                  <RoleBasedRoute allowedRole="entrepreneur">
                    <IdeathonRegistrationPage />
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
                <Route
                  path="ideathon/:id"
                  element={<AdminIdeathonDetailsPage />}
                />
                <Route path="feedback" element={<AdminFeedbackPage />} />
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
              {/* Entrepreneur Idea View Route */}
          
              {/* Investor Idea View Route */}
              <Route
                path="/investor/idea/:ideaId"
                element={
                  <RoleBasedRoute allowedRole="investor">
                    <InvestorIdeaViewPage />
                  </RoleBasedRoute>
                }
              />
              {/* Legacy route - kept for backward compatibility */}
              <Route
                path="/entrepreneur/idea/:ideaId"
                element={
                  <ProtectedRoute>
                    <EntrepreneurIdeasPage />
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
