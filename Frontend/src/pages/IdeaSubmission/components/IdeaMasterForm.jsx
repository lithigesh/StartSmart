import React, { useState, useEffect } from 'react';
import { ideasAPI } from '../../../services/api';

const IdeaMasterForm = ({ onDataChange, onSuccess, onError, initialData = {}, isEditMode = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    stage: 'Concept',
    targetAudience: '',
    problemStatement: '',
    solution: '',
    uniqueValueProposition: '',
    marketSize: '',
    competitiveAdvantage: '',
    attachments: null,
    ...initialData
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Technology',
    'Healthcare',
    'Education',
    'Finance',
    'E-commerce',
    'Social Impact',
    'Environment',
    'Entertainment',
    'Transportation',
    'Food & Beverage',
    'Real Estate',
    'Fashion',
    'Sports',
    'Energy',
    'Agriculture',
    'Other'
  ];

  const stages = [
    'Concept',
    'Research',
    'Prototype',
    'MVP',
    'Beta',
    'Launch',
    'Growth',
    'Scale'
  ];

  useEffect(() => {
    // Notify parent component of data changes
    if (onDataChange) {
      onDataChange(formData);
    }
  }, [formData, onDataChange]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'attachments') {
      setFormData(prev => ({
        ...prev,
        [name]: files
      }));
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

  const validateForm = () => {
    const newErrors = {};

    // Required field validations
    if (!formData.title.trim()) {
      newErrors.title = 'Idea title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters long';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters long';
    } else if (formData.description.length > 2000) {
      newErrors.description = 'Description must be less than 2000 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.problemStatement.trim()) {
      newErrors.problemStatement = 'Problem statement is required';
    } else if (formData.problemStatement.length < 20) {
      newErrors.problemStatement = 'Problem statement must be at least 20 characters long';
    } else if (formData.problemStatement.length > 1000) {
      newErrors.problemStatement = 'Problem statement must be less than 1000 characters';
    }

    if (!formData.solution.trim()) {
      newErrors.solution = 'Solution description is required';
    } else if (formData.solution.length < 20) {
      newErrors.solution = 'Solution description must be at least 20 characters long';
    } else if (formData.solution.length > 1000) {
      newErrors.solution = 'Solution description must be less than 1000 characters';
    }

    if (!formData.targetAudience.trim()) {
      newErrors.targetAudience = 'Target audience is required';
    } else if (formData.targetAudience.length < 10) {
      newErrors.targetAudience = 'Target audience must be at least 10 characters long';
    } else if (formData.targetAudience.length > 500) {
      newErrors.targetAudience = 'Target audience must be less than 500 characters';
    }

    if (!formData.uniqueValueProposition.trim()) {
      newErrors.uniqueValueProposition = 'Unique value proposition is required';
    }

    // File validation
    if (formData.attachments && formData.attachments.length > 0) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = [
        'application/pdf',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
        'image/gif'
      ];

      for (let file of formData.attachments) {
        if (file.size > maxSize) {
          newErrors.attachments = 'File size must be less than 10MB';
          break;
        }
        if (!allowedTypes.includes(file.type)) {
          newErrors.attachments = 'Invalid file type. Allowed: PDF, PPT, DOC, Images';
          break;
        }
      }

      if (formData.attachments.length > 5) {
        newErrors.attachments = 'Maximum 5 files allowed';
      }
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
      const submitData = {
        // Basic Information from form
        title: formData.title,
        description: formData.description,
        category: formData.category,
        targetAudience: formData.targetAudience,
        // Problem & Solution from form
        problemStatement: formData.problemStatement,
        solution: formData.solution,
        // Market info from form
        marketSize: formData.marketSize,
        // Additional info from form
        uniqueValueProposition: formData.uniqueValueProposition,
        competitiveAdvantage: formData.competitiveAdvantage,
        ...(formData.attachments && formData.attachments.length > 0 && { attachments: formData.attachments }),
        
        // Required fields with default values (will be filled in other forms)
        elevatorPitch: `${formData.title} - A solution for ${formData.targetAudience || 'target market'}` || 'Innovative solution to be detailed',
        
        // Optional fields that can be empty
        competitors: '',
        revenueStreams: '',
        pricingStrategy: '',
        keyPartnerships: '',
        goToMarketStrategy: '',
        scalabilityPlan: '',
        technologyStack: '',
        developmentRoadmap: '',
        challengesAnticipated: '',
        ecoFriendlyPractices: '',
        socialImpact: '',
        fundingRequirements: '',
        useOfFunds: '',
        equityOffer: ''
      };

      // Debug logging
      console.log('Submitting idea with data:', submitData);
      console.log('Field lengths:', {
        title: submitData.title?.length,
        elevatorPitch: submitData.elevatorPitch?.length,
        description: submitData.description?.length,
        targetAudience: submitData.targetAudience?.length,
        problemStatement: submitData.problemStatement?.length,
        solution: submitData.solution?.length
      });

      let result;
      if (isEditMode && initialData._id) {
        // Update existing idea
        result = await ideasAPI.updateIdea(initialData._id, submitData);
      } else {
        // Create new idea
        result = await ideasAPI.submitIdea(submitData);
      }

      if (result.success) {
        // Success will be handled by parent component
        console.log('Idea form submitted successfully:', result);
        if (onSuccess) {
          onSuccess(result);
        }
      } else {
        const errorMessage = result.message || 'Failed to submit idea';
        setErrors({ submit: errorMessage });
        if (onError) {
          onError(errorMessage);
        }
      }
    } catch (error) {
      console.error('Error submitting idea form:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        submitData: submitData
      });
      const errorMessage = error.message || 'An error occurred while submitting the form';
      setErrors({ submit: errorMessage });
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          {isEditMode ? 'Edit Idea Master' : 'Idea Master'}
        </h2>
        <p className="text-gray-400">
          Define the core concept, problem, and solution for your innovative idea.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Section */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Idea Title */}
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                Idea Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-white ${
                  errors.title ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="Enter a compelling title for your idea"
                maxLength={100}
                required
              />
              {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
              <p className="mt-1 text-xs text-gray-400">{formData.title.length}/100 characters</p>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-white ${
                  errors.category ? 'border-red-500' : 'border-gray-600'
                }`}
                required
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-400">{errors.category}</p>}
            </div>

            {/* Stage */}
            <div>
              <label htmlFor="stage" className="block text-sm font-medium text-gray-300 mb-1">
                Current Stage
              </label>
              <select
                id="stage"
                name="stage"
                value={formData.stage}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-white"
              >
                {stages.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="mt-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-white ${
                errors.description ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="Provide a detailed description of your idea (minimum 50 characters)"
              maxLength={2000}
              required
            />
            {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description}</p>}
            <p className="mt-1 text-xs text-gray-400">{formData.description.length}/2000 characters</p>
          </div>
        </div>

        {/* Problem & Solution Section */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Problem & Solution</h3>
          
          {/* Problem Statement */}
          <div className="mb-4">
            <label htmlFor="problemStatement" className="block text-sm font-medium text-gray-300 mb-1">
              Problem Statement *
            </label>
            <textarea
              id="problemStatement"
              name="problemStatement"
              value={formData.problemStatement}
              onChange={handleInputChange}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-white ${
                errors.problemStatement ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="What problem does your idea solve?"
              required
            />
            {errors.problemStatement && <p className="mt-1 text-sm text-red-400">{errors.problemStatement}</p>}
          </div>

          {/* Solution */}
          <div className="mb-4">
            <label htmlFor="solution" className="block text-sm font-medium text-gray-300 mb-1">
              Solution *
            </label>
            <textarea
              id="solution"
              name="solution"
              value={formData.solution}
              onChange={handleInputChange}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-white ${
                errors.solution ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="How does your idea solve the problem?"
              required
            />
            {errors.solution && <p className="mt-1 text-sm text-red-400">{errors.solution}</p>}
          </div>

          {/* Unique Value Proposition */}
          <div className="mb-4">
            <label htmlFor="uniqueValueProposition" className="block text-sm font-medium text-gray-300 mb-1">
              Unique Value Proposition *
            </label>
            <textarea
              id="uniqueValueProposition"
              name="uniqueValueProposition"
              value={formData.uniqueValueProposition}
              onChange={handleInputChange}
              rows={2}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-white ${
                errors.uniqueValueProposition ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="What makes your solution unique?"
              required
            />
            {errors.uniqueValueProposition && <p className="mt-1 text-sm text-red-400">{errors.uniqueValueProposition}</p>}
          </div>
        </div>

        {/* Market Information Section */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Market Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Target Audience */}
            <div>
              <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-300 mb-1">
                Target Audience *
              </label>
              <input
                type="text"
                id="targetAudience"
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-white ${
                  errors.targetAudience ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="Who is your target customer?"
                required
              />
              {errors.targetAudience && <p className="mt-1 text-sm text-red-400">{errors.targetAudience}</p>}
            </div>

            {/* Market Size */}
            <div>
              <label htmlFor="marketSize" className="block text-sm font-medium text-gray-300 mb-1">
                Market Size (Optional)
              </label>
              <input
                type="text"
                id="marketSize"
                name="marketSize"
                value={formData.marketSize}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-white"
                placeholder="e.g., $1B TAM, 10M potential users"
              />
            </div>
          </div>

          {/* Competitive Advantage */}
          <div className="mt-4">
            <label htmlFor="competitiveAdvantage" className="block text-sm font-medium text-gray-300 mb-1">
              Competitive Advantage (Optional)
            </label>
            <textarea
              id="competitiveAdvantage"
              name="competitiveAdvantage"
              value={formData.competitiveAdvantage}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="What advantages do you have over competitors?"
            />
          </div>
        </div>

        {/* Attachments Section */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Supporting Documents</h3>
          
          <div>
            <label htmlFor="attachments" className="block text-sm font-medium text-gray-300 mb-1">
              Attachments (Optional)
            </label>
            <input
              type="file"
              id="attachments"
              name="attachments"
              onChange={handleInputChange}
              multiple
              accept=".pdf,.ppt,.pptx,.doc,.docx,.jpg,.jpeg,.png,.gif"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-white ${
                errors.attachments ? 'border-red-500' : 'border-gray-600'
              }`}
            />
            {errors.attachments && <p className="mt-1 text-sm text-red-400">{errors.attachments}</p>}
            <p className="mt-1 text-xs text-gray-400">
              Supported formats: PDF, PPT, DOC, Images. Max 5 files, 10MB each.
            </p>
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
            {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Idea' : 'Save Idea')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default IdeaMasterForm;