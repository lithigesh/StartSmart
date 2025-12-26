const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    idea: { type: mongoose.Schema.Types.ObjectId, ref: 'Idea', required: true },
    reportType: {
        type: String,
        enum: ['swot', 'roadmap', 'sustainability'],
        required: true,
    },
    fileUrl: { type: String, required: true }, // URL to the PDF stored in a service like AWS S3
}, { timestamps: { createdAt: true, updatedAt: false } });

// Indexes for better query performance
ReportSchema.index({ idea: 1, reportType: 1 });
ReportSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Report', ReportSchema);