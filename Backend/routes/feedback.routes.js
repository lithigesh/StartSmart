const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const { isInvestor } = require('../middlewares/role.middleware');
const {
    addFeedback,
    getFeedbackForIdea,
    updateFeedback,
    deleteFeedback
} = require('../controllers/feedback.controller');

router.route('/')
    .post(protect, isInvestor, addFeedback); // Only investors can give feedback

router.route('/:id')
    .put(protect, isInvestor, updateFeedback)
    .delete(protect, isInvestor, deleteFeedback);

router.get('/:ideaId', protect, getFeedbackForIdea);

module.exports = router;