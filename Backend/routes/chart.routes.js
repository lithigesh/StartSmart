// Chart routes for idea analytics
const express = require('express');
const router = express.Router();
const { 
    getIdeasChartData, 
    getIdeaAnalytics,
    getTechStackDistribution 
} = require('../controllers/chart.controller');
const { protect } = require('../middlewares/auth.middleware');

// Get aggregated chart data for ideas overview
router.get('/ideas-overview', protect, getIdeasChartData);

// Get individual idea analytics
router.get('/idea/:ideaId', protect, getIdeaAnalytics);

// Get tech stack distribution data
router.get('/tech-stack-distribution', protect, getTechStackDistribution);

module.exports = router;
