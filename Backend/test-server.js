// test-server.js - Minimal version for testing
require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json());

// Simple test route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Test server is working',
        timestamp: new Date().toISOString(),
        env: {
            NODE_ENV: process.env.NODE_ENV,
            MONGO_URI: process.env.MONGO_URI ? 'SET' : 'NOT_SET'
        }
    });
});

app.get('/api/test', (req, res) => {
    res.json({ 
        message: 'API test endpoint working',
        method: req.method,
        url: req.url
    });
});

// Export for Vercel
module.exports = async (req, res) => {
    try {
        // Add CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        
        if (req.method === 'OPTIONS') {
            return res.status(200).end();
        }

        console.log('Test function called:', req.method, req.url);
        return app(req, res);
    } catch (error) {
        console.error('Test function error:', error);
        return res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
};

// Local development
if (require.main === module) {
    const PORT = process.env.PORT || 5002;
    app.listen(PORT, () => console.log(`Test server running on port ${PORT}`));
}