// models/Notification.model.js
const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    relatedIdea: { type: mongoose.Schema.Types.ObjectId, ref: 'Idea', required: false },
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);