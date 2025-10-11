const express = require("express");
const router = express.Router();
const {
  createComparison,
  getAllComparisons,
  getComparisonById,
  updateComparison,
  deleteComparison,
} = require("../controllers/comparison.controller");
const { protect } = require("../middlewares/auth.middleware");
const { isInvestor } = require("../middlewares/role.middleware");

// All routes require authentication and investor role
router.use(protect);
router.use(isInvestor);

// @route   POST /api/investor/comparisons
// @desc    Create a new comparison
// @access  Private (Investor)
router.post("/", createComparison);

// @route   GET /api/investor/comparisons
// @desc    Get all comparisons for logged-in investor
// @access  Private (Investor)
router.get("/", getAllComparisons);

// @route   GET /api/investor/comparisons/:id
// @desc    Get a specific comparison by ID
// @access  Private (Investor)
router.get("/:id", getComparisonById);

// @route   PUT /api/investor/comparisons/:id
// @desc    Update comparison notes/leader
// @access  Private (Investor)
router.put("/:id", updateComparison);

// @route   DELETE /api/investor/comparisons/:id
// @desc    Delete a comparison
// @access  Private (Investor)
router.delete("/:id", deleteComparison);

module.exports = router;
