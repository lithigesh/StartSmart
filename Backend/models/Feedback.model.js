const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    idea: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Idea',
        required: true
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Legacy field for backward compatibility
    investor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comments: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000
    },
    // Legacy field for backward compatibility
    comment: {
        type: String,
        trim: true,
        maxlength: 1000
    },
    suggestions: {
        type: String,
        trim: true,
        maxlength: 1000
    },
    category: {
        type: String,
        enum: ['feasibility', 'innovation', 'market_potential', 'technical', 'presentation', 'general'],
        default: 'general'
    },
    strengths: [{
        type: String,
        trim: true
    }],
    improvements: [{
        type: String,
        trim: true
    }],
    followUpRequired: {
        type: Boolean,
        default: false
    },
    followUpNotes: {
        type: String,
        trim: true,
        maxlength: 500
    },
    status: {
        type: String,
        enum: ['draft', 'submitted', 'reviewed'],
        default: 'submitted'
    },
    visibility: {
        type: String,
        enum: ['public', 'private', 'entrepreneur_only'],
        default: 'entrepreneur_only'
    },
    feedbackType: {
        type: String,
        enum: ['admin', 'investor', 'peer'],
        default: 'admin'
    }
}, {
    timestamps: true
});

// Indexes for better query performance
FeedbackSchema.index({ idea: 1, admin: 1 });
FeedbackSchema.index({ idea: 1, createdAt: -1 });
FeedbackSchema.index({ admin: 1, createdAt: -1 });
FeedbackSchema.index({ rating: 1 });
FeedbackSchema.index({ category: 1 });
FeedbackSchema.index({ feedbackType: 1 });

// Virtual for idea title (populated)
FeedbackSchema.virtual('ideaTitle').get(function() {
    return this.idea?.title || 'Unknown Idea';
});

// Virtual for admin name (populated)
FeedbackSchema.virtual('adminName').get(function() {
    return this.admin?.name || this.investor?.name || 'Unknown';
});

// Static method to get feedback statistics for an idea
FeedbackSchema.statics.getIdeaFeedbackStats = function(ideaId) {
    return this.aggregate([
        { $match: { idea: mongoose.Types.ObjectId(ideaId) } },
        {
            $group: {
                _id: null,
                averageRating: { $avg: '$rating' },
                totalFeedbacks: { $sum: 1 },
                ratingDistribution: {
                    $push: '$rating'
                },
                categories: {
                    $push: '$category'
                }
            }
        },
        {
            $project: {
                averageRating: { $round: ['$averageRating', 2] },
                totalFeedbacks: 1,
                ratingDistribution: 1,
                categories: 1
            }
        }
    ]);
};

// Instance method to check if feedback can be edited
FeedbackSchema.methods.canBeEdited = function() {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return this.status !== 'reviewed' && this.createdAt > oneDayAgo;
};

// Pre-save middleware for backward compatibility
FeedbackSchema.pre('save', function(next) {
    // Handle backward compatibility
    if (this.investor && !this.admin) {
        this.admin = this.investor;
        this.feedbackType = 'investor';
    }
    if (this.comment && !this.comments) {
        this.comments = this.comment;
    }
    if (this.isNew && !this.status) {
        this.status = 'submitted';
    }
    next();
});

module.exports = mongoose.model('Feedback', FeedbackSchema);