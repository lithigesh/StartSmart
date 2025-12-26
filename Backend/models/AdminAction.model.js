// models/AdminAction.model.js
const mongoose = require('mongoose');

const AdminActionSchema = new mongoose.Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Made optional for failed login attempts
    },
    actionType: {
        type: String,
        required: true,
        enum: [
            'deleteIdea', 
            'deleteUser', 
            'changeRole',
            'adminLogin',
            'failedAdminLogin',
            'adminVerification',
            'failedAdminVerification',
            'generateReport',
            'createFeedback',
            'updateFeedback',
            'deleteFeedback',
            'createSustainabilityAssessment',
            'updateSustainabilityAssessment',
            'deleteSustainabilityAssessment'
        ]
    },
    targetId: { // The ID of the document that was affected
        type: mongoose.Schema.Types.ObjectId,
        required: false // Made optional for login actions
    },
    targetModel: { // The model of the affected document
        type: String,
        required: false, // Made optional for login actions
        enum: ['User', 'Idea', 'Feedback', 'Sustainability', 'Ideathon', 'Report']
    },
    details: { // Optional extra details, e.g., "Role changed from X to Y"
        type: String
    }
}, { timestamps: { createdAt: true, updatedAt: false } });

// Indexes for better query performance
AdminActionSchema.index({ admin: 1, createdAt: -1 });
AdminActionSchema.index({ actionType: 1, createdAt: -1 });
AdminActionSchema.index({ targetModel: 1, targetId: 1 });
AdminActionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('AdminAction', AdminActionSchema);