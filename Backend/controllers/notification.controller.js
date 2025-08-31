// controllers/notification.controller.js
const Notification = require('../models/Notification.model');

// @desc    Get notifications for a user
// @route   GET /api/notifications/:userId
// @access  Private
exports.getNotifications = async (req, res, next) => {
    try {
        if (req.user.id !== req.params.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const notifications = await Notification.find({ user: req.params.userId })
            .sort({ createdAt: -1 });

        res.json(notifications);

        // Optional: Mark notifications as read after fetching
        // await Notification.updateMany({ user: req.params.userId, read: false }, { read: true });

    } catch (error) {
        next(error);
    }
};