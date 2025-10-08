const InvestorInterest = require("../models/InvestorInterest.model");
const Idea = require("../models/Idea.model");
const NotificationService = require("../services/notification.service");

// @desc    Get investor's interested ideas
// @route   GET /api/investors/interested
exports.getInterestedIdeas = async (req, res, next) => {
  try {
    const investorId = req.user._id || req.user.id;

    // Find all interests for this investor and populate the idea details
    const interests = await InvestorInterest.find({
      investor: investorId,
      status: "interested",
    }).populate({
      path: "idea",
      populate: {
        path: "owner",
        select: "name email",
      },
    });

    // Extract the ideas from the interest records
    const interestedIdeas = interests
      .filter((interest) => interest.idea) // Filter out any null ideas
      .map((interest) => interest.idea);

    res.json(interestedIdeas);
  } catch (error) {
    next(error);
  }
};

// @desc    Investor browses all analyzed ideas
// @route   GET /api/investors/ideas
exports.getInvestorIdeas = async (req, res, next) => {
  try {
    // Get all ideas that are either analyzed or submitted (for testing purposes)
    // In production, you might want to restrict this to only 'analyzed' ideas
    const ideas = await Idea.find({
      status: { $in: ["analyzed", "submitted"] },
    })
      .populate("owner", "name email")
      .sort({ createdAt: -1 }); // Sort by newest first

    res.json(ideas);
  } catch (error) {
    next(error);
  }
};

// @desc    Investor marks interest in an idea
// @route   POST /api/investors/:ideaId/interest
exports.markInterest = async (req, res, next) => {
  try {
    const { ideaId } = req.params;
    const investorId = req.user._id || req.user.id;

    console.log(
      `Marking interest - Investor ID: ${investorId}, Idea ID: ${ideaId}`
    );
    console.log(`User object:`, req.user);

    // Validate ObjectId format
    if (!ideaId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid idea ID format" });
    }

    // First check if the idea exists
    const idea = await Idea.findById(ideaId);
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    // Verify investor exists
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // For now, allow interest in submitted ideas as well for testing
    // In production, you might want to restrict to only 'analyzed' ideas
    if (!["analyzed", "submitted"].includes(idea.status)) {
      return res
        .status(400)
        .json({
          message: "Can only show interest in analyzed or submitted ideas",
        });
    }

    // Check if interest already exists
    const existingInterest = await InvestorInterest.findOne({
      idea: ideaId,
      investor: investorId,
    });

    if (existingInterest) {
      // Update existing interest to 'interested'
      existingInterest.status = "interested";
      await existingInterest.save();
      return res.json({
        message: "Interest updated successfully",
        interest: existingInterest,
      });
    }

    // Create new interest
    const interest = await InvestorInterest.create({
      idea: ideaId,
      investor: investorId,
      status: "interested",
    });

    // Populate the idea with owner details for notification
    const populatedIdea = await Idea.findById(ideaId).populate("owner");

    if (!populatedIdea || !populatedIdea.owner) {
      console.error(`Idea or idea owner not found for idea: ${ideaId}`);
      // Still return success since the interest was created successfully
      return res.status(201).json({
        message:
          "Interest marked successfully (notification skipped due to missing owner)",
        interest,
      });
    }

    // Notify the entrepreneur about the new interest
    try {
      await NotificationService.createInvestorInterestNotification(
        investorId.toString(), // investorId
        ideaId, // ideaId
        populatedIdea.owner._id.toString(), // entrepreneurId
        populatedIdea.title // ideaTitle
      );
    } catch (notificationError) {
      console.error("Failed to create notifications:", notificationError);
      // Don't fail the entire request if notification fails
    }

    res.status(201).json({ message: "Interest marked successfully", interest });
  } catch (error) {
    console.error("Error in markInterest:", error);
    next(error);
  }
};

// @desc    Investor updates their interest status
// @route   PUT /api/investors/:ideaId/interest
exports.updateInterestStatus = async (req, res, next) => {
  try {
    const { status } = req.body; // e.g., "not_interested"
    if (!["interested", "not_interested", "withdrawn"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const investorId = req.user._id || req.user.id;

    const interest = await InvestorInterest.findOneAndUpdate(
      { idea: req.params.ideaId, investor: investorId },
      { $set: { status: status } },
      { new: true }
    );

    if (!interest) {
      return res.status(404).json({ message: "Interest record not found" });
    }

    res.json(interest);
  } catch (error) {
    next(error);
  }
};

// @desc    Investor withdraws their interest
// @route   DELETE /api/investors/:ideaId/interest
exports.withdrawInterest = async (req, res, next) => {
  try {
    const { ideaId } = req.params;
    const investorId = req.user._id || req.user.id;

    const interest = await InvestorInterest.findOne({
      idea: ideaId,
      investor: investorId,
    });

    if (!interest) {
      return res.status(404).json({ message: "Interest record not found" });
    }

    // Instead of deleting, we could set status to 'withdrawn' or actually delete
    // For now, let's delete the record completely
    await InvestorInterest.findByIdAndDelete(interest._id);

    res.json({ message: "Interest withdrawn successfully" });
  } catch (error) {
    next(error);
  }
};

// @desc    Get investor portfolio analytics
// @route   GET /api/investors/portfolio/analytics
// @access  Private (Investor)
exports.getPortfolioAnalytics = async (req, res, next) => {
  try {
    const investorId = req.user._id || req.user.id;
    const FundingRequest = require("../models/FundingRequest.model");

    // Parallel query execution for better performance
    const [allRequests, interestedIdeasCount, pendingRequests] =
      await Promise.all([
        // Get all funding requests where investor is involved
        FundingRequest.find({
          $or: [
            { acceptedBy: investorId },
            { viewedBy: investorId },
            { "investorResponses.investor": investorId },
          ],
        })
          .populate("idea", "title category stage")
          .lean(),

        // Get interested ideas count
        InvestorInterest.countDocuments({
          investor: investorId,
          status: "interested",
        }),

        // Get pending/negotiated requests (accessible to this investor)
        FundingRequest.countDocuments({
          status: { $in: ["pending", "negotiated"] },
          $or: [
            { accessType: "public" },
            {
              accessType: "invited",
              "invitedInvestors.investor": investorId,
            },
          ],
          viewedBy: { $nin: [investorId] },
        }),
      ]);

    // Calculate metrics with null safety
    const acceptedDeals = allRequests.filter(
      (req) =>
        req.acceptedBy && req.acceptedBy.toString() === investorId.toString()
    );

    const totalInvested = acceptedDeals.reduce(
      (sum, deal) => sum + (deal.amount || 0),
      0
    );

    const viewedDeals = allRequests.filter(
      (req) =>
        req.viewedBy &&
        req.viewedBy.some((id) => id.toString() === investorId.toString())
    );

    const negotiatingDeals = allRequests.filter((req) => {
      const response = req.investorResponses?.find(
        (r) => r.investor && r.investor.toString() === investorId.toString()
      );
      return response && response.status === "interested";
    });

    const declinedDeals = allRequests.filter((req) => {
      const response = req.investorResponses?.find(
        (r) => r.investor && r.investor.toString() === investorId.toString()
      );
      return response && response.status === "declined";
    });

    // Calculate investment distribution by category (with null safety)
    const categoryDistribution = {};
    acceptedDeals.forEach((deal) => {
      if (deal.idea && deal.idea.category) {
        const category = deal.idea.category;
        categoryDistribution[category] =
          (categoryDistribution[category] || 0) + (deal.amount || 0);
      }
    });

    // Calculate investment distribution by stage (with null safety)
    const stageDistribution = {};
    acceptedDeals.forEach((deal) => {
      if (deal.idea && deal.idea.stage) {
        const stage = deal.idea.stage;
        stageDistribution[stage] = (stageDistribution[stage] || 0) + 1;
      }
    });

    // Calculate average deal size with safety check
    const averageDealSize =
      acceptedDeals.length > 0
        ? Math.round(totalInvested / acceptedDeals.length)
        : 0;

    // Calculate conversion rate with safety check
    const conversionRate =
      viewedDeals.length > 0
        ? (acceptedDeals.length / viewedDeals.length) * 100
        : 0;

    // Sort category distribution by value (highest first)
    const sortedCategories = Object.entries(categoryDistribution)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6); // Limit to top 6 categories

    // Response data
    res.json({
      success: true,
      data: {
        overview: {
          totalInvested,
          activeDeals: acceptedDeals.length,
          interestedIdeas: interestedIdeasCount,
          pendingReviews: pendingRequests,
          averageDealSize,
          conversionRate: parseFloat(conversionRate.toFixed(2)),
        },
        pipeline: {
          viewed: viewedDeals.length,
          negotiating: negotiatingDeals.length,
          accepted: acceptedDeals.length,
          declined: declinedDeals.length,
          total: viewedDeals.length,
        },
        distribution: {
          byCategory: sortedCategories.map(([name, value]) => ({
            name,
            value,
            percentage:
              totalInvested > 0
                ? parseFloat(((value / totalInvested) * 100).toFixed(1))
                : 0,
          })),
          byStage: Object.entries(stageDistribution)
            .sort(([, a], [, b]) => b - a)
            .map(([name, value]) => ({
              name,
              value,
              percentage:
                acceptedDeals.length > 0
                  ? parseFloat(
                      ((value / acceptedDeals.length) * 100).toFixed(1)
                    )
                  : 0,
            })),
        },
        recentDeals: acceptedDeals
          .sort(
            (a, b) =>
              new Date(b.acceptedAt || b.updatedAt) -
              new Date(a.acceptedAt || a.updatedAt)
          )
          .slice(0, 5)
          .map((deal) => ({
            id: deal._id,
            ideaTitle: deal.idea?.title || "Unknown",
            amount: deal.amount || 0,
            equity: deal.equity || 0,
            category: deal.idea?.category || "Other",
            stage: deal.idea?.stage || "Unknown",
            acceptedAt: deal.acceptedAt || deal.updatedAt,
            status: deal.status,
          })),
      },
    });
  } catch (error) {
    console.error("Error fetching portfolio analytics:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching portfolio analytics",
      error: error.message,
    });
  }
};
