const FundingRequest = require('../models/FundingRequest.model');
const Idea = require('../models/Idea.model');

// @desc    Create a funding request
// @route   POST /api/funding
exports.createFundingRequest = async (req, res, next) => {
    try {
        const { ideaId, amount, equity, message } = req.body;
        
        // Validate required fields
        if (!ideaId || !amount || !equity) {
            return res.status(400).json({ 
                success: false,
                message: 'Missing required fields: ideaId, amount, and equity are required' 
            });
        }

        // Find and validate the idea
        const idea = await Idea.findById(ideaId);
        if (!idea) {
            return res.status(404).json({ 
                success: false,
                message: 'Idea not found' 
            });
        }

        if (idea.owner.toString() !== req.user.id) {
            return res.status(403).json({ 
                success: false,
                message: 'Not authorized to request funding for this idea' 
            });
        }
        
        // Calculate valuation
        const calculatedValuation = (amount / equity) * 100;
        
        // Create funding request
        const request = await FundingRequest.create({
            idea: ideaId,
            entrepreneur: req.user.id,
            amount,
            equity,
            valuation: calculatedValuation,
        });

        // Add initial message to negotiation history if provided
        if (message && message.trim()) {
            request.negotiationHistory.push({
                investor: req.user.id, // The entrepreneur adding initial message
                message: message.trim(),
                timestamp: new Date()
            });
            await request.save();
        }

        // Update idea status
        idea.status = 'funding_requested';
        await idea.save();

        // Populate the response
        const populatedRequest = await FundingRequest.findById(request._id)
            .populate('idea', 'title description category')
            .populate('entrepreneur', 'name email');

        res.status(201).json({
            success: true,
            data: populatedRequest,
            message: 'Funding request created successfully'
        });
    } catch (error) {
        console.error('Error creating funding request:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating funding request',
            error: error.message
        });
    }
};

// @desc    Get all funding requests
// @route   GET /api/funding
exports.getAllFundingRequests = async (req, res, next) => {
    try {
        const requests = await FundingRequest.find().populate('idea', 'title owner');
        res.json(requests);
    } catch (error) {
        next(error);
    }
};

// @desc    Get a single funding request by ID
// @route   GET /api/funding/:id
exports.getFundingRequestById = async (req, res, next) => { /* ... implementation ... */ };

// @desc    Update a funding request (Investor response)
// @route   PUT /api/funding/:id
exports.updateFundingRequestStatus = async (req, res, next) => { /* ... implementation ... */ };

// @desc    Withdraw a funding request
// @route   DELETE /api/funding/:id
exports.withdrawFundingRequest = async (req, res, next) => { /* ... implementation ... */ };