const MarketResearchNote = require("../models/MarketResearchNote.model");
const Idea = require("../models/Idea.model");

// @desc    Create a new market research note
// @route   POST /api/investor/market-research
// @access  Private (Investor only)
exports.createResearchNote = async (req, res) => {
  try {
    const {
      title,
      sector,
      marketSize,
      trends,
      competitors,
      opportunities,
      threats,
      sources,
      notes,
      relatedIdeas,
      tags,
    } = req.body;

    // Validate required fields
    if (!title || !sector) {
      return res.status(400).json({
        message: "Title and sector are required",
      });
    }

    // Validate related ideas if provided
    if (relatedIdeas && relatedIdeas.length > 0) {
      const ideasExist = await Idea.countDocuments({
        _id: { $in: relatedIdeas },
      });
      if (ideasExist !== relatedIdeas.length) {
        return res.status(404).json({
          message: "One or more related ideas not found",
        });
      }
    }

    // Create research note
    const researchNote = await MarketResearchNote.create({
      investor: req.user._id,
      title,
      sector,
      marketSize: marketSize || "",
      trends: trends || "",
      competitors: competitors || "",
      opportunities: opportunities || "",
      threats: threats || "",
      sources: sources || "",
      notes: notes || "",
      relatedIdeas: relatedIdeas || [],
      tags: tags || [],
    });

    // Populate related ideas
    await researchNote.populate({
      path: "relatedIdeas",
      select: "title category owner",
      populate: { path: "owner", select: "name email" },
    });

    res.status(201).json({
      message: "Market research note created successfully",
      researchNote,
    });
  } catch (error) {
    console.error("Error creating research note:", error);
    res.status(500).json({
      message: error.message || "Error creating research note",
    });
  }
};

// @desc    Get all market research notes for logged-in investor
// @route   GET /api/investor/market-research
// @access  Private (Investor only)
exports.getAllResearchNotes = async (req, res) => {
  try {
    const { sector, search } = req.query;

    // Build query
    const query = { investor: req.user._id };

    if (sector) {
      query.sector = { $regex: sector, $options: "i" };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { sector: { $regex: search, $options: "i" } },
        { trends: { $regex: search, $options: "i" } },
        { notes: { $regex: search, $options: "i" } },
      ];
    }

    const researchNotes = await MarketResearchNote.find(query)
      .sort({ createdAt: -1 })
      .populate({
        path: "relatedIdeas",
        select: "title category owner",
        populate: { path: "owner", select: "name email" },
      });

    res.status(200).json({
      count: researchNotes.length,
      researchNotes,
    });
  } catch (error) {
    console.error("Error fetching research notes:", error);
    res.status(500).json({
      message: "Error fetching research notes",
    });
  }
};

// @desc    Get a specific market research note by ID
// @route   GET /api/investor/market-research/:id
// @access  Private (Investor only)
exports.getResearchNoteById = async (req, res) => {
  try {
    const researchNote = await MarketResearchNote.findById(
      req.params.id
    ).populate({
      path: "relatedIdeas",
      select:
        "title category owner analysis fundingRequirements targetAudience",
      populate: { path: "owner", select: "name email" },
    });

    if (!researchNote) {
      return res.status(404).json({
        message: "Research note not found",
      });
    }

    // Check ownership
    if (researchNote.investor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to access this research note",
      });
    }

    res.status(200).json(researchNote);
  } catch (error) {
    console.error("Error fetching research note:", error);
    res.status(500).json({
      message: "Error fetching research note",
    });
  }
};

// @desc    Update a market research note
// @route   PUT /api/investor/market-research/:id
// @access  Private (Investor only)
exports.updateResearchNote = async (req, res) => {
  try {
    const {
      title,
      sector,
      marketSize,
      trends,
      competitors,
      opportunities,
      threats,
      sources,
      notes,
      relatedIdeas,
      tags,
    } = req.body;

    const researchNote = await MarketResearchNote.findById(req.params.id);

    if (!researchNote) {
      return res.status(404).json({
        message: "Research note not found",
      });
    }

    // Check ownership
    if (researchNote.investor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to update this research note",
      });
    }

    // Validate related ideas if provided
    if (relatedIdeas && relatedIdeas.length > 0) {
      const ideasExist = await Idea.countDocuments({
        _id: { $in: relatedIdeas },
      });
      if (ideasExist !== relatedIdeas.length) {
        return res.status(404).json({
          message: "One or more related ideas not found",
        });
      }
    }

    // Update fields
    if (title !== undefined) researchNote.title = title;
    if (sector !== undefined) researchNote.sector = sector;
    if (marketSize !== undefined) researchNote.marketSize = marketSize;
    if (trends !== undefined) researchNote.trends = trends;
    if (competitors !== undefined) researchNote.competitors = competitors;
    if (opportunities !== undefined) researchNote.opportunities = opportunities;
    if (threats !== undefined) researchNote.threats = threats;
    if (sources !== undefined) researchNote.sources = sources;
    if (notes !== undefined) researchNote.notes = notes;
    if (relatedIdeas !== undefined) researchNote.relatedIdeas = relatedIdeas;
    if (tags !== undefined) researchNote.tags = tags;

    await researchNote.save();

    // Populate for response
    await researchNote.populate({
      path: "relatedIdeas",
      select: "title category owner",
      populate: { path: "owner", select: "name email" },
    });

    res.status(200).json({
      message: "Research note updated successfully",
      researchNote,
    });
  } catch (error) {
    console.error("Error updating research note:", error);
    res.status(500).json({
      message: error.message || "Error updating research note",
    });
  }
};

// @desc    Delete a market research note
// @route   DELETE /api/investor/market-research/:id
// @access  Private (Investor only)
exports.deleteResearchNote = async (req, res) => {
  try {
    const researchNote = await MarketResearchNote.findById(req.params.id);

    if (!researchNote) {
      return res.status(404).json({
        message: "Research note not found",
      });
    }

    // Check ownership
    if (researchNote.investor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to delete this research note",
      });
    }

    await researchNote.deleteOne();

    res.status(200).json({
      message: "Research note deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting research note:", error);
    res.status(500).json({
      message: "Error deleting research note",
    });
  }
};

// @desc    Get all unique sectors from investor's research notes
// @route   GET /api/investor/market-research/sectors/list
// @access  Private (Investor only)
exports.getSectors = async (req, res) => {
  try {
    const sectors = await MarketResearchNote.distinct("sector", {
      investor: req.user._id,
    });

    res.status(200).json({
      sectors: sectors.sort(),
    });
  } catch (error) {
    console.error("Error fetching sectors:", error);
    res.status(500).json({
      message: "Error fetching sectors",
    });
  }
};
