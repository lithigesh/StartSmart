const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const { isEntrepreneur } = require('../middlewares/role.middleware');
const {
    addSustainabilityEntry,
    getSustainabilityForIdea,
    updateSustainabilityEntry,
    deleteSustainabilityEntry
} = require('../controllers/sustainability.controller');

router.route('/')
    .post(protect, isEntrepreneur, addSustainabilityEntry);

router.route('/:id')
    .put(protect, isEntrepreneur, updateSustainabilityEntry)
    .delete(protect, isEntrepreneur, deleteSustainabilityEntry);

router.get('/:ideaId', protect, getSustainabilityForIdea);

module.exports = router;