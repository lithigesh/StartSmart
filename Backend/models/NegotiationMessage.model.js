const mongoose = require("mongoose");

/**
 * NegotiationMessage Model
 * Improved schema for chat messages in funding request negotiations
 * Replaces the embedded negotiationHistory array with proper message tracking
 */
const NegotiationMessageSchema = new mongoose.Schema(
  {
    fundingRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FundingRequest",
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    senderRole: {
      type: String,
      enum: ["investor", "entrepreneur"],
      required: true,
    },
    messageType: {
      type: String,
      enum: ["text", "proposal", "system"],
      default: "text",
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: [2000, "Message cannot exceed 2000 characters"],
    },
    // Read receipts - track who has viewed this message
    viewedBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        viewedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // Proposal-specific data
    proposalData: {
      amount: {
        type: Number,
        min: 0,
      },
      equity: {
        type: Number,
        min: 0,
        max: 100,
      },
      valuation: {
        type: Number,
        min: 0,
      },
    },
    // Message delivery status
    status: {
      type: String,
      enum: ["pending", "sent", "delivered", "failed"],
      default: "sent",
    },
    // Retry information for failed messages
    retryCount: {
      type: Number,
      default: 0,
    },
    errorMessage: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for efficient querying
NegotiationMessageSchema.index({ fundingRequest: 1, createdAt: -1 });
NegotiationMessageSchema.index({ sender: 1, createdAt: -1 });
NegotiationMessageSchema.index({ fundingRequest: 1, status: 1 });

// Virtual for sender name (populated)
NegotiationMessageSchema.virtual("senderName").get(function () {
  return this.sender?.name || "Unknown";
});

// Method to mark message as viewed by a user
NegotiationMessageSchema.methods.markAsViewed = function (userId) {
  const alreadyViewed = this.viewedBy.some(
    (view) => view.user.toString() === userId.toString()
  );

  if (!alreadyViewed) {
    this.viewedBy.push({
      user: userId,
      viewedAt: new Date(),
    });
  }

  return this.save();
};

// Method to check if message has been viewed by a user
NegotiationMessageSchema.methods.isViewedBy = function (userId) {
  return this.viewedBy.some(
    (view) => view.user.toString() === userId.toString()
  );
};

// Method to format message with proposal data
NegotiationMessageSchema.methods.getFormattedContent = function () {
  let content = this.content;

  if (this.messageType === "proposal" && this.proposalData) {
    const { amount, equity, valuation } = this.proposalData;

    content += "\n\n📊 Proposed Terms:\n";
    if (amount) {
      content += `💰 Amount: $${amount.toLocaleString()}\n`;
    }
    if (equity) {
      content += `📈 Equity: ${equity}%\n`;
    }
    if (valuation || (amount && equity)) {
      const val = valuation || Math.round((amount / equity) * 100);
      content += `🏢 Implied Valuation: $${val.toLocaleString()}`;
    }
  }

  return content;
};

// Static method to get messages for a funding request
NegotiationMessageSchema.statics.getMessagesForRequest = async function (
  fundingRequestId,
  options = {}
) {
  const { limit = 50, skip = 0, status } = options;

  const query = { fundingRequest: fundingRequestId };
  if (status) {
    query.status = status;
  }

  return this.find(query)
    .populate("sender", "name email role")
    .sort({ createdAt: 1 })
    .skip(skip)
    .limit(limit);
};

// Static method to get message count
NegotiationMessageSchema.statics.getMessageCount = async function (
  fundingRequestId,
  status
) {
  const query = { fundingRequest: fundingRequestId };
  if (status) {
    query.status = status;
  }
  return this.countDocuments(query);
};

// Static method to mark messages as delivered
NegotiationMessageSchema.statics.markAsDelivered = async function (messageIds) {
  return this.updateMany(
    { _id: { $in: messageIds }, status: "sent" },
    { $set: { status: "delivered" } }
  );
};

module.exports = mongoose.model("NegotiationMessage", NegotiationMessageSchema);
