const mongoose = require("mongoose");
require("dotenv").config();

const testPortfolioQuery = async () => {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB\n");

    const InvestorInterest = require("./models/InvestorInterest.model");
    const FundingRequest = require("./models/FundingRequest.model");

    // Sarah Investor's ID
    const investorId = "68caa2122543c651d3aba0b5";

    console.log("Testing portfolio analytics for Sarah Investor...\n");

    // Test 1: Count interested ideas (what the API does)
    const interestedIdeasCount = await InvestorInterest.countDocuments({
      investor: investorId,
      status: "interested",
    });
    console.log("✅ Interested Ideas Count:", interestedIdeasCount);

    // Test 2: Get all interests for this investor
    const allInterests = await InvestorInterest.find({
      investor: investorId,
    }).populate("idea", "title");

    console.log("\n📋 All Interest Records for Sarah:", allInterests.length);
    allInterests.forEach((interest, idx) => {
      console.log(
        `  ${idx + 1}. Status: "${interest.status}" | Idea: ${
          interest.idea?.title || "Unknown"
        }`
      );
    });

    // Test 3: Check funding requests
    const allRequests = await FundingRequest.find({
      $or: [
        { acceptedBy: investorId },
        { viewedBy: investorId },
        { "investorResponses.investor": investorId },
      ],
    }).populate("idea", "title");

    console.log("\n📊 Funding Requests (involved):", allRequests.length);
    allRequests.forEach((req, idx) => {
      console.log(
        `  ${idx + 1}. Status: ${req.status} | Idea: ${
          req.idea?.title || "Unknown"
        }`
      );
    });

    await mongoose.connection.close();
    console.log("\n✅ Done!");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

testPortfolioQuery();
