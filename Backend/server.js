// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
const server = http.createServer(app);

// Initialize database connection with retries
const initializeDB = async () => {
  let retries = 5;
  while (retries > 0) {
    try {
      await connectDB();
      console.log("Database connection successful");
      return;
    } catch (error) {
      console.error(`Database connection failed. Retries left: ${retries - 1}`);
      retries--;
      if (retries === 0) {
        console.error(
          "Could not connect to the database after multiple attempts"
        );
        process.exit(1);
      }
      // Wait for 5 seconds before retrying
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
};

initializeDB();

// Configure CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Configure Socket.IO with CORS
const io = new Server(server, {
  cors: corsOptions,
});

// Socket.IO connection handling
const connectedUsers = new Map(); // Map of userId -> socketId

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Authenticate and register user
  socket.on("authenticate", (userId) => {
    if (userId) {
      connectedUsers.set(userId, socket.id);
      socket.userId = userId;
      console.log(`User ${userId} authenticated with socket ${socket.id}`);
    }
  });

  // Join a funding request room
  socket.on("joinFundingRoom", (fundingRequestId) => {
    socket.join(`funding:${fundingRequestId}`);
    console.log(`Socket ${socket.id} joined room funding:${fundingRequestId}`);
  });

  // Leave a funding request room
  socket.on("leaveFundingRoom", (fundingRequestId) => {
    socket.leave(`funding:${fundingRequestId}`);
    console.log(`Socket ${socket.id} left room funding:${fundingRequestId}`);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    if (socket.userId) {
      connectedUsers.delete(socket.userId);
      console.log(`User ${socket.userId} disconnected`);
    }
    console.log("User disconnected:", socket.id);
  });
});

// Make io available to routes
app.set("io", io);

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve the BusinessAims viewer page
app.get("/admin/businessaims", (req, res) => {
  res.sendFile(path.join(__dirname, "businessaims-viewer.html"));
});

// API Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/ideas", require("./routes/idea.routes"));
app.use("/api/investor", require("./routes/investor.routes"));
app.use("/api/funding", require("./routes/funding.routes"));
app.use("/api/team", require("./routes/teamResource.routes"));
app.use("/api/aims", require("./routes/businessAim.routes"));
app.use("/api/sustainability", require("./routes/sustainability.routes"));
app.use("/api/feedback", require("./routes/feedback.routes"));
app.use("/api/ideathons", require("./routes/ideathon.routes"));
app.use("/api/reports", require("./routes/report.routes"));
app.use("/api/notifications", require("./routes/notification.routes"));
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/chart", require("./routes/chart.routes"));
app.use("/api/comparison", require("./routes/comparison.routes"));
app.use("/api/marketResearch", require("./routes/marketResearch.routes"));
app.use("/api/app-feedback", require("./routes/appFeedback.routes"));
app.use("/api/messages", require("./routes/negotiationMessage.routes"));

app.use(errorHandler);
// Health Check Route
app.get("/", (req, res) => {
  res.send(`
        <div style="
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 40px;
            background: #fafafa;
            color: #333;
        ">
            <h2 style="
                font-size: 28px;
                margin-bottom: 10px;
            ">
                StartSmart API is Running......
            </h2>

            <p style="
                font-size: 16px;
                margin-bottom: 20px;
            ">
                Backend service is active and responding.
            </p>

            <a href="https://github.com/lithigesh/StartSmart/blob/main/Backend/README.md"
               target="_blank"
               style="
                    text-decoration: none;
                    background: #1976d2;
                    color: white;
                    padding: 10px 18px;
                    border-radius: 6px;
                    font-size: 15px;
                    display: inline-block;
               ">
                View Backend Documentation
            </a>
        </div>
    `);
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
