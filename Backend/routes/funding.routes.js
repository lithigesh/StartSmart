const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const { isEntrepreneur, isInvestor } = require('../middlewares/role.middleware');
const {
    createFundingRequest,
    getAllFundingRequests,
    getFundingRequestById,
    updateFundingRequestStatus,
    withdrawFundingRequest
} = require('../controllers/funding.controller');

router.route('/')
    .post(protect, isEntrepreneur, createFundingRequest)
    .get(protect, getAllFundingRequests); // Accessible by both roles

router.route('/:id')
    .get(protect, getFundingRequestById)
    .put(protect, isInvestor, updateFundingRequestStatus) // Only investors can respond
    .delete(protect, isEntrepreneur, withdrawFundingRequest); // Only entrepreneurs can withdraw

module.exports = router;