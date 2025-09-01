const FundingRequest = require('../models/FundingRequest.model');
const Idea = require('../models/Idea.model');

// @desc    Create a funding request
// @route   POST /api/funding
exports.createFundingRequest = async (req, res, next) => {
    try {
        const { ideaId, amount, equity } = req.body;
        const idea = await Idea.findById(ideaId);
        if (!idea || idea.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to request funding for this idea' });
        }
        
        const request = await FundingRequest.create({
            idea: ideaId,
            entrepreneur: req.user.id,
            amount,
            equity,
            valuation: (amount / equity) * 100,
        });

        // Update idea status
        idea.status = 'funding_requested';
        await idea.save();

        res.status(201).json(request);
    } catch (error) {
        next(error);
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