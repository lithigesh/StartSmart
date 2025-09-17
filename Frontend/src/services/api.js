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
    try {
      const response = await Promise.race([
        fetch(`${API_URL}/api/ideas/${ideaId}`, {
          headers: getAuthHeaders(),
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 5000)
        )
      ]);
      return handleResponse(response);
    } catch (error) {
      console.warn('Ideas API not available, using demo data');
      return {
        success: true,
        data: {
          id: ideaId,
          title: "Demo Idea",
          description: "This is a demo idea",
          category: "Technology",
          stage: "Concept"
        }
      };
    }
  },

  // Get user's ideas
  getUserIdeas: async () => {
    try {
      // First get the current user info to get userId
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      
      // Decode token to get user ID (simple base64 decode of JWT payload)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.id;
      
      const response = await Promise.race([
        fetch(`${API_URL}/api/ideas/user/${userId}`, {
          headers: getAuthHeaders(),
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 5000)
        )
      ]);
      return handleResponse(response);
    } catch (error) {
      console.warn('User ideas API not available, using demo data');
      return {
        success: true,
        data: [
          {
            id: 1,
            title: "AI-Powered Marketing Platform",
            description: "Revolutionary AI platform for automated marketing campaigns with machine learning algorithms",
            category: "Technology",
            stage: "MVP",
            budget: 500000,
            tags: ["AI", "Marketing", "Automation"],
            createdAt: "2024-01-15T10:00:00Z"
          },
          {
            id: 2,
            title: "Smart Home Automation",
            description: "IoT-based home automation system with AI integration for energy efficiency",
            category: "IoT",
            stage: "Prototype",
            budget: 250000,
            tags: ["IoT", "Smart Home", "Energy"],
            createdAt: "2024-01-10T14:30:00Z"
          },
          {
            id: 3,
            title: "Sustainable Fashion Marketplace",
            description: "Online marketplace connecting eco-conscious consumers with sustainable fashion brands",
            category: "E-commerce",
            stage: "Concept",
            budget: 150000,
            tags: ["Fashion", "Sustainability", "Marketplace"],
            createdAt: "2024-01-05T16:45:00Z"
          }
        ]
      };
    }
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
    try {
      const response = await Promise.race([
        fetch(`${API_URL}/api/funding`, {
          headers: getAuthHeaders(),
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 5000)
        )
      ]);
      return handleResponse(response);
    } catch (error) {
      console.warn('Funding API not available, using demo data');
      return {
        success: true,
        data: [
          {
            id: 1,
            ideaTitle: "AI-Powered Marketing Platform",
            amount: 500000,
            equity: 15,
            valuation: 3000000,
            status: "pending",
            description: "Revolutionary AI platform for automated marketing campaigns",
            createdAt: "2024-01-15T10:00:00Z",
            investorName: "TechVentures Capital"
          },
          {
            id: 2,
            ideaTitle: "Smart Home Automation",
            amount: 250000,
            equity: 10,
            valuation: 2500000,
            status: "approved",
            description: "IoT-based home automation system with AI integration",
            createdAt: "2024-01-10T14:30:00Z",
            investorName: "Green Tech Investments"
          }
        ]
      };
    }
  },

  // Get user's funding requests
  getUserFundingRequests: async () => {
    try {
      const response = await Promise.race([
        fetch(`${API_URL}/api/funding/user`, {
          headers: getAuthHeaders(),
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 5000)
        )
      ]);
      return handleResponse(response);
    } catch (error) {
      console.warn('User funding API not available, using demo data');
      return {
        success: true,
        data: [
          {
            id: 1,
            ideaTitle: "AI-Powered Marketing Platform",
            amount: 500000,
            equity: 15,
            valuation: 3000000,
            status: "pending",
            description: "Revolutionary AI platform for automated marketing campaigns with machine learning algorithms",
            createdAt: "2024-01-15T10:00:00Z",
            updatedAt: "2024-01-15T10:00:00Z"
          },
          {
            id: 2,
            ideaTitle: "Smart Home Automation",
            amount: 250000,
            equity: 10,
            valuation: 2500000,
            status: "approved",
            description: "IoT-based home automation system with AI integration for energy efficiency",
            createdAt: "2024-01-10T14:30:00Z",
            updatedAt: "2024-01-12T09:15:00Z"
          },
          {
            id: 3,
            ideaTitle: "Sustainable Fashion Marketplace",
            amount: 150000,
            equity: 12,
            valuation: 1250000,
            status: "rejected",
            description: "Online marketplace connecting eco-conscious consumers with sustainable fashion brands",
            createdAt: "2024-01-05T16:45:00Z",
            updatedAt: "2024-01-08T11:20:00Z"
          }
        ]
      };
    }
  },

  // Create new funding request
  createFundingRequest: async (requestData) => {
    try {
      const response = await Promise.race([
        fetch(`${API_URL}/api/funding`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(requestData),
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 5000)
        )
      ]);
      return handleResponse(response);
    } catch (error) {
      console.warn('Create funding API not available, using demo response');
      return {
        success: true,
        data: {
          id: Date.now(),
          ideaTitle: "New Funding Request",
          amount: requestData.amount,
          equity: requestData.equity,
          valuation: requestData.valuation,
          status: "pending",
          description: requestData.description,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };
    }
  },

  // Get a specific funding request
  getFundingRequestById: async (requestId) => {
    try {
      const response = await Promise.race([
        fetch(`${API_URL}/api/funding/${requestId}`, {
          headers: getAuthHeaders(),
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 5000)
        )
      ]);
      return handleResponse(response);
    } catch (error) {
      console.warn('Funding request API not available, using demo data');
      return {
        success: true,
        data: {
          id: requestId,
          ideaTitle: "Demo Funding Request",
          amount: 100000,
          equity: 8,
          valuation: 1250000,
          status: "pending",
          description: "Demo funding request data",
          createdAt: "2024-01-15T10:00:00Z",
          updatedAt: "2024-01-15T10:00:00Z"
        }
      };
    }
  },

  // Update funding request status (for investors)
  updateFundingRequestStatus: async (requestId, status, message = "") => {
    try {
      const response = await Promise.race([
        fetch(`${API_URL}/api/funding/${requestId}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({ status, message }),
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 5000)
        )
      ]);
      return handleResponse(response);
    } catch (error) {
      console.warn('Update funding API not available, using demo response');
      return {
        success: true,
        data: {
          id: requestId,
          status: status,
          message: message,
          updatedAt: new Date().toISOString()
        }
      };
    }
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

// Investor Interest API
export const investorInterestAPI = {
  // Get investors interested in user's ideas
  getInterestedInvestors: async () => {
    try {
      const response = await Promise.race([
        fetch(`${API_URL}/api/investor-interest/user`, {
          headers: getAuthHeaders(),
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 5000)
        )
      ]);
      return handleResponse(response);
    } catch (error) {
      console.warn('Investor interest API not available, using demo data');
      return {
        success: true,
        data: [
          {
            id: 1,
            investorName: "TechVentures Capital",
            investorEmail: "contact@techventures.com",
            companyName: "TechVentures Capital",
            ideaTitle: "AI-Powered Marketing Platform",
            ideaId: 1,
            interestLevel: "high",
            message: "Very interested in your AI marketing platform. Would like to schedule a meeting to discuss investment opportunities.",
            investmentRange: "$500K - $1M",
            createdAt: "2024-01-15T10:00:00Z",
            status: "pending",
            investorProfile: {
              focus: ["AI", "SaaS", "Marketing"],
              stage: ["Series A", "Seed"],
              location: "San Francisco, CA"
            }
          },
          {
            id: 2,
            investorName: "Green Tech Investments",
            investorEmail: "partners@greentech.vc",
            companyName: "Green Tech Investments",
            ideaTitle: "Smart Home Automation",
            ideaId: 2,
            interestLevel: "medium",
            message: "Interested in your IoT solution. Could you provide more details about the technology stack?",
            investmentRange: "$250K - $500K",
            createdAt: "2024-01-12T14:30:00Z",
            status: "contacted",
            investorProfile: {
              focus: ["IoT", "Green Tech", "Hardware"],
              stage: ["Seed", "Pre-Series A"],
              location: "Austin, TX"
            }
          },
          {
            id: 3,
            investorName: "Impact Ventures",
            investorEmail: "team@impactvc.com",
            companyName: "Impact Ventures",
            ideaTitle: "Sustainable Fashion Marketplace",
            ideaId: 3,
            interestLevel: "high",
            message: "Love the sustainability angle. This aligns perfectly with our ESG investment thesis.",
            investmentRange: "$100K - $300K",
            createdAt: "2024-01-08T09:15:00Z",
            status: "meeting_scheduled",
            investorProfile: {
              focus: ["Sustainability", "E-commerce", "Social Impact"],
              stage: ["Seed", "Angel"],
              location: "New York, NY"
            }
          }
        ]
      };
    }
  },

  // Update investor interest status
  updateInvestorInterestStatus: async (interestId, status) => {
    try {
      const response = await Promise.race([
        fetch(`${API_URL}/api/investor-interest/${interestId}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({ status }),
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 5000)
        )
      ]);
      return handleResponse(response);
    } catch (error) {
      console.warn('Update investor interest API not available, using demo response');
      return {
        success: true,
        data: {
          id: interestId,
          status: status,
          updatedAt: new Date().toISOString()
        }
      };
    }
  },
};

// Analytics API
export const analyticsAPI = {
  // Get comprehensive analytics dashboard data
  getDashboardAnalytics: async () => {
    try {
      const response = await Promise.race([
        fetch(`${API_URL}/api/analytics/dashboard`, {
          headers: getAuthHeaders(),
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 5000)
        )
      ]);
      return handleResponse(response);
    } catch (error) {
      console.warn('Analytics API not available, using demo data');
      return {
        success: true,
        data: {
          overview: {
            totalIdeas: 3,
            totalViews: 1247,
            totalInterest: 8,
            conversionRate: 12.5
          },
          ideaPerformance: [
            {
              id: 1,
              title: "AI-Powered Marketing Platform",
              views: 687,
              interest: 5,
              funding: 500000,
              status: "active",
              conversionRate: 18.2,
              trend: "up"
            },
            {
              id: 2,
              title: "Smart Home Automation",
              views: 423,
              interest: 2,
              funding: 250000,
              status: "active",
              conversionRate: 8.5,
              trend: "stable"
            },
            {
              id: 3,
              title: "Sustainable Fashion Marketplace",
              views: 137,
              interest: 1,
              funding: 0,
              status: "concept",
              conversionRate: 4.3,
              trend: "down"
            }
          ],
          monthlyStats: [
            { month: "Jan", views: 145, interest: 2, funding: 0 },
            { month: "Feb", views: 289, interest: 3, funding: 150000 },
            { month: "Mar", views: 432, interest: 1, funding: 0 },
            { month: "Apr", views: 381, interest: 2, funding: 250000 },
            { month: "May", views: 0, interest: 0, funding: 500000 }
          ],
          investorEngagement: {
            totalInvestors: 15,
            activeConversations: 3,
            meetings: 2,
            proposals: 1
          },
          topCategories: [
            { category: "Technology", count: 2, percentage: 66.7 },
            { category: "E-commerce", count: 1, percentage: 33.3 }
          ],
          recentActivity: [
            {
              type: "investor_interest",
              message: "TechVentures Capital showed interest in AI-Powered Marketing Platform",
              timestamp: "2024-01-15T10:00:00Z"
            },
            {
              type: "funding_received",
              message: "Received $250K funding for Smart Home Automation",
              timestamp: "2024-01-12T14:30:00Z"
            },
            {
              type: "meeting_scheduled",
              message: "Meeting scheduled with Impact Ventures",
              timestamp: "2024-01-08T09:15:00Z"
            }
          ]
        }
      };
    }
  },

  // Get idea-specific analytics
  getIdeaAnalytics: async (ideaId) => {
    try {
      const response = await Promise.race([
        fetch(`${API_URL}/api/analytics/idea/${ideaId}`, {
          headers: getAuthHeaders(),
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 5000)
        )
      ]);
      return handleResponse(response);
    } catch (error) {
      console.warn('Idea analytics API not available, using demo data');
      return {
        success: true,
        data: {
          ideaId: ideaId,
          totalViews: 687,
          uniqueVisitors: 523,
          investorInterest: 5,
          averageEngagement: 7.2,
          viewsOverTime: [
            { date: "2024-01-01", views: 12 },
            { date: "2024-01-02", views: 25 },
            { date: "2024-01-03", views: 18 },
            { date: "2024-01-04", views: 34 },
            { date: "2024-01-05", views: 45 }
          ]
        }
      };
    }
  },
};

// Ideathons API
export const ideathonsAPI = {
  // Get all available ideathons/competitions
  getAllIdeathons: async () => {
    try {
      const response = await Promise.race([
        fetch(`${API_URL}/api/ideathons`, {
          headers: getAuthHeaders(),
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 5000)
        )
      ]);
      return handleResponse(response);
    } catch (error) {
      console.warn('Ideathons API not available, using demo data');
      return {
        success: true,
        data: [
          {
            id: 1,
            title: "Global Innovation Challenge 2024",
            description: "A worldwide competition for groundbreaking innovations that solve real-world problems",
            category: "General Innovation",
            prize: 100000,
            deadline: "2024-03-15T23:59:59Z",
            startDate: "2024-01-01T00:00:00Z",
            status: "active",
            participants: 2847,
            organizer: "Innovation Hub",
            requirements: ["Minimum viable prototype", "Business plan", "Pitch deck"],
            tags: ["Innovation", "Technology", "Global"],
            registrationFee: 0,
            maxTeamSize: 5,
            location: "Virtual & San Francisco",
            website: "https://globalinnovation.com"
          },
          {
            id: 2,
            title: "AI for Good Hackathon",
            description: "Develop AI solutions that create positive social impact and address humanitarian challenges",
            category: "Artificial Intelligence",
            prize: 50000,
            deadline: "2024-02-28T23:59:59Z",
            startDate: "2024-02-01T00:00:00Z",
            status: "active",
            participants: 1456,
            organizer: "AI Foundation",
            requirements: ["AI/ML solution", "Social impact focus", "Working demo"],
            tags: ["AI", "Social Impact", "Technology"],
            registrationFee: 25,
            maxTeamSize: 4,
            location: "Boston, MA",
            website: "https://aiforgood.org"
          },
          {
            id: 3,
            title: "Green Tech Innovation Awards",
            description: "Showcase sustainable technology solutions for environmental challenges",
            category: "Sustainability",
            prize: 75000,
            deadline: "2024-04-30T23:59:59Z",
            startDate: "2024-03-01T00:00:00Z",
            status: "upcoming",
            participants: 892,
            organizer: "EcoTech Alliance",
            requirements: ["Environmental focus", "Scalable solution", "Impact measurement"],
            tags: ["Sustainability", "CleanTech", "Environment"],
            registrationFee: 50,
            maxTeamSize: 6,
            location: "Austin, TX",
            website: "https://greentech-awards.com"
          },
          {
            id: 4,
            title: "FinTech Future Competition",
            description: "Revolutionary financial technology solutions for the next generation",
            category: "Financial Technology",
            prize: 80000,
            deadline: "2024-01-20T23:59:59Z",
            startDate: "2023-12-01T00:00:00Z",
            status: "ended",
            participants: 3241,
            organizer: "FinTech Ventures",
            requirements: ["Financial services focus", "Security compliance", "User testing"],
            tags: ["FinTech", "Banking", "Payments"],
            registrationFee: 100,
            maxTeamSize: 5,
            location: "New York, NY",
            website: "https://fintech-future.com"
          }
        ]
      };
    }
  },

  // Get user's ideathon registrations
  getUserRegistrations: async () => {
    try {
      const response = await Promise.race([
        fetch(`${API_URL}/api/ideathons/user/registrations`, {
          headers: getAuthHeaders(),
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 5000)
        )
      ]);
      return handleResponse(response);
    } catch (error) {
      console.warn('User registrations API not available, using demo data');
      return {
        success: true,
        data: [
          {
            id: 1,
            ideathonId: 1,
            ideathonTitle: "Global Innovation Challenge 2024",
            registrationDate: "2024-01-05T10:30:00Z",
            status: "registered",
            teamName: "InnovatorsUnited",
            teamMembers: 3,
            submissionStatus: "pending"
          },
          {
            id: 2,
            ideathonId: 2,
            ideathonTitle: "AI for Good Hackathon",
            registrationDate: "2024-01-10T14:20:00Z",
            status: "registered",
            teamName: "AI Impact",
            teamMembers: 4,
            submissionStatus: "submitted"
          }
        ]
      };
    }
  },

  // Register for an ideathon
  registerForIdeathon: async (ideathonId, registrationData) => {
    try {
      const response = await Promise.race([
        fetch(`${API_URL}/api/ideathons/${ideathonId}/register`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(registrationData),
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 5000)
        )
      ]);
      return handleResponse(response);
    } catch (error) {
      console.warn('Registration API not available, using demo response');
      return {
        success: true,
        data: {
          id: Date.now(),
          ideathonId: ideathonId,
          registrationDate: new Date().toISOString(),
          status: "registered",
          ...registrationData
        }
      };
    }
  },

  // Submit idea to ideathon
  submitToIdeathon: async (ideathonId, submissionData) => {
    try {
      const response = await Promise.race([
        fetch(`${API_URL}/api/ideathons/${ideathonId}/submit`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(submissionData),
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 5000)
        )
      ]);
      return handleResponse(response);
    } catch (error) {
      console.warn('Submission API not available, using demo response');
      return {
        success: true,
        data: {
          id: Date.now(),
          ideathonId: ideathonId,
          submissionDate: new Date().toISOString(),
          status: "submitted",
          ...submissionData
        }
      };
    }
  },
};

// Collaborations API
export const collaborationsAPI = {
  // Get all collaboration opportunities
  getAllCollaborations: async () => {
    try {
      const response = await Promise.race([
        fetch(`${API_URL}/api/collaborations`, {
          method: 'GET',
          headers: getAuthHeaders(),
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 5000)
        )
      ]);
      return handleResponse(response);
    } catch (error) {
      console.warn('Collaborations API not available, using demo data');
      return {
        success: true,
        data: [
          {
            id: 1,
            title: "AI Healthcare Platform Partnership",
            company: "MedTech Innovations",
            type: "Partnership",
            industry: "Healthcare",
            description: "Looking for AI/ML experts to develop predictive healthcare analytics platform",
            requirements: ["Machine Learning", "Python", "Healthcare Domain", "Data Science"],
            budget: "$75,000 - $150,000",
            duration: "6-8 months",
            remote: true,
            location: "San Francisco, CA",
            postedDate: "2024-01-15T10:00:00Z",
            deadline: "2024-03-15T23:59:59Z",
            status: "Open",
            contactEmail: "partnerships@medtech.com",
            companyLogo: "https://via.placeholder.com/50x50/3B82F6/ffffff?text=MT",
            applicants: 23,
            match: 92
          },
          {
            id: 2,
            title: "Sustainable Energy IoT Project",
            company: "GreenTech Solutions",
            type: "Joint Venture",
            industry: "Clean Energy",
            description: "Collaborate on IoT sensors for smart grid optimization and renewable energy management",
            requirements: ["IoT Development", "Embedded Systems", "React", "Node.js"],
            budget: "$50,000 - $100,000",
            duration: "4-6 months",
            remote: false,
            location: "Austin, TX",
            postedDate: "2024-01-12T14:30:00Z",
            deadline: "2024-02-28T23:59:59Z",
            status: "Open",
            contactEmail: "collab@greentech.com",
            companyLogo: "https://via.placeholder.com/50x50/10B981/ffffff?text=GT",
            applicants: 18,
            match: 87
          },
          {
            id: 3,
            title: "E-commerce Mobile App Development",
            company: "RetailNext",
            type: "Subcontract",
            industry: "E-commerce",
            description: "Need mobile app developers for next-gen shopping experience with AR features",
            requirements: ["React Native", "AR/VR", "Mobile Development", "E-commerce"],
            budget: "$30,000 - $60,000",
            duration: "3-4 months",
            remote: true,
            location: "Remote",
            postedDate: "2024-01-10T09:15:00Z",
            deadline: "2024-02-15T23:59:59Z",
            status: "Open",
            contactEmail: "dev@retailnext.com",
            companyLogo: "https://via.placeholder.com/50x50/8B5CF6/ffffff?text=RN",
            applicants: 31,
            match: 78
          },
          {
            id: 4,
            title: "Fintech Security Solutions",
            company: "SecureBank",
            type: "Partnership",
            industry: "Fintech",
            description: "Partner to develop blockchain-based security solutions for digital banking",
            requirements: ["Blockchain", "Cybersecurity", "Fintech", "Smart Contracts"],
            budget: "$100,000 - $200,000",
            duration: "8-12 months",
            remote: true,
            location: "New York, NY",
            postedDate: "2024-01-08T16:45:00Z",
            deadline: "2024-04-30T23:59:59Z",
            status: "Open",
            contactEmail: "partnerships@securebank.com",
            companyLogo: "https://via.placeholder.com/50x50/F59E0B/ffffff?text=SB",
            applicants: 12,
            match: 95
          },
          {
            id: 5,
            title: "EdTech Learning Platform",
            company: "EduInnovate",
            type: "Joint Venture",
            industry: "Education",
            description: "Collaborate on AI-powered personalized learning platform for K-12 education",
            requirements: ["React", "AI/ML", "Education Technology", "Backend Development"],
            budget: "$40,000 - $80,000",
            duration: "5-7 months",
            remote: true,
            location: "Seattle, WA",
            postedDate: "2024-01-05T11:20:00Z",
            deadline: "2024-03-01T23:59:59Z",
            status: "Open",
            contactEmail: "collab@eduinnovate.com",
            companyLogo: "https://via.placeholder.com/50x50/EF4444/ffffff?text=EI",
            applicants: 27,
            match: 83
          }
        ]
      };
    }
  },

  // Get user's collaboration applications
  getUserApplications: async () => {
    try {
      const response = await Promise.race([
        fetch(`${API_URL}/api/collaborations/applications`, {
          method: 'GET',
          headers: getAuthHeaders(),
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 5000)
        )
      ]);
      return handleResponse(response);
    } catch (error) {
      console.warn('User applications API not available, using demo data');
      return {
        success: true,
        data: [
          {
            id: 1,
            collaborationId: 1,
            title: "AI Healthcare Platform Partnership",
            company: "MedTech Innovations",
            status: "pending",
            appliedDate: "2024-01-16T10:00:00Z",
            message: "I have extensive experience in healthcare AI and would love to contribute to this innovative platform.",
            response: null
          },
          {
            id: 2,
            collaborationId: 4,
            title: "Fintech Security Solutions",
            company: "SecureBank",
            status: "accepted",
            appliedDate: "2024-01-09T14:30:00Z",
            message: "Our blockchain expertise aligns perfectly with your security requirements.",
            response: "Great! We're excited to work with you. Please schedule a call with our team."
          },
          {
            id: 3,
            collaborationId: 5,
            title: "EdTech Learning Platform", 
            company: "EduInnovate",
            status: "rejected",
            appliedDate: "2024-01-06T09:15:00Z",
            message: "We specialize in educational technology and AI-powered learning solutions.",
            response: "Thank you for your interest. We've decided to go with another partner."
          }
        ]
      };
    }
  },

  // Apply to collaboration
  applyToCollaboration: async (collaborationId, applicationData) => {
    try {
      const response = await Promise.race([
        fetch(`${API_URL}/api/collaborations/${collaborationId}/apply`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(applicationData),
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 5000)
        )
      ]);
      return handleResponse(response);
    } catch (error) {
      console.warn('Apply collaboration API not available, using demo response');
      return {
        success: true,
        data: {
          id: Date.now(),
          collaborationId: collaborationId,
          appliedDate: new Date().toISOString(),
          status: "pending",
          ...applicationData
        }
      };
    }
  },

  // Get collaboration by ID
  getCollaborationById: async (id) => {
    try {
      const response = await Promise.race([
        fetch(`${API_URL}/api/collaborations/${id}`, {
          method: 'GET',
          headers: getAuthHeaders(),
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 5000)
        )
      ]);
      return handleResponse(response);
    } catch (error) {
      console.warn('Collaboration details API not available, using demo data');
      const allCollaborations = await this.getAllCollaborations();
      const collaboration = allCollaborations.data.find(c => c.id === parseInt(id));
      return {
        success: true,
        data: collaboration || null
      };
    }
  },

  // Get collaboration stats
  getCollaborationStats: async () => {
    try {
      const response = await Promise.race([
        fetch(`${API_URL}/api/collaborations/stats`, {
          method: 'GET',
          headers: getAuthHeaders(),
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 5000)
        )
      ]);
      return handleResponse(response);
    } catch (error) {
      console.warn('Collaboration stats API not available, using demo data');
      return {
        success: true,
        data: {
          totalOpportunities: 5,
          appliedApplications: 3,
          acceptedApplications: 1,
          pendingApplications: 1,
          averageMatch: 87,
          totalBudget: "$395K - $690K"
        }
      };
    }
  }
};

export default {
  ideasAPI,
  entrepreneurAPI,
  investorAPI,
  fundingAPI,
  notificationsAPI,
  investorInterestAPI,
  analyticsAPI,
  ideathonsAPI,
  collaborationsAPI,
};
