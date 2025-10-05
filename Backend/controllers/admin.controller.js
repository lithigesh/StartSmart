// controllers/admin.controller.js
const User = require('../models/User.model');
const Idea = require('../models/Idea.model');
const Ideathon = require('../models/Ideathon.model');
const IdeathonRegistration = require('../models/IdeathonRegistration.model');
const Feedback = require('../models/Feedback.model');
const Sustainability = require('../models/Sustainability.model');
const AdminAction = require('../models/AdminAction.model');
const generateToken = require('../utils/generateToken');

// Helper function to get analytics data for reports
const getAnalyticsData = async (dateFilter = {}) => {
    try {
        // Get user statistics
        const userStats = await User.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: null,
                    totalUsers: { $sum: 1 },
                    entrepreneurs: { $sum: { $cond: [{ $eq: ['$role', 'entrepreneur'] }, 1, 0] } },
                    investors: { $sum: { $cond: [{ $eq: ['$role', 'investor'] }, 1, 0] } },
                    admins: { $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] } }
                }
            }
        ]);

        // Get idea statistics
        const ideaStats = await Idea.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: null,
                    totalIdeas: { $sum: 1 },
                    approvedIdeas: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } },
                    pendingIdeas: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
                    rejectedIdeas: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } }
                }
            }
        ]);

        // Get ideathon statistics
        const ideathonStats = await Ideathon.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: null,
                    totalIdeathons: { $sum: 1 },
                    activeIdeathons: { 
                        $sum: { 
                            $cond: [
                                { 
                                    $and: [
                                        { $lte: ['$startDate', new Date()] },
                                        { $gte: ['$endDate', new Date()] }
                                    ]
                                }, 
                                1, 
                                0
                            ] 
                        }
                    }
                }
            }
        ]);

        // Get feedback statistics
        const feedbackStats = await Feedback.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: null,
                    totalFeedback: { $sum: 1 },
                    averageRating: { $avg: '$rating' }
                }
            }
        ]);

        return {
            users: userStats[0] || { totalUsers: 0, entrepreneurs: 0, investors: 0, admins: 0 },
            ideas: ideaStats[0] || { totalIdeas: 0, approvedIdeas: 0, pendingIdeas: 0, rejectedIdeas: 0 },
            ideathons: ideathonStats[0] || { totalIdeathons: 0, activeIdeathons: 0 },
            feedback: feedbackStats[0] || { totalFeedback: 0, averageRating: 0 }
        };
    } catch (error) {
        throw error;
    }
};

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

// @desc    Admin gets all ideas
// @route   GET /api/admin/ideas
exports.getAllIdeas = async (req, res, next) => {
    try {
        const ideas = await Idea.find({})
            .populate('owner', 'name email')
            .sort({ createdAt: -1 });
        
        res.json(ideas);
    } catch (error) {
        next(error);
    }
};

// @desc    Get a single idea by ID
// @route   GET /api/admin/ideas/:id
exports.getIdeaById = async (req, res, next) => {
    try {
        const idea = await Idea.findById(req.params.id)
            .populate('owner', 'name email');
        
        if (!idea) {
            return res.status(404).json({ message: 'Idea not found' });
        }
        
        res.json(idea);
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





// ========== ANALYTICS & DASHBOARD ==========

// @desc    Get dashboard analytics
// @route   GET /api/admin/analytics/dashboard
// @access  Private (Admin only)
exports.getDashboardAnalytics = async (req, res, next) => {
    try {
        const { dateRange } = req.query;
        let dateFilter = {};
        
        // Temporarily disable date filtering to test if data exists

        
        if (dateRange && false) { // Temporarily disabled
            const { start, end } = JSON.parse(dateRange);
            dateFilter = {
                createdAt: {
                    $gte: new Date(start),
                    $lte: new Date(end)
                }
            };
        }




        // Get user statistics
        const userStats = await User.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: null,
                    totalUsers: { $sum: 1 },
                    entrepreneurs: { $sum: { $cond: [{ $eq: ['$role', 'entrepreneur'] }, 1, 0] } },
                    investors: { $sum: { $cond: [{ $eq: ['$role', 'investor'] }, 1, 0] } },
                    admins: { $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] } }
                }
            }
        ]);
        

        // Get user growth by month
        const userGrowth = await User.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 },
                    entrepreneurs: { $sum: { $cond: [{ $eq: ['$role', 'entrepreneur'] }, 1, 0] } },
                    investors: { $sum: { $cond: [{ $eq: ['$role', 'investor'] }, 1, 0] } }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // Get idea statistics
        const ideaStats = await Idea.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: null,
                    totalIdeas: { $sum: 1 },
                    approvedIdeas: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } },
                    pendingIdeas: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
                    rejectedIdeas: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } }
                }
            }
        ]);

        // Get ideas by category
        const ideasByCategory = await Idea.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    approved: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Get ideathon statistics
        const ideathonStats = await Ideathon.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: null,
                    totalIdeathons: { $sum: 1 },
                    activeIdeathons: { 
                        $sum: { 
                            $cond: [
                                { 
                                    $and: [
                                        { $lte: ['$startDate', new Date()] },
                                        { $gte: ['$endDate', new Date()] }
                                    ]
                                }, 
                                1, 
                                0
                            ] 
                        }
                    },
                    upcomingIdeathons: {
                        $sum: { $cond: [{ $gt: ['$startDate', new Date()] }, 1, 0] }
                    },
                    completedIdeathons: {
                        $sum: { $cond: [{ $lt: ['$endDate', new Date()] }, 1, 0] }
                    }
                }
            }
        ]);

        // Get feedback statistics
        const feedbackStats = await Feedback.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: null,
                    totalFeedback: { $sum: 1 },
                    averageRating: { $avg: '$rating' },
                    positiveCount: { $sum: { $cond: [{ $gte: ['$rating', 4] }, 1, 0] } },
                    negativeCount: { $sum: { $cond: [{ $lte: ['$rating', 2] }, 1, 0] } }
                }
            }
        ]);

        // Get sustainability statistics
        const sustainabilityStats = await Sustainability.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: null,
                    totalAssessments: { $sum: 1 },
                    averageScore: { $avg: '$overallScore' },
                    averageEnvironmental: { $avg: '$environmentalImpact.score' },
                    averageSocial: { $avg: '$socialImpact.score' },
                    averageEconomic: { $avg: '$economicSustainability.score' }
                }
            }
        ]);

        const responseData = {
            users: userStats[0] || {
                totalUsers: 0,
                entrepreneurs: 0,
                investors: 0,
                admins: 0
            },
            userGrowth,
            ideas: ideaStats[0] || {
                totalIdeas: 0,
                approvedIdeas: 0,
                pendingIdeas: 0,
                rejectedIdeas: 0
            },
            ideasByCategory,
            ideathons: ideathonStats[0] || {
                totalIdeathons: 0,
                activeIdeathons: 0,
                upcomingIdeathons: 0,
                completedIdeathons: 0
            },
            feedback: feedbackStats[0] || {
                totalFeedback: 0,
                averageRating: 0,
                positiveCount: 0,
                negativeCount: 0
            },
            sustainability: sustainabilityStats[0] || {
                totalAssessments: 0,
                averageScore: 0,
                averageEnvironmental: 0,
                averageSocial: 0,
                averageEconomic: 0
            }
        };


        res.json(responseData);
    } catch (error) {
        next(error);
    }
};

// @desc    Get chart data for visualization
// @route   GET /api/admin/analytics/charts
// @access  Private (Admin only)
exports.getChartData = async (req, res, next) => {
    try {
        const { type, dateRange } = req.query;
        let dateFilter = {};
        
        if (dateRange) {
            try {
                const { start, end } = JSON.parse(dateRange);
                dateFilter = {
                    createdAt: {
                        $gte: new Date(start),
                        $lte: new Date(end)
                    }
                };
                console.log('Chart data dateFilter:', dateFilter);
            } catch (e) {
                console.log('Date parsing error:', e);
                // If date parsing fails, don't apply date filter
                dateFilter = {};
            }
        }
        
        console.log('Fetching chart data for type:', type, 'with filter:', dateFilter);

        let chartData = {};

        switch (type) {
            case 'users':
                chartData = await User.aggregate([
                    { 
                        $match: {
                            ...dateFilter,
                            createdAt: { $exists: true, $type: "date" }
                        }
                    },
                    {
                        $group: {
                            _id: {
                                year: { $year: '$createdAt' },
                                month: { $month: '$createdAt' },
                                day: { $dayOfMonth: '$createdAt' }
                            },
                            count: { $sum: 1 }
                        }
                    },
                    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
                ]);
                break;

            case 'ideas':
                // First, let's debug what ideas exist
                const totalIdeasCount = await Idea.countDocuments();
                console.log('Total ideas in database:', totalIdeasCount);
                
                const allIdeas = await Idea.find({}).select('_id title status createdAt');
                console.log('All ideas from database:', JSON.stringify(allIdeas, null, 2));
                
                chartData = await Idea.aggregate([
                    // Since all ideas have valid createdAt dates, use them directly
                    {
                        $group: {
                            _id: {
                                year: { $year: '$createdAt' },
                                month: { $month: '$createdAt' },
                                day: { $dayOfMonth: '$createdAt' }
                            },
                            count: { $sum: 1 },
                            approved: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } },
                            pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
                            rejected: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } },
                            funding_requested: { $sum: { $cond: [{ $eq: ['$status', 'funding_requested'] }, 1, 0] } }
                        }
                    },
                    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
                ]);
                console.log('Chart data for ideas:', JSON.stringify(chartData, null, 2));
                break;

            case 'ideathons':
                chartData = await Ideathon.aggregate([
                    { 
                        $match: {
                            ...dateFilter,
                            createdAt: { $exists: true, $type: "date" }
                        }
                    },
                    {
                        $group: {
                            _id: {
                                year: { $year: '$createdAt' },
                                month: { $month: '$createdAt' }
                            },
                            count: { $sum: 1 }
                        }
                    },
                    { $sort: { '_id.year': 1, '_id.month': 1 } }
                ]);
                break;

            case 'feedback':
                chartData = await Feedback.aggregate([
                    { 
                        $match: {
                            ...dateFilter,
                            createdAt: { $exists: true, $type: "date" }
                        }
                    },
                    {
                        $group: {
                            _id: {
                                year: { $year: '$createdAt' },
                                month: { $month: '$createdAt' },
                                day: { $dayOfMonth: '$createdAt' }
                            },
                            count: { $sum: 1 },
                            averageRating: { $avg: '$rating' },
                            positive: { $sum: { $cond: [{ $gte: ['$rating', 4] }, 1, 0] } },
                            negative: { $sum: { $cond: [{ $lte: ['$rating', 2] }, 1, 0] } }
                        }
                    },
                    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
                ]);
                break;

            case 'sustainability':
                chartData = await Sustainability.aggregate([
                    { 
                        $match: {
                            ...dateFilter,
                            createdAt: { $exists: true, $type: "date" }
                        }
                    },
                    {
                        $group: {
                            _id: {
                                year: { $year: '$createdAt' },
                                month: { $month: '$createdAt' },
                                day: { $dayOfMonth: '$createdAt' }
                            },
                            count: { $sum: 1 },
                            averageScore: { $avg: '$overallScore' },
                            environmental: { $avg: '$environmentalImpact.score' },
                            social: { $avg: '$socialImpact.score' },
                            economic: { $avg: '$economicSustainability.score' }
                        }
                    },
                    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
                ]);
                break;

            default:
                return res.status(400).json({ message: 'Invalid chart type' });
        }

        console.log(`Chart data for ${type}:`, JSON.stringify(chartData, null, 2));
        res.json({ type, data: chartData });
    } catch (error) {
        console.error('Chart data error:', error);
        next(error);
    }
};

// ========== REPORT GENERATION ==========

// @desc    Generate and download report
// @route   GET /api/admin/reports/:type
// @access  Private (Admin only)
exports.generateReport = async (req, res, next) => {
    try {
        const { type } = req.params;
        const { format = 'json', dateRange } = req.query;
        
        let dateFilter = {};
        if (dateRange) {
            const { start, end } = JSON.parse(dateRange);
            dateFilter = {
                createdAt: {
                    $gte: new Date(start),
                    $lte: new Date(end)
                }
            };
        }

        let reportData = {};
        let fileName = '';

        switch (type) {
            case 'users':
                reportData = await User.find(dateFilter)
                    .select('-password')
                    .populate('ideas', 'title status category')
                    .sort({ createdAt: -1 });
                fileName = `users-report-${new Date().toISOString().split('T')[0]}`;
                break;

            case 'ideas':
                reportData = await Idea.find(dateFilter)
                    .populate('owner', 'name email role')
                    .populate('feedback', 'rating comments admin')
                    .populate('sustainabilityAssessment', 'overallScore environmentalImpact')
                    .sort({ createdAt: -1 });
                fileName = `ideas-report-${new Date().toISOString().split('T')[0]}`;
                break;

            case 'ideathons':
                reportData = await Ideathon.find(dateFilter)
                    .populate({
                        path: 'registrations',
                        populate: {
                            path: 'entrepreneur',
                            select: 'name email'
                        }
                    })
                    .sort({ createdAt: -1 });
                fileName = `ideathons-report-${new Date().toISOString().split('T')[0]}`;
                break;

            case 'feedback':
                reportData = await Feedback.find(dateFilter)
                    .populate('idea', 'title')
                    .populate('admin', 'name email')
                    .populate('investor', 'name email')
                    .sort({ createdAt: -1 });
                fileName = `feedback-report-${new Date().toISOString().split('T')[0]}`;
                break;

            case 'sustainability':
                reportData = await Sustainability.find(dateFilter)
                    .populate('idea', 'title')
                    .populate('assessor', 'name email')
                    .sort({ createdAt: -1 });
                fileName = `sustainability-report-${new Date().toISOString().split('T')[0]}`;
                break;

            case 'analytics':
                // Get analytics data directly instead of calling the controller
                const analyticsData = await getAnalyticsData(dateFilter);
                reportData = analyticsData;
                fileName = `analytics-report-${new Date().toISOString().split('T')[0]}`;
                break;

            default:
                return res.status(400).json({ message: 'Invalid report type' });
        }

        // Log report generation
        await AdminAction.create({
            admin: req.user.id,
            actionType: 'generateReport',
            details: `Generated ${type} report in ${format} format`
        });

        if (format === 'csv') {
            // For CSV format, we'll send JSON with CSV headers
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}.json"`);
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}.json"`);
        }

        res.json({
            reportType: type,
            generatedAt: new Date(),
            generatedBy: req.user.name,
            dateRange: dateRange ? JSON.parse(dateRange) : 'All time',
            data: reportData,
            metadata: {
                totalRecords: Array.isArray(reportData) ? reportData.length : 1,
                format
            }
        });
    } catch (error) {
        next(error);
    }
};

// ========== FEEDBACK MANAGEMENT ==========

// @desc    Get all feedback
// @route   GET /api/admin/feedback
// @access  Private (Admin only)
exports.getAllFeedback = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, ideaId, category, rating } = req.query;
        
        const filter = {};
        if (ideaId) filter.idea = ideaId;
        if (category) filter.category = category;
        if (rating) filter.rating = parseInt(rating);

        const feedbacks = await Feedback.find(filter)
            .populate('idea', 'title description category entrepreneur')
            .populate('admin', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Feedback.countDocuments(filter);

        res.json({
            feedback: feedbacks,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create feedback for an idea
// @route   POST /api/admin/feedback
// @access  Private (Admin only)
exports.createFeedback = async (req, res, next) => {
    try {
        const {
            ideaId,
            rating,
            comments,
            suggestions,
            category,
            strengths = [],
            improvements = [],
            followUpRequired,
            followUpNotes,
            visibility
        } = req.body;

        // Validate required fields
        if (!ideaId || !rating || !comments) {
            return res.status(400).json({
                message: 'Idea ID, rating, and comments are required'
            });
        }

        // Validate idea exists
        const idea = await Idea.findById(ideaId);
        if (!idea) {
            return res.status(404).json({ message: 'Idea not found' });
        }

        const feedback = new Feedback({
            idea: ideaId,
            admin: req.user.id,
            rating,
            comments,
            suggestions,
            category: category || 'general',
            strengths,
            improvements,
            followUpRequired: followUpRequired || false,
            followUpNotes,
            visibility: visibility || 'entrepreneur_only',
            feedbackType: 'admin'
        });

        await feedback.save();

        // Log admin action
        await AdminAction.create({
            admin: req.user.id,
            actionType: 'createFeedback',
            targetId: feedback._id,
            targetModel: 'Feedback',
            details: `Created feedback for idea "${idea.title}" with rating ${rating}/5`
        });

        const populatedFeedback = await Feedback.findById(feedback._id)
            .populate('idea', 'title description category entrepreneur')
            .populate('admin', 'name email');

        res.status(201).json({
            message: 'Feedback created successfully',
            feedback: populatedFeedback
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update feedback
// @route   PUT /api/admin/feedback/:id
// @access  Private (Admin only)
exports.updateFeedback = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const feedback = await Feedback.findById(id);
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        // Check if feedback can be edited
        if (!feedback.canBeEdited()) {
            return res.status(400).json({
                message: 'Feedback cannot be edited after 24 hours or if already reviewed'
            });
        }

        const updatedFeedback = await Feedback.findByIdAndUpdate(
            id,
            { ...updateData, updatedAt: new Date() },
            { new: true }
        ).populate('idea', 'title description category entrepreneur')
         .populate('admin', 'name email');

        // Log admin action
        await AdminAction.create({
            admin: req.user.id,
            actionType: 'updateFeedback',
            targetId: feedback._id,
            targetModel: 'Feedback',
            details: `Updated feedback for idea "${updatedFeedback.idea.title}"`
        });

        res.json({
            message: 'Feedback updated successfully',
            feedback: updatedFeedback
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete feedback
// @route   DELETE /api/admin/feedback/:id
// @access  Private (Admin only)
exports.deleteFeedback = async (req, res, next) => {
    try {
        const { id } = req.params;

        const feedback = await Feedback.findById(id).populate('idea', 'title');
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        await Feedback.findByIdAndDelete(id);

        // Log admin action
        await AdminAction.create({
            admin: req.user.id,
            actionType: 'deleteFeedback',
            targetId: id,
            targetModel: 'Feedback',
            details: `Deleted feedback for idea "${feedback.idea.title}"`
        });

        res.json({ message: 'Feedback deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// ========== SUSTAINABILITY MANAGEMENT ==========

// @desc    Get all sustainability assessments
// @route   GET /api/admin/sustainability
// @access  Private (Admin only)
exports.getAllSustainabilityAssessments = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, ideaId, rank, minScore, maxScore } = req.query;
        
        const filter = {};
        if (ideaId) filter.idea = ideaId;
        if (rank) filter.sustainabilityRank = rank;
        if (minScore || maxScore) {
            filter.overallSustainabilityScore = {};
            if (minScore) filter.overallSustainabilityScore.$gte = parseFloat(minScore);
            if (maxScore) filter.overallSustainabilityScore.$lte = parseFloat(maxScore);
        }

        const assessments = await Sustainability.find(filter)
            .populate('idea', 'title description category entrepreneur')
            .populate('admin', 'name email')
            .sort({ overallSustainabilityScore: -1, createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Sustainability.countDocuments(filter);

        res.json({
            assessments,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create sustainability assessment for an idea
// @route   POST /api/admin/sustainability
// @access  Private (Admin only)
exports.createSustainabilityAssessment = async (req, res, next) => {
    try {
        const {
            ideaId,
            environmentalImpact,
            socialImpact,
            economicSustainability,
            certifications = [],
            sdgAlignment = [],
            recommendations = [],
            visibility
        } = req.body;

        // Validate required fields
        if (!ideaId || !environmentalImpact || !socialImpact || !economicSustainability) {
            return res.status(400).json({
                message: 'Idea ID and all impact assessments are required'
            });
        }

        // Validate idea exists
        const idea = await Idea.findById(ideaId);
        if (!idea) {
            return res.status(404).json({ message: 'Idea not found' });
        }

        const assessment = new Sustainability({
            idea: ideaId,
            admin: req.user.id,
            environmentalImpact,
            socialImpact,
            economicSustainability,
            certifications,
            sdgAlignment,
            recommendations,
            visibility: visibility || 'entrepreneur_only'
        });

        await assessment.save();

        // Log admin action
        await AdminAction.create({
            admin: req.user.id,
            actionType: 'createSustainabilityAssessment',
            targetId: assessment._id,
            targetModel: 'Sustainability',
            details: `Created sustainability assessment for idea "${idea.title}" with score ${assessment.overallSustainabilityScore}/10`
        });

        const populatedAssessment = await Sustainability.findById(assessment._id)
            .populate('idea', 'title description category entrepreneur')
            .populate('admin', 'name email');

        res.status(201).json({
            message: 'Sustainability assessment created successfully',
            assessment: populatedAssessment
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update sustainability assessment
// @route   PUT /api/admin/sustainability/:id
// @access  Private (Admin only)
exports.updateSustainabilityAssessment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const assessment = await Sustainability.findById(id);
        if (!assessment) {
            return res.status(404).json({ message: 'Sustainability assessment not found' });
        }

        const updatedAssessment = await Sustainability.findByIdAndUpdate(
            id,
            { ...updateData, updatedAt: new Date() },
            { new: true }
        ).populate('idea', 'title description category entrepreneur')
         .populate('admin', 'name email');

        // Log admin action
        await AdminAction.create({
            admin: req.user.id,
            actionType: 'updateSustainabilityAssessment',
            targetId: assessment._id,
            targetModel: 'Sustainability',
            details: `Updated sustainability assessment for idea "${updatedAssessment.idea.title}"`
        });

        res.json({
            message: 'Sustainability assessment updated successfully',
            assessment: updatedAssessment
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete sustainability assessment
// @route   DELETE /api/admin/sustainability/:id
// @access  Private (Admin only)
exports.deleteSustainabilityAssessment = async (req, res, next) => {
    try {
        const { id } = req.params;

        const assessment = await Sustainability.findById(id).populate('idea', 'title');
        if (!assessment) {
            return res.status(404).json({ message: 'Sustainability assessment not found' });
        }

        await Sustainability.findByIdAndDelete(id);

        // Log admin action
        await AdminAction.create({
            admin: req.user.id,
            actionType: 'deleteSustainabilityAssessment',
            targetId: id,
            targetModel: 'Sustainability',
            details: `Deleted sustainability assessment for idea "${assessment.idea.title}"`
        });

        res.json({ message: 'Sustainability assessment deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// @desc    Get sustainability statistics
// @route   GET /api/admin/sustainability/stats
// @access  Private (Admin only)
exports.getSustainabilityStats = async (req, res, next) => {
    try {
        const stats = await Sustainability.getSustainabilityStats();
        
        res.json({
            message: 'Sustainability statistics retrieved successfully',
            stats: stats[0] || {
                averageScore: 0,
                totalAssessments: 0,
                rankDistribution: []
            }
        });
    } catch (error) {
        next(error);
    }
};