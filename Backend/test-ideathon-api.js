const axios = require('axios');

const API_BASE = 'http://localhost:5001';

async function testIdeathonAPI() {
    try {
        console.log('🔄 Testing Ideathon API...');
        
        // 1. Login as admin
        console.log('1. Logging in as admin...');
        const loginResponse = await axios.post(`${API_BASE}/api/admin/login`, {
            email: 'admin@startsmart.com',
            password: 'StartSmart@Admin2025'
        });
        
        const token = loginResponse.data.token;
        console.log('✅ Admin login successful');
        
        // 2. Get all ideathons
        console.log('2. Fetching all ideathons...');
        const ideathonsResponse = await axios.get(`${API_BASE}/api/ideathons`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log(`✅ Found ${ideathonsResponse.data.length} ideathons`);
        
        // 3. Create a new ideathon
        console.log('3. Creating a new ideathon...');
        const newIdeathon = {
            title: 'Test Innovation Challenge 2025',
            theme: 'Artificial Intelligence & Sustainability',
            fundingPrizes: '1st Place: $75,000, 2nd Place: $35,000, 3rd Place: $15,000',
            startDate: new Date('2025-10-01T09:00:00Z'),
            endDate: new Date('2025-11-30T23:59:59Z')
        };
        
        const createResponse = await axios.post(`${API_BASE}/api/ideathons`, newIdeathon, {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Ideathon created successfully:', createResponse.data.title);
        
        // 4. Get updated list
        console.log('4. Fetching updated ideathon list...');
        const updatedResponse = await axios.get(`${API_BASE}/api/ideathons`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log(`✅ Updated count: ${updatedResponse.data.length} ideathons`);
        
        console.log('\n🎉 All ideathon API tests passed!');
        
    } catch (error) {
        console.error('❌ API Test failed:', error.response?.data || error.message);
    }
}

testIdeathonAPI();