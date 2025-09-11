// controllers/admin.controller.js
const User = require('../models/User.model');
const Idea = require('../models/Idea.model');
const AdminAction = require('../models/AdminAction.model');
const generateToken = require('../utils/generateToken');

// @desc    Admin login - single step authentication
// @route   POST /api/admin/login
// @access  Public (but validates admin credentials from .env)
exports.adminLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        // Get admin credentials from environment
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@startsmart.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'StartSmart@Admin2025';
        
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        
        // Verify admin credentials match environment variables
        if (email !== adminEmail || password !== adminPassword) {
            // Log failed admin login attempt
            await AdminAction.create({
                actionType: 'failedAdminLogin',
                details: `Failed admin login attempt for email: ${email} from ${req.ip}`,
                admin: null
            });
            
            return res.status(401).json({ message: 'Invalid admin credentials' });
        }
        
        // Find or create admin user in database
        let adminUser = await User.findOne({ email: adminEmail });
        
        if (!adminUser) {
            // Create admin user if doesn't exist
            adminUser = new User({
                name: process.env.ADMIN_NAME || 'StartSmart Administrator',
                email: adminEmail,
                password: adminPassword,
                role: 'admin',
                settings: {
                    darkMode: false,
                    notifications: 'both'
                }
            });
            await adminUser.save();
        } else {
            // Update admin user to ensure it has admin role
            adminUser.role = 'admin';
            await adminUser.save();
        }
        
        // Generate JWT token
        const token = generateToken(adminUser._id);
        
        // Log successful admin login
        await AdminAction.create({
            admin: adminUser._id,
            actionType: 'adminLogin',
            details: `Successful admin login from ${req.ip}`
        });
        
        res.json({
            message: 'Admin login successful',
            token,
            user: {
                id: adminUser._id,
                name: adminUser.name,
                email: adminUser.email,
                role: adminUser.role
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Admin verification endpoint (legacy - keeping for compatibility)
// @route   POST /api/admin/verify
// @access  Private (requires valid admin JWT)
exports.verifyAdminPassword = async (req, res, next) => {
    try {
        const { adminPassword } = req.body;
        const correctAdminPassword = process.env.ADMIN_VERIFICATION_PASSWORD || 'StartSmart@Admin2025';
        
        if (!adminPassword) {
            return res.status(400).json({ message: 'Admin password is required' });
        }
        
        if (adminPassword !== correctAdminPassword) {
            // Log failed admin verification attempt
            await AdminAction.create({
                admin: req.user.id,
                actionType: 'failedAdminVerification',
                details: `Failed admin password verification from ${req.ip}`
            });
            
            return res.status(401).json({ message: 'Invalid admin verification password' });
        }
        
        // Log successful admin verification
        await AdminAction.create({
            admin: req.user.id,
            actionType: 'adminVerification',
            details: `Successful admin verification from ${req.ip}`
        });
        
        res.json({ 
            message: 'Admin verification successful',
            verified: true 
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({})
            .select('-password')
            .sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        next(error);
    }
};

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