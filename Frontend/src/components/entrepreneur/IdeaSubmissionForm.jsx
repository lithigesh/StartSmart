import React, { useState } from "react";
import {
  FaTimes,
  FaUpload,
  FaFileAlt,
  FaLightbulb,
  FaUsers,
  FaDollarSign,
  FaChartLine,
  FaCog,
  FaLeaf,
  FaMoneyBillWave,
} from "react-icons/fa";

const IdeaSubmissionForm = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    // Basic Information
    title: "",
    elevatorPitch: "",
    detailedDescription: "",
    category: "",
    targetAudience: "",

    // Problem & Solution
    problemStatement: "",
    solution: "",
    competitors: "",

    // Business Model
    revenueStreams: "",
    pricingStrategy: "",
    keyPartnerships: "",

    // Market & Growth
    marketSize: "",
    goToMarketStrategy: "",
    scalabilityPlan: "",

    // Technical Requirements
    technologyStack: "",
    developmentRoadmap: "",
    challengesAnticipated: "",

    // Sustainability & Social Impact
    ecoFriendlyPractices: "",
    socialImpact: "",

    // Funding & Investment
    fundingRequirements: "",
    useOfFunds: "",
    equityOffer: "",

    // Attachments
    attachments: []
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 8;

  const categories = [
    "Technology",
    "Healthcare",
    "Education",
    "Environmental",
    "Fintech",
    "E-commerce",
    "Social Impact",
    "Manufacturing",
    "Entertainment",
    "Food & Beverage",
    "Transportation",
    "Real Estate",
    "Other"
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (files) => {
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...Array.from(files)]
    }));
  };

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const nextStep = () => {
    // Basic validation for required fields
    if (currentStep === 1) {
      if (!formData.title || !formData.elevatorPitch || !formData.detailedDescription || !formData.category || !formData.targetAudience) {
        alert("Please fill in all required fields before proceeding.");
        return;
      }
    }
    if (currentStep === 2) {
      if (!formData.problemStatement || !formData.solution) {
        alert("Please fill in the problem statement and solution before proceeding.");
        return;
      }
    }
    if (currentStep === 3) {
      if (!formData.revenueStreams) {
        alert("Please describe your revenue streams before proceeding.");
        return;
      }
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // Final validation for required fields
    if (!formData.title || !formData.elevatorPitch || !formData.detailedDescription || 
        !formData.category || !formData.targetAudience || !formData.problemStatement || 
        !formData.solution || !formData.revenueStreams) {
      alert("Please fill in all required fields (marked with *) before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Error submitting idea:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <FaLightbulb className="text-white text-xl" />
              <h3 className="text-xl font-bold text-white">Basic Information</h3>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Idea Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="What is the name of your startup idea?"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white"
                required
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Elevator Pitch *</label>
              <textarea
                value={formData.elevatorPitch}
                onChange={(e) => handleInputChange("elevatorPitch", e.target.value)}
                placeholder="Summarize your idea in one or two sentences."
                rows="3"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white"
                required
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Detailed Description *</label>
              <textarea
                value={formData.detailedDescription}
                onChange={(e) => handleInputChange("detailedDescription", e.target.value)}
                placeholder="Provide a thorough explanation of the idea, the problem it solves, and how it works."
                rows="5"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white"
                required
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white"
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-gray-800">{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Target Audience *</label>
              <textarea
                value={formData.targetAudience}
                onChange={(e) => handleInputChange("targetAudience", e.target.value)}
                placeholder="Who are the primary users or customers for this idea? Describe demographics and behaviors."
                rows="3"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white"
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <FaUsers className="text-white text-xl" />
              <h3 className="text-xl font-bold text-white">Problem & Solution</h3>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Problem Statement *</label>
              <textarea
                value={formData.problemStatement}
                onChange={(e) => handleInputChange("problemStatement", e.target.value)}
                placeholder="What specific problem or gap in the market are you addressing?"
                rows="4"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white"
                required
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Your Solution *</label>
              <textarea
                value={formData.solution}
                onChange={(e) => handleInputChange("solution", e.target.value)}
                placeholder="Explain how your product/service solves the problem uniquely."
                rows="4"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white"
                required
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Competitors</label>
              <textarea
                value={formData.competitors}
                onChange={(e) => handleInputChange("competitors", e.target.value)}
                placeholder="List existing competitors and explain how your idea differentiates itself."
                rows="4"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <FaDollarSign className="text-white text-xl" />
              <h3 className="text-xl font-bold text-white">Business Model</h3>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Revenue Streams *</label>
              <textarea
                value={formData.revenueStreams}
                onChange={(e) => handleInputChange("revenueStreams", e.target.value)}
                placeholder="How do you plan to generate revenue? (Subscriptions, ads, sales, licensing, etc.)"
                rows="3"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white"
                required
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Pricing Strategy</label>
              <textarea
                value={formData.pricingStrategy}
                onChange={(e) => handleInputChange("pricingStrategy", e.target.value)}
                placeholder="What is your pricing approach or expected cost structure?"
                rows="3"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Key Partnerships</label>
              <textarea
                value={formData.keyPartnerships}
                onChange={(e) => handleInputChange("keyPartnerships", e.target.value)}
                placeholder="Do you have any partners, suppliers, or collaborators that help your idea?"
                rows="3"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <FaChartLine className="text-white text-xl" />
              <h3 className="text-xl font-bold text-white">Market & Growth</h3>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Market Size</label>
              <input
                type="text"
                value={formData.marketSize}
                onChange={(e) => handleInputChange("marketSize", e.target.value)}
                placeholder="What is the estimated size of your target market?"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Go-to-Market Strategy</label>
              <textarea
                value={formData.goToMarketStrategy}
                onChange={(e) => handleInputChange("goToMarketStrategy", e.target.value)}
                placeholder="How will you reach your customers and launch your product?"
                rows="4"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Scalability Plan</label>
              <textarea
                value={formData.scalabilityPlan}
                onChange={(e) => handleInputChange("scalabilityPlan", e.target.value)}
                placeholder="How do you plan to expand or scale the business over time?"
                rows="4"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <FaCog className="text-white text-xl" />
              <h3 className="text-xl font-bold text-white">Technical Requirements</h3>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Technology Stack</label>
              <textarea
                value={formData.technologyStack}
                onChange={(e) => handleInputChange("technologyStack", e.target.value)}
                placeholder="What technologies or tools will you use?"
                rows="3"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Development Roadmap</label>
              <textarea
                value={formData.developmentRoadmap}
                onChange={(e) => handleInputChange("developmentRoadmap", e.target.value)}
                placeholder="Outline major milestones (MVP, Beta launch, Full launch)."
                rows="4"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Challenges Anticipated</label>
              <textarea
                value={formData.challengesAnticipated}
                onChange={(e) => handleInputChange("challengesAnticipated", e.target.value)}
                placeholder="What potential hurdles do you foresee and how will you address them?"
                rows="4"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white"
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <FaLeaf className="text-white text-xl" />
              <h3 className="text-xl font-bold text-white">Sustainability & Social Impact</h3>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Eco-Friendly Practices</label>
              <textarea
                value={formData.ecoFriendlyPractices}
                onChange={(e) => handleInputChange("ecoFriendlyPractices", e.target.value)}
                placeholder="Do you use or plan to use any environmentally friendly materials, operations, or initiatives?"
                rows="4"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Social Impact</label>
              <textarea
                value={formData.socialImpact}
                onChange={(e) => handleInputChange("socialImpact", e.target.value)}
                placeholder="Describe how your idea benefits society or contributes to community well-being."
                rows="4"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white"
              />
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <FaMoneyBillWave className="text-white text-xl" />
              <h3 className="text-xl font-bold text-white">Funding & Investment</h3>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Funding Requirements</label>
              <input
                type="text"
                value={formData.fundingRequirements}
                onChange={(e) => handleInputChange("fundingRequirements", e.target.value)}
                placeholder="How much funding are you seeking and for what purposes?"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Use of Funds</label>
              <textarea
                value={formData.useOfFunds}
                onChange={(e) => handleInputChange("useOfFunds", e.target.value)}
                placeholder="Break down how you intend to allocate the funds (development, marketing, operations, etc.)."
                rows="4"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Equity Offer</label>
              <textarea
                value={formData.equityOffer}
                onChange={(e) => handleInputChange("equityOffer", e.target.value)}
                placeholder="Are you offering equity to investors? If yes, specify how much and under what terms."
                rows="3"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white"
              />
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <FaFileAlt className="text-white text-xl" />
              <h3 className="text-xl font-bold text-white">Attachments (Optional)</h3>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Upload Documents</label>
              <p className="text-white/60 text-sm mb-4">
                Upload pitch deck, prototype images, business plan, or any supporting documents.
              </p>
              
              <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                <FaUpload className="mx-auto text-white/40 text-3xl mb-4" />
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.gif"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-white hover:text-white/80">Choose files</span>
                  <span className="text-white/60"> or drag and drop</span>
                </label>
                <p className="text-white/40 text-xs mt-2">
                  PDF, DOC, PPT, images up to 10MB each
                </p>
              </div>

              {formData.attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="text-white font-medium">Uploaded Files:</h4>
                  {formData.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                      <span className="text-white text-sm">{file.name}</span>
                      <button
                        onClick={() => removeAttachment(index)}
                        className="text-white/80 hover:text-white/80"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] mx-4 bg-black border border-white/20 rounded-2xl overflow-hidden z-[70]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-bold text-white">Submit New Idea</h2>
            <p className="text-white/60 mt-1">Step {currentStep} of {totalSteps}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 border-b border-white/10">
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-white/10 bg-black relative z-[75]">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-3 text-white/60 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg hover:bg-white/10"
          >
            Previous
          </button>

          <div className="flex space-x-3">
            {currentStep < totalSteps ? (
              <button
                onClick={nextStep}
                className="px-8 py-3 bg-white text-black hover:bg-white/90 font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-3 bg-white text-black hover:bg-white/90 font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? "Submitting..." : "Submit Idea"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaSubmissionForm;