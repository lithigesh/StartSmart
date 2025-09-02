// models/Sustainability.model.js
const mongoose = require('mongoose');

const SustainabilitySchema = new mongoose.Schema({
    idea: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Idea',
        required: true,
        unique: true // Ensures only one sustainability entry per idea
    },
    ecoPractices: {
        type: [String],
        required: true
    },
    impactScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model('Sustainability', SustainabilitySchema);