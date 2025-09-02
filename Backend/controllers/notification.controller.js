// controllers/notification.controller.js
const Notification = require('../models/Notification.model');

// @desc    List all notifications for the logged-in user
// @route   GET /api/notifications
exports.getUserNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find({ user: req.user.id })
            .sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        next(error);
    }
};

// @desc    Mark a specific notification as read
// @route   PUT /api/notifications/:id/read
exports.markNotificationAsRead = async (req, res, next) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        // Security check: ensure the notification belongs to the user
        if (notification.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        notification.read = true;
        await notification.save();
        res.json(notification);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
exports.deleteNotification = async (req, res, next) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        if (notification.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        await notification.deleteOne();
        res.json({ message: 'Notification deleted successfully' });
    } catch (error) {
        next(error);
    }
};