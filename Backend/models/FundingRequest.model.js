const mongoose = require("mongoose");

const NegotiationHistorySchema = new mongoose.Schema({
  investor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  message: String,
  timestamp: { type: Date, default: Date.now },
});

const FundingRequestSchema = new mongoose.Schema(
  {
    // Basic Information
    idea: { type: mongoose.Schema.Types.ObjectId, ref: "Idea", required: true },
    entrepreneur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: { type: Number, required: true },
    equity: { type: Number, required: true, min: 0, max: 100 },
    valuation: Number,
    message: { type: String, trim: true },
    teamSize: { type: Number, min: 1 },

    // Business Details
    businessPlan: { type: String, trim: true },
    currentRevenue: { type: Number, min: 0 },
    previousFunding: { type: Number, min: 0, default: 0 },
    revenueModel: { type: String, trim: true },

    // Market & Strategy
    targetMarket: { type: String, trim: true },
    competitiveAdvantage: { type: String, trim: true },
    customerTraction: { type: String, trim: true },

    // Financial Projections
    financialProjections: { type: String, trim: true },
    useOfFunds: { type: String, trim: true },

    // Timeline & Milestones
    timeline: { type: String, trim: true },
    milestones: { type: String, trim: true },

    // Risk Assessment & Strategy
    riskFactors: { type: String, trim: true },
    exitStrategy: { type: String, trim: true },
    intellectualProperty: { type: String, trim: true },

    // Contact Information
    contactPhone: { type: String, trim: true },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    companyWebsite: { type: String, trim: true },
    linkedinProfile: { type: String, trim: true },

    // Additional Information
    additionalDocuments: { type: String, trim: true },

    // System Fields
    status: {
      type: String,
      enum: ["pending", "accepted", "negotiated", "declined", "withdrawn"],
      default: "pending",
    },
    negotiationHistory: [NegotiationHistorySchema],

    // Tracking Fields
    viewedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    lastViewedAt: { type: Date },
    responseDeadline: { type: Date },

    // Access Control & Targeting
    accessType: {
      type: String,
      enum: ["public", "private", "invited"],
      default: "public",
      // public: visible to all investors
      // private: visible only to specifically invited investors
      // invited: visible to invited investors + anyone who can be invited
    },
    invitedInvestors: [
      {
        investor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        invitedAt: { type: Date, default: Date.now },
        notificationSent: { type: Boolean, default: false },
        // Track if this investor had shown interest before invitation
        hadPriorInterest: { type: Boolean, default: false },
      },
    ],

    // Investor Interactions
    investorResponses: [
      {
        investor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        status: {
          type: String,
          enum: ["interested", "declined", "accepted"],
          required: true,
        },
        reason: { type: String, trim: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],

    // Acceptance Details
    acceptedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    acceptedAt: { type: Date },
    acceptanceTerms: {
      finalAmount: { type: Number },
      finalEquity: { type: Number },
      conditions: { type: String, trim: true },
      digitalSignature: { type: String, trim: true },
    },

    // Metrics
    fundingStage: {
      type: String,
      enum: ["seed", "series_a", "series_b", "series_c", "bridge", "other"],
      default: "seed",
    },
    investmentType: {
      type: String,
      enum: ["equity", "convertible_note", "safe", "revenue_share", "other"],
      default: "equity",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for calculated fields
FundingRequestSchema.virtual("calculatedValuation").get(function () {
  if (this.amount && this.equity) {
    return Math.round((this.amount / this.equity) * 100);
  }
  return this.valuation;
});

// Index for better query performance
FundingRequestSchema.index({ entrepreneur: 1, createdAt: -1 });
FundingRequestSchema.index({ status: 1 });
FundingRequestSchema.index({ idea: 1 });
FundingRequestSchema.index({ "invitedInvestors.investor": 1 });
FundingRequestSchema.index({ accessType: 1, status: 1 });

// Pre-save middleware to calculate valuation
FundingRequestSchema.pre("save", function (next) {
  if (this.amount && this.equity && !this.valuation) {
    this.valuation = Math.round((this.amount / this.equity) * 100);
  }
  next();
});

module.exports = mongoose.model("FundingRequest", FundingRequestSchema);
