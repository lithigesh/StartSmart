// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Initialize database connection with retries
const initializeDB = async () => {
    let retries = 5;
    while (retries > 0) {
        try {
            await connectDB();
            console.log('Database connection successful');
            return;
        } catch (error) {
            console.error(`Database connection failed. Retries left: ${retries-1}`);
            retries--;
            if (retries === 0) {
                console.error('Could not connect to the database after multiple attempts');
                process.exit(1);
            }
            // Wait for 5 seconds before retrying
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
};

initializeDB();
// Configure CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
edentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve the BusinessAims viewer page
app.get('/admin/businessaims', (req, res) => {
    res.sendFile(path.join(__dirname, 'businessaims-viewer.html'));
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
app.use('/api/app-feedback', require('./routes/appFeedback.routes'));

app.use(errorHandler);
// Health Check Route
app.get('/', (req, res) => {
    res.send(`
        <h2>StartSmart API is running...</h2>
        <p>View full backend documentation here:</p>
        <a href="https://github.com/lithigesh/StartSmart/blob/main/Backend/README.md" target="_blank">
            📄 StartSmart Backend Documentation
        </a>
    `);
});


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));