const mongoose = require('mongoose');

const BusinessAimSchema = new mongoose.Schema({
    // Reference to the idea
    ideaId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Idea', 
        required: true 
    },
    
    // Business Model
    businessModel: { 
        type: String, 
        required: true,
        trim: true,
        minlength: [10, 'Business model must be at least 10 characters long'],
        maxlength: [2000, 'Business model cannot exceed 2000 characters']
    },
    
    // Revenue Streams
    revenueStreams: [String],
    
    // Target Market
    targetMarket: { 
        type: String, 
        required: true,
        trim: true,
        minlength: [10, 'Target market must be at least 10 characters long'],
        maxlength: [1000, 'Target market cannot exceed 1000 characters']
    },
    
    // Market Size
    marketSize: { 
        type: String, 
        trim: true,
        maxlength: [500, 'Market size cannot exceed 500 characters']
    },
    
    // Competition Analysis
    competitionAnalysis: { 
        type: String, 
        trim: true,
        maxlength: [2000, 'Competition analysis cannot exceed 2000 characters']
    },
    
    // Pricing Strategy
    pricingStrategy: { 
        type: String, 
        trim: true,
        maxlength: [1000, 'Pricing strategy cannot exceed 1000 characters']
    },
    
    // Sales Strategy
    salesStrategy: { 
        type: String, 
        trim: true,
        maxlength: [1000, 'Sales strategy cannot exceed 1000 characters']
    },
    
    // Marketing Strategy
    marketingStrategy: { 
        type: String, 
        trim: true,
        maxlength: [1000, 'Marketing strategy cannot exceed 1000 characters']
    },
    
    // Funding Requirement
    fundingRequirement: { 
        type: String, 
        trim: true,
        maxlength: [500, 'Funding requirement cannot exceed 500 characters']
    },
    
    // Use of Funds
    useOfFunds: { 
        type: String, 
        trim: true,
        maxlength: [1000, 'Use of funds cannot exceed 1000 characters']
    },
    
    // Financial Projections
    financialProjections: { 
        type: String, 
        trim: true,
        maxlength: [2000, 'Financial projections cannot exceed 2000 characters']
    },
    
    // Key Metrics
    keyMetrics: [String],
    
    // Risk Assessment
    riskAssessment: { 
        type: String, 
        trim: true,
        maxlength: [2000, 'Risk assessment cannot exceed 2000 characters']
    },
    
    // Mitigation Strategies
    mitigationStrategies: { 
        type: String, 
        trim: true,
        maxlength: [2000, 'Mitigation strategies cannot exceed 2000 characters']
    },
    
    // Exit Strategy
    exitStrategy: { 
        type: String, 
        trim: true,
        maxlength: [1000, 'Exit strategy cannot exceed 1000 characters']
    },
    
    // Timeline
    timeline: { 
        type: String, 
        trim: true,
        maxlength: [1000, 'Timeline cannot exceed 1000 characters']
    },
    
    // Milestones
    milestones: [{
        name: { type: String, required: true },
        description: { type: String },
        targetDate: { type: Date },
        completed: { type: Boolean, default: false }
    }],
    
    // System fields
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    
    status: {
        type: String,
        enum: ['draft', 'submitted', 'approved', 'needs_revision'],
        default: 'submitted'
    }
}, { 
    timestamps: true,
    collection: 'businessAims' // Explicitly specify collection name
});

// Indexes for better query performance
BusinessAimSchema.index({ status: 1 });
BusinessAimSchema.index({ createdAt: -1 });

module.exports = mongoose.model('BusinessAim', BusinessAimSchema);