import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

const BackendStatusContext = createContext();

export const BackendStatusProvider = ({ children }) => {
  const [isAwake, setIsAwake] = useState(false);
  const [isWakingUp, setIsWakingUp] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
  const pollIntervalRef = useRef(null);

  const checkBackend = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(`${API_URL}/`, {
        method: "GET",
        signal: controller.signal,
        mode: "no-cors",
      });

      clearTimeout(timeoutId);
      setIsAwake(true);
      setIsWakingUp(false);
      return true;
    } catch (error) {
      return false;
    }
  }, [API_URL]);

  // Unified polling function
  const startPolling = useCallback(async () => {
    // Stop existing poll if any
    if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
    }

    // Do an immediate check
    const awake = await checkBackend();
    
    if (!awake) {
      setIsWakingUp(true);
      // Restart interval
      pollIntervalRef.current = setInterval(async () => {
        const nowAwake = await checkBackend();
        if (nowAwake) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
      }, 3000);
    }
  }, [checkBackend]);

  const triggerWakeup = useCallback(() => {
    setHasInteracted(true);
    if (!isAwake) {
        startPolling();
    }
  }, [isAwake, startPolling]);

  const dismissWakeup = useCallback(() => {
    setHasInteracted(false);
  }, []);

  useEffect(() => {
    startPolling();
    return () => {
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [startPolling]);

  return (
    <BackendStatusContext.Provider value={{ isAwake, isWakingUp, hasInteracted, triggerWakeup, dismissWakeup }}>
      {children}
    </BackendStatusContext.Provider>
  );
};

export const useBackendStatus = () => {
  const context = useContext(BackendStatusContext);
  if (!context) {
    throw new Error("useBackendStatus must be used within a BackendStatusProvider");
  }
  return context;
};
