const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const {
    generateAndSaveReport,
    downloadReport,
    deleteReport
} = require('../controllers/report.controller');

// The new design separates report generation from downloading
router.post('/ideas/:id/report', protect, generateAndSaveReport);
router.get('/ideas/:id/report/:reportId', protect, downloadReport); // Note: reportId is now needed
router.delete('/ideas/:id/report/:reportId', protect, deleteReport);

module.exports = router;