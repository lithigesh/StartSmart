// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of 30 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            family: 4, // Use IPv4, skip trying IPv6
            retryWrites: true,
            retryReads: true,
            maxPoolSize: 50,
            minPoolSize: 10
        });

        mongoose.connection.on('connected', () => {
            console.log(`MongoDB Connected: ${conn.connection.host}`);
        });

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

        // If Node process ends, close the MongoDB connection
        process.on('SIGINT', async () => {
            try {
                await mongoose.connection.close();
                console.log('MongoDB connection closed through app termination');
                process.exit(0);
            } catch (err) {
                console.error('Error closing MongoDB connection:', err);
                process.exit(1);
            }
        });

        return conn;
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        // Instead of exiting, we'll throw the error to be handled by the caller
        throw error;
    }
};

module.exports = connectDB;