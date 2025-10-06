// config/db.js
const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log('MongoDB already connected');
        return;
    }

    try {
        // Set mongoose options for serverless
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            bufferCommands: false,
            maxPoolSize: 1, // Maintain up to 1 socket connection
        });
        
        isConnected = true;
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        // Handle connection events
        mongoose.connection.on('disconnected', () => {
            isConnected = false;
            console.log('MongoDB disconnected');
        });
        
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
        throw error; // Don't exit process in serverless environment
    }
};

module.exports = connectDB;