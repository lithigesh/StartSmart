// models/AdminAction.model.js
const mongoose = require('mongoose');

const AdminActionSchema = new mongoose.Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    actionType: {
        type: String,
        required: true,
        enum: ['deleteIdea', 'deleteUser', 'changeRole']
    },
    targetId: { // The ID of the document that was affected
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    targetModel: { // The model of the affected document
        type: String,
        required: true,
        enum: ['User', 'Idea']
    },
    details: { // Optional extra details, e.g., "Role changed from X to Y"
        type: String
    }
}, { timestamps: { createdAt: true, updatedAt: false } });

module.exports = mongoose.model('AdminAction', AdminActionSchema);