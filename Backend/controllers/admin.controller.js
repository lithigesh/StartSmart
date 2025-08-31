// controllers/admin.controller.js
const User = require('../models/User.model');
const Idea = require('../models/Idea.model');
const generateToken = require('../utils/generateToken');

// @desc    Authenticate admin and get token
// @route   POST /api/admin/login
// @access  Public
exports.loginAdmin = (req, res, next) => {
    const { id, password } = req.body;

    // Check credentials against environment variables
    if (id === process.env.ADMIN_ID && password === process.env.ADMIN_PASSWORD) {
        // Credentials are correct, generate a specific admin token
        const token = generateToken({ id: 'admin_user', role: 'admin' });
        res.json({
            message: 'Admin login successful',
            token: token,
        });
    } else {
        // Incorrect credentials
        res.status(401).json({ message: 'Invalid admin credentials' });
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({ role: 'entrepreneur' });
        res.json(users);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all investors
// @route   GET /api/admin/investors
// @access  Private (Admin)
exports.getAllInvestors = async (req, res, next) => {
    try {
        const investors = await User.find({ role: 'investor' });
        res.json(investors);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all ideas
// @route   GET /api/admin/ideas
// @access  Private (Admin)
exports.getAllIdeas = async (req, res, next) => {
    try {
        const ideas = await Idea.find({}).populate('owner', 'name email');
        res.json(ideas);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a user or investor by ID
// @route   DELETE /api/admin/users/:id
// @route   DELETE /api/admin/investors/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await user.deleteOne();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete an idea by ID
// @route   DELETE /api/admin/ideas/:id
// @access  Private (Admin)
exports.deleteIdea = async (req, res, next) => {
    try {
        const idea = await Idea.findById(req.params.id);
        if (!idea) {
            return res.status(404).json({ message: 'Idea not found' });
        }
        await idea.deleteOne();
        res.json({ message: 'Idea deleted successfully' });
    } catch (error) {
        next(error);
    }
};