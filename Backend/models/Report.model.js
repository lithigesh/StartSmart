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

module.exports = mongoose.model('Report', ReportSchema);