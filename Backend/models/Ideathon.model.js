const mongoose = require('mongoose');

const IdeathonSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, 'Title is required'],
        trim: true,
        minlength: [5, 'Title must be at least 5 characters long'],
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    theme: {
        type: String,
        trim: true,
        maxlength: [100, 'Theme cannot exceed 100 characters']
    },
    fundingPrizes: {
        type: String,
        trim: true,
        maxlength: [500, 'Funding prizes description cannot exceed 500 characters']
    },
    startDate: { 
        type: Date, 
        required: [true, 'Start date is required'],
        validate: {
            validator: function(value) {
                const now = new Date();
                // Allow start dates up to 2 years in the future
                const maxFutureDate = new Date();
                maxFutureDate.setFullYear(maxFutureDate.getFullYear() + 2);
                return value > now && value <= maxFutureDate;
            },
            message: 'Start date must be in the future and within the next 2 years'
        }
    },
    endDate: { 
        type: Date, 
        required: [true, 'End date is required'],
        validate: {
            validator: function(value) {
                if (!this.startDate) return false;
                // End date must be after start date
                if (value <= this.startDate) return false;
                // Allow end dates up to 2 years from now
                const maxFutureDate = new Date();
                maxFutureDate.setFullYear(maxFutureDate.getFullYear() + 2);
                return value <= maxFutureDate;
            },
            message: 'End date must be after start date and within the next 2 years'
        }
    },
    
    // New required fields with validations
    description: { 
        type: String, 
        required: [true, 'Description is required'],
        trim: true,
        minlength: [50, 'Description must be at least 50 characters long'],
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    organizers: { 
        type: String, 
        required: [true, 'Organizers/Host Institution is required'],
        trim: true,
        minlength: [2, 'Organizers must be at least 2 characters long'],
        maxlength: [200, 'Organizers cannot exceed 200 characters']
    },
    submissionFormat: { 
        type: [String], 
        required: [true, 'At least one submission format is required'],
        validate: {
            validator: function(array) {
                return array && array.length > 0;
            },
            message: 'At least one submission format must be selected'
        },
        enum: {
            values: ['Pitch Deck', 'Prototype', 'Code Repository', 'Business Document', 'Video Presentation', 'Demo', 'Research Paper'],
            message: 'Invalid submission format'
        }
    },
    
    // New optional fields with validations
    eligibilityCriteria: {
        type: String,
        trim: true,
        maxlength: [1000, 'Eligibility criteria cannot exceed 1000 characters']
    },
    judgingCriteria: {
        type: String,
        trim: true,
        maxlength: [1000, 'Judging criteria cannot exceed 1000 characters']
    },
    location: { 
        type: String, 
        enum: {
            values: ['Online', 'Offline', 'Hybrid'],
            message: 'Location must be Online, Offline, or Hybrid'
        },
        default: 'Online'
    },
    contactInformation: {
        type: String,
        trim: true,
        maxlength: [500, 'Contact information cannot exceed 500 characters']
    },
    
    // Status field for better management
    status: {
        type: String,
        enum: {
            values: ['upcoming', 'ongoing', 'completed', 'cancelled'],
            message: 'Invalid status'
        },
        default: 'upcoming'
    },
    
    winners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: [true, 'Creator is required']
    },
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for calculating current status based on dates
IdeathonSchema.virtual('currentStatus').get(function() {
    const now = new Date();
    if (this.status === 'cancelled') return 'cancelled';
    if (this.status === 'completed') return 'completed';
    if (now < this.startDate) return 'upcoming';
    if (now >= this.startDate && now <= this.endDate) return 'ongoing';
    return 'completed';
});

// Index for better query performance
IdeathonSchema.index({ title: 'text', theme: 'text', organizers: 'text' });
IdeathonSchema.index({ startDate: 1, endDate: 1 });
IdeathonSchema.index({ status: 1 });
IdeathonSchema.index({ location: 1 });
IdeathonSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Ideathon', IdeathonSchema);