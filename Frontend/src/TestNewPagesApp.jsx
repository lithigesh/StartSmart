import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
// Test importing our new pages one by one
import FundingPage from "./pages/FundingPage.jsx";
import InvestorsPage from "./pages/InvestorsPage.jsx";
import AnalyticsPage from "./pages/AnalyticsPage.jsx";
import IdeathonsPage from "./pages/IdeathonsPage.jsx";
import CollaborationsPage from "./pages/CollaborationsPage.jsx";
import SettingsPage from "./pages/SettingsPageMinimal.jsx";

const TestNewPagesApp = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <div style={{ 
                minHeight: "100vh", 
                backgroundColor: "black", 
                color: "white", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center" 
              }}>
                <h1 style={{ fontSize: "2rem" }}>Minimal SettingsPage Test - StartSmart</h1>
              </div>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default TestNewPagesApp;