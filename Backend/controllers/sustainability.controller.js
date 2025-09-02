const Sustainability = require('../models/Sustainability.model');
const Idea = require('../models/Idea.model');

// @desc    Add a sustainability entry for an idea
// @route   POST /api/sustainability
exports.addSustainabilityEntry = async (req, res, next) => {
    try {
        const { ideaId, ecoPractices, impactScore } = req.body;
        const idea = await Idea.findById(ideaId);
        if (!idea || idea.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized for this idea' });
        }

        const entry = await Sustainability.create({
            idea: ideaId,
            ecoPractices,
            impactScore,
            submittedBy: req.user.id,
        });
        res.status(201).json(entry);
    } catch (error) {
        if (error.code === 11000) { // Handle duplicate entry for the same idea
            return res.status(400).json({ message: 'Sustainability entry for this idea already exists.' });
        }
        next(error);
    }
};

// @desc    Get sustainability score for an idea
// @route   GET /api/sustainability/:ideaId
exports.getSustainabilityForIdea = async (req, res, next) => {
    try {
        const entry = await Sustainability.findOne({ idea: req.params.ideaId });
        if (!entry) {
            return res.status(404).json({ message: 'Sustainability entry not found' });
        }
        res.json(entry);
    } catch (error) {
        next(error);
    }
};

// Other CRUD functions (update, delete) would follow a similar pattern with ownership checks
exports.updateSustainabilityEntry = async (req, res, next) => { /* ... */ };
exports.deleteSustainabilityEntry = async (req, res, next) => { /* ... */ };