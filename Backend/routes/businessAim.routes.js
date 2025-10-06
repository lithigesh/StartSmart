const express = require('express');
const router = express.Router();

// Import controller functions
const {
  createBusinessAim,
  getBusinessAims,
  getBusinessAimById,
  updateBusinessAim,
  deleteBusinessAim,
  getBusinessAimByIdeaId
} = require('../controllers/businessAim.controller');

// Import middleware
const { protect } = require('../middlewares/auth.middleware');
const { isEntrepreneur } = require('../middlewares/role.middleware');

// Routes
router.route('/')
  .post(protect, isEntrepreneur, createBusinessAim)
  .get(protect, isEntrepreneur, getBusinessAims);

router.route('/:id')
  .get(protect, isEntrepreneur, getBusinessAimById)
  .put(protect, isEntrepreneur, updateBusinessAim)
  .delete(protect, isEntrepreneur, deleteBusinessAim);

router.route('/idea/:ideaId')
  .get(protect, isEntrepreneur, getBusinessAimByIdeaId);

module.exports = router;
