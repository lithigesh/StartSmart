const axios = require('axios');

const testNotifications = async () => {
    try {
        // Login first
        const loginResponse = await axios.post('http://localhost:5001/api/auth/login', {
            email: 'entrepreneur@startsmart.com',
            password: 'password123'
        });
        
        const { token } = loginResponse.data;
        
        // Test notifications endpoint
        const notificationsResponse = await axios.get('http://localhost:5001/api/notifications', {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('Notifications response type:', typeof notificationsResponse.data);
        console.log('Notifications response:', notificationsResponse.data);
        console.log('Is array?', Array.isArray(notificationsResponse.data));
        
    } catch (error) {
        console.log('Error:', error.response?.status, error.response?.data);
    }
};

testNotifications();