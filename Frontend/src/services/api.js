// API service functions for backend integration
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
//const API_URL = "http://localhost:5001";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Network error" }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Ideas API - For both entrepreneurs and investors
export const ideasAPI = {
  // Submit a new idea (for entrepreneurs)
  submitIdea: async (ideaData) => {
    const response = await fetch(`${API_URL}/api/ideas`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(ideaData),
    });
    return handleResponse(response);
  },

  // Get a specific idea by ID
  getIdeaById: async (ideaId) => {
    const response = await fetch(`${API_URL}/api/ideas/${ideaId}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Investor specific API - Standardized to use investor endpoints
export const investorAPI = {
  // Get all analyzed ideas through investor endpoint
  getAllIdeas: async () => {
    const response = await fetch(`${API_URL}/api/investors/ideas`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Get ideas the investor has shown interest in
  getInterestedIdeas: async () => {
    const response = await fetch(`${API_URL}/api/investors/interested`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Mark interest through investor endpoint
  markInterest: async (ideaId) => {
    const response = await fetch(
      `${API_URL}/api/investors/${ideaId}/interest`,
      {
        method: "POST",
        headers: getAuthHeaders(),
      }
    );
    return handleResponse(response);
  },

  // Remove interest through investor endpoint
  removeInterest: async (ideaId) => {
    const response = await fetch(
      `${API_URL}/api/investors/${ideaId}/interest`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );
    return handleResponse(response);
  },

  // Update interest status
  updateInterestStatus: async (ideaId, status) => {
    const response = await fetch(
      `${API_URL}/api/investors/${ideaId}/interest`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      }
    );
    return handleResponse(response);
  },

  // Get a specific idea by ID (for investors)
  getIdeaById: async (ideaId) => {
    const response = await fetch(`${API_URL}/api/ideas/${ideaId}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Funding API
export const fundingAPI = {
  // Get all funding requests
  getAllFundingRequests: async () => {
    const response = await fetch(`${API_URL}/api/funding`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Get a specific funding request
  getFundingRequestById: async (requestId) => {
    const response = await fetch(`${API_URL}/api/funding/${requestId}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Update funding request status (for investors)
  updateFundingRequestStatus: async (requestId, status, message = "") => {
    const response = await fetch(`${API_URL}/api/funding/${requestId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, message }),
    });
    return handleResponse(response);
  },
};

// Notifications API (if available)
export const notificationsAPI = {
  // Get all notifications for the user
  getNotifications: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(
      `${API_URL}/api/notifications${query ? `?${query}` : ''}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return handleResponse(response);
  },

  // Get unread notification count
  getUnreadCount: async () => {
    const response = await fetch(`${API_URL}/api/notifications/count`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Mark a notification as read
  markAsRead: async (notificationId) => {
    const response = await fetch(
      `${API_URL}/api/notifications/${notificationId}/read`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
      }
    );
    return handleResponse(response);
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    const response = await fetch(
      `${API_URL}/api/notifications/mark-all-read`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
      }
    );
    return handleResponse(response);
  },

  // Delete a specific notification
  deleteNotification: async (notificationId) => {
    const response = await fetch(
      `${API_URL}/api/notifications/${notificationId}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );
    return handleResponse(response);
  },

  // Clear all notifications
  clearAllNotifications: async () => {
    const response = await fetch(
      `${API_URL}/api/notifications/clear-all`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );
    return handleResponse(response);
  },
};

export default {
  ideasAPI,
  investorAPI,
  fundingAPI,
  notificationsAPI,
};
