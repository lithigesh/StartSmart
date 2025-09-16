import React from "react";
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
import EntrepreneurDashboard from "./pages/EntrepreneurDashboard.jsx";
import IdeaDetailPage from "./pages/IdeaDetailPage.jsx";

// Entrepreneur Pages
import MyIdeasPage from "./pages/entrepreneur/MyIdeasPage.jsx";
import FundingPage from "./pages/entrepreneur/FundingPage.jsx";
import InvestorsPage from "./pages/entrepreneur/InvestorsPage.jsx";
import AnalyticsPage from "./pages/entrepreneur/AnalyticsPage.jsx";
import IdeathonsPage from "./pages/entrepreneur/IdeathonsPage.jsx";
import CollaborationsPage from "./pages/entrepreneur/CollaborationsPage.jsx";
import SettingsPage from "./pages/entrepreneur/SettingsPage.jsx";
import HelpPage from "./pages/entrepreneur/HelpPage.jsx";

import {
  NotFoundPage,
  ServerErrorPage,
  UnauthorizedPage,
  NetworkErrorPage,
} from "./pages/errors";

const App = () => {
  return (
    <ErrorBoundary>
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
                  <EntrepreneurDashboard />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/entrepreneur/ideas"
              element={
                <RoleBasedRoute allowedRole="entrepreneur">
                  <MyIdeasPage />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/entrepreneur/funding"
              element={
                <RoleBasedRoute allowedRole="entrepreneur">
                  <FundingPage />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/entrepreneur/investors"
              element={
                <RoleBasedRoute allowedRole="entrepreneur">
                  <InvestorsPage />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/entrepreneur/analytics"
              element={
                <RoleBasedRoute allowedRole="entrepreneur">
                  <AnalyticsPage />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/entrepreneur/ideathons"
              element={
                <RoleBasedRoute allowedRole="entrepreneur">
                  <IdeathonsPage />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/entrepreneur/collaborations"
              element={
                <RoleBasedRoute allowedRole="entrepreneur">
                  <CollaborationsPage />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/entrepreneur/settings"
              element={
                <RoleBasedRoute allowedRole="entrepreneur">
                  <SettingsPage />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/entrepreneur/help"
              element={
                <RoleBasedRoute allowedRole="entrepreneur">
                  <HelpPage />
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
    </ErrorBoundary>
  );
};

export default App;
