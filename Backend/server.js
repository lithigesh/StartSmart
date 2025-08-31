// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// API Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/ideas', require('./routes/idea.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));

// Health Check Route
app.get('/', (req, res) => {
    res.send('StartSmart API is running...');
});

// Global Error Handler (should be the last middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));