const NegotiationMessage = require("../models/NegotiationMessage.model");
const FundingRequest = require("../models/FundingRequest.model");

/**
 * Get all messages for a funding request with pagination
 */
exports.getMessagesForRequest = async (req, res) => {
  try {
    const { fundingRequestId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Verify funding request exists and user has access
    const fundingRequest = await FundingRequest.findById(fundingRequestId)
      .populate("entrepreneur", "name email")
      .populate("idea", "title");

    if (!fundingRequest) {
      return res.status(404).json({
        success: false,
        message: "Funding request not found",
      });
    }

    // Check authorization
    const isEntrepreneur = req.user.id === fundingRequest.entrepreneur?._id.toString();
    const hasInterest = fundingRequest.interests?.some(
      (interest) => interest.investor?.toString() === req.user.id
    );

    if (!isEntrepreneur && !hasInterest) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to view these messages",
      });
    }

    // Get messages with pagination
    const skip = (page - 1) * limit;
    const messages = await NegotiationMessage.find({
      fundingRequest: fundingRequestId,
    })
      .populate("sender", "name email")
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await NegotiationMessage.countDocuments({
      fundingRequest: fundingRequestId,
    });

    res.json({
      success: true,
      data: {
        messages,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
      error: error.message,
    });
  }
};

/**
 * Send a new negotiation message
 */
exports.sendMessage = async (req, res) => {
  try {
    const { fundingRequestId } = req.params;
    const { content, messageType = "text", proposalData } = req.body;

    if (!content && messageType !== "system") {
      return res.status(400).json({
        success: false,
        message: "Message content is required",
      });
    }

    // Verify funding request exists and user has access
    const fundingRequest = await FundingRequest.findById(fundingRequestId)
      .populate("entrepreneur", "name email");

    if (!fundingRequest) {
      return res.status(404).json({
        success: false,
        message: "Funding request not found",
      });
    }

    // Determine user role
    const isEntrepreneur = req.user.id === fundingRequest.entrepreneur?._id.toString();
    const hasInterest = fundingRequest.interests?.some(
      (interest) => interest.investor?.toString() === req.user.id
    );

    if (!isEntrepreneur && !hasInterest) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to send messages",
      });
    }

    const senderRole = isEntrepreneur ? "entrepreneur" : "investor";

    // Create new message
    const message = new NegotiationMessage({
      fundingRequest: fundingRequestId,
      sender: req.user.id,
      senderRole,
      messageType,
      content,
      proposalData: messageType === "proposal" ? proposalData : undefined,
      status: "sent",
    });

    await message.save();

    // Populate sender details for response
    await message.populate("sender", "name email");

    // Update funding request status to negotiated if needed
    if (fundingRequest.status === "pending") {
      fundingRequest.status = "negotiated";
      await fundingRequest.save();
    }

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
};

/**
 * Mark messages as delivered
 */
exports.markMessagesAsDelivered = async (req, res) => {
  try {
    const { fundingRequestId } = req.params;
    const { messageIds } = req.body;

    if (!Array.isArray(messageIds) || messageIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Message IDs array is required",
      });
    }

    const result = await NegotiationMessage.updateMany(
      {
        _id: { $in: messageIds },
        fundingRequest: fundingRequestId,
        status: "sent",
      },
      {
        $set: { status: "delivered" },
      }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} messages marked as delivered`,
      data: {
        modifiedCount: result.modifiedCount,
      },
    });
  } catch (error) {
    console.error("Error marking messages as delivered:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update message status",
      error: error.message,
    });
  }
};

/**
 * Retry a failed message
 */
exports.retryMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await NegotiationMessage.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    // Check authorization - only sender can retry
    if (message.sender.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to retry this message",
      });
    }

    if (message.status !== "failed") {
      return res.status(400).json({
        success: false,
        message: "Only failed messages can be retried",
      });
    }

    // Update message status and increment retry count
    message.status = "sent";
    message.retryCount += 1;
    message.errorMessage = undefined;
    await message.save();

    await message.populate("sender", "name email");

    res.json({
      success: true,
      message: "Message retry initiated",
      data: message,
    });
  } catch (error) {
    console.error("Error retrying message:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retry message",
      error: error.message,
    });
  }
};

/**
 * Get unread message count for a user
 */
exports.getUnreadCount = async (req, res) => {
  try {
    const { fundingRequestId } = req.params;

    // Get all funding requests where user is involved
    let query = {};
    
    if (fundingRequestId) {
      query.fundingRequest = fundingRequestId;
    }

    // Messages sent by others to this user (where user is NOT the sender)
    const unreadCount = await NegotiationMessage.countDocuments({
      ...query,
      sender: { $ne: req.user.id },
      status: { $in: ["sent", "pending"] },
    });

    res.json({
      success: true,
      data: {
        unreadCount,
      },
    });
  } catch (error) {
    console.error("Error getting unread count:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get unread count",
      error: error.message,
    });
  }
};
