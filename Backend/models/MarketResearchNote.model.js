const mongoose = require("mongoose");

const MarketResearchNoteSchema = new mongoose.Schema(
  {
    investor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Please provide a title for this research note"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    sector: {
      type: String,
      required: [true, "Please specify the industry sector"],
      trim: true,
    },
    marketSize: {
      type: String,
      default: "",
    },
    trends: {
      type: String,
      default: "",
    },
    competitors: {
      type: String,
      default: "",
    },
    opportunities: {
      type: String,
      default: "",
    },
    threats: {
      type: String,
      default: "",
    },
    sources: {
      type: String,
      default: "",
    },
    notes: {
      type: String,
      default: "",
    },
    relatedIdeas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Idea",
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
MarketResearchNoteSchema.index({ investor: 1, createdAt: -1 });
MarketResearchNoteSchema.index({ sector: 1 });
MarketResearchNoteSchema.index({ tags: 1 });

module.exports = mongoose.model("MarketResearchNote", MarketResearchNoteSchema);
