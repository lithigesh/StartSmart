// routes/notification.routes.js
const express = require('express');
const router = express.Router();
const { 
    getNotifications, 
    markNotificationAsRead, 
    deleteNotification 
} = require('../controllers/notification.controller');
const { protect } = require('../middlewares/auth.middleware');

router.get('/:userId', protect, getNotifications);
router.put('/:id/read', protect, markNotificationAsRead);
router.delete('/:id', protect, deleteNotification);

module.exports = router;