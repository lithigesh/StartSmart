const mongoose = require("mongoose");
require("dotenv").config();

const checkInterests = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/startsmart"
    );
    console.log("✅ Connected to MongoDB");

    const InvestorInterest = require("./models/InvestorInterest.model");
    const User = require("./models/User.model");

    // Get all investors
    const investors = await User.find({ role: "investor" });
    console.log("\n👤 Investors in database:", investors.length);

    if (investors.length > 0) {
      for (const investor of investors) {
        const allInterests = await InvestorInterest.find({
          investor: investor._id,
        }).populate("idea", "title status");

        const interestedOnly = await InvestorInterest.find({
          investor: investor._id,
          status: "interested",
        }).populate("idea", "title status");

        console.log(
          "\n📊 Investor:",
          investor.name,
          "(" + investor.email + ")"
        );
        console.log("   All Interest Records:", allInterests.length);
        console.log('   Status = "interested":', interestedOnly.length);

        console.log("\n   Detailed breakdown:");
        allInterests.forEach((interest, idx) => {
          console.log(
            "   " + (idx + 1) + '. Status: "' + interest.status + '" | Idea:',
            interest.idea?.title || "Unknown"
          );
        });
      }
    }

    // Overall count by status
    const byStatus = await InvestorInterest.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    console.log("\n📈 Overall Summary:");
    byStatus.forEach((item) => {
      console.log('   Status "' + item._id + '":', item.count);
    });

    await mongoose.connection.close();
    console.log("\n✅ Done!");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

checkInterests();
