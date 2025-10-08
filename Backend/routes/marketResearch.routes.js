const express = require("express");
const router = express.Router();
const {
  createResearchNote,
  getAllResearchNotes,
  getResearchNoteById,
  updateResearchNote,
  deleteResearchNote,
  getSectors,
} = require("../controllers/marketResearch.controller");
const { protect } = require("../middlewares/auth.middleware");
const { isInvestor } = require("../middlewares/role.middleware");

// All routes require authentication and investor role
router.use(protect);
router.use(isInvestor);

// @route   GET /api/investor/market-research/sectors/list
// @desc    Get all unique sectors from investor's research notes
// @access  Private (Investor)
router.get("/sectors/list", getSectors);

// @route   POST /api/investor/market-research
// @desc    Create a new market research note
// @access  Private (Investor)
router.post("/", createResearchNote);

// @route   GET /api/investor/market-research
// @desc    Get all market research notes for logged-in investor
// @access  Private (Investor)
router.get("/", getAllResearchNotes);

// @route   GET /api/investor/market-research/:id
// @desc    Get a specific market research note by ID
// @access  Private (Investor)
router.get("/:id", getResearchNoteById);

// @route   PUT /api/investor/market-research/:id
// @desc    Update a market research note
// @access  Private (Investor)
router.put("/:id", updateResearchNote);

// @route   DELETE /api/investor/market-research/:id
// @desc    Delete a market research note
// @access  Private (Investor)
router.delete("/:id", deleteResearchNote);

module.exports = router;
