import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";

const TestErrorBoundaryApp = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <div style={{ 
            minHeight: "100vh", 
            backgroundColor: "black", 
            color: "white", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center" 
          }}>
            <h1 style={{ fontSize: "2rem" }}>ErrorBoundary Working - StartSmart</h1>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default TestErrorBoundaryApp;