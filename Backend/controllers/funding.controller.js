const FundingRequest = require('../models/FundingRequest.model');
const Idea = require('../models/Idea.model');

// @desc    Create a funding request
// @route   POST /api/funding
exports.createFundingRequest = async (req, res, next) => {
    try {
        const { 
            ideaId, 
            amount, 
            equity, 
            message,
            teamSize,
            businessPlan,
            currentRevenue,
            previousFunding,
            revenueModel,
            targetMarket,
            competitiveAdvantage,
            customerTraction,
            financialProjections,
            useOfFunds,
            timeline,
            milestones,
            riskFactors,
            exitStrategy,
            intellectualProperty,
            contactPhone,
            contactEmail,
            companyWebsite,
            linkedinProfile,
            additionalDocuments,
            fundingStage,
            investmentType
        } = req.body;
        
        // Validate required fields
        if (!ideaId || !amount || !equity) {
            return res.status(400).json({ 
                success: false,
                message: 'Missing required fields: ideaId, amount, and equity are required' 
            });
        }

        // Validate numeric fields
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Amount must be a positive number'
            });
        }

        if (isNaN(equity) || equity <= 0 || equity > 100) {
            return res.status(400).json({
                success: false,
                message: 'Equity must be a number between 0 and 100'
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

        // Check if funding request already exists for this idea
        const existingRequest = await FundingRequest.findOne({
            idea: ideaId,
            entrepreneur: req.user.id,
            status: { $in: ['pending', 'negotiated'] }
        });

        if (existingRequest) {
            return res.status(400).json({
                success: false,
                message: 'An active funding request already exists for this idea'
            });
        }
        
        // Calculate valuation
        const calculatedValuation = Math.round((amount / equity) * 100);
        
        // Create funding request with all fields
        const requestData = {
            idea: ideaId,
            entrepreneur: req.user.id,
            amount: parseInt(amount),
            equity: parseFloat(equity),
            valuation: calculatedValuation,
            message: message?.trim(),
            teamSize: teamSize ? parseInt(teamSize) : undefined,
            businessPlan: businessPlan?.trim(),
            currentRevenue: currentRevenue ? parseInt(currentRevenue) : undefined,
            previousFunding: previousFunding ? parseInt(previousFunding) : 0,
            revenueModel: revenueModel?.trim(),
            targetMarket: targetMarket?.trim(),
            competitiveAdvantage: competitiveAdvantage?.trim(),
            customerTraction: customerTraction?.trim(),
            financialProjections: financialProjections?.trim(),
            useOfFunds: useOfFunds?.trim(),
            timeline: timeline?.trim(),
            milestones: milestones?.trim(),
            riskFactors: riskFactors?.trim(),
            exitStrategy: exitStrategy?.trim(),
            intellectualProperty: intellectualProperty?.trim(),
            contactPhone: contactPhone?.trim(),
            contactEmail: contactEmail?.trim(),
            companyWebsite: companyWebsite?.trim(),
            linkedinProfile: linkedinProfile?.trim(),
            additionalDocuments: additionalDocuments?.trim(),
            fundingStage: fundingStage || 'seed',
            investmentType: investmentType || 'equity'
        };

        // Remove undefined fields
        Object.keys(requestData).forEach(key => 
            requestData[key] === undefined && delete requestData[key]
        );

        const request = await FundingRequest.create(requestData);

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
            .populate('idea', 'title description category stage')
            .populate('entrepreneur', 'name email');

        res.status(201).json({
            success: true,
            data: populatedRequest,
            message: 'Funding request created successfully'
        });
    } catch (error) {
        console.error('Error creating funding request:', error);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: errors
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error creating funding request',
            error: error.message
        });
    }
};

// @desc    Get all funding requests (for investors/admins)
// @route   GET /api/funding
exports.getAllFundingRequests = async (req, res, next) => {
    try {
        const { status, fundingStage, minAmount, maxAmount, page = 1, limit = 10 } = req.query;
        
        // Build filter
        const filter = {};
        if (status) filter.status = status;
        if (fundingStage) filter.fundingStage = fundingStage;
        if (minAmount || maxAmount) {
            filter.amount = {};
            if (minAmount) filter.amount.$gte = parseInt(minAmount);
            if (maxAmount) filter.amount.$lte = parseInt(maxAmount);
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const requests = await FundingRequest.find(filter)
            .populate('idea', 'title description category stage')
            .populate('entrepreneur', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await FundingRequest.countDocuments(filter);

        res.json({
            success: true,
            data: requests,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / parseInt(limit)),
                total: total,
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Error fetching funding requests:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching funding requests',
            error: error.message
        });
    }
};

// @desc    Get user's funding requests (for entrepreneurs)
// @route   GET /api/funding/user
exports.getUserFundingRequests = async (req, res, next) => {
    try {
        const { status } = req.query;
        
        const filter = { entrepreneur: req.user.id };
        if (status) filter.status = status;
        
        const requests = await FundingRequest.find(filter)
            .populate('idea', 'title description category stage')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: requests,
            count: requests.length
        });
    } catch (error) {
        console.error('Error fetching user funding requests:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching your funding requests',
            error: error.message
        });
    }
};

// @desc    Get a single funding request by ID
// @route   GET /api/funding/:id
exports.getFundingRequestById = async (req, res, next) => {
    try {
        const request = await FundingRequest.findById(req.params.id)
            .populate('idea', 'title description category stage owner')
            .populate('entrepreneur', 'name email')
            .populate('negotiationHistory.investor', 'name email');

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Funding request not found'
            });
        }

        // Check authorization - entrepreneur can view their own, investors can view all
        if (req.user.role === 'entrepreneur' && request.entrepreneur._id.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this funding request'
            });
        }

        // Track view if it's an investor viewing
        if (req.user.role === 'investor' && !request.viewedBy.includes(req.user.id)) {
            request.viewedBy.push(req.user.id);
            request.lastViewedAt = new Date();
            await request.save();
        }

        res.json({
            success: true,
            data: request
        });
    } catch (error) {
        console.error('Error fetching funding request:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching funding request',
            error: error.message
        });
    }
};

// @desc    Update a funding request (Investor response or entrepreneur update)
// @route   PUT /api/funding/:id
exports.updateFundingRequestStatus = async (req, res, next) => {
    try {
        const { status, message, amount, equity, responseDeadline } = req.body;
        
        const request = await FundingRequest.findById(req.params.id)
            .populate('idea', 'title owner')
            .populate('entrepreneur', 'name email');

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Funding request not found'
            });
        }

        // Authorization check
        const isEntrepreneur = req.user.id === request.entrepreneur._id.toString();
        const isInvestor = req.user.role === 'investor';

        if (!isEntrepreneur && !isInvestor) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this funding request'
            });
        }

        // Investors can update status and add messages
        if (isInvestor && status) {
            if (!['accepted', 'negotiated', 'declined'].includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid status. Must be accepted, negotiated, or declined'
                });
            }
            request.status = status;
        }

        // Entrepreneurs can update their own request details (only if pending)
        if (isEntrepreneur && request.status === 'pending') {
            if (amount) request.amount = parseInt(amount);
            if (equity) request.equity = parseFloat(equity);
            if (request.amount && request.equity) {
                request.valuation = Math.round((request.amount / request.equity) * 100);
            }
        }

        // Add message to negotiation history
        if (message && message.trim()) {
            request.negotiationHistory.push({
                investor: req.user.id,
                message: message.trim(),
                timestamp: new Date()
            });
        }

        // Set response deadline (for investors)
        if (responseDeadline && isInvestor) {
            request.responseDeadline = new Date(responseDeadline);
        }

        await request.save();

        // Populate the updated request
        const updatedRequest = await FundingRequest.findById(request._id)
            .populate('idea', 'title description category stage')
            .populate('entrepreneur', 'name email')
            .populate('negotiationHistory.investor', 'name email');

        res.json({
            success: true,
            data: updatedRequest,
            message: `Funding request ${status ? 'status updated' : 'updated'} successfully`
        });
    } catch (error) {
        console.error('Error updating funding request:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating funding request',
            error: error.message
        });
    }
};

// @desc    Update funding request details (for entrepreneurs)
// @route   PUT /api/funding/:id/details
exports.updateFundingRequestDetails = async (req, res, next) => {
    try {
        const request = await FundingRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Funding request not found'
            });
        }

        // Only entrepreneur can update details
        if (request.entrepreneur.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this funding request'
            });
        }

        // Only allow updates if status is pending or negotiated
        if (!['pending', 'negotiated'].includes(request.status)) {
            return res.status(400).json({
                success: false,
                message: 'Cannot update details of accepted, declined, or withdrawn requests'
            });
        }

        // Update all allowed fields
        const updateFields = [
            'amount', 'equity', 'message', 'teamSize', 'businessPlan', 'currentRevenue',
            'previousFunding', 'revenueModel', 'targetMarket', 'competitiveAdvantage',
            'customerTraction', 'financialProjections', 'useOfFunds', 'timeline',
            'milestones', 'riskFactors', 'exitStrategy', 'intellectualProperty',
            'contactPhone', 'contactEmail', 'companyWebsite', 'linkedinProfile',
            'additionalDocuments', 'fundingStage', 'investmentType'
        ];

        updateFields.forEach(field => {
            if (req.body[field] !== undefined) {
                if (['amount', 'equity', 'teamSize', 'currentRevenue', 'previousFunding'].includes(field)) {
                    request[field] = req.body[field] ? parseFloat(req.body[field]) : undefined;
                } else {
                    request[field] = req.body[field];
                }
            }
        });

        // Recalculate valuation if amount or equity changed
        if (request.amount && request.equity) {
            request.valuation = Math.round((request.amount / request.equity) * 100);
        }

        await request.save();

        const updatedRequest = await FundingRequest.findById(request._id)
            .populate('idea', 'title description category stage')
            .populate('entrepreneur', 'name email');

        res.json({
            success: true,
            data: updatedRequest,
            message: 'Funding request details updated successfully'
        });
    } catch (error) {
        console.error('Error updating funding request details:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating funding request details',
            error: error.message
        });
    }
};

// @desc    Withdraw a funding request
// @route   DELETE /api/funding/:id
exports.withdrawFundingRequest = async (req, res, next) => {
    try {
        const request = await FundingRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Funding request not found'
            });
        }

        // Only entrepreneur can withdraw their own request
        if (request.entrepreneur.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to withdraw this funding request'
            });
        }

        // Can only withdraw pending or negotiated requests
        if (!['pending', 'negotiated'].includes(request.status)) {
            return res.status(400).json({
                success: false,
                message: 'Cannot withdraw accepted, declined, or already withdrawn requests'
            });
        }

        // Update status to withdrawn instead of deleting
        request.status = 'withdrawn';
        await request.save();

        // Update idea status back to active if needed
        const idea = await Idea.findById(request.idea);
        if (idea && idea.status === 'funding_requested') {
            idea.status = 'active';
            await idea.save();
        }

        res.json({
            success: true,
            message: 'Funding request withdrawn successfully',
            data: { id: request._id, status: 'withdrawn' }
        });
    } catch (error) {
        console.error('Error withdrawing funding request:', error);
        res.status(500).json({
            success: false,
            message: 'Error withdrawing funding request',
            error: error.message
        });
    }
};

// @desc    Get funding request statistics
// @route   GET /api/funding/stats
exports.getFundingStats = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;

        let stats = {};

        if (userRole === 'entrepreneur') {
            // Stats for entrepreneurs
            const userRequests = await FundingRequest.find({ entrepreneur: userId });
            
            stats = {
                totalRequests: userRequests.length,
                pendingRequests: userRequests.filter(r => r.status === 'pending').length,
                acceptedRequests: userRequests.filter(r => r.status === 'accepted').length,
                totalAmountRequested: userRequests.reduce((sum, r) => sum + r.amount, 0),
                totalAmountReceived: userRequests
                    .filter(r => r.status === 'accepted')
                    .reduce((sum, r) => sum + r.amount, 0),
                averageEquityOffered: userRequests.length > 0 
                    ? userRequests.reduce((sum, r) => sum + r.equity, 0) / userRequests.length 
                    : 0
            };
        } else if (userRole === 'investor') {
            // Stats for investors
            const totalRequests = await FundingRequest.countDocuments();
            const viewedRequests = await FundingRequest.countDocuments({ 
                viewedBy: userId 
            });
            
            stats = {
                totalAvailableRequests: totalRequests,
                viewedRequests: viewedRequests,
                unviewedRequests: totalRequests - viewedRequests
            };
        }

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error fetching funding stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching funding statistics',
            error: error.message
        });
    }
};