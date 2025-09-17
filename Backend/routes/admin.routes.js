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
    getAdminActivities
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

module.exports = router;