const Ideathon = require("../models/Ideathon.model");
const IdeathonRegistration = require("../models/IdeathonRegistration.model");
const User = require("../models/User.model");

// @desc    Admin creates an ideathon
// @route   POST /api/ideathons
exports.createIdeathon = async (req, res, next) => {
  try {
    const {
      title,
      theme,
      fundingPrizes,
      startDate,
      endDate,
      description,
      organizers,
      submissionFormat,
      eligibilityCriteria,
      judgingCriteria,
      location,
      contactInformation,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !startDate ||
      !endDate ||
      !description ||
      !organizers ||
      !submissionFormat
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, start date, end date, description, organizers, and submission format are required",
      });
    }

    // Validate submission format is an array
    if (!Array.isArray(submissionFormat) || submissionFormat.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one submission format must be selected",
      });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date",
      });
    }

    const ideathon = await Ideathon.create({
      title,
      theme,
      fundingPrizes,
      startDate: start,
      endDate: end,
      description,
      organizers,
      submissionFormat,
      eligibilityCriteria,
      judgingCriteria,
      location,
      contactInformation,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: ideathon,
    });
  } catch (error) {
    console.error("Create ideathon error:", error);
    next(error);
  }
};

// @desc    Get all ideathons with search and filter
// @route   GET /api/ideathons
exports.getAllIdeathons = async (req, res, next) => {
  try {
    const {
      search,
      status,
      location,
      theme,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build search query
    let query = {};

    // Text search across title, theme, and organizers
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { theme: { $regex: search, $options: "i" } },
        { organizers: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by status
    if (status && status !== "all") {
      query.status = status;
    }

    // Filter by location
    if (location && location !== "all") {
      query.location = location;
    }

    // Filter by theme (partial match)
    if (theme && theme !== "all") {
      query.theme = { $regex: theme, $options: "i" };
    }

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query with pagination
    const ideathons = await Ideathon.find(query)
      .populate("createdBy", "name email")
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await Ideathon.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum);

    // Get filter options for frontend
    const statusOptions = await Ideathon.distinct("status");
    const locationOptions = await Ideathon.distinct("location");
    const themeOptions = await Ideathon.distinct("theme");

    res.status(200).json({
      success: true,
      count: ideathons.length,
      total,
      totalPages,
      currentPage: pageNum,
      data: ideathons,
      filters: {
        statusOptions,
        locationOptions,
        themeOptions,
      },
    });
  } catch (error) {
    console.error("Get all ideathons error:", error);
    next(error);
  }
};

// @desc    Get ideathon by ID
// @route   GET /api/ideathons/:id
exports.getIdeathonById = async (req, res, next) => {
  try {
    const ideathon = await Ideathon.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!ideathon) {
      return res.status(404).json({
        success: false,
        message: "Ideathon not found",
      });
    }

    res.status(200).json({
      success: true,
      data: ideathon,
    });
  } catch (error) {
    console.error("Get ideathon by ID error:", error);
    next(error);
  }
};

// @desc    Update ideathon
// @route   PUT /api/ideathons/:id
exports.updateIdeathon = async (req, res, next) => {
  try {
    const {
      title,
      theme,
      fundingPrizes,
      startDate,
      endDate,
      description,
      organizers,
      submissionFormat,
      eligibilityCriteria,
      judgingCriteria,
      location,
      contactInformation,
    } = req.body;

    let ideathon = await Ideathon.findById(req.params.id);
    if (!ideathon) {
      return res.status(404).json({
        success: false,
        message: "Ideathon not found",
      });
    }

    // Validate dates if provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start >= end) {
        return res.status(400).json({
          success: false,
          message: "End date must be after start date",
        });
      }
    }

    // Validate submission format if provided
    if (
      submissionFormat &&
      (!Array.isArray(submissionFormat) || submissionFormat.length === 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "At least one submission format must be selected",
      });
    }

    ideathon = await Ideathon.findByIdAndUpdate(
      req.params.id,
      {
        title,
        theme,
        fundingPrizes,
        startDate,
        endDate,
        description,
        organizers,
        submissionFormat,
        eligibilityCriteria,
        judgingCriteria,
        location,
        contactInformation,
      },
      { new: true, runValidators: true }
    ).populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      data: ideathon,
    });
  } catch (error) {
    console.error("Update ideathon error:", error);
    next(error);
  }
};

// @desc    Delete ideathon
// @route   DELETE /api/ideathons/:id
exports.deleteIdeathon = async (req, res, next) => {
  try {
    const ideathon = await Ideathon.findById(req.params.id);
    if (!ideathon) {
      return res.status(404).json({
        success: false,
        message: "Ideathon not found",
      });
    }

    // Also delete related registrations
    await IdeathonRegistration.deleteMany({ ideathon: req.params.id });

    await Ideathon.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Ideathon deleted successfully",
    });
  } catch (error) {
    console.error("Delete ideathon error:", error);
    next(error);
  }
};

// @desc    Submit final submission for ideathon (compatibility route)
// @route   POST /api/ideathons/:id/submit
// @access  Private (Entrepreneur; admin should use registrations/:registrationId/final-submission)
exports.submitToIdeathon = async (req, res, next) => {
  try {
    // Find the current user's registration for this ideathon
    // This provides backward compatibility for clients that only know ideathonId.
    const registration = await IdeathonRegistration.findOne({
      ideathon: req.params.id,
      entrepreneur: req.user.id,
    }).select("_id");

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found for this ideathon",
      });
    }

    // Delegate to the canonical final-submission handler
    req.params.registrationId = registration._id.toString();
    return exports.submitFinalSubmission(req, res, next);
  } catch (error) {
    console.error("Submit to ideathon (compat) error:", error);
    next(error);
  }
};

// @desc    Submit final submission for ideathon
// @route   POST /api/ideathons/registrations/:registrationId/final-submission
exports.submitFinalSubmission = async (req, res, next) => {
  try {
    const {
      projectSummary,
      technicalImplementation,
      challenges,
      futureEnhancements,
      teamContributions,
      demoVideo,
      githubFinalRepo,
      liveDemoLink,
      additionalMaterials,
    } = req.body;

    // Find the registration
    let registration = await IdeathonRegistration.findById(
      req.params.registrationId
    ).populate("ideathon", "endDate");

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    // Verify that the registration belongs to the current user
    if (
      registration.entrepreneur.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to submit for this registration",
      });
    }

    // Check if the ideathon deadline has passed
    if (new Date() > registration.ideathon.endDate) {
      return res.status(400).json({
        success: false,
        message: "Submission deadline has passed",
      });
    }

    // Validate required fields
    if (!projectSummary || !technicalImplementation) {
      return res.status(400).json({
        success: false,
        message: "Project summary and technical implementation are required",
      });
    }

    // Update the registration with final submission
    registration = await IdeathonRegistration.findByIdAndUpdate(
      req.params.registrationId,
      {
        finalSubmission: {
          submittedAt: Date.now(),
          projectSummary,
          technicalImplementation,
          challenges,
          futureEnhancements,
          teamContributions,
          demoVideo,
          githubFinalRepo,
          liveDemoLink,
          additionalMaterials,
          status: "submitted",
        },
        progressStatus: "Ready for Submission",
        currentProgress: 100,
      },
      { new: true }
    ).populate(
      "ideathon",
      "title theme description startDate endDate status fundingPrizes"
    );

    res.status(200).json({
      success: true,
      message: "Final submission successfully submitted",
      data: registration,
    });
  } catch (error) {
    console.error("Final submission error:", error);
    next(error);
  }
};

// @desc    Get final submission details
// @route   GET /api/ideathons/registrations/:registrationId/final-submission
exports.getFinalSubmission = async (req, res, next) => {
  try {
    const registration = await IdeathonRegistration.findById(
      req.params.registrationId
    )
      .populate(
        "ideathon",
        "title theme description startDate endDate status fundingPrizes"
      )
      .populate("entrepreneur", "name email")
      .select(
        "finalSubmission progressStatus currentProgress teamName projectTitle"
      );

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    // Check if user is authorized to view this submission
    if (
      registration.entrepreneur._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this submission",
      });
    }

    res.status(200).json({
      success: true,
      data: registration,
    });
  } catch (error) {
    console.error("Get final submission error:", error);
    next(error);
  }
};

// @desc    Update final submission draft
// @route   PUT /api/ideathons/registrations/:registrationId/final-submission
exports.updateFinalSubmission = async (req, res, next) => {
  try {
    const {
      projectSummary,
      technicalImplementation,
      challenges,
      futureEnhancements,
      teamContributions,
      demoVideo,
      githubFinalRepo,
      liveDemoLink,
      additionalMaterials,
    } = req.body;

    // Find the registration
    let registration = await IdeathonRegistration.findById(
      req.params.registrationId
    ).populate("ideathon", "endDate");

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    // Verify that the registration belongs to the current user
    if (
      registration.entrepreneur.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this submission",
      });
    }

    // Check if the submission is already submitted and locked
    if (registration.finalSubmission?.status === "submitted") {
      return res.status(400).json({
        success: false,
        message: "Cannot update after final submission",
      });
    }

    // Update the registration with draft submission
    registration = await IdeathonRegistration.findByIdAndUpdate(
      req.params.registrationId,
      {
        finalSubmission: {
          projectSummary,
          technicalImplementation,
          challenges,
          futureEnhancements,
          teamContributions,
          demoVideo,
          githubFinalRepo,
          liveDemoLink,
          additionalMaterials,
          status: "draft",
        },
      },
      { new: true }
    ).populate(
      "ideathon",
      "title theme description startDate endDate status fundingPrizes"
    );

    res.status(200).json({
      success: true,
      message: "Final submission draft updated",
      data: registration,
    });
  } catch (error) {
    console.error("Update final submission error:", error);
    next(error);
  }
}; // @desc    Entrepreneur registers for an ideathon
// @route   POST /api/ideathons/:id/register
exports.registerForIdeathon = async (req, res, next) => {
  try {
    const {
      ideaId,
      pitchDetails,
      teamName,
      teamMembers,
      projectTitle,
      projectDescription,
      techStack,
      githubRepo,
      additionalInfo,
      userId,
      deadlineDate,
    } = req.body;

    // Validate required fields
    if (!teamName) {
      return res.status(400).json({
        success: false,
        message: "Team name is required",
      });
    }

    if (!projectTitle) {
      return res.status(400).json({
        success: false,
        message: "Project title is required",
      });
    }

    // Check if ideathon exists
    const ideathon = await Ideathon.findById(req.params.id);
    if (!ideathon) {
      return res.status(404).json({
        success: false,
        message: "Ideathon not found",
      });
    }

    // Determine entrepreneur ID: if admin is registering someone else, use userId from body
    // If entrepreneur is registering themselves, use req.user.id
    const entrepreneurId =
      req.user.role === "admin" && userId ? userId : req.user.id;

    // Check if already registered
    const existingRegistration = await IdeathonRegistration.findOne({
      ideathon: req.params.id,
      entrepreneur: entrepreneurId,
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: "Already registered for this ideathon",
      });
    }

    // Parse team members if it's a string (comma-separated names)
    let parsedTeamMembers = [];
    if (teamMembers) {
      if (typeof teamMembers === "string") {
        // Split by comma and create basic team member objects
        const memberNames = teamMembers
          .split(",")
          .map((name) => name.trim())
          .filter((name) => name);
        parsedTeamMembers = memberNames.map((name) => ({
          name: name,
          email: "", // Will be empty for now
          role: "Team Member",
        }));
      } else if (Array.isArray(teamMembers)) {
        parsedTeamMembers = teamMembers;
      }
    }

    // Get the ideathon to fetch its end date if no deadline is provided
    const ideathonDetails = await Ideathon.findById(req.params.id);
    if (!ideathonDetails) {
      return res.status(404).json({
        success: false,
        message: "Ideathon not found",
      });
    }

    // Use provided deadline or default to ideathon end date
    const finalDeadlineDate = deadlineDate
      ? new Date(deadlineDate)
      : ideathonDetails.endDate;

    const registration = await IdeathonRegistration.create({
      ideathon: req.params.id,
      entrepreneur: entrepreneurId,
      idea: ideaId || null, // Allow null/undefined idea for admin registrations
      pitchDetails,
      teamName,
      projectTitle: projectTitle || "Project Title", // Use provided or default
      projectDescription: projectDescription || pitchDetails,
      techStack,
      teamMembers: parsedTeamMembers,
      githubRepo,
      additionalInfo,
      deadlineDate: finalDeadlineDate,
      registeredBy: req.user.id, // Track who created the registration
    });

    res.status(201).json({
      success: true,
      data: registration,
    });
  } catch (error) {
    console.error("Register for ideathon error:", error);
    next(error);
  }
};

// @desc    Get ideathon registrations
// @route   GET /api/ideathons/:id/registrations
exports.getIdeathonRegistrations = async (req, res, next) => {
  try {
    let filter = {};

    // If ID is provided, get registrations for specific ideathon
    if (req.params.id) {
      filter.ideathon = req.params.id;
    }

    const registrations = await IdeathonRegistration.find(filter)
      .populate("entrepreneur", "name email")
      .populate("idea", "title description category")
      .populate("ideathon", "title startDate endDate")
      .sort({ createdAt: -1 });

    // Add deadline status and remaining time for each registration
    const registrationsWithDeadlineInfo = registrations.map((registration) => {
      const now = new Date();
      const deadline = new Date(registration.deadlineDate);
      const daysRemaining = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));

      return {
        ...registration.toObject(),
        deadlineStatus: {
          isOverdue: now > deadline,
          daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
          deadlineFormatted: deadline.toLocaleDateString(),
          urgencyLevel:
            daysRemaining <= 3
              ? "urgent"
              : daysRemaining <= 7
              ? "approaching"
              : "normal",
        },
      };
    });

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrationsWithDeadlineInfo,
    });
  } catch (error) {
    console.error("Get ideathon registrations error:", error);
    next(error);
  }
};

// @desc    Get single registration by ID
// @route   GET /api/ideathons/:id/registrations/:registrationId
exports.getRegistrationById = async (req, res, next) => {
  try {
    const registration = await IdeathonRegistration.findById(
      req.params.registrationId
    )
      .populate("entrepreneur", "name email")
      .populate("idea", "title description category")
      .populate("ideathon", "title startDate endDate");

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    // Verify user has permission to view this registration
    if (
      registration.entrepreneur._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this registration",
      });
    }

    res.status(200).json({
      success: true,
      data: registration,
    });
  } catch (error) {
    console.error("Get registration by ID error:", error);
    next(error);
  }
};

// @desc    Update ideathon registration
// @route   PUT /api/ideathons/:id/registrations/:registrationId
exports.updateRegistration = async (req, res, next) => {
  try {
    const {
      teamName,
      projectTitle,
      projectDescription,
      techStack,
      teamMembers,
      githubRepo,
      pitchDetails,
      additionalInfo,
      deadlineDate,
    } = req.body;

    // Find the registration
    let registration = await IdeathonRegistration.findById(
      req.params.registrationId
    );

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    // Verify that the registration belongs to the current user
    if (
      registration.entrepreneur.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this registration",
      });
    }

    // Get the ideathon to validate deadline date
    const ideathonDetails = await Ideathon.findById(req.params.id);
    if (!ideathonDetails) {
      return res.status(404).json({
        success: false,
        message: "Ideathon not found",
      });
    }

    // Validate deadline date is not after ideathon end date
    if (deadlineDate && new Date(deadlineDate) > ideathonDetails.endDate) {
      return res.status(400).json({
        success: false,
        message: "Deadline date cannot be after ideathon end date",
      });
    }

    // Update the registration
    registration = await IdeathonRegistration.findByIdAndUpdate(
      req.params.registrationId,
      {
        teamName,
        projectTitle,
        projectDescription,
        techStack,
        teamMembers,
        githubRepo,
        pitchDetails,
        additionalInfo,
        deadlineDate: deadlineDate ? new Date(deadlineDate) : undefined,
        updatedAt: Date.now(),
      },
      { new: true, runValidators: true }
    ).populate(
      "ideathon",
      "title theme description startDate endDate status fundingPrizes"
    );

    res.status(200).json({
      success: true,
      data: registration,
    });
  } catch (error) {
    console.error("Update registration error:", error);
    next(error);
  }
};

// @desc    Post ideathon winners
// @route   PUT /api/ideathons/:id/results
exports.postIdeathonWinners = async (req, res, next) => {
  try {
    const { winners } = req.body; // Array of winner objects with position and registration ID

    const ideathon = await Ideathon.findByIdAndUpdate(
      req.params.id,
      { winners, status: "completed" },
      { new: true }
    );

    if (!ideathon) {
      return res.status(404).json({
        success: false,
        message: "Ideathon not found",
      });
    }

    res.status(200).json({
      success: true,
      data: ideathon,
    });
  } catch (error) {
    console.error("Post ideathon winners error:", error);
    next(error);
  }
};

// @desc    Get ideathons registered by current user
// @route   GET /api/ideathons/my-registrations
exports.getMyRegisteredIdeathons = async (req, res, next) => {
  try {
    const registrations = await IdeathonRegistration.find({
      entrepreneur: req.user.id,
    })
      .populate(
        "ideathon",
        "title theme description startDate endDate status fundingPrizes"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    console.error("Get my registered ideathons error:", error);
    next(error);
  }
};

// @desc    Update ideathon registration progress
// @route   PUT /api/ideathons/registrations/:registrationId/progress
exports.updateRegistrationProgress = async (req, res, next) => {
  try {
    const {
      progressStatus,
      currentProgress,
      milestones,
      projectUpdates,
      challengesFaced,
      nextSteps,
      resourcesNeeded,
      feedback,
    } = req.body;

    // Find the registration
    let registration = await IdeathonRegistration.findById(
      req.params.registrationId
    );

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    // Verify that the registration belongs to the current user
    if (
      registration.entrepreneur.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this registration",
      });
    }

    // Validate progress status
    const validProgressStatuses = [
      "Not Started",
      "Planning Phase",
      "Initial Development",
      "Advanced Development",
      "Testing & Refinement",
      "Ready for Submission",
    ];

    if (progressStatus && !validProgressStatuses.includes(progressStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid progress status",
      });
    }

    // Validate current progress percentage
    if (
      currentProgress !== undefined &&
      (currentProgress < 0 || currentProgress > 100)
    ) {
      return res.status(400).json({
        success: false,
        message: "Progress percentage must be between 0 and 100",
      });
    }

    // Create progress update entry
    const progressUpdate = {
      date: Date.now(),
      status: progressStatus,
      progress: currentProgress,
      projectUpdates,
      challengesFaced,
      nextSteps,
      resourcesNeeded,
      feedback,
    };

    // Prepare update object
    const updateData = {
      lastUpdated: Date.now(),
      $push: { progressHistory: progressUpdate },
    };

    if (progressStatus) updateData.progressStatus = progressStatus;
    if (currentProgress !== undefined)
      updateData.currentProgress = currentProgress;
    if (milestones) updateData.milestones = milestones;

    // Add other fields if they exist
    if (projectUpdates) updateData.projectUpdates = projectUpdates;
    if (challengesFaced) updateData.challengesFaced = challengesFaced;
    if (nextSteps) updateData.nextSteps = nextSteps;
    if (resourcesNeeded) updateData.resourcesNeeded = resourcesNeeded;
    if (feedback) updateData.feedback = feedback;

    // Update the registration
    registration = await IdeathonRegistration.findByIdAndUpdate(
      req.params.registrationId,
      updateData,
      { new: true, runValidators: true }
    )
      .populate(
        "ideathon",
        "title theme description startDate endDate status fundingPrizes"
      )
      .populate("entrepreneur", "name email");

    // Calculate new progress metrics
    const completedMilestones = registration.milestones.filter(
      (m) => m.completed
    ).length;
    const totalMilestones = registration.milestones.length;
    const milestoneProgress =
      totalMilestones > 0
        ? Math.round((completedMilestones / totalMilestones) * 100)
        : 0;

    // Add metrics to response
    const responseData = {
      ...registration.toObject(),
      metrics: {
        completedMilestones,
        totalMilestones,
        milestoneProgress,
        lastUpdated: registration.lastUpdated,
      },
    };

    res.status(200).json({
      success: true,
      data: responseData,
      message: "Progress updated successfully",
    });
  } catch (error) {
    console.error("Update registration progress error:", error);
    next(error);
  }
};

// @desc    Add milestone to registration
// @route   POST /api/ideathons/registrations/:registrationId/milestones
exports.addMilestone = async (req, res, next) => {
  try {
    const { title } = req.body;

    // Find the registration
    let registration = await IdeathonRegistration.findById(
      req.params.registrationId
    );

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    // Verify that the registration belongs to the current user
    if (
      registration.entrepreneur.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this registration",
      });
    }

    // Add the new milestone
    registration.milestones.push({
      title,
      completed: false,
    });

    // Save the updated registration
    await registration.save();

    res.status(200).json({
      success: true,
      data: registration,
    });
  } catch (error) {
    console.error("Add milestone error:", error);
    next(error);
  }
};

// @desc    Update milestone status
// @route   PUT /api/ideathons/registrations/:registrationId/milestones/:milestoneId
exports.updateMilestone = async (req, res, next) => {
  try {
    const { completed } = req.body;
    const { registrationId, milestoneId } = req.params;

    // Find the registration
    let registration = await IdeathonRegistration.findById(registrationId);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    // Verify that the registration belongs to the current user
    if (
      registration.entrepreneur.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this registration",
      });
    }

    // Find and update the milestone
    const milestone = registration.milestones.id(milestoneId);
    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: "Milestone not found",
      });
    }

    milestone.completed = completed;
    milestone.completedDate = completed ? Date.now() : undefined;

    // Save the updated registration
    await registration.save();

    res.status(200).json({
      success: true,
      data: registration,
    });
  } catch (error) {
    console.error("Update milestone error:", error);
    next(error);
  }
};

// @desc    Withdraw from ideathon (delete registration)
// @route   DELETE /api/ideathons/registrations/:registrationId
exports.withdrawFromIdeathon = async (req, res, next) => {
  try {
    const registration = await IdeathonRegistration.findById(
      req.params.registrationId
    );

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    // Check if the user is authorized (either the entrepreneur or admin)
    if (
      registration.entrepreneur.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to withdraw this registration",
      });
    }

    await registration.deleteOne();

    res.status(200).json({
      success: true,
      message: "Successfully withdrawn from ideathon",
    });
  } catch (error) {
    console.error("Withdraw from ideathon error:", error);
    next(error);
  }
};
