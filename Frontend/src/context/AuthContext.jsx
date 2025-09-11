import React, { createContext, useContext, useReducer, useEffect, useCallback } from "react";

// Get API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
//const API_URL = "http://localhost:5001";

// Auth Context
const AuthContext = createContext();

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  loading: true,
  error: null,
};

// Try to get user from localStorage if available
const storedUser = localStorage.getItem("user");
if (storedUser) {
  try {
    const parsedUser = JSON.parse(storedUser);
    initialState.user = parsedUser;
    initialState.isAuthenticated = !!localStorage.getItem("token");
    initialState.loading = false;
  } catch (error) {
    console.error("Error parsing stored user:", error);
    localStorage.removeItem("user");
  }
}

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case "USER_LOADED":
      localStorage.setItem("user", JSON.stringify(action.payload));
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload,
        error: null,
      };
    case "REGISTER_SUCCESS":
    case "LOGIN_SUCCESS":
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case "REGISTER_FAIL":
    case "AUTH_ERROR":
    case "LOGIN_FAIL":
    case "LOGOUT":
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: action.payload,
      };
    case "CLEAR_ERRORS":
      return {
        ...state,
        error: null,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Get role-based dashboard URL
  const getRoleDashboardUrl = (user) => {
    if (!user || !user.role) return "/";
    
    switch (user.role) {
      case "admin":
        return "/admin/dashboard";
      case "investor":
        return "/investor/dashboard";
      case "entrepreneur":
        return "/entrepreneur/dashboard";
      default:
        return "/";
    }
  };

  // Load user - wrapped with useCallback to prevent infinite loops
  const loadUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (token && storedUser) {
      try {
        // Try to use stored user data first
        const userData = JSON.parse(storedUser);
        dispatch({
          type: "USER_LOADED",
          payload: userData,
        });
        return;
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
      }
    }
    
    if (token) {
      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          dispatch({
            type: "USER_LOADED",
            payload: data,
          });
        } else {
          console.error("Failed to load user:", response.status);
          dispatch({ type: "AUTH_ERROR" });
        }
      } catch (error) {
        console.error("Error loading user:", error);
        dispatch({ type: "AUTH_ERROR" });
      }
    } else {
      dispatch({ type: "AUTH_ERROR" });
    }
  }, [API_URL]); // Only depend on API_URL which shouldn't change

  // Register user - wrapped with useCallback
  const register = useCallback(async (formData) => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        dispatch({
          type: "REGISTER_SUCCESS",
          payload: data,
        });
        return { success: true, data, user: data.user };
      } else {
        dispatch({
          type: "REGISTER_FAIL",
          payload: data.message || "Registration failed",
        });
        return { success: false, error: data.message || "Registration failed" };
      }
    } catch (error) {
      dispatch({
        type: "REGISTER_FAIL",
        payload: error.message || "Network error",
      });
      return { success: false, error: error.message || "Network error" };
    }
  }, [API_URL]);

  // Login user - simplified and more reliable, wrapped with useCallback
  const login = useCallback(async (formData) => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user data
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // Update state
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: data,
        });
        
        return { 
          success: true, 
          user: data.user,
          redirectUrl: getRoleDashboardUrl(data.user)
        };
      } else {
        dispatch({
          type: "LOGIN_FAIL",
          payload: data.message || "Login failed",
        });
        return { success: false, error: data.message || "Login failed" };
      }
    } catch (error) {
      dispatch({
        type: "LOGIN_FAIL",
        payload: error.message || "Network error",
      });
      return { success: false, error: error.message || "Network error" };
    }
  }, [API_URL]);

  // Logout user with optional redirect - wrapped with useCallback
  const logout = useCallback((redirectTo = null) => {
    // Clear storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Update state
    dispatch({ type: "LOGOUT" });
    
    // Handle redirect
    if (redirectTo) {
      // Use setTimeout to ensure state is updated before redirect
      setTimeout(() => {
        window.location.href = redirectTo;
      }, 100);
    }
  }, []);

  // Clear errors - wrapped with useCallback
  const clearErrors = useCallback(() => {
    dispatch({ type: "CLEAR_ERRORS" });
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        register,
        login,
        logout,
        clearErrors,
        loadUser,
        getRoleDashboardUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
