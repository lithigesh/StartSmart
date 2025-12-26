// models/Sustainability.model.js
const mongoose = require('mongoose');

const SustainabilitySchema = new mongoose.Schema({
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
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // Environmental Impact Scoring (1-10 scale)
    environmentalImpact: {
        carbonFootprint: {
            score: {
                type: Number,
                required: true,
                min: 1,
                max: 10,
                default: 5
            },
            notes: {
                type: String,
                trim: true,
                maxlength: 500
            }
        },
        resourceUsage: {
            score: {
                type: Number,
                required: true,
                min: 1,
                max: 10,
                default: 5
            },
            notes: {
                type: String,
                trim: true,
                maxlength: 500
            }
        },
        wasteReduction: {
            score: {
                type: Number,
                required: true,
                min: 1,
                max: 10,
                default: 5
            },
            notes: {
                type: String,
                trim: true,
                maxlength: 500
            }
        },
        renewableEnergy: {
            score: {
                type: Number,
                required: true,
                min: 1,
                max: 10,
                default: 5
            },
            notes: {
                type: String,
                trim: true,
                maxlength: 500
            }
        }
    },
    // Social Impact Scoring (1-10 scale)
    socialImpact: {
        communityBenefit: {
            score: {
                type: Number,
                required: true,
                min: 1,
                max: 10,
                default: 5
            },
            notes: {
                type: String,
                trim: true,
                maxlength: 500
            }
        },
        inclusivity: {
            score: {
                type: Number,
                required: true,
                min: 1,
                max: 10,
                default: 5
            },
            notes: {
                type: String,
                trim: true,
                maxlength: 500
            }
        },
        jobCreation: {
            score: {
                type: Number,
                required: true,
                min: 1,
                max: 10,
                default: 5
            },
            notes: {
                type: String,
                trim: true,
                maxlength: 500
            }
        },
        ethicalPractices: {
            score: {
                type: Number,
                required: true,
                min: 1,
                max: 10,
                default: 5
            },
            notes: {
                type: String,
                trim: true,
                maxlength: 500
            }
        }
    },
    // Economic Sustainability (1-10 scale)
    economicSustainability: {
        longTermViability: {
            score: {
                type: Number,
                required: true,
                min: 1,
                max: 10,
                default: 5
            },
            notes: {
                type: String,
                trim: true,
                maxlength: 500
            }
        },
        costEffectiveness: {
            score: {
                type: Number,
                required: true,
                min: 1,
                max: 10,
                default: 5
            },
            notes: {
                type: String,
                trim: true,
                maxlength: 500
            }
        },
        marketDemand: {
            score: {
                type: Number,
                required: true,
                min: 1,
                max: 10,
                default: 5
            },
            notes: {
                type: String,
                trim: true,
                maxlength: 500
            }
        },
        scalability: {
            score: {
                type: Number,
                required: true,
                min: 1,
                max: 10,
                default: 5
            },
            notes: {
                type: String,
                trim: true,
                maxlength: 500
            }
        }
    },
    // Legacy fields for backward compatibility
    ecoPractices: {
        type: [String],
        default: []
    },
    impactScore: {
        type: Number,
        min: 0,
        max: 100
    },
    // Overall Assessment
    overallSustainabilityScore: {
        type: Number,
        min: 1,
        max: 10
    },
    sustainabilityRank: {
        type: String,
        enum: ['Excellent', 'Good', 'Average', 'Poor', 'Very Poor'],
        default: 'Average'
    },
    // Additional Information
    certifications: [{
        name: {
            type: String,
            trim: true
        },
        issuingBody: {
            type: String,
            trim: true
        },
        verified: {
            type: Boolean,
            default: false
        }
    }],
    sdgAlignment: [{
        type: String,
        enum: [
            'No Poverty', 'Zero Hunger', 'Good Health and Well-being',
            'Quality Education', 'Gender Equality', 'Clean Water and Sanitation',
            'Affordable and Clean Energy', 'Decent Work and Economic Growth',
            'Industry Innovation and Infrastructure', 'Reduced Inequalities',
            'Sustainable Cities and Communities', 'Responsible Consumption and Production',
            'Climate Action', 'Life Below Water', 'Life on Land',
            'Peace Justice and Strong Institutions', 'Partnerships for the Goals'
        ]
    }],
    recommendations: [{
        category: {
            type: String,
            enum: ['environmental', 'social', 'economic', 'general']
        },
        suggestion: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500
        },
        priority: {
            type: String,
            enum: ['high', 'medium', 'low'],
            default: 'medium'
        }
    }],
    nextReviewDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['draft', 'completed', 'reviewed', 'approved'],
        default: 'completed'
    },
    visibility: {
        type: String,
        enum: ['public', 'private', 'entrepreneur_only'],
        default: 'entrepreneur_only'
    }
}, {
    timestamps: true
});

// Indexes for better query performance
SustainabilitySchema.index({ idea: 1 }, { unique: true }); // Unique index to prevent duplicate assessments
SustainabilitySchema.index({ idea: 1, admin: 1 });
SustainabilitySchema.index({ idea: 1, createdAt: -1 });
SustainabilitySchema.index({ overallSustainabilityScore: -1 });
SustainabilitySchema.index({ sustainabilityRank: 1 });
SustainabilitySchema.index({ status: 1 });

// Pre-save middleware for backward compatibility and calculations
SustainabilitySchema.pre('save', function(next) {
    // Handle backward compatibility
    if (this.submittedBy && !this.admin) {
        this.admin = this.submittedBy;
    }
    
    // Calculate overall sustainability score if detailed scores exist
    if (this.environmentalImpact && this.socialImpact && this.economicSustainability) {
        const envScores = [
            this.environmentalImpact.carbonFootprint.score,
            this.environmentalImpact.resourceUsage.score,
            this.environmentalImpact.wasteReduction.score,
            this.environmentalImpact.renewableEnergy.score
        ];
        
        const socialScores = [
            this.socialImpact.communityBenefit.score,
            this.socialImpact.inclusivity.score,
            this.socialImpact.jobCreation.score,
            this.socialImpact.ethicalPractices.score
        ];
        
        const economicScores = [
            this.economicSustainability.longTermViability.score,
            this.economicSustainability.costEffectiveness.score,
            this.economicSustainability.marketDemand.score,
            this.economicSustainability.scalability.score
        ];
        
        const allScores = [...envScores, ...socialScores, ...economicScores];
        const avgScore = allScores.reduce((sum, score) => sum + score, 0) / allScores.length;
        
        this.overallSustainabilityScore = Math.round(avgScore * 10) / 10;
        
        // Update legacy impactScore for backward compatibility
        this.impactScore = Math.round(avgScore * 10);
        
        // Determine sustainability rank
        if (this.overallSustainabilityScore >= 8.5) {
            this.sustainabilityRank = 'Excellent';
        } else if (this.overallSustainabilityScore >= 7) {
            this.sustainabilityRank = 'Good';
        } else if (this.overallSustainabilityScore >= 5) {
            this.sustainabilityRank = 'Average';
        } else if (this.overallSustainabilityScore >= 3) {
            this.sustainabilityRank = 'Poor';
        } else {
            this.sustainabilityRank = 'Very Poor';
        }
    }
    
    // Set next review date (6 months from now)
    if (this.isNew) {
        this.nextReviewDate = new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000);
    }
    
    next();
});

// Static method to get sustainability statistics
SustainabilitySchema.statics.getSustainabilityStats = function() {
    return this.aggregate([
        {
            $group: {
                _id: null,
                averageScore: { $avg: '$overallSustainabilityScore' },
                totalAssessments: { $sum: 1 },
                rankDistribution: {
                    $push: '$sustainabilityRank'
                }
            }
        }
    ]);
};

// Instance method to get category scores
SustainabilitySchema.methods.getCategoryScores = function() {
    if (!this.environmentalImpact || !this.socialImpact || !this.economicSustainability) {
        return null;
    }
    
    const envScore = (
        this.environmentalImpact.carbonFootprint.score +
        this.environmentalImpact.resourceUsage.score +
        this.environmentalImpact.wasteReduction.score +
        this.environmentalImpact.renewableEnergy.score
    ) / 4;
    
    const socialScore = (
        this.socialImpact.communityBenefit.score +
        this.socialImpact.inclusivity.score +
        this.socialImpact.jobCreation.score +
        this.socialImpact.ethicalPractices.score
    ) / 4;
    
    const economicScore = (
        this.economicSustainability.longTermViability.score +
        this.economicSustainability.costEffectiveness.score +
        this.economicSustainability.marketDemand.score +
        this.economicSustainability.scalability.score
    ) / 4;
    
    return {
        environmental: Math.round(envScore * 10) / 10,
        social: Math.round(socialScore * 10) / 10,
        economic: Math.round(economicScore * 10) / 10
    };
};

// Pre-save middleware to handle legacy field migration
SustainabilitySchema.pre('save', function(next) {
    // Migrate submittedBy to admin if admin is not set
    if (!this.admin && this.submittedBy) {
        this.admin = this.submittedBy;
    }
    
    // Maintain backward compatibility - sync in both directions
    if (this.isModified('admin') && !this.submittedBy) {
        this.submittedBy = this.admin;
    }
    
    next();
});

module.exports = mongoose.model('Sustainability', SustainabilitySchema);