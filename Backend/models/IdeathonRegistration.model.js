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
    }
}, { timestamps: { createdAt: true, updatedAt: false } });

// Prevent a user from registering for the same ideathon more than once
IdeathonRegistrationSchema.index({ ideathon: 1, entrepreneur: 1 }, { unique: true });

module.exports = mongoose.model('IdeathonRegistration', IdeathonRegistrationSchema);