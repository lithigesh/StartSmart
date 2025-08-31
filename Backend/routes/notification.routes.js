// routes/notification.routes.js
const express = require('express');
const router = express.Router();
const { getNotifications } = require('../controllers/notification.controller');
const { protect } = require('../middlewares/auth.middleware');

router.get('/:userId', protect, getNotifications);

module.exports = router;