const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const { isInvestor } = require('../middlewares/role.middleware');
const {
    markInterest,
    updateInterestStatus,
    withdrawInterest,
    getInvestorIdeas
} = require('../controllers/investor.controller');

// Route for investors to browse all analyzed ideas
router.get('/ideas', protect, isInvestor, getInvestorIdeas);

// Routes for managing interest in a specific idea
router.route('/:ideaId/interest')
    .post(protect, isInvestor, markInterest)
    .put(protect, isInvestor, updateInterestStatus)
    .delete(protect, isInvestor, withdrawInterest);

module.exports = router;