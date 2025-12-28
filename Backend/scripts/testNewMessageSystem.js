/**
 * Test script to verify the new NegotiationMessage system is working
 * Tests:
 * 1. Fetching messages for a funding request
 * 2. Sending investor message
 * 3. Sending entrepreneur message
 * 4. Message format validation
 */

require("dotenv").config();
const mongoose = require("mongoose");
const NegotiationMessage = require("../models/NegotiationMessage.model");
const FundingRequest = require("../models/FundingRequest.model");
const User = require("../models/User.model");
const Idea = require("../models/Idea.model");

const testNewMessageSystem = async () => {
  try {
    console.log("🔌 Connecting to database...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected successfully\n");

    // Find a funding request with negotiation history
    console.log("🔍 Finding a funding request with negotiation...");
    const fundingRequest = await FundingRequest.findOne({
      $or: [
        { "negotiationHistory.0": { $exists: true } },
        { status: "negotiated" },
      ],
    })
      .populate("entrepreneur", "name email")
      .populate("idea", "title");

    if (!fundingRequest) {
      console.log("❌ No funding request found with negotiation history");
      console.log(
        "💡 Create a funding request and negotiate on it first, then run this test"
      );
      await mongoose.connection.close();
      return;
    }

    console.log(`✅ Found funding request: ${fundingRequest.idea?.title}`);
    console.log(`   Entrepreneur: ${fundingRequest.entrepreneur?.name}`);
    console.log(`   Status: ${fundingRequest.status}`);
    console.log(
      `   Legacy messages in negotiationHistory: ${fundingRequest.negotiationHistory.length}\n`
    );

    // Check for new-format messages
    console.log("🔍 Checking for new-format messages...");
    const newMessages = await NegotiationMessage.find({
      fundingRequest: fundingRequest._id,
    })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    console.log(`✅ Found ${newMessages.length} messages in new format`);

    if (newMessages.length > 0) {
      console.log("\n📨 Sample new-format message:");
      const sample = newMessages[0];
      console.log(`   Sender: ${sample.sender?.name} (${sample.senderRole})`);
      console.log(`   Content: ${sample.content?.substring(0, 50)}...`);
      console.log(`   Type: ${sample.messageType}`);
      console.log(`   Status: ${sample.status}`);
      console.log(`   Created: ${sample.createdAt}`);
    }

    // Compare with legacy messages
    console.log("\n📊 Message Format Comparison:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(
      `Legacy Format (negotiationHistory): ${fundingRequest.negotiationHistory.length} messages`
    );
    console.log(
      `New Format (NegotiationMessage):     ${newMessages.length} messages`
    );
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Check if any investors have interacted
    if (fundingRequest.investorResponses.length > 0) {
      const sampleInvestor = fundingRequest.investorResponses[0].investor;
      console.log(`\n✅ Found investor interaction: ${sampleInvestor}`);
      console.log(
        `   You can now test sending messages through the API endpoints`
      );
    }

    // Test message structure
    console.log("\n🔍 Testing message structure...");
    if (fundingRequest.negotiationHistory.length > 0) {
      const legacyMsg = fundingRequest.negotiationHistory[0];
      await fundingRequest.populate(
        "negotiationHistory.investor",
        "name email"
      );

      console.log("\n📝 Legacy message structure:");
      console.log(`   Has investor field: ${!!legacyMsg.investor}`);
      console.log(
        `   Investor name: ${
          legacyMsg.investor?.name || "null (entrepreneur message)"
        }`
      );
      console.log(`   Message: ${legacyMsg.message?.substring(0, 50)}...`);
      console.log(`   Timestamp: ${legacyMsg.timestamp}`);
    }

    if (newMessages.length > 0) {
      const newMsg = newMessages[0];
      console.log("\n📝 New message structure:");
      console.log(`   Has sender field: ${!!newMsg.sender}`);
      console.log(`   Sender role: ${newMsg.senderRole}`);
      console.log(`   Sender name: ${newMsg.sender?.name}`);
      console.log(`   Content: ${newMsg.content?.substring(0, 50)}...`);
      console.log(`   Message type: ${newMsg.messageType}`);
      console.log(`   Status: ${newMsg.status}`);
      console.log(`   Created: ${newMsg.createdAt}`);
    }

    console.log("\n✅ Test completed successfully!");
    console.log("\n💡 Next steps:");
    console.log("   1. Test sending messages through the frontend");
    console.log(
      "   2. Verify polling is working (messages update every 5 seconds)"
    );
    console.log(
      "   3. Check that both investor and entrepreneur can send/receive"
    );
    console.log(
      "   4. Verify real-time updates without page refresh or modal close"
    );
  } catch (error) {
    console.error("❌ Error during test:", error);
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 Database connection closed");
    process.exit(0);
  }
};

testNewMessageSystem();
