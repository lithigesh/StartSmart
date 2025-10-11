// models/IdeathonRegistration.model.js
const mongoose = require('mongoose');

const IdeathonRegistrationSchema = new mongoose.Schema({
    ideathon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ideathon',
        required: true
    },
    entrepreneur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    idea: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Idea'
    },
    pitchDetails: {
        type: String
    },
    registeredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['registered', 'shortlisted', 'winner'],
        default: 'registered',
    },
    // Progress tracking
    progressStatus: {
        type: String,
        enum: ['Not Started', 'Planning Phase', 'Initial Development', 'Advanced Development', 'Testing & Refinement', 'Ready for Submission'],
        default: 'Not Started'
    },
    milestones: [{
        title: String,
        description: String,
        completed: {
            type: Boolean,
            default: false
        },
        completedDate: Date,
        dueDate: Date
    }],
    currentProgress: {
        type: Number,  // Percentage of completion (0-100)
        default: 0
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    // Progress history for tracking changes over time
    progressHistory: [{
        date: {
            type: Date,
            default: Date.now
        },
        status: String,
        progress: Number,
        projectUpdates: String,
        challengesFaced: String,
        nextSteps: String,
        resourcesNeeded: String,
        feedback: String
    }],
    // Current update fields
    projectUpdates: String,
    challengesFaced: String,
    nextSteps: String,
    resourcesNeeded: String,
    feedback: String,
    // Team information
    teamName: {
        type: String,
        required: true
    },
    projectTitle: {
        type: String,
        required: true
    },
    projectDescription: {
        type: String
    },
    deadlineDate: {
        type: Date,
        required: true
    },
    techStack: {
        type: String
    },
    teamMembers: [{
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        role: {
            type: String,
            required: true
        }
    }],
    githubRepo: {
        type: String
    },
    additionalInfo: {
        type: String
    },
    // Final Submission fields
    finalSubmission: {
        submittedAt: Date,
        projectSummary: String,
        technicalImplementation: String,
        challenges: String,
        futureEnhancements: String,
        teamContributions: String,
        demoVideo: String,
        githubFinalRepo: String,
        liveDemoLink: String,
        additionalMaterials: [{
            title: String,
            link: String,
            description: String
        }],
        status: {
            type: String,
            enum: ['draft', 'submitted', 'under-review', 'accepted', 'rejected'],
            default: 'draft'
        },
        feedback: String,
        reviewedAt: Date,
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }
}, { timestamps: { createdAt: true, updatedAt: false } });

// Prevent a user from registering for the same ideathon more than once
IdeathonRegistrationSchema.index({ ideathon: 1, entrepreneur: 1 }, { unique: true });

module.exports = mongoose.model('IdeathonRegistration', IdeathonRegistrationSchema);