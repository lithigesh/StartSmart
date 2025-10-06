const BusinessAim = require('../models/BusinessAim.model');
const Idea = require('../models/Idea.model');

// @desc    Create new business aim
// @route   POST /api/business-aims
// @access  Private (Entrepreneur only)
const createBusinessAim = async (req, res) => {
  console.log('=== BusinessAim Create Request ===');
  console.log('User ID:', req.user?.id);
  console.log('Request Body:', req.body);
  
  try {
    const {
      ideaId,
      businessModel,
      revenueStreams,
      targetMarket,
      marketSize,
      competitionAnalysis,
      pricingStrategy,
      salesStrategy,
      marketingStrategy,
      fundingRequirement,
      useOfFunds,
      financialProjections,
      keyMetrics,
      riskAssessment,
      mitigationStrategies,
      exitStrategy,
      timeline,
      milestones
    } = req.body;

    // Validate required fields
    if (!ideaId || !businessModel || !targetMarket) {
      console.log('Validation failed:', { ideaId: !!ideaId, businessModel: !!businessModel, targetMarket: !!targetMarket });
      return res.status(400).json({
        success: false,
        message: 'Idea ID, business model, and target market are required'
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

    // Check if business aim already exists for this idea
    const existingBusinessAim = await BusinessAim.findOne({ ideaId, owner: req.user.id });
    if (existingBusinessAim) {
      return res.status(400).json({
        success: false,
        message: 'Business aim already exists for this idea. Use update instead.'
      });
    }

    // Create new business aim
    console.log('Creating business aim with data:', {
      ideaId,
      businessModel: businessModel?.substring(0, 50) + '...',
      targetMarket: targetMarket?.substring(0, 50) + '...',
      owner: req.user.id
    });
    
    const businessAim = await BusinessAim.create({
      ideaId,
      businessModel,
      revenueStreams: revenueStreams || [],
      targetMarket,
      marketSize,
      competitionAnalysis,
      pricingStrategy,
      salesStrategy,
      marketingStrategy,
      fundingRequirement,
      useOfFunds,
      financialProjections,
      keyMetrics: keyMetrics || [],
      riskAssessment,
      mitigationStrategies,
      exitStrategy,
      timeline,
      milestones: milestones || [],
      owner: req.user.id
    });

    console.log('BusinessAim created successfully:', businessAim._id);
    
    res.status(201).json({
      success: true,
      message: 'Business aim created successfully',
      data: businessAim
    });
  } catch (error) {
    console.error('Error creating business aim:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all business aims for logged-in user
// @route   GET /api/business-aims
// @access  Private (Entrepreneur only)
const getBusinessAims = async (req, res) => {
  try {
    console.log('=== Getting BusinessAims for user:', req.user.id);
    
    const businessAims = await BusinessAim.find({ owner: req.user.id })
      .populate('ideaId', 'title problemTitle solutionTitle category')
      .sort({ createdAt: -1 });

    console.log(`Found ${businessAims.length} business aims for user`);
    businessAims.forEach((aim, index) => {
      console.log(`${index + 1}. ID: ${aim._id}, Created: ${aim.createdAt}, IdeaTitle: ${aim.ideaId?.title || 'No title'}`);
    });

    res.json({
      success: true,
      count: businessAims.length,
      data: businessAims
    });
  } catch (error) {
    console.error('Error fetching business aims:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get business aim by ID
// @route   GET /api/business-aims/:id
// @access  Private (Entrepreneur only)
const getBusinessAimById = async (req, res) => {
  try {
    const businessAim = await BusinessAim.findOne({ 
      _id: req.params.id, 
      owner: req.user.id 
    }).populate('ideaId', 'title category description');

    if (!businessAim) {
      return res.status(404).json({
        success: false,
        message: 'Business aim not found'
      });
    }

    res.json({
      success: true,
      data: businessAim
    });
  } catch (error) {
    console.error('Error fetching business aim:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update business aim
// @route   PUT /api/business-aims/:id
// @access  Private (Entrepreneur only)
const updateBusinessAim = async (req, res) => {
  try {
    const businessAim = await BusinessAim.findOne({ 
      _id: req.params.id, 
      owner: req.user.id 
    });

    if (!businessAim) {
      return res.status(404).json({
        success: false,
        message: 'Business aim not found'
      });
    }

    // Update fields
    const allowedFields = [
      'businessModel', 'revenueStreams', 'targetMarket', 'marketSize',
      'competitionAnalysis', 'pricingStrategy', 'salesStrategy', 'marketingStrategy',
      'fundingRequirement', 'useOfFunds', 'financialProjections', 'keyMetrics',
      'riskAssessment', 'mitigationStrategies', 'exitStrategy', 'timeline', 'milestones'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        businessAim[field] = req.body[field];
      }
    });

    await businessAim.save();

    res.json({
      success: true,
      message: 'Business aim updated successfully',
      data: businessAim
    });
  } catch (error) {
    console.error('Error updating business aim:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete business aim
// @route   DELETE /api/business-aims/:id
// @access  Private (Entrepreneur only)
const deleteBusinessAim = async (req, res) => {
  try {
    const businessAim = await BusinessAim.findOne({ 
      _id: req.params.id, 
      owner: req.user.id 
    });

    if (!businessAim) {
      return res.status(404).json({
        success: false,
        message: 'Business aim not found'
      });
    }

    await BusinessAim.deleteOne({ _id: req.params.id });

    res.json({
      success: true,
      message: 'Business aim deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting business aim:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get business aim by idea ID
// @route   GET /api/business-aims/idea/:ideaId
// @access  Private (Entrepreneur only)
const getBusinessAimByIdeaId = async (req, res) => {
  try {
    const businessAim = await BusinessAim.findOne({ 
      ideaId: req.params.ideaId, 
      owner: req.user.id 
    }).populate('ideaId', 'title category description');

    res.json({
      success: true,
      data: businessAim
    });
  } catch (error) {
    console.error('Error fetching business aim by idea ID:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  createBusinessAim,
  getBusinessAims,
  getBusinessAimById,
  updateBusinessAim,
  deleteBusinessAim,
  getBusinessAimByIdeaId
};
