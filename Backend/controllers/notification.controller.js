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


// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markNotificationAsRead = async (req, res, next) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) return res.status(404).json({ message: 'Notification not found' });
        if (notification.user.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

        notification.read = true;
        await notification.save();
        res.json(notification);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
exports.deleteNotification = async (req, res, next) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) return res.status(404).json({ message: 'Notification not found' });
        if (notification.user.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
        
        await notification.deleteOne();
        res.json({ message: 'Notification removed' });
    } catch (error) {
        next(error);
    }
};