import { API_URL } from '../config/config';

export const ideasAPI = {
    /**
     * Fetch user's ideas from the server
     * @returns {Promise<{success: boolean, data: Array, message: string}>}
     */
    getUserIdeas: async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${API_URL}/api/ideas/user`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch ideas');
            }

            return {
                success: true,
                data: data.data || [],
                message: data.message
            };

        } catch (error) {
            console.error('Error fetching ideas:', error);
            throw error;
        }
    }
};