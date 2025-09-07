// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const {
    registerUser,
    loginUser,
    getMe,
    updateUserProfile,
    deleteUserAccount,
    getUserHistory
} = require('../controllers/auth.controller');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateUserProfile);
router.delete('/profile', protect, deleteUserAccount);
router.get('/users/:id/history', protect, getUserHistory);

module.exports = router;