const mongoose = require('mongoose');

const InvestorInterestSchema = new mongoose.Schema({
    idea: { type: mongoose.Schema.Types.ObjectId, ref: 'Idea', required: true },
    investor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
        type: String,
        enum: ['interested', 'not_interested', 'withdrawn'],
        default: 'interested',
    },
}, { timestamps: { updatedAt: true, createdAt: false } }); // Only care about when it was last updated

// Ensure an investor can only have one interest status per idea
InvestorInterestSchema.index({ idea: 1, investor: 1 }, { unique: true });

module.exports = mongoose.model('InvestorInterest', InvestorInterestSchema);