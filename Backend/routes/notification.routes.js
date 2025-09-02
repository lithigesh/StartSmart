// routes/notification.routes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const {
    getUserNotifications,
    markNotificationAsRead,
    deleteNotification
} = require('../controllers/notification.controller');

// All routes are for the currently logged-in user
router.route('/')
    .get(protect, getUserNotifications);

router.route('/:id/read')
    .put(protect, markNotificationAsRead);

router.route('/:id')
    .delete(protect, deleteNotification);

module.exports = router;