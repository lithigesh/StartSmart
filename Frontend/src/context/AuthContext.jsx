import React, { createContext, useContext, useReducer, useEffect } from "react";

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

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case "USER_LOADED":
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
      return {
        ...state,
        token: action.payload.token,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case "REGISTER_FAIL":
    case "AUTH_ERROR":
    case "LOGIN_FAIL":
    case "LOGOUT":
      localStorage.removeItem("token");
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

  // Load user
  const loadUser = async () => {
    if (localStorage.getItem("token")) {
      try {
        const response = await fetch("http://localhost:5001/api/auth/me", {
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
      const response = await fetch("http://localhost:5001/api/auth/register", {
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
      } else {
        dispatch({
          type: "REGISTER_FAIL",
          payload: data.message || "Registration failed",
        });
      }
    } catch (error) {
      dispatch({
        type: "REGISTER_FAIL",
        payload: error.message || "Network error",
      });
    }
  };

  // Login user
  const login = async (formData) => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const response = await fetch("http://localhost:5001/api/auth/login", {
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
      } else {
        console.error("Login failed:", data.message);
        dispatch({
          type: "LOGIN_FAIL",
          payload: data.message || "Login failed",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      dispatch({
        type: "LOGIN_FAIL",
        payload: error.message || "Network error",
      });
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
