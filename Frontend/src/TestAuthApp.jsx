import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

const TestAuthApp = () => {
  return (
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
          <h1 style={{ fontSize: "2rem" }}>Auth Context Working - StartSmart</h1>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default TestAuthApp;