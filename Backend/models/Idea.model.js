const mongoose = require('mongoose');

const IdeaSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
        type: String,
        enum: ['draft', 'submitted', 'analyzed', 'funding_requested', 'closed'],
        default: 'submitted',
    },
    analysis: {
        score: { type: Number, min: 0, max: 100 },
        swot: {
            strengths: String,
            weaknesses: String,
            opportunities: String,
            threats: String,
        },
        roadmap: [String],
        trends: [{ year: Number, popularity: Number }],
    },
}, { timestamps: true });

module.exports = mongoose.model('Idea', IdeaSchema);