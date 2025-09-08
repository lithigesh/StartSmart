const InvestorInterest = require('../models/InvestorInterest.model');
const Idea = require('../models/Idea.model');
const NotificationService = require('../services/notification.service');

// @desc    Get investor's interested ideas
// @route   GET /api/investors/interested
exports.getInterestedIdeas = async (req, res, next) => {
    try {
        const investorId = req.user._id || req.user.id;
        
        // Find all interests for this investor and populate the idea details
        const interests = await InvestorInterest.find({ 
            investor: investorId, 
            status: 'interested' 
        }).populate({
            path: 'idea',
            populate: {
                path: 'owner',
                select: 'name email'
            }
        });

        // Extract the ideas from the interest records
        const interestedIdeas = interests
            .filter(interest => interest.idea) // Filter out any null ideas
            .map(interest => interest.idea);

        res.json(interestedIdeas);
    } catch (error) {
        next(error);
    }
};

// @desc    Investor browses all analyzed ideas
// @route   GET /api/investors/ideas
exports.getInvestorIdeas = async (req, res, next) => {
    try {
        // Get all ideas that are either analyzed or submitted (for testing purposes)
        // In production, you might want to restrict this to only 'analyzed' ideas
        const ideas = await Idea.find({ 
            status: { $in: ['analyzed', 'submitted'] }
        })
            .populate('owner', 'name email')
            .sort({ createdAt: -1 }); // Sort by newest first
        
        res.json(ideas);
    } catch (error) {
        next(error);
    }
};

// @desc    Investor marks interest in an idea
// @route   POST /api/investors/:ideaId/interest
exports.markInterest = async (req, res, next) => {
    try {
        const { ideaId } = req.params;
        const investorId = req.user._id || req.user.id;

        console.log(`Marking interest - Investor ID: ${investorId}, Idea ID: ${ideaId}`);
        console.log(`User object:`, req.user);

        // Validate ObjectId format
        if (!ideaId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid idea ID format' });
        }

        // First check if the idea exists
        const idea = await Idea.findById(ideaId);
        if (!idea) {
            return res.status(404).json({ message: 'Idea not found' });
        }

        // Verify investor exists
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        // For now, allow interest in submitted ideas as well for testing
        // In production, you might want to restrict to only 'analyzed' ideas
        if (!['analyzed', 'submitted'].includes(idea.status)) {
            return res.status(400).json({ message: 'Can only show interest in analyzed or submitted ideas' });
        }

        // Check if interest already exists
        const existingInterest = await InvestorInterest.findOne({
            idea: ideaId,
            investor: investorId
        });

        if (existingInterest) {
            // Update existing interest to 'interested'
            existingInterest.status = 'interested';
            await existingInterest.save();
            return res.json({ message: 'Interest updated successfully', interest: existingInterest });
        }

        // Create new interest
        const interest = await InvestorInterest.create({
            idea: ideaId,
            investor: investorId,
            status: 'interested'
        });

        // Populate the idea with owner details for notification
        const populatedIdea = await Idea.findById(ideaId).populate('owner');
        
        if (!populatedIdea || !populatedIdea.owner) {
            console.error(`Idea or idea owner not found for idea: ${ideaId}`);
            // Still return success since the interest was created successfully
            return res.status(201).json({ 
                message: 'Interest marked successfully (notification skipped due to missing owner)', 
                interest 
            });
        }

        // Notify the entrepreneur about the new interest
        try {
            await NotificationService.createInvestorInterestNotification(
                investorId.toString(), // investorId
                ideaId, // ideaId
                populatedIdea.owner._id.toString(), // entrepreneurId
                populatedIdea.title // ideaTitle
            );
        } catch (notificationError) {
            console.error('Failed to create notifications:', notificationError);
            // Don't fail the entire request if notification fails
        }

        res.status(201).json({ message: 'Interest marked successfully', interest });
    } catch (error) {
        console.error('Error in markInterest:', error);
        next(error);
    }
};

// @desc    Investor updates their interest status
// @route   PUT /api/investors/:ideaId/interest
exports.updateInterestStatus = async (req, res, next) => {
    try {
        const { status } = req.body; // e.g., "not_interested"
        if (!['interested', 'not_interested', 'withdrawn'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const investorId = req.user._id || req.user.id;

        const interest = await InvestorInterest.findOneAndUpdate(
            { idea: req.params.ideaId, investor: investorId },
            { $set: { status: status } },
            { new: true }
        );

        if (!interest) {
            return res.status(404).json({ message: 'Interest record not found' });
        }

        res.json(interest);
    } catch (error) {
        next(error);
    }
};

// @desc    Investor withdraws their interest
// @route   DELETE /api/investors/:ideaId/interest
exports.withdrawInterest = async (req, res, next) => {
    try {
        const { ideaId } = req.params;
        const investorId = req.user.id;

        const interest = await InvestorInterest.findOne({
            idea: ideaId,
            investor: investorId,
        });

        if (!interest) {
            return res.status(404).json({ message: 'Interest record not found' });
        }

        // Instead of deleting, we could set status to 'withdrawn' or actually delete
        // For now, let's delete the record completely
        await InvestorInterest.findByIdAndDelete(interest._id);

        res.json({ message: 'Interest withdrawn successfully' });
    } catch (error) {
        next(error);
    }
};