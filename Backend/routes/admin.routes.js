// routes/admin.routes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/role.middleware');
const {
    adminLogin,
    verifyAdminPassword,
    getAllUsers,
    getAllIdeas,
    getIdeaById,
    changeUserRole,
    deleteUser,
    deleteIdea,
    getAdminActivities,
    // Feedback management
    getAllFeedback,
    createFeedback,
    updateFeedback,
    deleteFeedback,
    // Analytics
    getDashboardAnalytics,
    getChartData,
    // Reports
    generateReport
} = require('../controllers/admin.controller');

// Public Admin Login Route (no middleware needed)
router.post('/login', adminLogin);

// Admin verification endpoint (requires JWT from regular login) - LEGACY
router.post('/verify', protect, isAdmin, verifyAdminPassword);

// Protected Admin Routes
router.get('/users', protect, isAdmin, getAllUsers);
router.get('/ideas', protect, isAdmin, getAllIdeas);
router.get('/ideas/:id', protect, isAdmin, getIdeaById);
router.put('/users/:id/role', protect, isAdmin, changeUserRole);
router.delete('/users/:id', protect, isAdmin, deleteUser);
router.delete('/ideas/:id', protect, isAdmin, deleteIdea);
router.get('/activities', protect, isAdmin, getAdminActivities);

// Feedback Routes
router.get('/feedback', protect, isAdmin, getAllFeedback);
router.post('/feedback', protect, isAdmin, createFeedback);
router.put('/feedback/:id', protect, isAdmin, updateFeedback);
router.delete('/feedback/:id', protect, isAdmin, deleteFeedback);

// Analytics Routes
router.get('/analytics/dashboard', protect, isAdmin, getDashboardAnalytics);
router.get('/analytics/charts', protect, isAdmin, getChartData);

// Report Generation Routes
router.get('/reports/:type', protect, isAdmin, generateReport);

module.exports = router;