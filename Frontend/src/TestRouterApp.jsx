import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const TestApp = () => {
  return (
    <BrowserRouter>
      <div style={{ 
        minHeight: "100vh", 
        backgroundColor: "black", 
        color: "white", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center" 
      }}>
        <h1 style={{ fontSize: "2rem" }}>Router Working - StartSmart</h1>
      </div>
    </BrowserRouter>
  );
};

export default TestApp;