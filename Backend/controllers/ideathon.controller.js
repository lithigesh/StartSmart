const Ideathon = require('../models/Ideathon.model');
const IdeathonRegistration = require('../models/IdeathonRegistration.model');
const User = require('../models/User.model');

// @desc    Admin creates an ideathon
// @route   POST /api/ideathons
exports.createIdeathon = async (req, res, next) => {
    try {
        const { title, theme, fundingPrizes, startDate, endDate } = req.body;
        
        // Validate required fields
        if (!title || !startDate || !endDate) {
            return res.status(400).json({ 
                success: false,
                message: 'Title, start date, and end date are required' 
            });
        }

        // Validate dates
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (start >= end) {
            return res.status(400).json({ 
                success: false,
                message: 'End date must be after start date' 
            });
        }

        const ideathon = await Ideathon.create({
            title, 
            theme, 
            fundingPrizes, 
            startDate: start, 
            endDate: end,
            createdBy: req.user.id
        });
        
        res.status(201).json({ 
            success: true,
            data: ideathon 
        });
    } catch (error) {
        console.error('Create ideathon error:', error);
        next(error);
    }
};

// @desc    Get all ideathons
// @route   GET /api/ideathons
exports.getAllIdeathons = async (req, res, next) => {
    try {
        const ideathons = await Ideathon.find()
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });
        
        res.status(200).json({ 
            success: true,
            count: ideathons.length,
            data: ideathons 
        });
    } catch (error) {
        console.error('Get all ideathons error:', error);
        next(error);
    }
};

// @desc    Get ideathon by ID
// @route   GET /api/ideathons/:id
exports.getIdeathonById = async (req, res, next) => {
    try {
        const ideathon = await Ideathon.findById(req.params.id)
            .populate('createdBy', 'name email');
        
        if (!ideathon) {
            return res.status(404).json({ 
                success: false,
                message: 'Ideathon not found' 
            });
        }
        
        res.status(200).json({ 
            success: true,
            data: ideathon 
        });
    } catch (error) {
        console.error('Get ideathon by ID error:', error);
        next(error);
    }
};

// @desc    Update ideathon
// @route   PUT /api/ideathons/:id
exports.updateIdeathon = async (req, res, next) => {
    try {
        const { title, theme, fundingPrizes, startDate, endDate } = req.body;
        
        let ideathon = await Ideathon.findById(req.params.id);
        if (!ideathon) {
            return res.status(404).json({ 
                success: false,
                message: 'Ideathon not found' 
            });
        }
        
        // Validate dates if provided
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            if (start >= end) {
                return res.status(400).json({ 
                    success: false,
                    message: 'End date must be after start date' 
                });
            }
        }
        
        ideathon = await Ideathon.findByIdAndUpdate(
            req.params.id,
            { title, theme, fundingPrizes, startDate, endDate },
            { new: true, runValidators: true }
        ).populate('createdBy', 'name email');
        
        res.status(200).json({ 
            success: true,
            data: ideathon 
        });
    } catch (error) {
        console.error('Update ideathon error:', error);
        next(error);
    }
};

// @desc    Delete ideathon
// @route   DELETE /api/ideathons/:id
exports.deleteIdeathon = async (req, res, next) => {
    try {
        const ideathon = await Ideathon.findById(req.params.id);
        if (!ideathon) {
            return res.status(404).json({ 
                success: false,
                message: 'Ideathon not found' 
            });
        }
        
        // Also delete related registrations
        await IdeathonRegistration.deleteMany({ ideathon: req.params.id });
        
        await Ideathon.findByIdAndDelete(req.params.id);
        
        res.status(200).json({ 
            success: true,
            message: 'Ideathon deleted successfully' 
        });
    } catch (error) {
        console.error('Delete ideathon error:', error);
        next(error);
    }
};

// @desc    Entrepreneur registers for an ideathon
// @route   POST /api/ideathons/:id/register
exports.registerForIdeathon = async (req, res, next) => {
    try {
        const { ideaId, pitchDetails } = req.body;
        
        // Check if ideathon exists
        const ideathon = await Ideathon.findById(req.params.id);
        if (!ideathon) {
            return res.status(404).json({ 
                success: false,
                message: 'Ideathon not found' 
            });
        }
        
        // Check if already registered
        const existingRegistration = await IdeathonRegistration.findOne({
            ideathon: req.params.id,
            entrepreneur: req.user.id
        });
        
        if (existingRegistration) {
            return res.status(400).json({ 
                success: false,
                message: 'Already registered for this ideathon' 
            });
        }
        
        const registration = await IdeathonRegistration.create({
            ideathon: req.params.id,
            entrepreneur: req.user.id,
            idea: ideaId,
            pitchDetails
        });
        
        res.status(201).json({ 
            success: true,
            data: registration 
        });
    } catch (error) {
        console.error('Register for ideathon error:', error);
        next(error);
    }
};

// @desc    Get ideathon registrations
// @route   GET /api/ideathons/:id/registrations
exports.getIdeathonRegistrations = async (req, res, next) => {
    try {
        const registrations = await IdeathonRegistration.find({ 
            ideathon: req.params.id 
        })
        .populate('entrepreneur', 'name email')
        .populate('idea', 'title description category')
        .sort({ createdAt: -1 });
        
        res.status(200).json({ 
            success: true,
            count: registrations.length,
            data: registrations 
        });
    } catch (error) {
        console.error('Get ideathon registrations error:', error);
        next(error);
    }
};

// @desc    Post ideathon winners
// @route   PUT /api/ideathons/:id/results
exports.postIdeathonWinners = async (req, res, next) => {
    try {
        const { winners } = req.body; // Array of winner objects with position and registration ID
        
        const ideathon = await Ideathon.findByIdAndUpdate(
            req.params.id,
            { winners, status: 'completed' },
            { new: true }
        );
        
        if (!ideathon) {
            return res.status(404).json({ 
                success: false,
                message: 'Ideathon not found' 
            });
        }
        
        res.status(200).json({ 
            success: true,
            data: ideathon 
        });
    } catch (error) {
        console.error('Post ideathon winners error:', error);
        next(error);
    }
};