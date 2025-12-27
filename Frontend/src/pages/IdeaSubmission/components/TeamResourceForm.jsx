import React, { useState, useEffect } from 'react';
import { teamResourceAPI, ideasAPI } from '../../../services/api';

const TeamResourceForm = ({ onDataChange, onSuccess, onError, initialData = {}, isEditMode = false, ideaId = null }) => {
  // Sample data for quick testing and demonstration
  const sampleData = {
    teamMembers: [
      {
        name: 'Sarah Chen',
        role: 'CEO & Product Manager',
        skills: ['Management', 'Product Development', 'Marketing'],
        experience: '8 years in product management at tech startups, previously led teams at two successful exits'
      },
      {
        name: 'Marcus Rodriguez',
        role: 'CTO & Lead Developer',
        skills: ['Technology', 'Product Development'],
        experience: '10 years full-stack development, expert in AI/ML, former senior engineer at major tech companies'
      },
      {
        name: 'Emily Watson',
        role: 'Head of Marketing & Sales',
        skills: ['Marketing', 'Sales', 'Business Development'],
        experience: '6 years digital marketing, specialist in growth hacking and customer acquisition strategies'
      }
    ],
    coreSkills: ['Technology', 'Marketing', 'Product Development', 'Management'],
    resourcesNeeded: [
      {
        type: 'Cloud Services',
        description: 'AWS infrastructure for scalable backend services and AI model hosting',
        estimatedCost: 15000,
        priority: 'High'
      },
      {
        type: 'Software',
        description: 'Professional development tools, design software, and project management platforms',
        estimatedCost: 8000,
        priority: 'High'
      },
      {
        type: 'Office Space',
        description: 'Co-working space for team collaboration and client meetings',
        estimatedCost: 12000,
        priority: 'Medium'
      }
    ],
    skillsGap: 'We need to strengthen our capabilities in data science and machine learning model optimization. Additionally, we require expertise in regulatory compliance for agricultural technology and established relationships with farming cooperatives for market validation and distribution channels.',
    resourceBudget: '150000',
    teamStructure: 'Flat organizational structure with cross-functional teams. Each core team member leads their domain while contributing to other areas. We believe in collaborative decision-making with clear accountability. Weekly all-hands meetings ensure alignment, and bi-weekly one-on-ones maintain individual growth focus.',
    collaborationPreferences: 'We prefer agile methodologies with 2-week sprints, daily standups, and regular retrospectives. Strong emphasis on transparent communication through Slack and Notion. We value work-life balance and encourage asynchronous collaboration across time zones while maintaining core collaboration hours.',
    remoteWorkPolicy: 'Hybrid',
    timeline: '18 months to full market launch: 6 months MVP development and testing, 6 months pilot program with select farming partners, 6 months full product launch and scaling. Key milestones include prototype completion (month 3), beta testing (month 9), and commercial launch (month 18).'
  };

  const [formData, setFormData] = useState({
    ideaId: ideaId || '',
    teamMembers: initialData.teamMembers || sampleData.teamMembers,
    coreSkills: initialData.coreSkills || sampleData.coreSkills,
    resourcesNeeded: initialData.resourcesNeeded || sampleData.resourcesNeeded,
    skillsGap: initialData.skillsGap || sampleData.skillsGap,
    resourceBudget: initialData.resourceBudget || sampleData.resourceBudget,
    teamStructure: initialData.teamStructure || sampleData.teamStructure,
    collaborationPreferences: initialData.collaborationPreferences || sampleData.collaborationPreferences,
    remoteWorkPolicy: initialData.remoteWorkPolicy || sampleData.remoteWorkPolicy,
    timeline: initialData.timeline || sampleData.timeline,
    ...initialData
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableIdeas, setAvailableIdeas] = useState([]);
  const [loadingIdeas, setLoadingIdeas] = useState(false);

  // Function to clear form data
  const clearForm = () => {
    setFormData({
      ideaId: ideaId || '',
      teamMembers: [],
      coreSkills: [],
      resourcesNeeded: [],
      skillsGap: '',
      resourceBudget: '',
      teamStructure: '',
      collaborationPreferences: '',
      remoteWorkPolicy: 'Flexible',
      timeline: ''
    });
    setErrors({});
  };

  // Function to load fresh sample data
  const loadSampleData = () => {
    setFormData({
      ideaId: ideaId || '',
      ...sampleData
    });
    setErrors({});
  };

  // Predefined core skills - matching backend enum
  const availableCoreSkills = [
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
  ];

  // Resource types - matching backend enum
  const resourceTypes = [
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
  ];

  const remoteWorkOptions = [
    'Fully Remote',
    'Hybrid',
    'Flexible',
    'On-site Only'
  ];

  // Fetch available ideas on component mount
  useEffect(() => {
    const fetchIdeas = async () => {
      if (!ideaId) { // Only fetch if not bound to a specific idea
        setLoadingIdeas(true);
        try {
          const response = await ideasAPI.getUserIdeas();
          if (response.success) {
            setAvailableIdeas(response.data || []);
          }
        } catch (error) {
          console.error('Error fetching ideas:', error);
          setErrors(prev => ({ ...prev, ideasFetch: 'Failed to load ideas' }));
        } finally {
          setLoadingIdeas(false);
        }
      }
    };

    fetchIdeas();
  }, [ideaId]);

  useEffect(() => {
    // Notify parent component of data changes
    if (onDataChange) {
      onDataChange(formData);
    }
  }, [formData, onDataChange]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'coreSkills') {
        setFormData(prev => ({
          ...prev,
          coreSkills: checked 
            ? [...prev.coreSkills, value]
            : prev.coreSkills.filter(skill => skill !== value)
        }));
      } else if (name === 'resourcesNeeded') {
        setFormData(prev => ({
          ...prev,
          resourcesNeeded: checked 
            ? [...prev.resourcesNeeded, value]
            : prev.resourcesNeeded.filter(resource => resource !== value)
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const addTeamMember = () => {
    setFormData(prev => ({
      ...prev,
      teamMembers: [
        ...prev.teamMembers,
        {
          name: '',
          role: '',
          expertise: '',
          email: '',
          linkedin: '',
          commitment: 'Full-time',
          equity: ''
        }
      ]
    }));
  };

  const removeTeamMember = (index) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index)
    }));
  };

  const updateTeamMember = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map((member, i) => 
        i === index ? { ...member, [field]: value } : member
      )
    }));

    // Clear team member specific errors
    const errorKey = `teamMember_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({
        ...prev,
        [errorKey]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Idea selection validation (only if not bound to specific idea)
    if (!ideaId && !formData.ideaId) {
      newErrors.ideaId = 'Please select an idea for this team resource plan';
    }

    // Team members validation
    if (formData.teamMembers.length === 0) {
      newErrors.teamMembers = 'At least one team member is required';
    } else {
      formData.teamMembers.forEach((member, index) => {
        if (!member.name.trim()) {
          newErrors[`teamMember_${index}_name`] = 'Name is required';
        }
        if (!member.role.trim()) {
          newErrors[`teamMember_${index}_role`] = 'Role is required';
        }
        if (!member.expertise.trim()) {
          newErrors[`teamMember_${index}_expertise`] = 'Expertise is required';
        }
        if (member.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)) {
          newErrors[`teamMember_${index}_email`] = 'Invalid email format';
        }
        if (member.linkedin && !member.linkedin.includes('linkedin.com')) {
          newErrors[`teamMember_${index}_linkedin`] = 'Please enter a valid LinkedIn URL';
        }
        if (member.equity && (isNaN(member.equity) || member.equity < 0 || member.equity > 100)) {
          newErrors[`teamMember_${index}_equity`] = 'Equity must be a number between 0 and 100';
        }
      });
    }

    // Core skills validation
    if (formData.coreSkills.length === 0) {
      newErrors.coreSkills = 'At least one core skill is required';
    }

    // Resources needed validation
    if (formData.resourcesNeeded.length === 0) {
      newErrors.resourcesNeeded = 'At least one resource type is required';
    }

    // Skills gap validation
    if (!formData.skillsGap.trim()) {
      newErrors.skillsGap = 'Skills gap analysis is required';
    } else if (formData.skillsGap.length < 20) {
      newErrors.skillsGap = 'Skills gap analysis must be at least 20 characters long';
    }

    // Resource budget validation
    if (formData.resourceBudget && isNaN(formData.resourceBudget.replace(/[,$]/g, ''))) {
      newErrors.resourceBudget = 'Resource budget must be a valid number';
    }

    // Team structure validation
    if (formData.teamStructure && formData.teamStructure.length < 10) {
      newErrors.teamStructure = 'Team structure description must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Ensure ideaId is set
      const submitData = {
        ...formData,
        ideaId: formData.ideaId || ideaId
      };

      let result;
      if (isEditMode && initialData._id) {
        // Update existing team resource
        result = await teamResourceAPI.updateTeamResource(initialData._id, submitData);
      } else {
        // Create new team resource
        result = await teamResourceAPI.createTeamResource(submitData);
      }

      if (result.success) {
        // Success will be handled by parent component
        console.log('Team resource form submitted successfully:', result);
        if (onSuccess) {
          onSuccess(result);
        }
      } else {
        const errorMessage = result.message || 'Failed to submit team resource';
        setErrors({ submit: errorMessage });
        if (onError) {
          onError(errorMessage);
        }
      }
    } catch (error) {
      console.error('Error submitting team resource form:', error);
      const errorMessage = 'An error occurred while submitting the form';
      setErrors({ submit: errorMessage });
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white font-manrope mb-3">
                {isEditMode ? 'Edit Team & Resources' : 'Team & Resource Management'}
              </h2>
              <p className="text-white/70 font-manrope text-lg">
                Define your team structure, skills, and resource requirements for your idea.
              </p>
              {!isEditMode && (
                <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <p className="text-blue-300 font-manrope text-sm">
                    💡 <strong>Sample data has been pre-loaded</strong> to help you get started quickly. You can modify any field or use the "Clear Form" button to start fresh.
                  </p>
                </div>
              )}
            </div>
            
            {/* Quick Action Buttons */}
            {!isEditMode && (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={clearForm}
                  className="px-4 py-2 bg-white/[0.05] hover:bg-white/[0.08] text-white/70 hover:text-white text-sm rounded-lg transition-all duration-300 border border-white/10 hover:border-white/20 font-manrope"
                >
                  🗑️ Clear Form
                </button>
                <button
                  type="button"
                  onClick={loadSampleData}
                  className="px-4 py-2 bg-blue-600/80 hover:bg-blue-600 text-white text-sm rounded-lg transition-all duration-300 font-manrope shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  🚀 Load Sample Data
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>
        <div className="relative z-10 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
        {/* Idea Selection Section - Only show if not bound to specific idea */}
        {!ideaId && (
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Select an Idea</h3>
            
            {loadingIdeas ? (
              <div className="text-gray-400">Loading your ideas...</div>
            ) : availableIdeas.length === 0 ? (
              <div className="p-4 bg-yellow-900 border border-yellow-500 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className="text-yellow-400 text-xl">⚠️</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-yellow-400">
                      No ideas found. Please create an idea first using the <strong>Idea Master Form</strong>.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Choose an idea to create team resource plan for *
                </label>
                <select
                  name="ideaId"
                  value={formData.ideaId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select an idea...</option>
                  {availableIdeas.map((idea) => (
                    <option key={idea._id} value={idea._id}>
                      {idea.title || idea.problemTitle || 'Untitled Idea'}
                    </option>
                  ))}
                </select>
                {errors.ideaId && (
                  <p className="mt-1 text-sm text-red-400">{errors.ideaId}</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Team Members Section */}
        <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Team Members</h3>
              <button
                type="button"
                onClick={addTeamMember}
                className="px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
              >
              Add Team Member
            </button>
          </div>

          {formData.teamMembers.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>No team members added yet.</p>
              <p className="text-sm">Click "Add Team Member" to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {formData.teamMembers.map((member, index) => (
                <div key={index} className="bg-gray-900 p-4 rounded-md border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-md font-medium text-black">Team Member #{index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeTeamMember(index)}
                      className="text-red-400 hover:text-red-800 focus:outline-none"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                        className={`w-full px-3 py-2 border bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white ${
                          errors[`teamMember_${index}_name`] ? 'border-red-500' : 'border-gray-600'
                        }`}
                        placeholder="Full name"
                        required
                      />
                      {errors[`teamMember_${index}_name`] && (
                        <p className="mt-1 text-sm text-red-400">{errors[`teamMember_${index}_name`]}</p>
                      )}
                    </div>

                    {/* Role */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Role *
                      </label>
                      <input
                        type="text"
                        value={member.role}
                        onChange={(e) => updateTeamMember(index, 'role', e.target.value)}
                        className={`w-full px-3 py-2 border bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white ${
                          errors[`teamMember_${index}_role`] ? 'border-red-500' : 'border-gray-600'
                        }`}
                        placeholder="e.g., Co-founder, CTO, Lead Developer"
                        required
                      />
                      {errors[`teamMember_${index}_role`] && (
                        <p className="mt-1 text-sm text-red-400">{errors[`teamMember_${index}_role`]}</p>
                      )}
                    </div>

                    {/* Expertise */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Expertise *
                      </label>
                      <input
                        type="text"
                        value={member.expertise}
                        onChange={(e) => updateTeamMember(index, 'expertise', e.target.value)}
                        className={`w-full px-3 py-2 border bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white ${
                          errors[`teamMember_${index}_expertise`] ? 'border-red-500' : 'border-gray-600'
                        }`}
                        placeholder="Key skills and expertise areas"
                        required
                      />
                      {errors[`teamMember_${index}_expertise`] && (
                        <p className="mt-1 text-sm text-red-400">{errors[`teamMember_${index}_expertise`]}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={member.email}
                        onChange={(e) => updateTeamMember(index, 'email', e.target.value)}
                        className={`w-full px-3 py-2 border bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white ${
                          errors[`teamMember_${index}_email`] ? 'border-red-500' : 'border-gray-600'
                        }`}
                        placeholder="Email address"
                      />
                      {errors[`teamMember_${index}_email`] && (
                        <p className="mt-1 text-sm text-red-400">{errors[`teamMember_${index}_email`]}</p>
                      )}
                    </div>

                    {/* LinkedIn */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        LinkedIn Profile
                      </label>
                      <input
                        type="url"
                        value={member.linkedin}
                        onChange={(e) => updateTeamMember(index, 'linkedin', e.target.value)}
                        className={`w-full px-3 py-2 border bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white ${
                          errors[`teamMember_${index}_linkedin`] ? 'border-red-500' : 'border-gray-600'
                        }`}
                        placeholder="LinkedIn profile URL"
                      />
                      {errors[`teamMember_${index}_linkedin`] && (
                        <p className="mt-1 text-sm text-red-400">{errors[`teamMember_${index}_linkedin`]}</p>
                      )}
                    </div>

                    {/* Commitment */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Commitment Level
                      </label>
                      <select
                        value={member.commitment}
                        onChange={(e) => updateTeamMember(index, 'commitment', e.target.value)}
                        className="w-full px-3 py-2 border bg-gray-700 text-white border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Consultant">Consultant</option>
                        <option value="Advisor">Advisor</option>
                      </select>
                    </div>

                    {/* Equity */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Equity % (Optional)
                      </label>
                      <input
                        type="number"
                        value={member.equity}
                        onChange={(e) => updateTeamMember(index, 'equity', e.target.value)}
                        className={`w-full px-3 py-2 border bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white ${
                          errors[`teamMember_${index}_equity`] ? 'border-red-500' : 'border-gray-600'
                        }`}
                        placeholder="0-100"
                        min="0"
                        max="100"
                        step="0.1"
                      />
                      {errors[`teamMember_${index}_equity`] && (
                        <p className="mt-1 text-sm text-red-400">{errors[`teamMember_${index}_equity`]}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {errors.teamMembers && <p className="mt-2 text-sm text-red-400">{errors.teamMembers}</p>}
        </div>

        {/* Core Skills Section */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Core Skills *</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {availableCoreSkills.map(skill => (
              <label key={skill} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="coreSkills"
                  value={skill}
                  checked={formData.coreSkills.includes(skill)}
                  onChange={handleInputChange}
                  className="rounded border-gray-600 text-blue-600 focus:ring-white"
                />
                <span className="text-sm text-gray-300">{skill}</span>
              </label>
            ))}
          </div>
          {errors.coreSkills && <p className="mt-2 text-sm text-red-400">{errors.coreSkills}</p>}
        </div>

        {/* Skills Gap Analysis */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Skills Gap Analysis</h3>
          <div>
            <label htmlFor="skillsGap" className="block text-sm font-medium text-gray-300 mb-1">
              Skills Gap Description *
            </label>
            <textarea
              id="skillsGap"
              name="skillsGap"
              value={formData.skillsGap}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-3 py-2 border bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white ${
                errors.skillsGap ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="Describe what skills or expertise your team currently lacks and needs to acquire"
              required
            />
            {errors.skillsGap && <p className="mt-1 text-sm text-red-400">{errors.skillsGap}</p>}
          </div>
        </div>

        {/* Resources Needed Section */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Resources Needed *</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {resourceTypes.map(resource => (
              <label key={resource} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="resourcesNeeded"
                  value={resource}
                  checked={formData.resourcesNeeded.includes(resource)}
                  onChange={handleInputChange}
                  className="rounded border-gray-600 text-blue-600 focus:ring-white"
                />
                <span className="text-sm text-gray-300">{resource}</span>
              </label>
            ))}
          </div>
          {errors.resourcesNeeded && <p className="mt-2 text-sm text-red-400">{errors.resourcesNeeded}</p>}
        </div>

        {/* Additional Information Section */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Additional Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Resource Budget */}
            <div>
              <label htmlFor="resourceBudget" className="block text-sm font-medium text-gray-300 mb-1">
                Resource Budget (Optional)
              </label>
              <input
                type="text"
                id="resourceBudget"
                name="resourceBudget"
                value={formData.resourceBudget}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white ${
                  errors.resourceBudget ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="e.g., $50,000 for initial setup"
              />
              {errors.resourceBudget && <p className="mt-1 text-sm text-red-400">{errors.resourceBudget}</p>}
            </div>

            {/* Remote Work Policy */}
            <div>
              <label htmlFor="remoteWorkPolicy" className="block text-sm font-medium text-gray-300 mb-1">
                Remote Work Policy
              </label>
              <select
                id="remoteWorkPolicy"
                name="remoteWorkPolicy"
                value={formData.remoteWorkPolicy}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border bg-gray-700 text-white border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
              >
                {remoteWorkOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Team Structure */}
          <div className="mt-4">
            <label htmlFor="teamStructure" className="block text-sm font-medium text-gray-300 mb-1">
              Team Structure & Organization (Optional)
            </label>
            <textarea
              id="teamStructure"
              name="teamStructure"
              value={formData.teamStructure}
              onChange={handleInputChange}
              rows={3}
              className={`w-full px-3 py-2 border bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white ${
                errors.teamStructure ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="Describe how your team is organized and how members will collaborate"
            />
            {errors.teamStructure && <p className="mt-1 text-sm text-red-400">{errors.teamStructure}</p>}
          </div>

          {/* Collaboration Preferences */}
          <div className="mt-4">
            <label htmlFor="collaborationPreferences" className="block text-sm font-medium text-gray-300 mb-1">
              Collaboration Preferences (Optional)
            </label>
            <textarea
              id="collaborationPreferences"
              name="collaborationPreferences"
              value={formData.collaborationPreferences}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-3 py-2 border bg-gray-700 text-white border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Preferred tools, methodologies, communication styles, etc."
            />
          </div>

          {/* Timeline */}
          <div className="mt-4">
            <label htmlFor="timeline" className="block text-sm font-medium text-gray-300 mb-1">
              Development Timeline (Optional)
            </label>
            <input
              type="text"
              id="timeline"
              name="timeline"
              value={formData.timeline}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border bg-gray-700 text-white border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="e.g., 6 months MVP, 12 months full launch"
            />
          </div>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-400">{errors.submit}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 bg-white text-black rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Team & Resources' : 'Save Team & Resources')}
          </button>
        </div>
      </form>
        </div>
      </div>
    </div>
  );
};

export default TeamResourceForm;