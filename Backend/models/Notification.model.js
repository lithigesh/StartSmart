// models/Notification.model.js
const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: [
        "new_idea",
        "idea_update",
        "funding_update",
        "funding_invitation",
        "funding",
        "system",
        "interest_confirmation",
        "analysis_complete",
      ],
      default: "system",
    },
    read: { type: Boolean, default: false },
    relatedIdea: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Idea",
      required: false,
    },
    relatedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    actionUrl: { type: String, required: false }, // URL to navigate when notification is clicked
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    expiresAt: { type: Date, required: false }, // Optional expiration date
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);
