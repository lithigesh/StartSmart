// routes/notification.routes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const {
    getUserNotifications,
    getUnreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    clearAllNotifications,
    createNotification
} = require('../controllers/notification.controller');

// All routes are for the currently logged-in user
router.route('/')
    .get(protect, getUserNotifications)
    .post(protect, createNotification); // For system-generated notifications

router.route('/count')
    .get(protect, getUnreadCount);

router.route('/mark-all-read')
    .put(protect, markAllNotificationsAsRead);

router.route('/clear-all')
    .delete(protect, clearAllNotifications);

router.route('/:id/read')
    .put(protect, markNotificationAsRead);

router.route('/:id')
    .delete(protect, deleteNotification);

module.exports = router;