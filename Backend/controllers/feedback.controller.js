const Feedback = require('../models/Feedback.model');

// @desc    Add feedback to an idea
// @route   POST /api/feedback
exports.addFeedback = async (req, res, next) => {
    try {
        const { ideaId, comment, rating } = req.body;
        const feedback = await Feedback.create({
            idea: ideaId,
            investor: req.user.id,
            comment,
            rating,
        });
        res.status(201).json(feedback);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all feedback for an idea
// @route   GET /api/feedback/:ideaId
exports.getFeedbackForIdea = async (req, res, next) => {
    try {
        const feedbackList = await Feedback.find({ idea: req.params.ideaId })
            .populate('investor', 'name');
        res.json(feedbackList);
    } catch (error) {
        next(error);
    }
};

// @desc    Update your own feedback
// @route   PUT /api/feedback/:id
exports.updateFeedback = async (req, res, next) => {
    try {
        const feedback = await Feedback.findById(req.params.id);
        if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
        if (feedback.investor.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You can only update your own feedback' });
        }

        feedback.comment = req.body.comment || feedback.comment;
        feedback.rating = req.body.rating || feedback.rating;
        await feedback.save();
        res.json(feedback);
    } catch (error) {
        next(error);
    }
};

exports.deleteFeedback = async (req, res, next) => { /* Similar logic to update */ };