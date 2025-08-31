// controllers/idea.controller.js
const Idea = require('../models/Idea.model');
const Notification = require('../models/Notification.model');
const aiService = require('../services/aiAnalysis.service');
const pdfService = require('../services/pdf.service');

// ------ ENTREPRENEUR CONTROLLERS ------

// @desc    Submit a new idea
// @route   POST /api/ideas
exports.submitIdea = async (req, res, next) => {
    try {
        const { title, description, category } = req.body;
        const idea = await Idea.create({
            title,
            description,
            category,
            owner: req.user.id,
        });
        res.status(201).json(idea);
    } catch (error) {
        next(error);
    }
};

// @desc    Run AI analysis on an idea
// @route   POST /api/ideas/:id/analyze
exports.analyzeIdea = async (req, res, next) => {
    try {
        const idea = await Idea.findById(req.params.id);

        if (!idea) return res.status(404).json({ message: 'Idea not found' });
        if (idea.owner.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
        
        idea.status = 'analyzing';
        await idea.save();

        // Asynchronous analysis
        (async () => {
            try {
                const [aiResult, trendsResult] = await Promise.all([
                    aiService.generateSwotAndRoadmap(idea.title, idea.description),
                    aiService.getMarketTrends(idea.category)
                ]);

                idea.analysis = {
                    score: aiResult.score,
                    swot: aiResult.swot,
                    roadmap: aiResult.roadmap,
                    trends: trendsResult,
                };
                idea.status = 'analyzed';
                await idea.save();
                console.log(`Analysis complete for idea: ${idea.title}`);
            } catch (aiError) {
                idea.status = 'failed';
                await idea.save();
                console.error(`AI analysis failed for idea ${idea._id}:`, aiError);
            }
        })();

        res.status(202).json({ message: 'Analysis has started. Results will be available shortly.' });

    } catch (error) {
        next(error);
    }
};

// @desc    Get all ideas for a specific user
// @route   GET /api/ideas/user/:userId
exports.getUserIdeas = async (req, res, next) => {
    try {
        // Ensure the logged-in user is requesting their own ideas
        if (req.user.id !== req.params.userId) {
            return res.status(403).json({ message: 'You can only view your own ideas.' });
        }
        const ideas = await Idea.find({ owner: req.params.userId }).sort({ createdAt: -1 });
        res.json(ideas);
    } catch (error) {
        next(error);
    }
};

// @desc    Get PDF report for an idea
// @route   GET /api/ideas/:id/report
exports.getIdeaReport = async (req, res, next) => {
    try {
        const idea = await Idea.findById(req.params.id);
        if (!idea) return res.status(404).json({ message: 'Idea not found' });
        if (idea.owner.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
        if (idea.status !== 'analyzed') return res.status(400).json({ message: 'Analysis not complete' });
        
        const filename = `Report-${idea.title.replace(/\s+/g, '-')}.pdf`;
        res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-type', 'application/pdf');

        pdfService.buildPDF(
            (chunk) => res.write(chunk),
            () => res.end(),
            idea
        );
    } catch (error) {
        next(error);
    }
};


// ------ INVESTOR CONTROLLERS ------

// @desc    Get all analyzed ideas for investors
// @route   GET /api/ideas
exports.getAllIdeasForInvestor = async (req, res, next) => {
    try {
        const ideas = await Idea.find({ status: 'analyzed' })
            .populate('owner', 'name')
            .sort({ createdAt: -1 });
        res.json(ideas);
    } catch (error) {
        next(error);
    }
};

// @desc    Get single idea details
// @route   GET /api/ideas/:id
exports.getIdeaDetailsForInvestor = async (req, res, next) => {
    try {
        const idea = await Idea.findById(req.params.id).populate('owner', 'name email');
        if (!idea || idea.status !== 'analyzed') {
            return res.status(404).json({ message: 'Analyzed idea not found.' });
        }
        res.json(idea);
    } catch (error) {
        next(error);
    }
};

// @desc    Mark interest in an idea
// @route   POST /api/ideas/:id/interest
exports.markInterest = async (req, res, next) => {
    try {
        const idea = await Idea.findById(req.params.id);
        if (!idea) return res.status(404).json({ message: 'Idea not found' });

        const alreadyInterested = idea.investorsInterested.includes(req.user.id);

        if (alreadyInterested) {
            // Optional: allow un-marking interest
            idea.investorsInterested.pull(req.user.id);
        } else {
            idea.investorsInterested.push(req.user.id);
            // Create a notification for the entrepreneur
            await Notification.create({
                user: idea.owner,
                message: `Investor ${req.user.name} is interested in your idea: "${idea.title}"`,
                relatedIdea: idea._id,
            });
        }
        await idea.save();
        res.json({ message: 'Interest updated successfully.' });
    } catch (error) {
        next(error);
    }
};


// Shared controller (can be used by Entrepreneur to see who is interested)
// @desc    Get investors interested in an idea
// @route   GET /api/ideas/:id/investors
exports.getInterestedInvestors = async (req, res, next) => {
    try {
        const idea = await Idea.findById(req.params.id)
            .populate('investorsInterested', 'name email');

        if (!idea) return res.status(404).json({ message: 'Idea not found.' });
        if (idea.owner.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

        res.json(idea.investorsInterested);
    } catch (error) {
        next(error);
    }
};