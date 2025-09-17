import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import LandingPage from "./pages/LandingPage.jsx";

const TestBasicPagesApp = () => {
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
                <h1 style={{ fontSize: "2rem" }}>Basic Routes Working - StartSmart</h1>
              </div>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default TestBasicPagesApp;