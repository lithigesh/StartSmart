const mongoose = require("mongoose");
require("dotenv").config();

const checkUsers = async () => {
  try {
    const uri =
      process.env.MONGO_URI ||
      process.env.MONGODB_URI ||
      "mongodb://localhost:27017/startsmart";
    console.log("🔌 Connecting to:", uri.substring(0, 50) + "...");

    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB");

    const User = require("./models/User.model");
    const InvestorInterest = require("./models/InvestorInterest.model");

    // Get ALL users
    const allUsers = await User.find({});
    console.log("\n👥 Total users in database:", allUsers.length);

    if (allUsers.length > 0) {
      console.log("\nUser Details:");
      for (const user of allUsers) {
        console.log("\n  Name:", user.name);
        console.log("  Email:", user.email);
        console.log("  Role:", user.role);
        console.log("  ID:", user._id);

        // Check interests for this user
        const interests = await InvestorInterest.find({ investor: user._id });
        console.log("  Interest Records:", interests.length);

        if (interests.length > 0) {
          interests.forEach((interest, idx) => {
            console.log("    " + (idx + 1) + ". Status:", interest.status);
          });
        }
      }
    }

    // Check all InvestorInterest records
    const allInterests = await InvestorInterest.find({}).populate(
      "investor",
      "name email role"
    );
    console.log("\n\n📊 All InvestorInterest Records:", allInterests.length);

    if (allInterests.length > 0) {
      allInterests.forEach((interest, idx) => {
        console.log("\n  " + (idx + 1) + ".");
        console.log("    Investor ID:", interest.investor?._id || "NULL");
        console.log(
          "    Investor Name:",
          interest.investor?.name || "NOT FOUND"
        );
        console.log("    Investor Role:", interest.investor?.role || "N/A");
        console.log("    Status:", interest.status);
        console.log("    Idea ID:", interest.idea);
      });
    }

    await mongoose.connection.close();
    console.log("\n✅ Done!");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

checkUsers();
