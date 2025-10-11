const mongoose = require("mongoose");

const ComparisonNoteSchema = new mongoose.Schema(
  {
    investor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ideas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Idea",
        required: true,
      },
    ],
    chosenLeader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Idea",
      default: null,
    },
    notes: {
      type: String,
      default: "",
    },
    rationale: {
      type: String,
      default: "",
    },
    // Snapshot of key metrics at comparison time to preserve historical data
    comparisonMetrics: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Validation: Must have 2-4 ideas
ComparisonNoteSchema.pre("validate", function (next) {
  if (this.ideas.length < 2) {
    next(new Error("Comparison must include at least 2 ideas"));
  } else if (this.ideas.length > 4) {
    next(new Error("Comparison cannot include more than 4 ideas"));
  } else {
    next();
  }
});

// Index for faster queries
ComparisonNoteSchema.index({ investor: 1, createdAt: -1 });
ComparisonNoteSchema.index({ ideas: 1 });

module.exports = mongoose.model("ComparisonNote", ComparisonNoteSchema);
