// controllers/notification.controller.js
const Notification = require('../models/Notification.model');

// @desc    List all notifications for the logged-in user
// @route   GET /api/notifications
exports.getUserNotifications = async (req, res, next) => {
    try {
        const { page = 1, limit = 50, unreadOnly = false } = req.query;
        const query = { 
            user: req.user.id,
            // Remove expired notifications
            $or: [
                { expiresAt: { $exists: false } },
                { expiresAt: null },
                { expiresAt: { $gt: new Date() } }
            ]
        };
        
        if (unreadOnly === 'true') {
            query.read = false;
        }

        const notifications = await Notification.find(query)
            .populate('relatedIdea', 'title category')
            .populate('relatedUser', 'name')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Notification.countDocuments(query);
        const unreadCount = await Notification.countDocuments({ 
            user: req.user.id, 
            read: false,
            $or: [
                { expiresAt: { $exists: false } },
                { expiresAt: null },
                { expiresAt: { $gt: new Date() } }
            ]
        });

        res.json({
            notifications,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalNotifications: total,
            unreadCount,
            hasMore: page * limit < total
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get unread notification count
// @route   GET /api/notifications/count
exports.getUnreadCount = async (req, res, next) => {
    try {
        const unreadCount = await Notification.countDocuments({ 
            user: req.user.id, 
            read: false,
            $or: [
                { expiresAt: { $exists: false } },
                { expiresAt: null },
                { expiresAt: { $gt: new Date() } }
            ]
        });
        res.json({ unreadCount });
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

// @desc    Mark all notifications as read for the user
// @route   PUT /api/notifications/mark-all-read
exports.markAllNotificationsAsRead = async (req, res, next) => {
    try {
        await Notification.updateMany(
            { user: req.user.id, read: false },
            { read: true }
        );
        res.json({ message: 'All notifications marked as read' });
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

// @desc    Delete all notifications for the user
// @route   DELETE /api/notifications/clear-all
exports.clearAllNotifications = async (req, res, next) => {
    try {
        await Notification.deleteMany({ user: req.user.id });
        res.json({ message: 'All notifications cleared successfully' });
    } catch (error) {
        next(error);
    }
};

// @desc    Create a new notification (for system use)
// @route   POST /api/notifications
exports.createNotification = async (req, res, next) => {
    try {
        const { userId, title, message, type, relatedIdea, relatedUser, actionUrl, priority, expiresAt } = req.body;
        
        const notification = await Notification.create({
            user: userId,
            title,
            message,
            type,
            relatedIdea,
            relatedUser,
            actionUrl,
            priority,
            expiresAt
        });

        await notification.populate('relatedIdea', 'title category');
        await notification.populate('relatedUser', 'name');

        res.status(201).json(notification);
    } catch (error) {
        next(error);
    }
};