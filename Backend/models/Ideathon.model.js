const mongoose = require('mongoose');

const IdeathonSchema = new mongoose.Schema({
    title: { type: String, required: true },
    theme: String,
    fundingPrizes: String,
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    winners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Ideathon', IdeathonSchema);