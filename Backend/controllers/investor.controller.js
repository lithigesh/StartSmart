const InvestorInterest = require('../models/InvestorInterest.model');
const Idea = require('../models/Idea.model');

// @desc    Investor browses all analyzed ideas
// @route   GET /api/investors/ideas
exports.getInvestorIdeas = async (req, res, next) => {
    try {
        const ideas = await Idea.find({ status: 'analyzed' }).populate('owner', 'name');
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
        const investorId = req.user.id;

        // Use findOneAndUpdate with upsert to create or update interest
        const interest = await InvestorInterest.findOneAndUpdate(
            { idea: ideaId, investor: investorId },
            { $set: { status: 'interested' } },
            { upsert: true, new: true }
        );

        res.status(201).json(interest);
    } catch (error) {
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

        const interest = await InvestorInterest.findOneAndUpdate(
            { idea: req.params.ideaId, investor: req.user.id },
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
        const result = await InvestorInterest.findOneAndDelete({
            idea: req.params.ideaId,
            investor: req.user.id,
        });

        if (!result) {
            return res.status(404).json({ message: 'Interest record not found' });
        }

        res.json({ message: 'Interest withdrawn successfully' });
    } catch (error) {
        next(error);
    }
};