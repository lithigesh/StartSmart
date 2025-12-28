// controllers/auth.controller.js
const User = require("../models/User.model");
const Idea = require("../models/Idea.model");
const Feedback = require("../models/Feedback.model");
const FundingRequest = require("../models/FundingRequest.model");
const NotificationService = require("../services/notification.service");
const generateToken = require("../utils/generateToken");

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res, next) => {
  const { name, email, password, role } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = await User.create({ name, email, password, role });

    // Create welcome notification for new user
    await NotificationService.createWelcomeNotification(user);

    res.status(201).json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      // Prevent admin users from logging in through normal login
      if (user.role === "admin") {
        return res.status(403).json({
          message: "Invalid email or password",
        });
      }

      res.json({
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      // You can add more updatable fields here, e.g., settings
      // user.settings.darkMode = req.body.settings.darkMode;

      if (req.body.password) {
        user.password = req.body.password; // The 'pre-save' hook will hash it
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user account
// @route   DELETE /api/auth/profile
// @access  Private
exports.deleteUserAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      // Business logic note: Decide what to do with the user's ideas.
      // For now, we'll just delete the user.
      await user.deleteOne();
      res.json({ message: "User account deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get a user's complete history (ideas, feedback, funding)
// @route   GET /api/auth/users/:id/history
// @access  Private
exports.getUserHistory = async (req, res, next) => {
  try {
    const userId = req.params.id;
    if (req.user.id !== userId && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to view this history" });
    }

    // Aggregate data for the user
    const [ideasSubmitted, feedbackGiven, fundingRequestsMade] =
      await Promise.all([
        Idea.find({ owner: userId }).lean(),
        Feedback.find({ investor: userId }).populate("idea", "title").lean(),
        FundingRequest.find({ entrepreneur: userId })
          .populate("idea", "title")
          .lean(),
      ]);

    res.json({
      ideasSubmitted,
      feedbackGiven,
      fundingRequestsMade,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile (name and email)
// @route   PUT /api/auth/update-profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    // Check if email is being changed and if it already exists
    if (email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    // Update user fields
    user.name = name;
    user.email = email;

    const updatedUser = await user.save();

    res.json({
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user password
// @route   PUT /api/auth/update-password
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate required fields
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Current password and new password are required" });
    }

    // Verify current password
    const isPasswordValid = await user.matchPassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Validate new password length
    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters" });
    }

    // Ensure new password is different from current
    const isSamePassword = await user.matchPassword(newPassword);
    if (isSamePassword) {
      return res
        .status(400)
        .json({
          message: "New password must be different from current password",
        });
    }

    // Update password (pre-save hook will hash it)
    user.password = newPassword;
    await user.save();

    res.json({
      message: "Password updated successfully",
    });
  } catch (error) {
    next(error);
  }
};
