import { API_URL } from "../config/config";

class IdeathonService {
  async getAllIdeathons() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(`${API_URL}/api/ideathons`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch ideathons");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching ideathons:", error);
      throw error;
    }
  }

  async getUserRegistrations() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `${API_URL}/api/ideathons/my-registrations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch registrations");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching registrations:", error);
      throw error;
    }
  }

  async registerForIdeathon(ideathonId, registrationData) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `${API_URL}/api/ideathons/${ideathonId}/register`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(registrationData),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error registering for ideathon:", error);
      throw error;
    }
  }
}

export const ideathonService = new IdeathonService();
