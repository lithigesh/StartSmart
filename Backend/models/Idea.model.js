// models/Idea.model.js
const mongoose = require('mongoose');

const SwotSchema = new mongoose.Schema({
    strengths: { type: String, default: '' },
    weaknesses: { type: String, default: '' },
    opportunities: { type: String, default: '' },
    threats: { type: String, default: '' },
});

const TrendSchema = new mongoose.Schema({
    year: Number,
    popularity: Number,
});

const IdeaSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
        type: String,
        enum: ['pending', 'analyzing', 'analyzed', 'failed'],
        default: 'pending',
    },
    analysis: {
        score: { type: Number, default: 0 },
        swot: SwotSchema,
        roadmap: [String],
        trends: [TrendSchema],
    },
    investorsInterested: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('Idea', IdeaSchema);