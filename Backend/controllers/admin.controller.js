// controllers/admin.controller.js
const User = require('../models/User.model');
const Idea = require('../models/Idea.model');
const AdminAction = require('../models/AdminAction.model');
const generateToken = require('../utils/generateToken');

// @desc    Admin login
exports.loginAdmin = (req, res, next) => { /* ... (already implemented, no changes needed) */ };

// @desc    Get all users (entrepreneurs)
exports.getAllUsers = async (req, res, next) => { /* ... (already implemented) */ };

// @desc    Change a user's role
// @route   PUT /api/admin/users/:id/role
exports.changeUserRole = async (req, res, next) => {
    try {
        const { role } = req.body;
        if (!['entrepreneur', 'investor', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role specified.' });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const oldRole = user.role;
        user.role = role;
        await user.save();
        
        // Log the admin action
        await AdminAction.create({
            admin: req.user.id,
            actionType: 'changeRole',
            targetId: user._id,
            targetModel: 'User',
            details: `Role changed from '${oldRole}' to '${role}' for user ${user.email}`
        });

        res.json({ message: 'User role updated successfully.', user });
    } catch (error) {
        next(error);
    }
};

// @desc    Admin deletes a user
// @route   DELETE /api/admin/users/:id
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        await user.deleteOne();
        
        // Log the admin action
        await AdminAction.create({
            admin: req.user.id,
            actionType: 'deleteUser',
            targetId: req.params.id,
            targetModel: 'User',
            details: `Deleted user ${user.email}`
        });

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// @desc    Admin deletes an idea
// @route   DELETE /api/admin/ideas/:id
exports.deleteIdea = async (req, res, next) => {
    try {
        const idea = await Idea.findById(req.params.id);
        if (!idea) return res.status(404).json({ message: 'Idea not found' });

        await idea.deleteOne();
        
        // Log the admin action
        await AdminAction.create({
            admin: req.user.id,
            actionType: 'deleteIdea',
            targetId: req.params.id,
            targetModel: 'Idea',
            details: `Deleted idea titled "${idea.title}"`
        });
        
        res.json({ message: 'Idea deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// @desc    View admin activity logs
// @route   GET /api/admin/activities
exports.getAdminActivities = async (req, res, next) => {
    try {
        const activities = await AdminAction.find()
            .populate('admin', 'name email')
            .sort({ createdAt: -1 });
        res.json(activities);
    } catch (error) {
        next(error);
    }
};