const FundingRequest = require("../models/FundingRequest.model");
const Idea = require("../models/Idea.model");
const InvestorInterest = require("../models/InvestorInterest.model");
const User = require("../models/User.model");

// ===== HELPER FUNCTIONS =====

/**
 * Check if an investor has access to a funding request
 * @param {Object} fundingRequest - The funding request document
 * @param {String} investorId - The investor's user ID
 * @returns {Boolean} - Whether the investor has access
 */
const checkInvestorAccess = (fundingRequest, investorId) => {
  // If accessType is not set (old requests), default to public access
  const accessType = fundingRequest.accessType || "public";

  // Public requests are accessible to all
  if (accessType === "public") {
    return true;
  }

  // Private requests are only for entrepreneurs
  if (accessType === "private") {
    return false;
  }

  // Invited requests require investor to be in invitedInvestors list
  if (accessType === "invited") {
    const isInvited = fundingRequest.invitedInvestors.some(
      (invited) => invited.investor.toString() === investorId.toString()
    );
    return isInvited;
  }

  return false;
};

// ===== CONTROLLER FUNCTIONS =====

// @desc    Get interested investors for a specific idea (for entrepreneur targeting)
// @route   GET /api/funding/idea/:ideaId/interested-investors
// @access  Private (Entrepreneur - owner of the idea)
exports.getInterestedInvestorsForIdea = async (req, res, next) => {
  try {
    const { ideaId } = req.params;

    // Verify idea exists and belongs to the entrepreneur
    const idea = await Idea.findById(ideaId);
    if (!idea) {
      return res.status(404).json({
        success: false,
        message: "Idea not found",
      });
    }

    if (idea.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view interested investors for this idea",
      });
    }

    // Get all interested investors with their details
    const interests = await InvestorInterest.find({
      idea: ideaId,
      status: "interested",
    }).populate({
      path: "investor",
      select: "name email role createdAt",
    });

    // Format the response with additional metadata
    const interestedInvestors = interests
      .filter((interest) => interest.investor) // Filter out any null investors
      .map((interest) => ({
        _id: interest.investor._id,
        name: interest.investor.name,
        email: interest.investor.email,
        interestedSince: interest.updatedAt || interest.createdAt,
        // You can add more investor profile data here if available
      }));

    res.json({
      success: true,
      data: interestedInvestors,
      count: interestedInvestors.length,
      ideaTitle: idea.title,
    });
  } catch (error) {
    console.error("Error fetching interested investors:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching interested investors",
      error: error.message,
    });
  }
};

// @desc    Create a funding request
// @route   POST /api/funding
exports.createFundingRequest = async (req, res, next) => {
  try {
    const {
      ideaId,
      amount,
      equity,
      message,
      teamSize,
      businessPlan,
      currentRevenue,
      previousFunding,
      revenueModel,
      targetMarket,
      competitiveAdvantage,
      customerTraction,
      financialProjections,
      useOfFunds,
      timeline,
      milestones,
      riskFactors,
      exitStrategy,
      intellectualProperty,
      contactPhone,
      contactEmail,
      companyWebsite,
      linkedinProfile,
      additionalDocuments,
      fundingStage,
      investmentType,
      // NEW: Targeting fields
      accessType, // 'public', 'private', or 'invited'
      targetedInvestors, // Array of investor IDs
    } = req.body;

    // Validate required fields
    if (!ideaId || !amount || !equity) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: ideaId, amount, and equity are required",
      });
    }

    // Validate numeric fields
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a positive number",
      });
    }

    if (isNaN(equity) || equity <= 0 || equity > 100) {
      return res.status(400).json({
        success: false,
        message: "Equity must be a number between 0 and 100",
      });
    }

    // Find and validate the idea
    const idea = await Idea.findById(ideaId);
    if (!idea) {
      return res.status(404).json({
        success: false,
        message: "Idea not found",
      });
    }

    if (idea.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to request funding for this idea",
      });
    }

    // Check if funding request already exists for this idea
    const existingRequest = await FundingRequest.findOne({
      idea: ideaId,
      entrepreneur: req.user.id,
      status: { $in: ["pending", "negotiated"] },
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "An active funding request already exists for this idea",
      });
    }

    // Calculate valuation
    const calculatedValuation = Math.round((amount / equity) * 100);

    // Determine access type and validate targeted investors
    let finalAccessType = accessType || "public";
    let invitedInvestorsList = [];

    if (
      targetedInvestors &&
      Array.isArray(targetedInvestors) &&
      targetedInvestors.length > 0
    ) {
      // Validate that targeted investors are real investors and have shown interest
      const interests = await InvestorInterest.find({
        idea: ideaId,
        investor: { $in: targetedInvestors },
        status: "interested",
      }).populate("investor", "name email role");

      // Check if all targeted investors are valid
      const validInvestorIds = interests.map((int) =>
        int.investor._id.toString()
      );
      const invalidInvestors = targetedInvestors.filter(
        (id) => !validInvestorIds.includes(id)
      );

      if (invalidInvestors.length > 0) {
        return res.status(400).json({
          success: false,
          message:
            "Some targeted investors have not shown interest in this idea or are invalid",
          invalidInvestors,
        });
      }

      // Build invited investors list with prior interest tracking
      invitedInvestorsList = interests.map((interest) => ({
        investor: interest.investor._id,
        invitedAt: new Date(),
        notificationSent: false,
        hadPriorInterest: true,
      }));

      // Set access type based on targeting preference
      // If accessType not explicitly provided, default to "invited" when targeting specific investors
      if (!accessType) {
        finalAccessType = "invited"; // Changed from "private" - invited investors should have access
      }
    }

    // Create funding request with all fields
    const requestData = {
      idea: ideaId,
      entrepreneur: req.user.id,
      amount: parseInt(amount),
      equity: parseFloat(equity),
      valuation: calculatedValuation,
      message: message?.trim(),
      teamSize: teamSize ? parseInt(teamSize) : undefined,
      businessPlan: businessPlan?.trim(),
      currentRevenue: currentRevenue ? parseInt(currentRevenue) : undefined,
      previousFunding: previousFunding ? parseInt(previousFunding) : 0,
      revenueModel: revenueModel?.trim(),
      targetMarket: targetMarket?.trim(),
      competitiveAdvantage: competitiveAdvantage?.trim(),
      customerTraction: customerTraction?.trim(),
      financialProjections: financialProjections?.trim(),
      useOfFunds: useOfFunds?.trim(),
      timeline: timeline?.trim(),
      milestones: milestones?.trim(),
      riskFactors: riskFactors?.trim(),
      exitStrategy: exitStrategy?.trim(),
      intellectualProperty: intellectualProperty?.trim(),
      contactPhone: contactPhone?.trim(),
      contactEmail: contactEmail?.trim(),
      companyWebsite: companyWebsite?.trim(),
      linkedinProfile: linkedinProfile?.trim(),
      additionalDocuments: additionalDocuments?.trim(),
      fundingStage: fundingStage || "seed",
      investmentType: investmentType || "equity",
      accessType: finalAccessType,
      invitedInvestors: invitedInvestorsList,
    };

    // Remove undefined fields
    Object.keys(requestData).forEach(
      (key) => requestData[key] === undefined && delete requestData[key]
    );

    const request = await FundingRequest.create(requestData);

    // Add initial message to negotiation history if provided
    if (message && message.trim()) {
      request.negotiationHistory.push({
        investor: req.user.id, // The entrepreneur adding initial message
        message: message.trim(),
        timestamp: new Date(),
      });
      await request.save();
    }

    // Update idea status
    idea.status = "funding_requested";
    await idea.save();

    // Send notifications to targeted investors
    if (invitedInvestorsList.length > 0) {
      const NotificationService = require("../services/notification.service");

      for (const invitedInvestor of invitedInvestorsList) {
        try {
          await NotificationService.createNotification(
            invitedInvestor.investor,
            `🎯 You've been invited to review a funding request for "${idea.title}"`,
            "funding_invitation",
            request._id,
            {
              priority: "high",
              metadata: {
                entrepreneurName: req.user.name,
                amount: amount,
                equity: equity,
                ideaTitle: idea.title,
              },
            }
          );

          // Mark notification as sent
          const investorIndex = request.invitedInvestors.findIndex(
            (inv) =>
              inv.investor.toString() === invitedInvestor.investor.toString()
          );
          if (investorIndex !== -1) {
            request.invitedInvestors[investorIndex].notificationSent = true;
          }
        } catch (notifError) {
          console.error(
            `Failed to send notification to investor ${invitedInvestor.investor}:`,
            notifError
          );
        }
      }
      await request.save();
    }

    // Populate the response
    const populatedRequest = await FundingRequest.findById(request._id)
      .populate("idea", "title description category stage")
      .populate("entrepreneur", "name email");

    res.status(201).json({
      success: true,
      data: populatedRequest,
      message: "Funding request created successfully",
    });
  } catch (error) {
    console.error("Error creating funding request:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error creating funding request",
      error: error.message,
    });
  }
};

// @desc    Get all funding requests (for investors/admins)
// @route   GET /api/funding
exports.getAllFundingRequests = async (req, res, next) => {
  try {
    const {
      status,
      fundingStage,
      minAmount,
      maxAmount,
      page = 1,
      limit = 10,
    } = req.query;

    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (fundingStage) filter.fundingStage = fundingStage;
    if (minAmount || maxAmount) {
      filter.amount = {};
      if (minAmount) filter.amount.$gte = parseInt(minAmount);
      if (maxAmount) filter.amount.$lte = parseInt(maxAmount);
    }

    // Access control: Investors can only see public requests OR requests they're invited to
    if (req.user && req.user.role === "investor") {
      filter.$or = [
        { accessType: "public" },
        { accessType: "invited", "invitedInvestors.investor": req.user.id },
        { accessType: "private", "invitedInvestors.investor": req.user.id },
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const requests = await FundingRequest.find(filter)
      .populate("idea", "title description category stage")
      .populate("entrepreneur", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await FundingRequest.countDocuments(filter);

    res.json({
      success: true,
      data: requests,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total: total,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching funding requests:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching funding requests",
      error: error.message,
    });
  }
};

// @desc    Get user's funding requests (for entrepreneurs)
// @route   GET /api/funding/user
exports.getUserFundingRequests = async (req, res, next) => {
  try {
    const { status } = req.query;

    const filter = { entrepreneur: req.user.id };
    if (status) filter.status = status;

    const requests = await FundingRequest.find(filter)
      .populate("idea", "title description category stage")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: requests,
      count: requests.length,
    });
  } catch (error) {
    console.error("Error fetching user funding requests:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching your funding requests",
      error: error.message,
    });
  }
};

// @desc    Get a single funding request by ID
// @route   GET /api/funding/:id
exports.getFundingRequestById = async (req, res, next) => {
  try {
    const request = await FundingRequest.findById(req.params.id)
      .populate("idea", "title description category stage owner")
      .populate("entrepreneur", "name email")
      .populate("negotiationHistory.investor", "name email")
      .populate("investorResponses.investor", "name email");

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Funding request not found",
      });
    }

    // Check authorization - entrepreneur can view their own, investors can view all
    if (
      req.user.role === "entrepreneur" &&
      request.entrepreneur._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this funding request",
      });
    }

    // Track view if it's an investor viewing
    if (
      req.user.role === "investor" &&
      !request.viewedBy.includes(req.user.id)
    ) {
      request.viewedBy.push(req.user.id);
      request.lastViewedAt = new Date();
      await request.save();
    }

    res.json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.error("Error fetching funding request:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching funding request",
      error: error.message,
    });
  }
};

// @desc    Update a funding request (Investor response or entrepreneur update)
// @route   PUT /api/funding/:id
exports.updateFundingRequestStatus = async (req, res, next) => {
  try {
    const { status, message, amount, equity, responseDeadline } = req.body;

    const request = await FundingRequest.findById(req.params.id)
      .populate("idea", "title owner")
      .populate("entrepreneur", "name email");

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Funding request not found",
      });
    }

    // Authorization check
    const isEntrepreneur = req.user.id === request.entrepreneur._id.toString();
    const isInvestor = req.user.role === "investor";

    if (!isEntrepreneur && !isInvestor) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this funding request",
      });
    }

    // Investors can update status and add messages
    if (isInvestor && status) {
      if (!["accepted", "negotiated", "declined"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status. Must be accepted, negotiated, or declined",
        });
      }
      request.status = status;
    }

    // Entrepreneurs can update their own request details (only if pending)
    if (isEntrepreneur && request.status === "pending") {
      if (amount) request.amount = parseInt(amount);
      if (equity) request.equity = parseFloat(equity);
      if (request.amount && request.equity) {
        request.valuation = Math.round((request.amount / request.equity) * 100);
      }
    }

    // Add message to negotiation history
    if (message && message.trim()) {
      request.negotiationHistory.push({
        investor: req.user.id,
        message: message.trim(),
        timestamp: new Date(),
      });
    }

    // Set response deadline (for investors)
    if (responseDeadline && isInvestor) {
      request.responseDeadline = new Date(responseDeadline);
    }

    await request.save();

    // Populate the updated request
    const updatedRequest = await FundingRequest.findById(request._id)
      .populate("idea", "title description category stage")
      .populate("entrepreneur", "name email")
      .populate("negotiationHistory.investor", "name email");

    res.json({
      success: true,
      data: updatedRequest,
      message: `Funding request ${
        status ? "status updated" : "updated"
      } successfully`,
    });
  } catch (error) {
    console.error("Error updating funding request:", error);
    res.status(500).json({
      success: false,
      message: "Error updating funding request",
      error: error.message,
    });
  }
};

// @desc    Update funding request details (for entrepreneurs)
// @route   PUT /api/funding/:id/details
exports.updateFundingRequestDetails = async (req, res, next) => {
  try {
    const request = await FundingRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Funding request not found",
      });
    }

    // Only entrepreneur can update details
    if (request.entrepreneur.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this funding request",
      });
    }

    // Only allow updates if status is pending or negotiated
    if (!["pending", "negotiated"].includes(request.status)) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot update details of accepted, declined, or withdrawn requests",
      });
    }

    // Update all allowed fields
    const updateFields = [
      "amount",
      "equity",
      "message",
      "teamSize",
      "businessPlan",
      "currentRevenue",
      "previousFunding",
      "revenueModel",
      "targetMarket",
      "competitiveAdvantage",
      "customerTraction",
      "financialProjections",
      "useOfFunds",
      "timeline",
      "milestones",
      "riskFactors",
      "exitStrategy",
      "intellectualProperty",
      "contactPhone",
      "contactEmail",
      "companyWebsite",
      "linkedinProfile",
      "additionalDocuments",
      "fundingStage",
      "investmentType",
    ];

    updateFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (
          [
            "amount",
            "equity",
            "teamSize",
            "currentRevenue",
            "previousFunding",
          ].includes(field)
        ) {
          request[field] = req.body[field]
            ? parseFloat(req.body[field])
            : undefined;
        } else {
          request[field] = req.body[field];
        }
      }
    });

    // Recalculate valuation if amount or equity changed
    if (request.amount && request.equity) {
      request.valuation = Math.round((request.amount / request.equity) * 100);
    }

    await request.save();

    const updatedRequest = await FundingRequest.findById(request._id)
      .populate("idea", "title description category stage")
      .populate("entrepreneur", "name email");

    res.json({
      success: true,
      data: updatedRequest,
      message: "Funding request details updated successfully",
    });
  } catch (error) {
    console.error("Error updating funding request details:", error);
    res.status(500).json({
      success: false,
      message: "Error updating funding request details",
      error: error.message,
    });
  }
};

// @desc    Withdraw a funding request
// @route   DELETE /api/funding/:id
exports.withdrawFundingRequest = async (req, res, next) => {
  try {
    const request = await FundingRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Funding request not found",
      });
    }

    // Only entrepreneur can withdraw their own request
    if (request.entrepreneur.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to withdraw this funding request",
      });
    }

    // Can only withdraw pending or negotiated requests
    if (!["pending", "negotiated"].includes(request.status)) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot withdraw accepted, declined, or already withdrawn requests",
      });
    }

    // Store the idea ID before deleting
    const ideaId = request.idea;
    const requestId = request._id;

    // Delete the funding request permanently
    await FundingRequest.findByIdAndDelete(req.params.id);

    // Update idea status back to active if needed
    const idea = await Idea.findById(ideaId);
    if (idea && idea.status === "funding_requested") {
      idea.status = "analyzed"; // Changed from 'active' to 'analyzed' (valid status)
      await idea.save();
    }

    res.json({
      success: true,
      message: "Funding request deleted successfully",
      data: { id: requestId, deleted: true },
    });
  } catch (error) {
    console.error("Error withdrawing funding request:", error);
    res.status(500).json({
      success: false,
      message: "Error withdrawing funding request",
      error: error.message,
    });
  }
};

// @desc    Get funding request statistics
// @route   GET /api/funding/stats
exports.getFundingStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let stats = {};

    if (userRole === "entrepreneur") {
      // Stats for entrepreneurs
      const userRequests = await FundingRequest.find({ entrepreneur: userId });

      stats = {
        totalRequests: userRequests.length,
        pendingRequests: userRequests.filter((r) => r.status === "pending")
          .length,
        acceptedRequests: userRequests.filter((r) => r.status === "accepted")
          .length,
        totalAmountRequested: userRequests.reduce(
          (sum, r) => sum + r.amount,
          0
        ),
        totalAmountReceived: userRequests
          .filter((r) => r.status === "accepted")
          .reduce((sum, r) => sum + r.amount, 0),
        averageEquityOffered:
          userRequests.length > 0
            ? userRequests.reduce((sum, r) => sum + r.equity, 0) /
              userRequests.length
            : 0,
      };
    } else if (userRole === "investor") {
      // Stats for investors
      const totalRequests = await FundingRequest.countDocuments();
      const viewedRequests = await FundingRequest.countDocuments({
        viewedBy: userId,
      });

      stats = {
        totalAvailableRequests: totalRequests,
        viewedRequests: viewedRequests,
        unviewedRequests: totalRequests - viewedRequests,
      };
    }

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching funding stats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching funding statistics",
      error: error.message,
    });
  }
};

// ========================================
// INVESTOR DEAL MANAGEMENT ENDPOINTS
// ========================================

// @desc    Mark funding request as viewed by investor
// @route   PUT /api/funding/:id/view
// @access  Private (Investor)
exports.markAsViewed = async (req, res, next) => {
  try {
    const request = await FundingRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Funding request not found",
      });
    }

    // CHECK ACCESS CONTROL
    const investorId = req.user.id;
    if (!checkInvestorAccess(request, investorId)) {
      return res.status(403).json({
        success: false,
        message: "You don't have access to this funding request",
      });
    }

    // Check if already viewed by this investor
    if (!request.viewedBy.includes(investorId)) {
      request.viewedBy.push(investorId);
      request.lastViewedAt = new Date();
      await request.save();
    }

    res.json({
      success: true,
      message: "Funding request marked as viewed",
      data: request,
    });
  } catch (error) {
    console.error("Error marking funding request as viewed:", error);
    res.status(500).json({
      success: false,
      message: "Error marking funding request as viewed",
      error: error.message,
    });
  }
};

// @desc    Investor responds to funding request (Accept/Decline/Interested)
// @route   PUT /api/funding/:id/investor-response
// @access  Private (Investor)
exports.investorRespondToRequest = async (req, res, next) => {
  try {
    const { responseStatus, reason, acceptanceTerms } = req.body;
    const investorId = req.user.id;

    // Validate response status
    if (!["interested", "declined", "accepted"].includes(responseStatus)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid response status. Must be: interested, declined, or accepted",
      });
    }

    const request = await FundingRequest.findById(req.params.id)
      .populate("idea", "title description category stage")
      .populate("entrepreneur", "name email");

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Funding request not found",
      });
    }

    // CHECK ACCESS CONTROL
    if (!checkInvestorAccess(request, investorId)) {
      return res.status(403).json({
        success: false,
        message: "You don't have access to this funding request",
      });
    }

    // Can only respond to pending or negotiated requests
    if (!["pending", "negotiated"].includes(request.status)) {
      return res.status(400).json({
        success: false,
        message: "Can only respond to pending or negotiated funding requests",
      });
    }

    // Check if investor already responded
    const existingResponse = request.investorResponses.find(
      (r) => r.investor.toString() === investorId
    );

    if (existingResponse) {
      // Update existing response
      existingResponse.status = responseStatus;
      existingResponse.reason = reason || existingResponse.reason;
      existingResponse.timestamp = new Date();
    } else {
      // Add new response
      request.investorResponses.push({
        investor: investorId,
        status: responseStatus,
        reason: reason || "",
        timestamp: new Date(),
      });
    }

    // Update request status based on response
    if (responseStatus === "accepted") {
      // ATOMIC CHECK: Prevent race condition where multiple investors accept
      // Use findOneAndUpdate with condition that acceptedBy is null
      const updatedRequest = await FundingRequest.findOneAndUpdate(
        {
          _id: request._id,
          acceptedBy: null, // Only update if not already accepted
          status: { $in: ["pending", "negotiated"] },
        },
        {
          $set: {
            status: "accepted",
            acceptedBy: investorId,
            acceptedAt: new Date(),
            acceptanceTerms: acceptanceTerms
              ? {
                  finalAmount: acceptanceTerms.finalAmount || request.amount,
                  finalEquity: acceptanceTerms.finalEquity || request.equity,
                  conditions: acceptanceTerms.conditions || "",
                  digitalSignature: acceptanceTerms.digitalSignature || "",
                }
              : undefined,
          },
          $addToSet: { viewedBy: investorId },
          $push: {
            negotiationHistory: {
              investor: investorId,
              message: `✅ Investment accepted! Final terms: $${
                acceptanceTerms?.finalAmount || request.amount
              } for ${acceptanceTerms?.finalEquity || request.equity}% equity`,
              timestamp: new Date(),
            },
          },
        },
        { new: true }
      )
        .populate("idea", "title description category stage")
        .populate("entrepreneur", "name email");

      // Check if update was successful (null means another investor already accepted)
      if (!updatedRequest) {
        return res.status(409).json({
          success: false,
          message:
            "This funding request has already been accepted by another investor",
        });
      }

      // Update idea status to indicate funding received
      const Idea = require("../models/Idea.model");
      await Idea.findByIdAndUpdate(
        updatedRequest.idea._id || updatedRequest.idea,
        {
          status: "closed",
          fundingStatus: "funded",
        }
      );

      // Reload request for response
      request.status = updatedRequest.status;
      request.acceptedBy = updatedRequest.acceptedBy;
      request.acceptedAt = updatedRequest.acceptedAt;
      request.acceptanceTerms = updatedRequest.acceptanceTerms;
      request.viewedBy = updatedRequest.viewedBy;
    } else if (responseStatus === "declined") {
      request.status = "declined";

      // Add system message to negotiation history
      request.negotiationHistory.push({
        investor: investorId,
        message: `❌ Investment declined. ${reason ? `Reason: ${reason}` : ""}`,
        timestamp: new Date(),
      });

      // Mark as viewed
      if (!request.viewedBy.includes(investorId)) {
        request.viewedBy.push(investorId);
        request.lastViewedAt = new Date();
      }

      await request.save();
    } else {
      // For "interested" status, just save the changes
      if (!request.viewedBy.includes(investorId)) {
        request.viewedBy.push(investorId);
        request.lastViewedAt = new Date();
      }
      await request.save();
    }

    // Send notification to entrepreneur
    const NotificationService = require("../services/notification.service");
    let notificationMessage = "";

    if (responseStatus === "accepted") {
      notificationMessage = `🎉 Great news! An investor has accepted your funding request for "${request.idea.title}"!`;
    } else if (responseStatus === "declined") {
      notificationMessage = `An investor has declined your funding request for "${request.idea.title}".`;
    } else if (responseStatus === "interested") {
      notificationMessage = `💡 An investor is interested in your funding request for "${request.idea.title}".`;
    }

    await NotificationService.createNotification(
      request.entrepreneur._id || request.entrepreneur,
      notificationMessage,
      "funding",
      request._id
    );

    res.json({
      success: true,
      message: `Funding request ${responseStatus} successfully`,
      data: request,
    });
  } catch (error) {
    console.error("Error responding to funding request:", error);
    res.status(500).json({
      success: false,
      message: "Error responding to funding request",
      error: error.message,
    });
  }
};

// @desc    Investor negotiates terms with entrepreneur
// @route   POST /api/funding/:id/negotiate
// @access  Private (Investor)
exports.investorNegotiate = async (req, res, next) => {
  try {
    const { message, proposedAmount, proposedEquity } = req.body;
    const investorId = req.user.id;

    // Validate message
    if (!message || message.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Negotiation message is required",
      });
    }

    // Validate numeric inputs if provided
    if (
      proposedAmount !== undefined &&
      proposedAmount !== null &&
      proposedAmount !== ""
    ) {
      const amount = parseFloat(proposedAmount);
      if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({
          success: false,
          message: "Proposed amount must be a positive number",
        });
      }
    }

    if (
      proposedEquity !== undefined &&
      proposedEquity !== null &&
      proposedEquity !== ""
    ) {
      const equity = parseFloat(proposedEquity);
      if (isNaN(equity) || equity <= 0 || equity > 100) {
        return res.status(400).json({
          success: false,
          message: "Proposed equity must be between 0 and 100 percent",
        });
      }
    }

    const request = await FundingRequest.findById(req.params.id)
      .populate("idea", "title description category stage")
      .populate("entrepreneur", "name email");

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Funding request not found",
      });
    }

    // CHECK ACCESS CONTROL
    if (!checkInvestorAccess(request, investorId)) {
      return res.status(403).json({
        success: false,
        message: "You don't have access to this funding request",
      });
    }

    // Can only negotiate pending, negotiated, or accepted requests
    if (!["pending", "negotiated"].includes(request.status)) {
      return res.status(400).json({
        success: false,
        message: "Can only negotiate pending or ongoing negotiation requests",
      });
    }

    // Build negotiation message
    let negotiationMessage = message;
    if (proposedAmount || proposedEquity) {
      negotiationMessage += "\n\n📊 Proposed Terms:\n";
      if (proposedAmount) {
        negotiationMessage += `💰 Amount: $${proposedAmount.toLocaleString()}\n`;
      }
      if (proposedEquity) {
        negotiationMessage += `📈 Equity: ${proposedEquity}%\n`;
      }

      // Calculate new valuation
      if (proposedAmount && proposedEquity) {
        const newValuation = Math.round(
          (proposedAmount / proposedEquity) * 100
        );
        negotiationMessage += `🏢 Implied Valuation: $${newValuation.toLocaleString()}`;
      }
    }

    // Add to negotiation history
    request.negotiationHistory.push({
      investor: investorId,
      message: negotiationMessage,
      timestamp: new Date(),
    });

    // Update status to negotiated if it was pending
    if (request.status === "pending") {
      request.status = "negotiated";
    }

    // Mark as viewed
    if (!request.viewedBy.includes(investorId)) {
      request.viewedBy.push(investorId);
      request.lastViewedAt = new Date();
    }

    // Track investor interest
    const existingResponse = request.investorResponses.find(
      (r) => r.investor.toString() === investorId
    );

    if (!existingResponse) {
      request.investorResponses.push({
        investor: investorId,
        status: "interested",
        timestamp: new Date(),
      });
    }

    await request.save();

    // Populate the request with investor details before sending response
    await request.populate("negotiationHistory.investor", "name email");
    await request.populate("investorResponses.investor", "name email");

    // Send notification to entrepreneur
    const NotificationService = require("../services/notification.service");
    await NotificationService.createNotification(
      request.entrepreneur._id || request.entrepreneur,
      `💬 An investor has sent a negotiation message for your funding request "${request.idea.title}"`,
      "funding",
      request._id
    );

    res.json({
      success: true,
      message: "Negotiation message sent successfully",
      data: request,
    });
  } catch (error) {
    console.error("Error sending negotiation message:", error);
    res.status(500).json({
      success: false,
      message: "Error sending negotiation message",
      error: error.message,
    });
  }
};

// @desc    Entrepreneur responds to negotiation
// @route   POST /api/funding/:id/entrepreneur-negotiate
// @access  Private (Entrepreneur)
exports.entrepreneurRespond = async (req, res, next) => {
  try {
    const { message, proposedAmount, proposedEquity, investorId } = req.body;
    const entrepreneurId = req.user.id;

    // Validate message
    if (!message || message.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Response message is required",
      });
    }

    // Validate numeric inputs if provided
    if (
      proposedAmount !== undefined &&
      proposedAmount !== null &&
      proposedAmount !== ""
    ) {
      const amount = parseFloat(proposedAmount);
      if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({
          success: false,
          message: "Proposed amount must be a positive number",
        });
      }
    }

    if (
      proposedEquity !== undefined &&
      proposedEquity !== null &&
      proposedEquity !== ""
    ) {
      const equity = parseFloat(proposedEquity);
      if (isNaN(equity) || equity <= 0 || equity > 100) {
        return res.status(400).json({
          success: false,
          message: "Proposed equity must be between 0 and 100 percent",
        });
      }
    }

    const request = await FundingRequest.findById(req.params.id)
      .populate("idea", "title description category stage")
      .populate("entrepreneur", "name email");

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Funding request not found",
      });
    }

    // Verify entrepreneur owns this funding request
    if (request.entrepreneur._id.toString() !== entrepreneurId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to respond to this funding request",
      });
    }

    // Can only respond to negotiated or pending requests
    if (!["pending", "negotiated"].includes(request.status)) {
      return res.status(400).json({
        success: false,
        message: "Can only respond to pending or ongoing negotiation requests",
      });
    }

    // Build response message
    let responseMessage = message;
    if (proposedAmount || proposedEquity) {
      responseMessage += "\n\n📊 Counter Proposal:\n";
      if (proposedAmount) {
        responseMessage += `💰 Amount: $${proposedAmount.toLocaleString()}\n`;
      }
      if (proposedEquity) {
        responseMessage += `📈 Equity: ${proposedEquity}%\n`;
      }

      // Calculate new valuation
      if (proposedAmount && proposedEquity) {
        const newValuation = Math.round(
          (proposedAmount / proposedEquity) * 100
        );
        responseMessage += `🏢 Implied Valuation: $${newValuation.toLocaleString()}`;
      }
    }

    // Add to negotiation history (entrepreneur messages use null investor field)
    request.negotiationHistory.push({
      investor: null, // null indicates entrepreneur message
      message: responseMessage,
      timestamp: new Date(),
    });

    // Update status to negotiated
    if (request.status === "pending") {
      request.status = "negotiated";
    }

    await request.save();

    // Populate the request with investor details before sending response
    await request.populate("negotiationHistory.investor", "name email");
    await request.populate("investorResponses.investor", "name email");

    // Send notification to the investor (if specified) or all interested investors
    const NotificationService = require("../services/notification.service");

    if (investorId) {
      // Notify specific investor
      await NotificationService.createNotification(
        investorId,
        `💬 The entrepreneur has responded to your negotiation for "${request.idea.title}"`,
        "funding",
        request._id
      );
    } else {
      // Notify all interested investors
      const interestedInvestors = request.investorResponses
        .filter((r) => r.status === "interested")
        .map((r) => r.investor);

      for (const investor of interestedInvestors) {
        await NotificationService.createNotification(
          investor,
          `💬 The entrepreneur has updated the negotiation for "${request.idea.title}"`,
          "funding",
          request._id
        );
      }
    }

    res.json({
      success: true,
      message: "Response sent successfully",
      data: request,
    });
  } catch (error) {
    console.error("Error sending entrepreneur response:", error);
    res.status(500).json({
      success: false,
      message: "Error sending response",
      error: error.message,
    });
  }
};

// @desc    Get investor's deal pipeline
// @route   GET /api/funding/investor/pipeline
// @access  Private (Investor)
exports.getInvestorPipeline = async (req, res, next) => {
  try {
    const investorId = req.user.id;
    const { stage } = req.query; // Filter by pipeline stage

    // Build the query based on investor interaction + access control
    let query = {
      $and: [
        {
          $or: [
            { viewedBy: investorId },
            { "investorResponses.investor": investorId },
            { "negotiationHistory.investor": investorId },
            { acceptedBy: investorId },
          ],
        },
        {
          $or: [
            { accessType: "public" },
            { accessType: "invited", "invitedInvestors.investor": investorId },
            { accessType: "private", "invitedInvestors.investor": investorId },
          ],
        },
      ],
    };

    // Apply stage filter if provided
    if (stage) {
      if (stage === "new") {
        query.status = "pending";
        query.viewedBy = { $ne: investorId };
      } else if (stage === "viewed") {
        query.viewedBy = investorId;
        query["negotiationHistory.investor"] = { $ne: investorId };
        query.status = "pending";
      } else if (stage === "negotiating") {
        query.status = "negotiated";
      } else if (stage === "accepted") {
        query.acceptedBy = investorId;
        query.status = "accepted";
      } else if (stage === "declined") {
        query["investorResponses"] = {
          $elemMatch: {
            investor: investorId,
            status: "declined",
          },
        };
      }
    }

    const requests = await FundingRequest.find(query)
      .populate("idea", "title description category stage")
      .populate("entrepreneur", "name email")
      .populate("acceptedBy", "name email")
      .sort({ createdAt: -1 });

    // Group by pipeline stage
    const pipeline = {
      new: [],
      viewed: [],
      negotiating: [],
      accepted: [],
      declined: [],
    };

    requests.forEach((request) => {
      const hasViewed = request.viewedBy.some(
        (id) => id.toString() === investorId
      );
      const hasNegotiated = request.negotiationHistory.some(
        (n) => n.investor && n.investor.toString() === investorId
      );
      const hasDeclined = request.investorResponses.some(
        (r) => r.investor.toString() === investorId && r.status === "declined"
      );
      const hasAccepted =
        request.acceptedBy && request.acceptedBy._id.toString() === investorId;

      if (hasAccepted) {
        pipeline.accepted.push(request);
      } else if (hasDeclined) {
        pipeline.declined.push(request);
      } else if (request.status === "negotiated" && hasNegotiated) {
        pipeline.negotiating.push(request);
      } else if (hasViewed && !hasNegotiated) {
        pipeline.viewed.push(request);
      } else if (!hasViewed) {
        pipeline.new.push(request);
      }
    });

    // Calculate stats
    const stats = {
      total: requests.length,
      new: pipeline.new.length,
      viewed: pipeline.viewed.length,
      negotiating: pipeline.negotiating.length,
      accepted: pipeline.accepted.length,
      declined: pipeline.declined.length,
      totalInvested: pipeline.accepted.reduce((sum, r) => {
        return sum + (r.acceptanceTerms?.finalAmount || r.amount);
      }, 0),
    };

    res.json({
      success: true,
      data: stage ? requests : pipeline,
      stats: stats,
    });
  } catch (error) {
    console.error("Error fetching investor pipeline:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching investor pipeline",
      error: error.message,
    });
  }
};
