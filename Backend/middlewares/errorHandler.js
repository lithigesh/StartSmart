// middlewares/errorHandler.js

const errorHandler = (err, req, res, next) => {
    // Log the error for debugging purposes
    // In production, you might want to use a more sophisticated logger like Winston
    console.error(err.stack);

    // Set a default status code if one isn't already set
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode).json({
        message: err.message,
        // In development mode, you might want to send the stack trace
        // In production, you should not expose the stack trace
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    });
};

module.exports = errorHandler;