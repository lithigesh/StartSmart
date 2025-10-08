// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorHandler");

// Initialize database connection
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve the BusinessAims viewer page
app.get("/admin/businessaims", (req, res) => {
  res.sendFile(path.join(__dirname, "businessaims-viewer.html"));
});

// API Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/ideas", require("./routes/idea.routes"));
app.use("/api/investors", require("./routes/investor.routes"));
app.use("/api/funding", require("./routes/funding.routes"));
app.use("/api/team", require("./routes/teamResource.routes"));
app.use("/api/aims", require("./routes/businessAim.routes"));
app.use("/api/sustainability", require("./routes/sustainability.routes"));
app.use("/api/feedback", require("./routes/feedback.routes"));
app.use("/api/ideathons", require("./routes/ideathon.routes"));
app.use("/api/reports", require("./routes/report.routes"));
app.use("/api/notifications", require("./routes/notification.routes"));
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/charts", require("./routes/chart.routes"));
app.use("/api/app-feedback", require("./routes/appFeedback.routes"));
app.use("/api/investor/comparisons", require("./routes/comparison.routes"));
app.use(
  "/api/investor/market-research",
  require("./routes/marketResearch.routes")
);

app.use(errorHandler);

// Health Check Route
app.get("/", (req, res) => {
  res.send("StartSmart API is running...");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
