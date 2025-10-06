// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Global connection state for serverless
let isConnected = false;

const initDB = async () => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
      console.log('Database connected in serverless function');
    } catch (error) {
      console.error('Database connection error:', error);
      throw error;
    }
  }
};

app.use(express.json({ limit: '10mb' }));

// Note: Static file serving removed for serverless compatibility
// In production, use cloud storage for file uploads

// API endpoint for business aims (instead of serving static HTML)
app.get('/admin/businessaims', (req, res) => {
    res.json({ 
        message: 'Business Aims API endpoint',
        note: 'Use frontend route for UI'
    });
});

// API Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/ideas', require('./routes/idea.routes'));
app.use('/api/investors', require('./routes/investor.routes'));
app.use('/api/funding', require('./routes/funding.routes'));
app.use('/api/team', require('./routes/teamResource.routes'));
app.use('/api/aims', require('./routes/businessAim.routes'));
app.use('/api/sustainability', require('./routes/sustainability.routes'));
app.use('/api/feedback', require('./routes/feedback.routes'));
app.use('/api/ideathons', require('./routes/ideathon.routes'));
app.use('/api/reports', require('./routes/report.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/charts', require('./routes/chart.routes'));

app.use(errorHandler);

// Health Check Route
app.get('/', (req, res) => {
    res.json({ 
        message: 'StartSmart API is running...',
        cors: 'enabled',
        timestamp: new Date().toISOString()
    });
});

// CORS Test Route
app.get('/api/cors-test', (req, res) => {
    res.json({ 
        message: 'CORS test successful',
        origin: req.headers.origin,
        method: req.method,
        timestamp: new Date().toISOString()
    });
});

// Export for Vercel serverless functions
module.exports = async (req, res) => {
  try {
    await initDB();
    return app(req, res);
  } catch (error) {
    console.error('Serverless function error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};

// For local development
if (require.main === module) {
  const PORT = process.env.PORT || 5001;
  initDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  }).catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}