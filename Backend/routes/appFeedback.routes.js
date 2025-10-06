// routes/appFeedback.routes.js
const express = require('express');
const router = express.Router();
const {
    createAppFeedback,
    getMyFeedback,
    getFeedback,
    updateFeedback,
    deleteFeedback,
    markAsHelpful,
    getFeedbackStats
} = require('../controllers/appFeedback.controller');
const { protect } = require('../middlewares/auth.middleware');

// Apply authentication to all routes
router.use(protect);

// Routes
router.route('/')
    .post(createAppFeedback);

router.route('/my-feedback')
    .get(getMyFeedback);

router.route('/stats')
    .get(getFeedbackStats);

router.route('/:id')
    .get(getFeedback)
    .put(updateFeedback)
    .delete(deleteFeedback);

router.route('/:id/helpful')
    .post(markAsHelpful);

module.exports = router;