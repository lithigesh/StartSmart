const mongoose = require('mongoose');

const NegotiationHistorySchema = new mongoose.Schema({
    investor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: String,
    timestamp: { type: Date, default: Date.now },
});

const FundingRequestSchema = new mongoose.Schema({
    idea: { type: mongoose.Schema.Types.ObjectId, ref: 'Idea', required: true },
    entrepreneur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    equity: { type: Number, required: true, min: 0, max: 100 },
    valuation: Number,
    status: {
        type: String,
        enum: ['pending', 'accepted', 'negotiated', 'declined'],
        default: 'pending',
    },
    negotiationHistory: [NegotiationHistorySchema],
}, { timestamps: true });

module.exports = mongoose.model('FundingRequest', FundingRequestSchema);