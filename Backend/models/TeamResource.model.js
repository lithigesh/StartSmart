const mongoose = require('mongoose');

const TeamMemberSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Team member name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  role: { 
    type: String, 
    required: [true, 'Team member role is required'],
    trim: true,
    minlength: [2, 'Role must be at least 2 characters long'],
    maxlength: [100, 'Role cannot exceed 100 characters']
  },
  expertise: { 
    type: String, 
    required: [true, 'Team member expertise is required'],
    trim: true,
    minlength: [5, 'Expertise must be at least 5 characters long'],
    maxlength: [500, 'Expertise cannot exceed 500 characters']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  isFounder: {
    type: Boolean,
    default: false
  }
});

const TeamResourceSchema = new mongoose.Schema({
  // Reference to the idea this team is working on
  ideaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Idea',
    required: [true, 'Idea reference is required']
  },
  
  // User who owns this team/resource entry
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner is required']
  },

  // Team members array
  teamMembers: {
    type: [TeamMemberSchema],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one team member is required'
    }
  },

  // Core skills (multi-select)
  coreSkills: {
    type: [String],
    enum: {
      values: [
        'Marketing', 
        'Technology', 
        'Finance', 
        'Management', 
        'Sales', 
        'Product Development',
        'Design',
        'Operations',
        'Legal',
        'HR',
        'Data Analytics',
        'Business Development',
        'Customer Support',
        'Quality Assurance'
      ],
      message: 'Invalid core skill selected'
    },
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one core skill is required'
    }
  },

  // Resources needed
  resourcesNeeded: {
    type: [String],
    enum: {
      values: [
        'Hardware',
        'Software',
        'Office Space',
        'Equipment',
        'Infrastructure',
        'Cloud Services',
        'Tools',
        'Licenses',
        'Certifications',
        'Training',
        'Consulting',
        'Legal Services',
        'Marketing Budget',
        'Development Tools'
      ],
      message: 'Invalid resource type selected'
    }
  },

  // Current resources available (free text)
  currentResources: {
    type: String,
    trim: true,
    maxlength: [1000, 'Current resources description cannot exceed 1000 characters']
  },

  // Resource gaps (optional)
  resourceGaps: {
    type: String,
    trim: true,
    maxlength: [1000, 'Resource gaps description cannot exceed 1000 characters']
  },

  // Additional notes
  notes: {
    type: String,
    trim: true,
    maxlength: [2000, 'Notes cannot exceed 2000 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual to populate idea details
TeamResourceSchema.virtual('ideaDetails', {
  ref: 'Idea',
  localField: 'ideaId',
  foreignField: '_id',
  justOne: true
});

// Virtual to populate owner details
TeamResourceSchema.virtual('ownerDetails', {
  ref: 'User',
  localField: 'owner',
  foreignField: '_id',
  justOne: true,
  select: 'name email'
});

// Index for faster queries (other indexes defined at the end)

// Pre-save middleware to validate team member uniqueness
TeamResourceSchema.pre('save', function(next) {
  // Check for duplicate team member emails within the same team
  const emails = this.teamMembers
    .filter(member => member.email)
    .map(member => member.email);
  
  const uniqueEmails = [...new Set(emails)];
  if (emails.length !== uniqueEmails.length) {
    return next(new Error('Duplicate email addresses found in team members'));
  }
  
  next();
});

// Static method to find teams by idea
TeamResourceSchema.statics.findByIdea = function(ideaId) {
  return this.find({ ideaId })
    .populate('ideaDetails', 'title category')
    .populate('ownerDetails', 'name email')
    .sort({ createdAt: -1 });
};

// Static method to find teams by owner
TeamResourceSchema.statics.findByOwner = function(ownerId) {
  return this.find({ owner: ownerId })
    .populate('ideaDetails', 'title category')
    .sort({ createdAt: -1 });
};

// Instance method to get team size
TeamResourceSchema.methods.getTeamSize = function() {
  return this.teamMembers ? this.teamMembers.length : 0;
};

// Instance method to check if user is in team
TeamResourceSchema.methods.hasTeamMember = function(email) {
  return this.teamMembers.some(member => 
    member.email && member.email.toLowerCase() === email.toLowerCase()
  );
};

// Indexes for better query performance
TeamResourceSchema.index({ ideaId: 1 }, { unique: true });
TeamResourceSchema.index({ owner: 1 });
TeamResourceSchema.index({ coreSkills: 1 });
TeamResourceSchema.index({ resourcesNeeded: 1 });
TeamResourceSchema.index({ createdAt: -1 });

module.exports = mongoose.model('TeamResource', TeamResourceSchema);