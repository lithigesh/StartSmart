// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

connectDB();
const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/ideas', require('./routes/idea.routes'));
app.use('/api/investors', require('./routes/investor.routes'));
app.use('/api/funding', require('./routes/funding.routes'));
app.use('/api/sustainability', require('./routes/sustainability.routes'));
app.use('/api/feedback', require('./routes/feedback.routes'));
app.use('/api/ideathons', require('./routes/ideathon.routes'));
app.use('/api/reports', require('./routes/report.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

app.use(errorHandler);

// Health Check Route
app.get('/', (req, res) => {
    res.send('StartSmart API is running...');
});


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));