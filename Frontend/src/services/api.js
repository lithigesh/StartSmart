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

// Helper function to get auth headers for file uploads
const getAuthHeadersForUpload = () => {
  const token = localStorage.getItem("token");
  return {
    ...(token && { Authorization: `Bearer ${token}` }),
    // Don't set Content-Type for FormData - browser will set it with boundary
  };
};

// Ideas API - For both entrepreneurs and investors
export const ideasAPI = {
  // Submit a new idea (for entrepreneurs) - Updated to handle file uploads
  submitIdea: async (ideaData) => {
    // Check if ideaData contains files (attachments)
    const hasFiles = ideaData.attachments && ideaData.attachments.length > 0;
    
    if (hasFiles) {
      // Use FormData for file uploads
      const formData = new FormData();
      
      // Append all form fields
      Object.keys(ideaData).forEach(key => {
        if (key === 'attachments') {
          // Handle file attachments
          ideaData.attachments.forEach(file => {
            formData.append('attachments', file);
          });
        } else {
          // Append other fields
          formData.append(key, ideaData[key] || '');
        }
      });

      const response = await fetch(`${API_URL}/api/ideas`, {
        method: "POST",
        headers: getAuthHeadersForUpload(),
        body: formData,
      });
      return handleResponse(response);
    } else {
      // Use JSON for ideas without files
      const response = await fetch(`${API_URL}/api/ideas`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(ideaData),
      });
      return handleResponse(response);
    }
  },

  // Get a specific idea by ID
  getIdeaById: async (ideaId) => {
    const response = await fetch(`${API_URL}/api/ideas/${ideaId}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Entrepreneur specific API
export const entrepreneurAPI = {
  // Get all ideas for the current entrepreneur
  getMyIdeas: async () => {
    // First get the current user info to get userId
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");
    
    // Decode token to get user ID (simple base64 decode of JWT payload)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.id;
    
    const response = await fetch(`${API_URL}/api/ideas/user/${userId}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Get dashboard metrics for entrepreneur
  getDashboardMetrics: async () => {
    try {
      // Get all user's ideas first
      const ideas = await entrepreneurAPI.getMyIdeas();
      
      // Calculate metrics from the ideas
      const totalIdeas = ideas.length;
      let fundingReceived = 0;
      let interestedInvestors = 0;
      
      // For each idea, we'd need to get funding and investor interest
      // For now, we'll return basic metrics
      for (const idea of ideas) {
        // You can expand this to call specific endpoints for funding/interest data
        if (idea.fundingReceived) {
          fundingReceived += idea.fundingReceived;
        }
        if (idea.interestedInvestors) {
          interestedInvestors += idea.interestedInvestors.length;
        }
      }
      
      return {
        totalIdeas,
        fundingReceived,
        interestedInvestors,
        ideas
      };
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      return {
        totalIdeas: 0,
        fundingReceived: 0,
        interestedInvestors: 0,
        ideas: []
      };
    }
  },

  // Get recent activity for entrepreneur
  getRecentActivity: async () => {
    try {
      // This would typically come from a dedicated activity endpoint
      // For now, we'll derive it from other data sources
      const activities = [];
      
      // You can implement this by calling multiple endpoints:
      // - Recent notifications
      // - Recent investor interests
      // - Recent funding updates
      
      return activities;
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return [];
    }
  },

  // Trigger analysis for an idea
  analyzeIdea: async (ideaId) => {
    const response = await fetch(`${API_URL}/api/ideas/${ideaId}/analysis`, {
      method: "POST",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Get interested investors for an idea
  getInterestedInvestors: async (ideaId) => {
    const response = await fetch(`${API_URL}/api/ideas/${ideaId}/investors`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Update an idea
  updateIdea: async (ideaId, ideaData) => {
    const response = await fetch(`${API_URL}/api/ideas/${ideaId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(ideaData),
    });
    return handleResponse(response);
  },

  // Delete an idea
  deleteIdea: async (ideaId) => {
    const response = await fetch(`${API_URL}/api/ideas/${ideaId}`, {
      method: "DELETE",
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
  entrepreneurAPI,
  investorAPI,
  fundingAPI,
  notificationsAPI,
};
