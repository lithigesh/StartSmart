import React, { useState, useEffect } from 'react';
import { businessAimAPI, ideasAPI } from '../../../services/api';

const BusinessAimForm = ({ onDataChange, onSuccess, onError, initialData = {}, isEditMode = false, ideaId = null }) => {
  // Sample data for quick testing and demonstration
  const sampleData = {
    businessModel: 'SaaS (Software as a Service) with tiered subscription plans targeting agricultural businesses and individual farmers. Revenue generated through monthly/annual subscriptions, premium features, and consulting services.',
    revenueStreams: ['Subscription', 'Consulting/Services', 'Licensing'],
    targetMarket: 'Primary: Small to medium agricultural businesses and tech-forward farmers in North America and Europe. Secondary: Agricultural cooperatives, urban farming initiatives, and agricultural technology integrators seeking AI-powered solutions.',
    marketSize: '$12.8B vertical farming market growing at 24% CAGR, with $4.2B in AI agricultural applications. Target addressable market of 2.4M farms in North America and 10.8M in Europe, representing $850M immediate opportunity.',
    competitionAnalysis: 'Main competitors include AeroFarms, Plenty, and Iron Ox in hardware-focused solutions. Our competitive advantage lies in AI-powered optimization software that works with existing infrastructure, 60% lower cost than hardware-heavy alternatives, and faster deployment times.',
    pricingStrategy: 'Freemium model: Basic plan free (up to 5 plants), Professional $29/month (unlimited plants + basic AI), Enterprise $99/month (advanced AI + analytics + support). Custom enterprise pricing for large operations. Annual plans offer 20% discount.',
    salesStrategy: 'Digital-first approach with content marketing, SEO, and social media. Partner with agricultural suppliers and equipment manufacturers. Attend agricultural trade shows and conferences. Referral program for existing customers. Direct sales team for enterprise accounts.',
    marketingStrategy: 'Inbound marketing through educational content about urban farming and AI technology. Partnerships with gardening influencers and sustainability advocates. Free webinars and workshops. Social proof through customer success stories and case studies.',
    fundingRequirement: '750000',
    useOfFunds: 'Product Development (40% - $300K): AI algorithm refinement, mobile app enhancement, IoT integration. Marketing & Sales (30% - $225K): Digital marketing campaigns, trade show participation, sales team expansion. Operations (20% - $150K): Infrastructure scaling, customer support, quality assurance. Legal & Compliance (10% - $75K): Patent applications, regulatory compliance, legal documentation.',
    financialProjections: 'Year 1: $120K revenue, 400 customers. Year 2: $480K revenue, 1,600 customers. Year 3: $1.2M revenue, 3,500 customers. Break-even expected month 18. Projected 15% monthly growth rate after initial traction period.',
    keyMetrics: ['Monthly Recurring Revenue (MRR)', 'Customer Acquisition Cost (CAC)', 'Lifetime Value (LTV)', 'Churn Rate'],
    riskAssessment: 'Technology risks: AI model accuracy, hardware compatibility issues. Market risks: Slow adoption of new technology, economic downturn affecting discretionary spending. Competition risks: Large tech companies entering market. Regulatory risks: Changing agricultural regulations.',
    mitigationStrategies: 'Diversified technology stack to reduce single-point failures. Strong customer support and education programs. Strategic partnerships with established agricultural companies. Flexible pricing to accommodate market conditions. Continuous innovation to maintain competitive edge.',
    exitStrategy: 'Strategic acquisition by major agricultural technology company (John Deere, Monsanto/Bayer) or agricultural equipment manufacturer within 5-7 years. Alternative: IPO after reaching $50M+ annual revenue. Focus on building valuable IP portfolio and customer base.',
    timeline: '24 months to full market presence: Months 1-6: Product refinement and beta testing. Months 7-12: Limited market launch and customer feedback integration. Months 13-18: Full product launch and scaling. Months 19-24: Market expansion and partnership development.',
    milestones: [
      {
        title: 'Beta Product Launch',
        description: 'Complete beta version with 50 test users providing feedback',
        targetDate: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 6 months from now
        keyDeliverables: 'Functional AI algorithms, mobile app, user feedback analysis'
      },
      {
        title: 'Commercial Launch',
        description: 'Full product launch with paid subscription tiers',
        targetDate: new Date(Date.now() + 12 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 12 months from now
        keyDeliverables: 'Payment system, customer support, marketing campaign launch'
      },
      {
        title: 'Scale to 1000 Customers',
        description: 'Reach 1000 paying customers across all subscription tiers',
        targetDate: new Date(Date.now() + 18 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 18 months from now
        keyDeliverables: 'Customer acquisition systems, retention programs, product optimization'
      }
    ]
  };

  const [formData, setFormData] = useState({
    ideaId: ideaId || '',
    businessModel: initialData.businessModel || sampleData.businessModel,
    revenueStreams: initialData.revenueStreams || sampleData.revenueStreams,
    targetMarket: initialData.targetMarket || sampleData.targetMarket,
    marketSize: initialData.marketSize || sampleData.marketSize,
    competitionAnalysis: initialData.competitionAnalysis || sampleData.competitionAnalysis,
    pricingStrategy: initialData.pricingStrategy || sampleData.pricingStrategy,
    salesStrategy: initialData.salesStrategy || sampleData.salesStrategy,
    marketingStrategy: initialData.marketingStrategy || sampleData.marketingStrategy,
    fundingRequirement: initialData.fundingRequirement || sampleData.fundingRequirement,
    useOfFunds: initialData.useOfFunds || sampleData.useOfFunds,
    financialProjections: initialData.financialProjections || sampleData.financialProjections,
    keyMetrics: initialData.keyMetrics || sampleData.keyMetrics,
    riskAssessment: initialData.riskAssessment || sampleData.riskAssessment,
    mitigationStrategies: initialData.mitigationStrategies || sampleData.mitigationStrategies,
    exitStrategy: initialData.exitStrategy || sampleData.exitStrategy,
    timeline: initialData.timeline || sampleData.timeline,
    milestones: initialData.milestones || sampleData.milestones,
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
      milestones: []
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
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white font-manrope mb-3">
                {isEditMode ? 'Edit Business Aim & Strategy' : 'Business Aim & Strategy'}
              </h2>
              <p className="text-white/70 font-manrope text-lg">
                Define your business model, market strategy, and financial objectives for sustainable growth.
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
      </div>
    </div>
  );
};

export default BusinessAimForm;