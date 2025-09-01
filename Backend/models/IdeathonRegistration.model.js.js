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
    status: {
        type: String,
        enum: ['registered', 'shortlisted', 'winner'],
        default: 'registered',
    },
}, { timestamps: { createdAt: true, updatedAt: false } });

// Prevent a user from registering for the same ideathon more than once
IdeathonRegistrationSchema.index({ ideathon: 1, entrepreneur: 1 }, { unique: true });

module.exports = mongoose.model('IdeathonRegistration', IdeathonRegistrationSchema);