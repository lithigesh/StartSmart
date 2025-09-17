import React, { useState, useEffect } from "react";
import { investorAPI, ideasAPI } from "../services/api";
import { useNotifications } from "../hooks/useNotifications";
import { FaUser } from "react-icons/fa";
import EmptyState from "../components/EmptyState";
import ErrorBoundary from "../components/ErrorBoundary";

const InvestorsPageTest = () => {
  const { addNotification } = useNotifications();
  
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-black text-white p-8">
        <h1 className="text-3xl font-bold">Investors Page - Test Version</h1>
        <p className="mt-4">This version tests the basic imports.</p>
        <FaUser className="text-2xl mt-4" />
      </div>
    </ErrorBoundary>
  );
};

export default InvestorsPageTest;