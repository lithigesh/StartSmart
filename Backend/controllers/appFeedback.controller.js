// controllers/appFeedback.controller.js
const AppFeedback = require('../models/AppFeedback.model');

// @desc    Create new app feedback
// @route   POST /api/app-feedback
// @access  Private
exports.createAppFeedback = async (req, res, next) => {
    try {
        const {
            category,
            title,
            description,
            overallRating,
            ratings,
            frequencyOfUse,
            recommendationScore,
            mostUsedFeatures,
            suggestedImprovements,
            stepsToReproduce,
            expectedBehavior,
            actualBehavior,
            featureDescription,
            featurePriority,
            contactForFollowUp,
            preferredContactMethod,
            browserInfo,
            deviceInfo
        } = req.body;

        // Validate required fields
        if (!title || !description || !overallRating || recommendationScore === undefined) {
            return res.status(400).json({
                message: 'Title, description, overall rating, and recommendation score are required'
            });
        }

        // Create feedback
        const feedback = new AppFeedback({
            user: req.user.id,
            userRole: req.user.role, // Automatically set user role
            category,
            title,
            description,
            overallRating,
            ratings,
            frequencyOfUse,
            recommendationScore,
            mostUsedFeatures: Array.isArray(mostUsedFeatures) ? mostUsedFeatures : [],
            suggestedImprovements: Array.isArray(suggestedImprovements) ? suggestedImprovements : [],
            stepsToReproduce,
            expectedBehavior,
            actualBehavior,
            featureDescription,
            featurePriority,
            contactForFollowUp: contactForFollowUp || false,
            preferredContactMethod,
            browserInfo,
            deviceInfo
        });

        await feedback.save();

        const populatedFeedback = await AppFeedback.findById(feedback._id)
            .populate('user', 'name email role');

        res.status(201).json({
            message: 'Feedback submitted successfully',
            feedback: populatedFeedback
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user's feedback history
// @route   GET /api/app-feedback/my-feedback
// @access  Private
exports.getMyFeedback = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, category, status } = req.query;

        const filter = { user: req.user.id };
        if (category) filter.category = category;
        if (status) filter.status = status;

        const feedback = await AppFeedback.find(filter)
            .populate('adminResponse.respondedBy', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await AppFeedback.countDocuments(filter);

        res.json({
            feedback,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single feedback
// @route   GET /api/app-feedback/:id
// @access  Private
exports.getFeedback = async (req, res, next) => {
    try {
        const feedback = await AppFeedback.findById(req.params.id)
            .populate('user', 'name email role')
            .populate('adminResponse.respondedBy', 'name email');

        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        // Users can only see their own feedback (unless admin)
        if (feedback.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json(feedback);
    } catch (error) {
        next(error);
    }
};

// @desc    Update feedback
// @route   PUT /api/app-feedback/:id
// @access  Private
exports.updateFeedback = async (req, res, next) => {
    try {
        const feedback = await AppFeedback.findById(req.params.id);

        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        // Users can only update their own feedback
        if (feedback.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Don't allow updates if admin has already responded
        if (feedback.adminResponse && feedback.adminResponse.response) {
            return res.status(400).json({ 
                message: 'Cannot update feedback that has already been responded to by admin' 
            });
        }

        const updatedFeedback = await AppFeedback.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('user', 'name email role');

        res.json({
            message: 'Feedback updated successfully',
            feedback: updatedFeedback
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete feedback
// @route   DELETE /api/app-feedback/:id
// @access  Private
exports.deleteFeedback = async (req, res, next) => {
    try {
        const feedback = await AppFeedback.findById(req.params.id);

        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        // Users can only delete their own feedback
        if (feedback.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        await AppFeedback.findByIdAndDelete(req.params.id);

        res.json({ message: 'Feedback deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// @desc    Mark feedback as helpful
// @route   POST /api/app-feedback/:id/helpful
// @access  Private
exports.markAsHelpful = async (req, res, next) => {
    try {
        const feedback = await AppFeedback.findById(req.params.id);

        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        await feedback.markAsHelpful();

        res.json({
            message: 'Feedback marked as helpful',
            helpfulVotes: feedback.helpfulVotes
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get feedback statistics for user
// @route   GET /api/app-feedback/stats
// @access  Private
exports.getFeedbackStats = async (req, res, next) => {
    try {
        const userFeedbackStats = await AppFeedback.aggregate([
            { $match: { user: req.user._id } },
            {
                $group: {
                    _id: null,
                    totalFeedback: { $sum: 1 },
                    averageRating: { $avg: '$overallRating' },
                    averageRecommendation: { $avg: '$recommendationScore' },
                    statusBreakdown: {
                        $push: '$status'
                    },
                    categoryBreakdown: {
                        $push: '$category'
                    }
                }
            }
        ]);

        // Count by status
        const statusCounts = await AppFeedback.aggregate([
            { $match: { user: req.user._id } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Count by category
        const categoryCounts = await AppFeedback.aggregate([
            { $match: { user: req.user._id } },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            }
        ]);

        const stats = userFeedbackStats[0] || {
            totalFeedback: 0,
            averageRating: 0,
            averageRecommendation: 0
        };

        res.json({
            ...stats,
            statusCounts,
            categoryCounts
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all feedback (Admin only)
// @route   GET /api/app-feedback/admin/all
// @access  Admin
exports.getAllFeedbackAdmin = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, category, status, userRole } = req.query;

        const filter = {};
        if (category) filter.category = category;
        if (status) filter.status = status;
        if (userRole) filter.userRole = userRole;

        const feedback = await AppFeedback.find(filter)
            .populate('user', 'name email role')
            .populate('adminResponse.respondedBy', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await AppFeedback.countDocuments(filter);

        // Get stats by user role
        const roleStats = await AppFeedback.aggregate([
            {
                $group: {
                    _id: '$userRole',
                    count: { $sum: 1 },
                    avgRating: { $avg: '$overallRating' },
                    avgRecommendation: { $avg: '$recommendationScore' }
                }
            }
        ]);

        res.json({
            feedback,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total,
            roleStats
        });
    } catch (error) {
        next(error);
    }
};