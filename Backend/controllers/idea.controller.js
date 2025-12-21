// controllers/idea.controller.js
const Idea = require("../models/Idea.model");
const User = require("../models/User.model");
const Notification = require("../models/Notification.model");
const NotificationService = require("../services/notification.service");
const aiService = require("../services/aiAnalysis.service");
const pdfService = require("../services/pdf.service");
const fs = require("fs");
const path = require("path");

// ------ ENTREPRENEUR CONTROLLERS ------

// @desc    Submit a new idea
// @route   POST /api/ideas
exports.submitIdea = async (req, res, next) => {
  try {
    const {
      // Basic Information
      title,
      elevatorPitch,
      description, // detailedDescription from frontend
      category,
      targetAudience,

      // Problem & Solution
      problemStatement,
      solution,
      competitors,

      // Business Model
      revenueStreams,
      pricingStrategy,
      keyPartnerships,

      // Market & Growth
      marketSize,
      goToMarketStrategy,
      scalabilityPlan,

      // Technical Requirements
      technologyStack,
      developmentRoadmap,
      challengesAnticipated,

      // Sustainability & Social Impact
      ecoFriendlyPractices,
      socialImpact,

      // Funding & Investment
      fundingRequirements,
      useOfFunds,
      equityOffer,
    } = req.body;

    // Process uploaded files
    const attachments = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        attachments.push({
          filename: file.filename,
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          path: file.path,
        });
      });
    }

    const idea = await Idea.create({
      // Basic Information
      title,
      elevatorPitch,
      description,
      category,
      targetAudience,

      // Problem & Solution
      problemStatement,
      solution,
      competitors,

      // Business Model
      revenueStreams,
      pricingStrategy,
      keyPartnerships,

      // Market & Growth
      marketSize,
      goToMarketStrategy,
      scalabilityPlan,

      // Technical Requirements
      technologyStack,
      developmentRoadmap,
      challengesAnticipated,

      // Sustainability & Social Impact
      ecoFriendlyPractices,
      socialImpact,

      // Funding & Investment
      fundingRequirements,
      useOfFunds,
      equityOffer,

      // System fields
      owner: req.user.id,
      attachments,
    });

    // Create notifications for all investors about the new idea
    await NotificationService.createNewIdeaNotification(idea, req.user);

    res.status(201).json({
      success: true,
      message: "Idea submitted successfully",
      data: idea,
    });
  } catch (error) {
    // If there's an error, clean up uploaded files
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        fs.unlink(file.path, (err) => {
          if (err) console.error("Error deleting file:", err);
        });
      });
    }
    next(error);
  }
};

// @desc    Run AI analysis on an idea
// @route   POST /api/ideas/:id/analyze
exports.analyzeIdea = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.id);

    if (!idea) return res.status(404).json({ message: "Idea not found" });
    if (idea.owner.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    idea.status = "analyzing";
    await idea.save();

    // Asynchronous analysis with enhanced comprehensive data
    (async () => {
      try {
        // Pass the complete idea object to get comprehensive analysis
        const [aiResult, trendsResult] = await Promise.all([
          aiService.generateSwotAndRoadmap(idea), // Pass entire idea object
          aiService.getMarketTrends(idea.category),
        ]);

        // Process and validate the AI results before storing
        let roadmap = aiResult.roadmap;
        if (Array.isArray(roadmap)) {
          // Convert roadmap objects to strings if needed
          roadmap = roadmap.map((item) => {
            if (typeof item === "object" && item.milestone) {
              return `${item.timeframe || "TBD"}: ${item.milestone}`;
            }
            return typeof item === "string" ? item : String(item);
          });
        }

        // Store the enhanced analysis results
        idea.analysis = {
          score: aiResult.score,
          swot: aiResult.swot,
          roadmap: roadmap,
          trends: trendsResult,
          // Store additional analysis if provided
          recommendations: aiResult.recommendations || {},
          marketAssessment: aiResult.market_assessment || {},
        };
        idea.status = "analyzed";
        await idea.save();

        // Notify the entrepreneur that analysis is complete
        await NotificationService.createAnalysisCompleteNotification(idea);

        console.log(`Enhanced AI analysis complete for idea: ${idea.title}`);
      } catch (aiError) {
        idea.status = "submitted"; // Reset to submitted instead of failed
        await idea.save();
        console.error(`AI analysis failed for idea ${idea._id}:`, aiError);

        // Store a basic fallback analysis
        idea.analysis = {
          score: 50,
          swot: {
            strengths:
              "Manual analysis required - AI analysis temporarily unavailable",
            weaknesses:
              "Manual analysis required - AI analysis temporarily unavailable",
            opportunities:
              "Manual analysis required - AI analysis temporarily unavailable",
            threats:
              "Manual analysis required - AI analysis temporarily unavailable",
          },
          roadmap: [
            "Q1: Conduct market research and validation",
            "Q2: Develop MVP and gather user feedback",
            "Q3: Refine product based on market response",
            "Q4: Scale and seek additional funding",
          ],
          trends: [],
        };
        idea.status = "analyzed";
        await idea.save();
      }
    })();

    res.status(202).json({
      message:
        "Enhanced AI analysis has started. Comprehensive results will be available shortly.",
      status: "analyzing",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all ideas for a specific user
// @route   GET /api/ideas/user/:userId
exports.getUserIdeas = async (req, res, next) => {
  try {
    // Ensure the logged-in user is requesting their own ideas
    if (req.user.id !== req.params.userId) {
      return res
        .status(403)
        .json({ message: "You can only view your own ideas." });
    }
    const ideas = await Idea.find({ owner: req.params.userId }).sort({
      createdAt: -1,
    });
    res.json(ideas);
  } catch (error) {
    next(error);
  }
};

// @desc    Get PDF report for an idea
// @route   GET /api/ideas/:id/report
exports.getIdeaReport = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ message: "Idea not found" });
    if (idea.owner.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });
    if (idea.status !== "analyzed")
      return res.status(400).json({ message: "Analysis not complete" });

    const filename = `Report-${idea.title.replace(/\s+/g, "-")}.pdf`;
    res.setHeader("Content-disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-type", "application/pdf");

    pdfService.buildPDF(
      (chunk) => res.write(chunk),
      () => res.end(),
      idea
    );
  } catch (error) {
    next(error);
  }
};

// ------ INVESTOR CONTROLLERS ------

// @desc    Get all analyzed ideas for investors
// @route   GET /api/ideas
exports.getAllIdeasForInvestor = async (req, res, next) => {
  try {
    const ideas = await Idea.find({ status: "analyzed" })
      .populate("owner", "name")
      .sort({ createdAt: -1 });
    res.json(ideas);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single idea details
// @route   GET /api/ideas/:id
exports.getIdeaDetailsForInvestor = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.id).populate(
      "owner",
      "name email"
    );
    if (!idea || idea.status !== "analyzed") {
      return res.status(404).json({ message: "Analyzed idea not found." });
    }
    res.json(idea);
  } catch (error) {
    next(error);
  }
};

// Shared controller (can be used by Entrepreneur to see who is interested)
// @desc    Get investors interested in an idea
// @route   GET /api/ideas/:id/investors
exports.getInterestedInvestors = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.id).populate(
      "investorsInterested",
      "name email"
    );

    if (!idea) return res.status(404).json({ message: "Idea not found." });
    if (idea.owner.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    res.json(idea.investorsInterested);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all ideas an investor has marked as interested
// @route   GET /api/ideas/interested
// @access  Private (Investor)
exports.getInterestedIdeasForInvestor = async (req, res, next) => {
  try {
    const ideas = await Idea.find({ investorsInterested: req.user.id })
      .populate("owner", "name")
      .sort({ createdAt: -1 });

    if (!ideas) {
      return res.json([]);
    }

    res.json(ideas);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single idea by ID (for owner)
// @route   GET /api/ideas/:id
// @access  Private (Owner only)
exports.getIdeaById = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    // Allow access if user is the owner OR an investor
    if (idea.owner.toString() !== req.user.id && req.user.role !== "investor") {
      return res
        .status(403)
        .json({ message: "Not authorized to view this idea" });
    }

    res.json(idea);
  } catch (error) {
    next(error);
  }
};

// @desc    Update an idea
// @route   PUT /api/ideas/:id
// @access  Private (Owner only)
exports.updateIdea = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    if (idea.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this idea" });
    }

    // Allow editing for draft and submitted status, but not for analyzed or beyond
    if (idea.status !== "draft" && idea.status !== "submitted") {
      return res
        .status(400)
        .json({
          message: "Cannot update an idea that is being or has been analyzed.",
        });
    }

    // Update all allowed fields
    idea.title = req.body.title || idea.title;
    idea.description = req.body.description || idea.description;
    idea.category = req.body.category || idea.category;
    idea.stage = req.body.stage || idea.stage;
    idea.fundingGoal =
      req.body.fundingGoal !== undefined
        ? req.body.fundingGoal
        : idea.fundingGoal;
    idea.elevatorPitch = req.body.elevatorPitch || idea.elevatorPitch;
    idea.targetAudience = req.body.targetAudience || idea.targetAudience;
    idea.problemStatement = req.body.problemStatement || idea.problemStatement;
    idea.solution = req.body.solution || idea.solution;

    const updatedIdea = await idea.save();
    res.json(updatedIdea);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an idea
// @route   DELETE /api/ideas/:id
// @access  Private (Owner only)
exports.deleteIdea = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    if (idea.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this idea" });
    }

    await idea.deleteOne();
    // Optional: Also delete related notifications
    res.json({ message: "Idea removed successfully" });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark interest in an idea (ADD ONLY)
// @route   POST /api/ideas/:id/interest
exports.markInterest = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ message: "Idea not found" });

    // Check if already interested
    const alreadyInterested = idea.investorsInterested.some(
      (investorId) => investorId.toString() === req.user.id
    );

    if (alreadyInterested) {
      return res
        .status(400)
        .json({ message: "Already marked interest in this idea" });
    }

    // Using $addToSet to prevent duplicate entries
    await Idea.updateOne(
      { _id: req.params.id },
      { $addToSet: { investorsInterested: req.user.id } }
    );

    // Find entrepreneur and send notification
    const entrepreneur = await User.findById(idea.owner);
    if (entrepreneur) {
      await Notification.create({
        user: idea.owner,
        title: "New Investor Interest",
        message: `Investor ${req.user.name} is interested in your idea: "${idea.title}"`,
        type: "interest_confirmation",
        relatedIdea: idea._id,
        relatedUser: req.user.id,
        actionUrl: `/ideas/${idea._id}`,
      });
    }

    res.status(201).json({ message: "Interest marked successfully." });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove interest in an idea
// @route   DELETE /api/ideas/:id/interest
// @access  Private (Investor)
exports.removeInterest = async (req, res, next) => {
  try {
    await Idea.updateOne(
      { _id: req.params.id },
      { $pull: { investorsInterested: req.user.id } }
    );
    res.json({ message: "Interest removed successfully." });
  } catch (error) {
    next(error);
  }
};

// @desc    Re-run AI analysis on an idea
// @route   PUT /api/ideas/:id/analysis
// @access  Private (Owner only)
exports.rerunAnalysis = async (req, res, next) => {
  // This function can be an alias for analyzeIdea or have slightly different logic
  // For simplicity, we will just call the original analyzeIdea function.
  // This creates a dedicated PUT endpoint for the action.
  exports.analyzeIdea(req, res, next);
};

// @desc    Delete/reset the analysis for an idea
// @route   DELETE /api/ideas/:id/analysis
// @access  Private (Owner only)
exports.deleteAnalysis = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ message: "Idea not found" });
    if (idea.owner.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    // Reset analysis fields to default and status to pending
    idea.analysis = {
      score: 0,
      swot: { strengths: "", weaknesses: "", opportunities: "", threats: "" },
      roadmap: [],
      trends: [],
    };
    idea.status = "submitted";

    await idea.save();
    res.json({ message: "Analysis has been reset", idea });
  } catch (error) {
    next(error);
  }
};
