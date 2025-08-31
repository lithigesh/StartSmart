// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getMe,
    updateUserProfile,
    deleteUserAccount,
} = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

// Use /profile for actions on the currently authenticated user
router.route('/profile')
    .get(protect, getMe)
    .put(protect, updateUserProfile)
    .delete(protect, deleteUserAccount);

// Note: I'm using /profile instead of /:id for security.
// This prevents a user from trying to update/delete another user's account.
// The user is identified by their token.

module.exports = router;


