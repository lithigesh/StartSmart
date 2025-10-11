import { API_BASE } from './api';

export const ideathonRegistrationAPI = {
  // Register for an ideathon
  register: async (ideathonId, registrationData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${API_BASE}/api/ideathons/${ideathonId}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(registrationData)
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error(data.message || "Invalid registration data");
        }
        if (response.status === 401) {
          throw new Error("Please login to register");
        }
        if (response.status === 403) {
          throw new Error("You don't have permission to register");
        }
        if (response.status === 409) {
          throw new Error("Already registered for this ideathon");
        }
        throw new Error(data.message || "Failed to register");
      }

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }
};