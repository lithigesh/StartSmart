const ComparisonNote = require("../models/ComparisonNote.model");
const Idea = require("../models/Idea.model");

// @desc    Create a new comparison
// @route   POST /api/investor/comparisons
// @access  Private (Investor only)
exports.createComparison = async (req, res) => {
  try {
    const { ideas, chosenLeader, notes, rationale } = req.body;

    // Validation: Check ideas array
    if (
      !ideas ||
      !Array.isArray(ideas) ||
      ideas.length < 2 ||
      ideas.length > 4
    ) {
      return res.status(400).json({
        message: "Please select between 2 and 4 ideas to compare",
      });
    }

    // Validate that all ideas exist and are analyzed
    const ideasData = await Idea.find({ _id: { $in: ideas } })
      .select(
        "_id title elevatorPitch category owner analysis fundingRequirements createdAt targetAudience problemStatement solution marketSize revenueStreams competitors scalabilityPlan"
      )
      .populate("owner", "name email");

    if (ideasData.length !== ideas.length) {
      return res.status(404).json({
        message: "One or more ideas not found",
      });
    }

    // Validate chosenLeader is one of the selected ideas
    if (chosenLeader && !ideas.includes(chosenLeader.toString())) {
      return res.status(400).json({
        message: "Chosen leader must be one of the compared ideas",
      });
    }

    // Create comparison metrics snapshot
    const comparisonMetrics = {};
    ideasData.forEach((idea) => {
      comparisonMetrics[idea._id.toString()] = {
        title: idea.title,
        elevatorPitch: idea.elevatorPitch,
        category: idea.category,
        ownerName: idea.owner?.name || "Anonymous",
        score: idea.analysis?.score || 0,
        fundingRequirements: idea.fundingRequirements || "Not specified",
        createdAt: idea.createdAt,
        targetAudience: idea.targetAudience || "",
        problemStatement: idea.problemStatement || "",
        solution: idea.solution || "",
        marketSize: idea.marketSize || "Not specified",
        revenueStreams: idea.revenueStreams || "Not specified",
        competitors: idea.competitors || "Not specified",
        scalabilityPlan: idea.scalabilityPlan || "Not specified",
      };
    });

    // Create comparison
    const comparison = await ComparisonNote.create({
      investor: req.user._id,
      ideas,
      chosenLeader: chosenLeader || null,
      notes: notes || "",
      rationale: rationale || "",
      comparisonMetrics,
    });

    // Populate ideas for response
    await comparison.populate({
      path: "ideas",
      select:
        "title elevatorPitch category owner analysis fundingRequirements createdAt targetAudience problemStatement solution",
      populate: { path: "owner", select: "name email" },
    });

    await comparison.populate({
      path: "chosenLeader",
      select: "title",
    });

    res.status(201).json({
      message: "Comparison created successfully",
      comparison,
    });
  } catch (error) {
    console.error("Error creating comparison:", error);
    res.status(500).json({
      message: error.message || "Error creating comparison",
    });
  }
};

// @desc    Get all comparisons for the logged-in investor
// @route   GET /api/investor/comparisons
// @access  Private (Investor only)
exports.getAllComparisons = async (req, res) => {
  try {
    const comparisons = await ComparisonNote.find({ investor: req.user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "ideas",
        select:
          "title elevatorPitch category owner analysis fundingRequirements createdAt targetAudience problemStatement solution",
        populate: { path: "owner", select: "name email" },
      })
      .populate({
        path: "chosenLeader",
        select: "title",
      });

    res.status(200).json({
      count: comparisons.length,
      comparisons,
    });
  } catch (error) {
    console.error("Error fetching comparisons:", error);
    res.status(500).json({
      message: "Error fetching comparisons",
    });
  }
};

// @desc    Get a specific comparison by ID
// @route   GET /api/investor/comparisons/:id
// @access  Private (Investor only)
exports.getComparisonById = async (req, res) => {
  try {
    const comparison = await ComparisonNote.findById(req.params.id)
      .populate({
        path: "ideas",
        select:
          "title elevatorPitch description category owner analysis fundingRequirements createdAt targetAudience problemStatement solution marketSize revenueStreams competitors scalabilityPlan pricingStrategy goToMarketStrategy",
        populate: { path: "owner", select: "name email" },
      })
      .populate({
        path: "chosenLeader",
        select: "title",
      });

    if (!comparison) {
      return res.status(404).json({
        message: "Comparison not found",
      });
    }

    // Check ownership
    if (comparison.investor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to access this comparison",
      });
    }

    res.status(200).json(comparison);
  } catch (error) {
    console.error("Error fetching comparison:", error);
    res.status(500).json({
      message: "Error fetching comparison",
    });
  }
};

// @desc    Update a comparison (notes, rationale, chosenLeader)
// @route   PUT /api/investor/comparisons/:id
// @access  Private (Investor only)
exports.updateComparison = async (req, res) => {
  try {
    const { notes, rationale, chosenLeader } = req.body;

    const comparison = await ComparisonNote.findById(req.params.id);

    if (!comparison) {
      return res.status(404).json({
        message: "Comparison not found",
      });
    }

    // Check ownership
    if (comparison.investor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to update this comparison",
      });
    }

    // Validate chosenLeader if provided
    if (chosenLeader) {
      const isValidLeader = comparison.ideas.some(
        (ideaId) => ideaId.toString() === chosenLeader.toString()
      );
      if (!isValidLeader) {
        return res.status(400).json({
          message: "Chosen leader must be one of the compared ideas",
        });
      }
    }

    // Update fields
    if (notes !== undefined) comparison.notes = notes;
    if (rationale !== undefined) comparison.rationale = rationale;
    if (chosenLeader !== undefined) comparison.chosenLeader = chosenLeader;

    await comparison.save();

    // Populate for response
    await comparison.populate({
      path: "ideas",
      select:
        "title elevatorPitch category owner analysis fundingRequirements createdAt targetAudience problemStatement solution",
      populate: { path: "owner", select: "name email" },
    });

    await comparison.populate({
      path: "chosenLeader",
      select: "title",
    });

    res.status(200).json({
      message: "Comparison updated successfully",
      comparison,
    });
  } catch (error) {
    console.error("Error updating comparison:", error);
    res.status(500).json({
      message: "Error updating comparison",
    });
  }
};

// @desc    Delete a comparison
// @route   DELETE /api/investor/comparisons/:id
// @access  Private (Investor only)
exports.deleteComparison = async (req, res) => {
  try {
    const comparison = await ComparisonNote.findById(req.params.id);

    if (!comparison) {
      return res.status(404).json({
        message: "Comparison not found",
      });
    }

    // Check ownership
    if (comparison.investor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to delete this comparison",
      });
    }

    await comparison.deleteOne();

    res.status(200).json({
      message: "Comparison deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting comparison:", error);
    res.status(500).json({
      message: "Error deleting comparison",
    });
  }
};
