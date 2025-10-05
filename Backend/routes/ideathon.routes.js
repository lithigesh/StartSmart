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
    postIdeathonWinners
} = require('../controllers/ideathon.controller');

// Admin routes for managing ideathons
router.route('/')
    .post(protect, isAdmin, createIdeathon)
    .get(protect, getAllIdeathons);

// Routes for participation (must come before /:id routes to avoid conflicts)
router.get('/registrations', protect, isAdmin, getIdeathonRegistrations);
router.post('/:id/register', protect, registerForIdeathon); // Allow both admin and entrepreneur
router.get('/:id/registrations', protect, isAdmin, getIdeathonRegistrations);
router.put('/:id/results', protect, isAdmin, postIdeathonWinners);

// Specific ideathon routes (must come after other routes to avoid conflicts)
router.route('/:id')
    .get(protect, getIdeathonById)
    .put(protect, isAdmin, updateIdeathon)
    .delete(protect, isAdmin, deleteIdeathon);

module.exports = router;