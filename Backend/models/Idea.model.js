const mongoose = require("mongoose");

const IdeaSchema = new mongoose.Schema(
  {
    // Basic Information
    title: { type: String, required: true },
    elevatorPitch: { type: String, required: true },
    description: { type: String, required: true }, // This is detailedDescription from form
    category: { type: String, required: true },
    targetAudience: { type: String, required: true },

    // Problem & Solution
    problemStatement: { type: String, required: true },
    solution: { type: String, required: true },
    competitors: { type: String },

    // Business Model
    revenueStreams: { type: String },
    pricingStrategy: { type: String },
    keyPartnerships: { type: String },

    // Market & Growth
    marketSize: { type: String },
    goToMarketStrategy: { type: String },
    scalabilityPlan: { type: String },

    // Technical Requirements
    technologyStack: { type: String },
    developmentRoadmap: { type: String },
    challengesAnticipated: { type: String },

    // Sustainability & Social Impact
    ecoFriendlyPractices: { type: String },
    socialImpact: { type: String },

    // Funding & Investment
    fundingRequirements: { type: String },
    useOfFunds: { type: String },
    equityOffer: { type: String },

    // Additional Business Details
    uniqueValueProposition: { type: String },
    competitiveAdvantage: { type: String },
    stage: {
      type: String,
      enum: [
        "Concept",
        "Research",
        "Prototype",
        "MVP",
        "Beta",
        "Launch",
        "Growth",
        "Scale",
      ],
      default: "Concept",
    },

    // Attachments
    attachments: [
      {
        filename: { type: String },
        originalname: { type: String },
        mimetype: { type: String },
        size: { type: Number },
        path: { type: String },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    // System fields
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "draft",
        "submitted",
        "analyzing",
        "analyzed",
        "funding_requested",
        "closed",
      ],
      default: "submitted",
    },
    fundingStatus: {
      type: String,
      enum: ["not_requested", "seeking", "funded", "rejected"],
      default: "not_requested",
    },

    // AI Analysis (existing structure)
    analysis: {
      score: { type: Number, min: 0, max: 100 },
      swot: {
        strengths: String,
        weaknesses: String,
        opportunities: String,
        threats: String,
      },
      roadmap: [String],
      trends: [{ year: Number, popularity: Number }],
      recommendations: {
        immediate_actions: String,
        risk_mitigation: String,
        growth_strategy: String,
        funding_advice: String,
      },
      marketAssessment: {
        market_size_evaluation: String,
        competitive_positioning: String,
        customer_validation: String,
      },
    },

    // Investor Interest Tracking
    investorsInterested: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// Indexes for better query performance
IdeaSchema.index({ owner: 1, createdAt: -1 });
IdeaSchema.index({ status: 1 });
IdeaSchema.index({ fundingStatus: 1 });
IdeaSchema.index({ category: 1 });
IdeaSchema.index({ owner: 1, status: 1 });
IdeaSchema.index({ "analysis.score": -1 }); // For sorting by score
IdeaSchema.index({ createdAt: -1 }); // For recent ideas
// Text index for search functionality
IdeaSchema.index({ title: "text", description: "text", elevatorPitch: "text" });

module.exports = mongoose.model("Idea", IdeaSchema);
