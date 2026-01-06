const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const { isAdmin, isEntrepreneur } = require('../middlewares/role.middleware');
const {
    createIdeathon,
    getAllIdeathons,
    getIdeathonById,
    updateIdeathon,
    deleteIdeathon,
    registerForIdeathon,
    getIdeathonRegistrations,
    getRegistrationById,
    postIdeathonWinners,
    getMyRegisteredIdeathons,
    updateRegistration,
    updateRegistrationProgress,
    addMilestone,
    updateMilestone,
    submitFinalSubmission,
    getFinalSubmission,
    updateFinalSubmission,
    withdrawFromIdeathon
} = require('../controllers/ideathon.controller');

// Admin routes for managing ideathons
router.route('/')
    .post(protect, isAdmin, createIdeathon)
    .get(protect, getAllIdeathons);

// Routes for participation (must come before /:id routes to avoid conflicts)
router.get('/my-registrations', protect, isEntrepreneur, getMyRegisteredIdeathons);
router.get('/registrations', protect, isAdmin, getIdeathonRegistrations);

// Registration management routes
router.put('/:id/registrations/:registrationId', protect, updateRegistration);
router.get('/:id/registrations/:registrationId', protect, getRegistrationById);
router.post('/:id/register', protect, registerForIdeathon); // Allow both admin and entrepreneur
router.get('/:id/registrations', protect, isAdmin, getIdeathonRegistrations);
router.put('/:id/results', protect, isAdmin, postIdeathonWinners);
router.delete('/registrations/:registrationId', protect, withdrawFromIdeathon);

// Progress tracking routes
router.put('/registrations/:registrationId/progress', protect, updateRegistrationProgress);
router.post('/registrations/:registrationId/milestones', protect, addMilestone);
router.put('/registrations/:registrationId/milestones/:milestoneId', protect, updateMilestone);

// Final submission routes
router.post('/registrations/:registrationId/final-submission', protect, submitFinalSubmission);
router.get('/registrations/:registrationId/final-submission', protect, getFinalSubmission);
router.put('/registrations/:registrationId/final-submission', protect, updateFinalSubmission);

// Specific ideathon routes (must come after other routes to avoid conflicts)
router.route('/:id')
    .get(protect, getIdeathonById)
    .put(protect, isAdmin, updateIdeathon)
    .delete(protect, isAdmin, deleteIdeathon);

module.exports = router;