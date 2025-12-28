const express = require("express");
const router = express.Router();
const {
  getMessagesForRequest,
  sendMessage,
  markMessagesAsDelivered,
  markMessagesAsViewed,
  retryMessage,
  getUnreadCount,
} = require("../controllers/negotiationMessage.controller");
const { protect } = require("../middlewares/auth.middleware");

// All routes require authentication
router.use(protect);

// Get messages for a funding request
router.get("/funding/:fundingRequestId", getMessagesForRequest);

// Send a new message
router.post("/funding/:fundingRequestId", sendMessage);

// Mark messages as delivered
router.put("/funding/:fundingRequestId/delivered", markMessagesAsDelivered);

// Mark messages as viewed (read receipts)
router.put("/funding/:fundingRequestId/viewed", markMessagesAsViewed);

// Retry a failed message
router.put("/:messageId/retry", retryMessage);

// Get unread count
router.get("/funding/:fundingRequestId/unread", getUnreadCount);

module.exports = router;
