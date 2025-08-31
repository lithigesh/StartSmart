// routes/idea.routes.js
const express = require('express');
const router = express.Router();
const {
    submitIdea,
    analyzeIdea,
    getUserIdeas,
    getInterestedInvestors,
    getIdeaReport,
    getAllIdeasForInvestor,
    getIdeaDetailsForInvestor,
    markInterest,
} = require('../controllers/idea.controller');
const { protect } = require('../middlewares/auth.middleware');
const { isEntrepreneur, isInvestor } = require('../middlewares/role.middleware');

// --- Entrepreneur Routes ---
router.post('/', protect, isEntrepreneur, submitIdea);
router.post('/:id/analyze', protect, isEntrepreneur, analyzeIdea);
router.get('/user/:userId', protect, isEntrepreneur, getUserIdeas);
router.get('/:id/investors', protect, isEntrepreneur, getInterestedInvestors);
router.get('/:id/report', protect, isEntrepreneur, getIdeaReport);

// --- Investor Routes ---
router.get('/', protect, isInvestor, getAllIdeasForInvestor);
router.get('/:id', protect, isInvestor, getIdeaDetailsForInvestor);
router.post('/:id/interest', protect, isInvestor, markInterest);

module.exports = router;