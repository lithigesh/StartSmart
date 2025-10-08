const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware");
const {
  isEntrepreneur,
  isInvestor,
} = require("../middlewares/role.middleware");
const {
  createFundingRequest,
  getAllFundingRequests,
  getUserFundingRequests,
  getFundingRequestById,
  updateFundingRequestStatus,
  updateFundingRequestDetails,
  withdrawFundingRequest,
  getFundingStats,
  markAsViewed,
  investorRespondToRequest,
  investorNegotiate,
  entrepreneurRespond,
  getInvestorPipeline,
  getInterestedInvestorsForIdea,
} = require("../controllers/funding.controller");

// Base routes
router
  .route("/")
  .post(protect, isEntrepreneur, createFundingRequest)
  .get(protect, getAllFundingRequests); // Accessible by both roles with different filtering

// User-specific routes
router.route("/user").get(protect, isEntrepreneur, getUserFundingRequests); // Get entrepreneur's funding requests

router.route("/stats").get(protect, getFundingStats); // Get funding statistics

// Idea-specific routes (for targeting)
router
  .route("/idea/:ideaId/interested-investors")
  .get(protect, isEntrepreneur, getInterestedInvestorsForIdea); // Get interested investors for targeting

// Investor-specific routes
router
  .route("/investor/pipeline")
  .get(protect, isInvestor, getInvestorPipeline); // Get investor's deal pipeline

router.route("/:id/view").put(protect, isInvestor, markAsViewed); // Mark funding request as viewed

router
  .route("/:id/investor-response")
  .put(protect, isInvestor, investorRespondToRequest); // Accept/Decline funding request

router.route("/:id/negotiate").post(protect, isInvestor, investorNegotiate); // Send negotiation message

router
  .route("/:id/entrepreneur-negotiate")
  .post(protect, isEntrepreneur, entrepreneurRespond); // Entrepreneur responds to negotiation

// Individual funding request routes
router
  .route("/:id")
  .get(protect, getFundingRequestById)
  .put(protect, updateFundingRequestStatus) // Status updates (for investors)
  .delete(protect, isEntrepreneur, withdrawFundingRequest); // Only entrepreneurs can withdraw

// Detailed updates route (for entrepreneurs)
router
  .route("/:id/details")
  .put(protect, isEntrepreneur, updateFundingRequestDetails);

module.exports = router;
