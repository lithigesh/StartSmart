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

router.route('/:id')
    .get(protect, getIdeathonById)
    .put(protect, isAdmin, updateIdeathon)
    .delete(protect, isAdmin, deleteIdeathon);

// Routes for participation
router.post('/:id/register', protect, isEntrepreneur, registerForIdeathon);
router.get('/:id/registrations', protect, isAdmin, getIdeathonRegistrations);
router.put('/:id/results', protect, isAdmin, postIdeathonWinners);

module.exports = router;