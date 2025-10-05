const Ideathon = require('../models/Ideathon.model');
const IdeathonRegistration = require('../models/IdeathonRegistration.model');
const User = require('../models/User.model');

// @desc    Admin creates an ideathon
// @route   POST /api/ideathons
exports.createIdeathon = async (req, res, next) => {
    try {
        const { 
            title, 
            theme, 
            fundingPrizes, 
            startDate, 
            endDate,
            description,
            organizers,
            submissionFormat,
            eligibilityCriteria,
            judgingCriteria,
            location,
            contactInformation
        } = req.body;
        
        // Validate required fields
        if (!title || !startDate || !endDate || !description || !organizers || !submissionFormat) {
            return res.status(400).json({ 
                success: false,
                message: 'Title, start date, end date, description, organizers, and submission format are required' 
            });
        }

        // Validate submission format is an array
        if (!Array.isArray(submissionFormat) || submissionFormat.length === 0) {
            return res.status(400).json({ 
                success: false,
                message: 'At least one submission format must be selected' 
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
            description,
            organizers,
            submissionFormat,
            eligibilityCriteria,
            judgingCriteria,
            location,
            contactInformation,
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

// @desc    Get all ideathons with search and filter
// @route   GET /api/ideathons
exports.getAllIdeathons = async (req, res, next) => {
    try {
        const { 
            search, 
            status, 
            location, 
            theme,
            page = 1, 
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        // Build search query
        let query = {};

        // Text search across title, theme, and organizers
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { theme: { $regex: search, $options: 'i' } },
                { organizers: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Filter by status
        if (status && status !== 'all') {
            query.status = status;
        }

        // Filter by location
        if (location && location !== 'all') {
            query.location = location;
        }

        // Filter by theme (partial match)
        if (theme && theme !== 'all') {
            query.theme = { $regex: theme, $options: 'i' };
        }

        // Build sort object
        const sortObj = {};
        sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Calculate pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Execute query with pagination
        const ideathons = await Ideathon.find(query)
            .populate('createdBy', 'name email')
            .sort(sortObj)
            .skip(skip)
            .limit(limitNum);

        // Get total count for pagination
        const total = await Ideathon.countDocuments(query);
        const totalPages = Math.ceil(total / limitNum);

        // Get filter options for frontend
        const statusOptions = await Ideathon.distinct('status');
        const locationOptions = await Ideathon.distinct('location');
        const themeOptions = await Ideathon.distinct('theme');

        res.status(200).json({ 
            success: true,
            count: ideathons.length,
            total,
            totalPages,
            currentPage: pageNum,
            data: ideathons,
            filters: {
                statusOptions,
                locationOptions,
                themeOptions
            }
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
        const { 
            title, 
            theme, 
            fundingPrizes, 
            startDate, 
            endDate,
            description,
            organizers,
            submissionFormat,
            eligibilityCriteria,
            judgingCriteria,
            location,
            contactInformation
        } = req.body;
        
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

        // Validate submission format if provided
        if (submissionFormat && (!Array.isArray(submissionFormat) || submissionFormat.length === 0)) {
            return res.status(400).json({ 
                success: false,
                message: 'At least one submission format must be selected' 
            });
        }
        
        ideathon = await Ideathon.findByIdAndUpdate(
            req.params.id,
            { 
                title, 
                theme, 
                fundingPrizes, 
                startDate, 
                endDate,
                description,
                organizers,
                submissionFormat,
                eligibilityCriteria,
                judgingCriteria,
                location,
                contactInformation
            },
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
        const { ideaId, pitchDetails, userId } = req.body;
        
        // Check if ideathon exists
        const ideathon = await Ideathon.findById(req.params.id);
        if (!ideathon) {
            return res.status(404).json({ 
                success: false,
                message: 'Ideathon not found' 
            });
        }
        
        // Determine entrepreneur ID: if admin is registering someone else, use userId from body
        // If entrepreneur is registering themselves, use req.user.id
        const entrepreneurId = (req.user.role === 'admin' && userId) ? userId : req.user.id;
        
        // Check if already registered
        const existingRegistration = await IdeathonRegistration.findOne({
            ideathon: req.params.id,
            entrepreneur: entrepreneurId
        });
        
        if (existingRegistration) {
            return res.status(400).json({ 
                success: false,
                message: 'Already registered for this ideathon' 
            });
        }
        
        const registration = await IdeathonRegistration.create({
            ideathon: req.params.id,
            entrepreneur: entrepreneurId,
            idea: ideaId,
            pitchDetails,
            registeredBy: req.user.id // Track who created the registration
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
        let filter = {};
        
        // If ID is provided, get registrations for specific ideathon
        if (req.params.id) {
            filter.ideathon = req.params.id;
        }
        
        const registrations = await IdeathonRegistration.find(filter)
        .populate('entrepreneur', 'name email')
        .populate('idea', 'title description category')
        .populate('ideathon', 'title startDate endDate')
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