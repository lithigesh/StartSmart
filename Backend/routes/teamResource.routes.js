const express = require('express');
const router = express.Router();
const {
  createTeamResource,
  getTeamResources,
  getTeamResourceById,
  updateTeamResource,
  deleteTeamResource,
  getTeamResourcesByIdea
} = require('../controllers/teamResource.controller');
const { protect } = require('../middlewares/auth.middleware');
const { isEntrepreneur } = require('../middlewares/role.middleware');

// All routes require authentication and entrepreneur role
router.use(protect);
router.use(isEntrepreneur);

// @route   GET /api/team
// @desc    Get all team resources for current user
// @route   POST /api/team
// @desc    Create new team resource
router.route('/')
  .get(getTeamResources)
  .post(createTeamResource);

// @route   GET /api/team/idea/:ideaId
// @desc    Get team resources for specific idea
router.get('/idea/:ideaId', getTeamResourcesByIdea);

// @route   GET /api/team/:id
// @desc    Get team resource by ID
// @route   PUT /api/team/:id
// @desc    Update team resource
// @route   DELETE /api/team/:id
// @desc    Delete team resource
router.route('/:id')
  .get(getTeamResourceById)
  .put(updateTeamResource)
  .delete(deleteTeamResource);

module.exports = router;