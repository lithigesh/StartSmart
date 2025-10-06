import React, { useState, useEffect } from 'react';
import { businessAimAPI, ideasAPI } from '../../../services/api';

const BusinessAimForm = ({ onDataChange, onSuccess, onError, initialData = {}, isEditMode = false, ideaId = null }) => {
  const [formData, setFormData] = useState({
    ideaId: ideaId || '',
    businessModel: '',
    revenueStreams: [],
    targetMarket: '',
    marketSize: '',
    competitionAnalysis: '',
    pricingStrategy: '',
    salesStrategy: '',
    marketingStrategy: '',
    fundingRequirement: '',
    useOfFunds: '',
    financialProjections: '',
    keyMetrics: [],
    riskAssessment: '',
    mitigationStrategies: '',
    exitStrategy: '',
    timeline: '',
    milestones: [],
    ...initialData
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableIdeas, setAvailableIdeas] = useState([]);
  const [loadingIdeas, setLoadingIdeas] = useState(false);

  // Predefined revenue streams
  const availableRevenueStreams = [
    'Subscription',
    'One-time Purchase',
    'Freemium',
    'Advertising',
    'Commission/Marketplace',
    'Licensing',
    'Consulting/Services',
    'Data Monetization',
    'Hardware Sales',
    'Transaction Fees',
    'Affiliate Marketing',
    'Sponsorship'
  ];

  // Key metrics options
  const availableKeyMetrics = [
    'Monthly Recurring Revenue (MRR)',
    'Annual Recurring Revenue (ARR)',
    'Customer Acquisition Cost (CAC)',
    'Lifetime Value (LTV)',
    'Churn Rate',
    'Gross Margin',
    'Monthly Active Users (MAU)',
    'Daily Active Users (DAU)',
    'Conversion Rate',
    'User Engagement',
    'Revenue Growth Rate',
    'Market Share'
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
      if (name === 'revenueStreams') {
        setFormData(prev => ({
          ...prev,
          revenueStreams: checked 
            ? [...prev.revenueStreams, value]
            : prev.revenueStreams.filter(stream => stream !== value)
        }));
      } else if (name === 'keyMetrics') {
        setFormData(prev => ({
          ...prev,
          keyMetrics: checked 
            ? [...prev.keyMetrics, value]
            : prev.keyMetrics.filter(metric => metric !== value)
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

  const addMilestone = () => {
    setFormData(prev => ({
      ...prev,
      milestones: [
        ...prev.milestones,
        {
          title: '',
          description: '',
          timeline: '',
          metrics: ''
        }
      ]
    }));
  };

  const removeMilestone = (index) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index)
    }));
  };

  const updateMilestone = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.map((milestone, i) => 
        i === index ? { ...milestone, [field]: value } : milestone
      )
    }));

    // Clear milestone specific errors
    const errorKey = `milestone_${index}_${field}`;
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
      newErrors.ideaId = 'Please select an idea for this business aim plan';
    }

    // Business model validation
    if (!formData.businessModel.trim()) {
      newErrors.businessModel = 'Business model is required';
    } else if (formData.businessModel.length < 20) {
      newErrors.businessModel = 'Business model description must be at least 20 characters long';
    }

    // Revenue streams validation
    if (formData.revenueStreams.length === 0) {
      newErrors.revenueStreams = 'At least one revenue stream is required';
    }

    // Target market validation
    if (!formData.targetMarket.trim()) {
      newErrors.targetMarket = 'Target market is required';
    } else if (formData.targetMarket.length < 20) {
      newErrors.targetMarket = 'Target market description must be at least 20 characters long';
    }

    // Competition analysis validation
    if (!formData.competitionAnalysis.trim()) {
      newErrors.competitionAnalysis = 'Competition analysis is required';
    } else if (formData.competitionAnalysis.length < 50) {
      newErrors.competitionAnalysis = 'Competition analysis must be at least 50 characters long';
    }

    // Pricing strategy validation
    if (!formData.pricingStrategy.trim()) {
      newErrors.pricingStrategy = 'Pricing strategy is required';
    }

    // Funding requirement validation
    if (formData.fundingRequirement && isNaN(formData.fundingRequirement.replace(/[,$]/g, ''))) {
      newErrors.fundingRequirement = 'Funding requirement must be a valid number';
    }

    // Risk assessment validation
    if (!formData.riskAssessment.trim()) {
      newErrors.riskAssessment = 'Risk assessment is required';
    } else if (formData.riskAssessment.length < 30) {
      newErrors.riskAssessment = 'Risk assessment must be at least 30 characters long';
    }

    // Milestones validation
    formData.milestones.forEach((milestone, index) => {
      if (!milestone.title.trim()) {
        newErrors[`milestone_${index}_title`] = 'Milestone title is required';
      }
      if (!milestone.timeline.trim()) {
        newErrors[`milestone_${index}_timeline`] = 'Milestone timeline is required';
      }
    });

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

      console.log('=== BusinessAim Frontend Submission ===');
      console.log('Submit Data:', JSON.stringify(submitData, null, 2));

      let result;
      if (isEditMode && initialData._id) {
        // Update existing business aim
        result = await businessAimAPI.updateBusinessAim(initialData._id, submitData);
      } else {
        // Create new business aim
        result = await businessAimAPI.createBusinessAim(submitData);
      }

      console.log('API Result:', result);

      if (result.success) {
        // Success will be handled by parent component
        console.log('Business aim form submitted successfully:', result);
        if (onSuccess) {
          onSuccess(result);
        }
      } else {
        const errorMessage = result.message || 'Failed to submit business aim';
        setErrors({ submit: errorMessage });
        if (onError) {
          onError(errorMessage);
        }
      }
    } catch (error) {
      console.error('Error submitting business aim form:', error);
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
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          {isEditMode ? 'Edit Business Aim' : 'Business Aim & Strategy'}
        </h2>
        <p className="text-gray-400">
          Define your business model, market strategy, and financial objectives.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
                  Choose an idea to create business aim plan for *
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

        {/* Business Model Section */}
        <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Business Model</h3>
            
            {/* Business Model Description */}
            <div className="mb-4">
              <label htmlFor="businessModel" className="block text-sm font-medium text-gray-300 mb-1">
                Business Model Description *
              </label>
              <textarea
                id="businessModel"
                name="businessModel"
                value={formData.businessModel}
                onChange={handleInputChange}
                rows={4}
              className={`w-full px-3 py-2 border bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white ${
                errors.businessModel ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="Describe how your business will create, deliver, and capture value"
              required
            />
            {errors.businessModel && <p className="mt-1 text-sm text-red-400">{errors.businessModel}</p>}
          </div>

          {/* Revenue Streams */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Revenue Streams *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableRevenueStreams.map(stream => (
                <label key={stream} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="revenueStreams"
                    value={stream}
                    checked={formData.revenueStreams.includes(stream)}
                    onChange={handleInputChange}
                    className="rounded border-gray-600 text-blue-600 focus:ring-white"
                  />
                  <span className="text-sm text-gray-300">{stream}</span>
                </label>
              ))}
            </div>
            {errors.revenueStreams && <p className="mt-2 text-sm text-red-400">{errors.revenueStreams}</p>}
          </div>
        </div>

        {/* Market Analysis Section */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Market Analysis</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Target Market */}
            <div className="md:col-span-2">
              <label htmlFor="targetMarket" className="block text-sm font-medium text-gray-300 mb-1">
                Target Market *
              </label>
              <textarea
                id="targetMarket"
                name="targetMarket"
                value={formData.targetMarket}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-3 py-2 border bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white ${
                  errors.targetMarket ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="Define your target customer segments and market"
                required
              />
              {errors.targetMarket && <p className="mt-1 text-sm text-red-400">{errors.targetMarket}</p>}
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
                className="w-full px-3 py-2 border bg-gray-700 text-white border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                placeholder="e.g., $10B TAM, 100M potential customers"
              />
            </div>
          </div>

          {/* Competition Analysis */}
          <div className="mt-4">
            <label htmlFor="competitionAnalysis" className="block text-sm font-medium text-gray-300 mb-1">
              Competition Analysis *
            </label>
            <textarea
              id="competitionAnalysis"
              name="competitionAnalysis"
              value={formData.competitionAnalysis}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-3 py-2 border bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white ${
                errors.competitionAnalysis ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="Analyze your competitors, their strengths/weaknesses, and your competitive advantages"
              required
            />
            {errors.competitionAnalysis && <p className="mt-1 text-sm text-red-400">{errors.competitionAnalysis}</p>}
          </div>
        </div>

        {/* Strategy Section */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Strategy</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pricing Strategy */}
            <div>
              <label htmlFor="pricingStrategy" className="block text-sm font-medium text-gray-300 mb-1">
                Pricing Strategy *
              </label>
              <textarea
                id="pricingStrategy"
                name="pricingStrategy"
                value={formData.pricingStrategy}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-3 py-2 border bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white ${
                  errors.pricingStrategy ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="Describe your pricing model and strategy"
                required
              />
              {errors.pricingStrategy && <p className="mt-1 text-sm text-red-400">{errors.pricingStrategy}</p>}
            </div>

            {/* Sales Strategy */}
            <div>
              <label htmlFor="salesStrategy" className="block text-sm font-medium text-gray-300 mb-1">
                Sales Strategy (Optional)
              </label>
              <textarea
                id="salesStrategy"
                name="salesStrategy"
                value={formData.salesStrategy}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border bg-gray-700 text-white border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                placeholder="How will you sell your product/service?"
              />
            </div>
          </div>

          {/* Marketing Strategy */}
          <div className="mt-4">
            <label htmlFor="marketingStrategy" className="block text-sm font-medium text-gray-300 mb-1">
              Marketing Strategy (Optional)
            </label>
            <textarea
              id="marketingStrategy"
              name="marketingStrategy"
              value={formData.marketingStrategy}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border bg-gray-700 text-white border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="How will you market and promote your solution?"
            />
          </div>
        </div>

        {/* Financial Planning Section */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Financial Planning</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Funding Requirement */}
            <div>
              <label htmlFor="fundingRequirement" className="block text-sm font-medium text-gray-300 mb-1">
                Funding Requirement (Optional)
              </label>
              <input
                type="text"
                id="fundingRequirement"
                name="fundingRequirement"
                value={formData.fundingRequirement}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white ${
                  errors.fundingRequirement ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="e.g., $500,000"
              />
              {errors.fundingRequirement && <p className="mt-1 text-sm text-red-400">{errors.fundingRequirement}</p>}
            </div>

            {/* Use of Funds */}
            <div>
              <label htmlFor="useOfFunds" className="block text-sm font-medium text-gray-300 mb-1">
                Use of Funds (Optional)
              </label>
              <textarea
                id="useOfFunds"
                name="useOfFunds"
                value={formData.useOfFunds}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border bg-gray-700 text-white border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                placeholder="How will you use the funding?"
              />
            </div>
          </div>

          {/* Financial Projections */}
          <div className="mt-4">
            <label htmlFor="financialProjections" className="block text-sm font-medium text-gray-300 mb-1">
              Financial Projections (Optional)
            </label>
            <textarea
              id="financialProjections"
              name="financialProjections"
              value={formData.financialProjections}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border bg-gray-700 text-white border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Provide revenue and expense projections for the next 3-5 years"
            />
          </div>

          {/* Key Metrics */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Key Metrics to Track (Optional)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableKeyMetrics.map(metric => (
                <label key={metric} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="keyMetrics"
                    value={metric}
                    checked={formData.keyMetrics.includes(metric)}
                    onChange={handleInputChange}
                    className="rounded border-gray-600 text-blue-600 focus:ring-white"
                  />
                  <span className="text-sm text-gray-300">{metric}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Risk Management Section */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Risk Management</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Risk Assessment */}
            <div>
              <label htmlFor="riskAssessment" className="block text-sm font-medium text-gray-300 mb-1">
                Risk Assessment *
              </label>
              <textarea
                id="riskAssessment"
                name="riskAssessment"
                value={formData.riskAssessment}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-3 py-2 border bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white ${
                  errors.riskAssessment ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="Identify potential risks and challenges"
                required
              />
              {errors.riskAssessment && <p className="mt-1 text-sm text-red-400">{errors.riskAssessment}</p>}
            </div>

            {/* Mitigation Strategies */}
            <div>
              <label htmlFor="mitigationStrategies" className="block text-sm font-medium text-gray-300 mb-1">
                Mitigation Strategies (Optional)
              </label>
              <textarea
                id="mitigationStrategies"
                name="mitigationStrategies"
                value={formData.mitigationStrategies}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border bg-gray-700 text-white border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                placeholder="How will you mitigate identified risks?"
              />
            </div>
          </div>

          {/* Exit Strategy */}
          <div className="mt-4">
            <label htmlFor="exitStrategy" className="block text-sm font-medium text-gray-300 mb-1">
              Exit Strategy (Optional)
            </label>
            <textarea
              id="exitStrategy"
              name="exitStrategy"
              value={formData.exitStrategy}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-3 py-2 border bg-gray-700 text-white border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="What are your potential exit strategies?"
            />
          </div>
        </div>

        {/* Timeline & Milestones Section */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-black">Timeline & Milestones</h3>
            <button
              type="button"
              onClick={addMilestone}
              className="px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
            >
              Add Milestone
            </button>
          </div>

          {/* Overall Timeline */}
          <div className="mb-4">
            <label htmlFor="timeline" className="block text-sm font-medium text-gray-300 mb-1">
              Overall Timeline (Optional)
            </label>
            <input
              type="text"
              id="timeline"
              name="timeline"
              value={formData.timeline}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border bg-gray-700 text-white border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="e.g., 18 months to market, 3 years to profitability"
            />
          </div>

          {/* Milestones */}
          {formData.milestones.length === 0 ? (
            <div className="text-center py-4 text-gray-400">
              <p>No milestones added yet.</p>
              <p className="text-sm">Click "Add Milestone" to define key achievements.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {formData.milestones.map((milestone, index) => (
                <div key={index} className="bg-gray-900 p-4 rounded-md border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-md font-medium text-black">Milestone #{index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeMilestone(index)}
                      className="text-red-400 hover:text-red-800 focus:outline-none"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={milestone.title}
                        onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                        className={`w-full px-3 py-2 border bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white ${
                          errors[`milestone_${index}_title`] ? 'border-red-500' : 'border-gray-600'
                        }`}
                        placeholder="Milestone title"
                        required
                      />
                      {errors[`milestone_${index}_title`] && (
                        <p className="mt-1 text-sm text-red-400">{errors[`milestone_${index}_title`]}</p>
                      )}
                    </div>

                    {/* Timeline */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Timeline *
                      </label>
                      <input
                        type="text"
                        value={milestone.timeline}
                        onChange={(e) => updateMilestone(index, 'timeline', e.target.value)}
                        className={`w-full px-3 py-2 border bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white ${
                          errors[`milestone_${index}_timeline`] ? 'border-red-500' : 'border-gray-600'
                        }`}
                        placeholder="e.g., Month 6, Q2 2024"
                        required
                      />
                      {errors[`milestone_${index}_timeline`] && (
                        <p className="mt-1 text-sm text-red-400">{errors[`milestone_${index}_timeline`]}</p>
                      )}
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Description
                      </label>
                      <textarea
                        value={milestone.description}
                        onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border bg-gray-700 text-white border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                        placeholder="Describe this milestone"
                      />
                    </div>

                    {/* Success Metrics */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Success Metrics
                      </label>
                      <input
                        type="text"
                        value={milestone.metrics}
                        onChange={(e) => updateMilestone(index, 'metrics', e.target.value)}
                        className="w-full px-3 py-2 border bg-gray-700 text-white border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                        placeholder="How will you measure success? (e.g., 1000 users, $10K revenue)"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
            {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Business Aim' : 'Save Business Aim')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BusinessAimForm;