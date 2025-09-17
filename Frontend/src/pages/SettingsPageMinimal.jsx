import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../hooks/useNotifications";

const SettingsPage = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "black", 
      color: "white", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center" 
    }}>
      <h1 style={{ fontSize: "2rem" }}>Minimal SettingsPage Works!</h1>
    </div>
  );
};

export default SettingsPage;