import React, { createContext, useContext, useReducer, useEffect } from "react";

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
    return user.role === "investor" ? "/investor/dashboard" : "/entrepreneur/dashboard";
  };

  // Load user
  const loadUser = async () => {
    if (localStorage.getItem("token")) {
      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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
  };

  // Register user
  const register = async (formData) => {
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
        await loadUser();
        return { success: true, data };
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
  };

  // Login user
  const login = async (formData) => {
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
      console.log("Login response:", data);

      if (response.ok) {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: data,
        });
        console.log("Login successful, user data set");
        return { success: true };
      } else {
        console.error("Login failed:", data.message);
        dispatch({
          type: "LOGIN_FAIL",
          payload: data.message || "Login failed",
        });
        return { success: false, error: data.message || "Login failed" };
      }
    } catch (error) {
      console.error("Login error:", error);
      dispatch({
        type: "LOGIN_FAIL",
        payload: error.message || "Network error",
      });
      return { success: false, error: error.message || "Network error" };
    }
  };

  // Logout user
  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  // Clear errors
  const clearErrors = () => {
    dispatch({ type: "CLEAR_ERRORS" });
  };

  useEffect(() => {
    loadUser();
  }, []);

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
