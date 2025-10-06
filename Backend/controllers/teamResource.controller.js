const TeamResource = require('../models/TeamResource.model');
const Idea = require('../models/Idea.model');

// @desc    Create new team/resource entry
// @route   POST /api/team
// @access  Private (Entrepreneur only)
const createTeamResource = async (req, res) => {
  try {
    const { ideaId, teamMembers, coreSkills, resourcesNeeded, currentResources, resourceGaps, notes } = req.body;

    // Validate required fields
    if (!ideaId || !teamMembers || !coreSkills) {
      return res.status(400).json({
        success: false,
        message: 'Idea ID, team members, and core skills are required'
      });
    }

    // Verify the idea exists and belongs to the user
    const idea = await Idea.findOne({ _id: ideaId, owner: req.user.id });
    if (!idea) {
      return res.status(404).json({
        success: false,
        message: 'Idea not found or access denied'
      });
    }

    // Validate team members
    if (!Array.isArray(teamMembers) || teamMembers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one team member is required'
      });
    }

    // Validate each team member
    for (const member of teamMembers) {
      if (!member.name || !member.role || !member.expertise) {
        return res.status(400).json({
          success: false,
          message: 'Each team member must have name, role, and expertise'
        });
      }
    }

    // Validate core skills
    if (!Array.isArray(coreSkills) || coreSkills.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one core skill is required'
      });
    }

    // Check if team resource already exists for this idea
    const existingTeam = await TeamResource.findOne({ ideaId, owner: req.user.id });
    if (existingTeam) {
      return res.status(400).json({
        success: false,
        message: 'Team resource entry already exists for this idea. Use update instead.'
      });
    }

    // Create new team resource
    const teamResource = new TeamResource({
      ideaId,
      owner: req.user.id,
      teamMembers,
      coreSkills,
      resourcesNeeded: resourcesNeeded || [],
      currentResources: currentResources || '',
      resourceGaps: resourceGaps || '',
      notes: notes || ''
    });

    const savedTeamResource = await teamResource.save();
    
    // Populate the response
    await savedTeamResource.populate([
      { path: 'ideaDetails', select: 'title category' },
      { path: 'ownerDetails', select: 'name email' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Team resource created successfully',
      data: savedTeamResource
    });

  } catch (error) {
    console.error('Error creating team resource:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating team resource',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get all team resources for current user
// @route   GET /api/team
// @access  Private (Entrepreneur only)
const getTeamResources = async (req, res) => {
  try {
    const { page = 1, limit = 10, ideaId } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    const query = { owner: req.user.id };
    if (ideaId) {
      query.ideaId = ideaId;
    }

    // Get team resources with pagination
    const teamResources = await TeamResource.find(query)
      .populate('ideaDetails', 'title category stage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await TeamResource.countDocuments(query);

    res.status(200).json({
      success: true,
      message: 'Team resources retrieved successfully',
      data: teamResources,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching team resources:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching team resources',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get team resource by ID
// @route   GET /api/team/:id
// @access  Private (Entrepreneur only)
const getTeamResourceById = async (req, res) => {
  try {
    const teamResource = await TeamResource.findOne({
      _id: req.params.id,
      owner: req.user.id
    }).populate([
      { path: 'ideaDetails', select: 'title category stage description' },
      { path: 'ownerDetails', select: 'name email' }
    ]);

    if (!teamResource) {
      return res.status(404).json({
        success: false,
        message: 'Team resource not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Team resource retrieved successfully',
      data: teamResource
    });

  } catch (error) {
    console.error('Error fetching team resource:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching team resource',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Update team resource
// @route   PUT /api/team/:id
// @access  Private (Entrepreneur only)
const updateTeamResource = async (req, res) => {
  try {
    const { teamMembers, coreSkills, resourcesNeeded, currentResources, resourceGaps, notes } = req.body;

    // Find team resource
    const teamResource = await TeamResource.findOne({
      _id: req.params.id,
      owner: req.user.id
    });

    if (!teamResource) {
      return res.status(404).json({
        success: false,
        message: 'Team resource not found'
      });
    }

    // Validate team members if provided
    if (teamMembers) {
      if (!Array.isArray(teamMembers) || teamMembers.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'At least one team member is required'
        });
      }

      // Validate each team member
      for (const member of teamMembers) {
        if (!member.name || !member.role || !member.expertise) {
          return res.status(400).json({
            success: false,
            message: 'Each team member must have name, role, and expertise'
          });
        }
      }
    }

    // Validate core skills if provided
    if (coreSkills && (!Array.isArray(coreSkills) || coreSkills.length === 0)) {
      return res.status(400).json({
        success: false,
        message: 'At least one core skill is required'
      });
    }

    // Update fields
    if (teamMembers) teamResource.teamMembers = teamMembers;
    if (coreSkills) teamResource.coreSkills = coreSkills;
    if (resourcesNeeded !== undefined) teamResource.resourcesNeeded = resourcesNeeded;
    if (currentResources !== undefined) teamResource.currentResources = currentResources;
    if (resourceGaps !== undefined) teamResource.resourceGaps = resourceGaps;
    if (notes !== undefined) teamResource.notes = notes;

    const updatedTeamResource = await teamResource.save();
    
    // Populate the response
    await updatedTeamResource.populate([
      { path: 'ideaDetails', select: 'title category' },
      { path: 'ownerDetails', select: 'name email' }
    ]);

    res.status(200).json({
      success: true,
      message: 'Team resource updated successfully',
      data: updatedTeamResource
    });

  } catch (error) {
    console.error('Error updating team resource:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating team resource',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Delete team resource
// @route   DELETE /api/team/:id
// @access  Private (Entrepreneur only)
const deleteTeamResource = async (req, res) => {
  try {
    const teamResource = await TeamResource.findOne({
      _id: req.params.id,
      owner: req.user.id
    });

    if (!teamResource) {
      return res.status(404).json({
        success: false,
        message: 'Team resource not found'
      });
    }

    await TeamResource.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Team resource deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting team resource:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting team resource',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get team resources by idea ID
// @route   GET /api/team/idea/:ideaId
// @access  Private (Entrepreneur only)
const getTeamResourcesByIdea = async (req, res) => {
  try {
    const { ideaId } = req.params;

    // Verify the idea exists and belongs to the user
    const idea = await Idea.findOne({ _id: ideaId, owner: req.user.id });
    if (!idea) {
      return res.status(404).json({
        success: false,
        message: 'Idea not found or access denied'
      });
    }

    const teamResources = await TeamResource.find({ 
      ideaId, 
      owner: req.user.id 
    }).populate('ideaDetails', 'title category stage');

    res.status(200).json({
      success: true,
      message: 'Team resources for idea retrieved successfully',
      data: teamResources
    });

  } catch (error) {
    console.error('Error fetching team resources by idea:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching team resources',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  createTeamResource,
  getTeamResources,
  getTeamResourceById,
  updateTeamResource,
  deleteTeamResource,
  getTeamResourcesByIdea
};