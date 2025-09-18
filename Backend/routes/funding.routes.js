const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const { isEntrepreneur, isInvestor } = require('../middlewares/role.middleware');
const {
    createFundingRequest,
    getAllFundingRequests,
    getUserFundingRequests,
    getFundingRequestById,
    updateFundingRequestStatus,
    updateFundingRequestDetails,
    withdrawFundingRequest,
    getFundingStats
} = require('../controllers/funding.controller');

// Base routes
router.route('/')
    .post(protect, isEntrepreneur, createFundingRequest)
    .get(protect, getAllFundingRequests); // Accessible by both roles with different filtering

// User-specific routes
router.route('/user')
    .get(protect, isEntrepreneur, getUserFundingRequests); // Get entrepreneur's funding requests

router.route('/stats')
    .get(protect, getFundingStats); // Get funding statistics

// Individual funding request routes
router.route('/:id')
    .get(protect, getFundingRequestById)
    .put(protect, updateFundingRequestStatus) // Status updates (for investors)
    .delete(protect, isEntrepreneur, withdrawFundingRequest); // Only entrepreneurs can withdraw

// Detailed updates route (for entrepreneurs)
router.route('/:id/details')
    .put(protect, isEntrepreneur, updateFundingRequestDetails);

module.exports = router;