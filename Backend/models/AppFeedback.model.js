// models/AppFeedback.model.js
const mongoose = require('mongoose');

const AppFeedbackSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // User Role (for better categorization)
    userRole: {
        type: String,
        enum: ['entrepreneur', 'investor', 'admin'],
        required: false // Make optional to maintain backward compatibility
    },
    
    // Feedback Categories
    category: {
        type: String,
        enum: ['general', 'bug_report', 'feature_request', 'ui_ux', 'performance', 'security', 'analytics', 'other'],
        required: true,
        default: 'general'
    },
    
    // Main Feedback Content
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: [5, 'Title must be at least 5 characters long'],
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: [10, 'Description must be at least 10 characters long'],
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    
    // Rating System
    overallRating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    
    // Specific Ratings
    ratings: {
        usability: {
            type: Number,
            min: 1,
            max: 5,
            default: 3
        },
        performance: {
            type: Number,
            min: 1,
            max: 5,
            default: 3
        },
        features: {
            type: Number,
            min: 1,
            max: 5,
            default: 3
        },
        design: {
            type: Number,
            min: 1,
            max: 5,
            default: 3
        }
    },
    
    // Additional Information
    browserInfo: {
        userAgent: String,
        browserName: String,
        browserVersion: String,
        os: String
    },
    deviceInfo: {
        deviceType: {
            type: String,
            enum: ['desktop', 'tablet', 'mobile'],
            default: 'desktop'
        },
        screenResolution: String
    },
    
    // User Experience Questions
    frequencyOfUse: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'rarely', 'first_time'],
        default: 'weekly'
    },
    recommendationScore: {
        type: Number,
        min: 0,
        max: 10,
        required: true
    },
    
    // Improvement Suggestions
    mostUsedFeatures: [{
        type: String,
        trim: true
    }],
    suggestedImprovements: [{
        type: String,
        trim: true
    }],
    
    // Bug Report Specific Fields
    stepsToReproduce: {
        type: String,
        trim: true
    },
    expectedBehavior: {
        type: String,
        trim: true
    },
    actualBehavior: {
        type: String,
        trim: true
    },
    
    // Feature Request Specific Fields
    featureDescription: {
        type: String,
        trim: true
    },
    featurePriority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },
    
    // Contact Information
    contactForFollowUp: {
        type: Boolean,
        default: false
    },
    preferredContactMethod: {
        type: String,
        enum: ['email', 'phone', 'in_app'],
        default: 'email'
    },
    
    // Admin Response
    adminResponse: {
        response: String,
        respondedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        respondedAt: Date
    },
    
    // Status Tracking
    status: {
        type: String,
        enum: ['open', 'in_review', 'in_progress', 'resolved', 'closed'],
        default: 'open'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    
    // Analytics
    isHelpful: {
        type: Boolean,
        default: false
    },
    helpfulVotes: {
        type: Number,
        default: 0
    },
    
    // Attachments
    attachments: [{
        filename: String,
        originalname: String,
        mimetype: String,
        size: Number,
        path: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better query performance
AppFeedbackSchema.index({ user: 1, createdAt: -1 });
AppFeedbackSchema.index({ category: 1, status: 1 });
AppFeedbackSchema.index({ overallRating: -1 });
AppFeedbackSchema.index({ status: 1, priority: 1 });
AppFeedbackSchema.index({ createdAt: -1 });

// Virtual for getting feedback age
AppFeedbackSchema.virtual('feedbackAge').get(function() {
    const now = new Date();
    const diffTime = Math.abs(now - this.createdAt);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
});

// Virtual for average rating
AppFeedbackSchema.virtual('averageSpecificRating').get(function() {
    if (!this.ratings) return this.overallRating;
    
    const ratings = [
        this.ratings.usability,
        this.ratings.performance,
        this.ratings.features,
        this.ratings.design
    ].filter(rating => rating && rating > 0);
    
    if (ratings.length === 0) return this.overallRating;
    
    return Math.round((ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length) * 10) / 10;
});

// Static method to get feedback statistics
AppFeedbackSchema.statics.getFeedbackStats = function() {
    return this.aggregate([
        {
            $group: {
                _id: null,
                totalFeedback: { $sum: 1 },
                averageRating: { $avg: '$overallRating' },
                averageRecommendation: { $avg: '$recommendationScore' },
                categoryDistribution: {
                    $push: '$category'
                },
                statusDistribution: {
                    $push: '$status'
                }
            }
        }
    ]);
};

// Instance method to mark as helpful
AppFeedbackSchema.methods.markAsHelpful = function() {
    this.isHelpful = true;
    this.helpfulVotes += 1;
    return this.save();
};

// Indexes for better query performance (duplicates removed)

module.exports = mongoose.model('AppFeedback', AppFeedbackSchema);