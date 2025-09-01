const Ideathon = require('../models/Ideathon.model');
const IdeathonRegistration = require('../models/IdeathonRegistration.model');

// @desc    Admin creates an ideathon
// @route   POST /api/ideathons
exports.createIdeathon = async (req, res, next) => {
    try {
        const { title, theme, fundingPrizes, startDate, endDate } = req.body;
        const ideathon = await Ideathon.create({
            title, theme, fundingPrizes, startDate, endDate,
            createdBy: req.user.id
        });
        res.status(201).json(ideathon);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all ideathons
// @route   GET /api/ideathons
exports.getAllIdeathons = async (req, res, next) => { /* ... */ };
exports.getIdeathonById = async (req, res, next) => { /* ... */ };
exports.updateIdeathon = async (req, res, next) => { /* ... */ };
exports.deleteIdeathon = async (req, res, next) => { /* ... */ };

// @desc    Entrepreneur registers for an ideathon
// @route   POST /api/ideathons/:id/register
exports.registerForIdeathon = async (req, res, next) => {
    try {
        const { ideaId, pitchDetails } = req.body;
        const registration = await IdeathonRegistration.create({
            ideathon: req.params.id,
            entrepreneur: req.user.id,
            idea: ideaId,
            pitchDetails
        });
        res.status(201).json(registration);
    } catch (error) {
        next(error);
    }
};

exports.getIdeathonRegistrations = async (req, res, next) => { /* ... */ };
exports.postIdeathonWinners = async (req, res, next) => { /* ... */ };