// routes/idea.routes.js
const express = require('express');
const router = express.Router();

// --- Controller Imports ---
// Import all required controller functions for ideas
const {
    submitIdea,
    getAllIdeasForInvestor, // Used by Investors to browse
    getIdeaById,            // Used by both roles to get a single idea
    updateIdea,             // Used by Entrepreneurs to edit
    deleteIdea,             // Used by Entrepreneurs to delete
    getUserIdeas,           // Used by Entrepreneurs for their history
    analyzeIdea,            // Used by Entrepreneurs to trigger analysis
    getInterestedInvestors, // Used by Entrepreneurs to see who is interested
    getIdeaReport,          // Used by Entrepreneurs to download PDF
    markInterest,           // Used by Investors to add interest
    removeInterest,         // Used by Investors to remove interest
    getInterestedIdeasForInvestor, // Used by Investors for their history
    rerunAnalysis,          // Used by Entrepreneurs to re-analyze
    deleteAnalysis          // Used by Entrepreneurs to reset analysis
} = require('../controllers/idea.controller');

// --- Middleware Imports ---
const { protect } = require('../middlewares/auth.middleware');
const { isEntrepreneur, isInvestor } = require('../middlewares/role.middleware');
const { uploadIdeaAttachments, handleUploadError } = require('../middlewares/upload.middleware');

// --- Validator Imports ---
// Import validation rules for creating an idea
const { validateIdeaCreation } = require('../validators/idea.validator');

//===============================================
// --- ROUTE DEFINITIONS ---
//===============================================

// --- Base Route: /api/ideas ---
// Handles creation of new ideas (by Entrepreneurs) and listing all ideas (for Investors)
router.route('/')
    .post(protect, isEntrepreneur, uploadIdeaAttachments, handleUploadError, validateIdeaCreation, submitIdea)
    .get(protect, isInvestor, getAllIdeasForInvestor);

// --- Investor's Interest History Route: /api/ideas/interested/list ---
// Fetches the list of ideas the logged-in investor has marked as interested.
// Placed before '/:id' to avoid "interested" being treated as an ID.
router.get('/interested/list', protect, isInvestor, getInterestedIdeasForInvestor);

// --- Entrepreneur's Idea History Route: /api/ideas/user ---
// Fetches all ideas submitted by the logged-in entrepreneur.
// IMPORTANT: Must be before /:id route to avoid "user" being treated as an ID
// Changed from /user/:userId to /user to use req.user.id from auth middleware
router.get('/user', protect, isEntrepreneur, getUserIdeas);

// --- Specific Idea Routes: /api/ideas/:id ---
// Handles CRUD operations on a single idea by its ID.
// IMPORTANT: This catch-all route must come AFTER specific routes like /user/:userId
router.route('/:id')
    .get(protect, getIdeaById) // Accessible by both roles, controller checks ownership.
    .put(protect, isEntrepreneur, updateIdea)
    .delete(protect, isEntrepreneur, deleteIdea);

// --- Idea Analysis Route: /api/ideas/:id/analysis ---
// Handles triggering, re-running, and resetting the AI analysis for an idea.
router.route('/:id/analysis')
    .post(protect, isEntrepreneur, analyzeIdea) // POST is for the initial creation of analysis
    .put(protect, isEntrepreneur, rerunAnalysis) // PUT is for updating/re-running it
    .delete(protect, isEntrepreneur, deleteAnalysis); // DELETE is for removing the analysis data

// --- Investor Interest Route: /api/ideas/:id/interest ---
// Handles an investor marking or un-marking their interest in an idea.
router.route('/:id/interest')
    .post(protect, isInvestor, markInterest)
    .delete(protect, isInvestor, removeInterest);

// --- List of Interested Investors Route: /api/ideas/:id/investors ---
// For an entrepreneur to see which investors are interested in their idea.
router.get('/:id/investors', protect, isEntrepreneur, getInterestedInvestors);

// --- PDF Report Download Route: /api/ideas/:id/report ---
// For an entrepreneur to download the generated PDF report.
router.get('/:id/report', protect, isEntrepreneur, getIdeaReport);


module.exports = router;