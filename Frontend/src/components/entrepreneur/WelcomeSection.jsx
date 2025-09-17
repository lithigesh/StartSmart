import React, { useState } from "react";
import { FaPlus, FaChartLine, FaLightbulb } from "react-icons/fa";
import IdeaSubmissionForm from "./IdeaSubmissionForm";
import { ideasAPI } from "../../services/api";

const WelcomeSection = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSubmitIdea = async (formData) => {
    try {
      // Now send all comprehensive form data to the updated backend
      const ideaData = {
        // Basic Information
        title: formData.title,
        elevatorPitch: formData.elevatorPitch,
        description: formData.detailedDescription, // Maps to 'description' in backend
        category: formData.category,
        targetAudience: formData.targetAudience,

        // Problem & Solution
        problemStatement: formData.problemStatement,
        solution: formData.solution,
        competitors: formData.competitors,

        // Business Model
        revenueStreams: formData.revenueStreams,
        pricingStrategy: formData.pricingStrategy,
        keyPartnerships: formData.keyPartnerships,

        // Market & Growth
        marketSize: formData.marketSize,
        goToMarketStrategy: formData.goToMarketStrategy,
        scalabilityPlan: formData.scalabilityPlan,

        // Technical Requirements
        technologyStack: formData.technologyStack,
        developmentRoadmap: formData.developmentRoadmap,
        challengesAnticipated: formData.challengesAnticipated,

        // Sustainability & Social Impact
        ecoFriendlyPractices: formData.ecoFriendlyPractices,
        socialImpact: formData.socialImpact,

        // Funding & Investment
        fundingRequirements: formData.fundingRequirements,
        useOfFunds: formData.useOfFunds,
        equityOffer: formData.equityOffer,

        // Attachments
        attachments: formData.attachments || []
      };

      await ideasAPI.submitIdea(ideaData);
      alert("Idea submitted successfully!");
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error submitting idea:", error);
      alert("Error submitting idea. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="relative">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
            <FaLightbulb className="w-6 h-6 text-yellow-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              Ready to innovate?
            </h2>
            <p className="text-gray-400">
              Transform your ideas into reality
            </p>
          </div>
        </div>

        <p className="text-gray-300 mb-6 max-w-2xl">
          Your dashboard to manage ideas, track progress, and connect with
          investors. Start by submitting your next big idea and watch it
          transform into reality.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center gap-2 bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            <FaPlus className="w-4 h-4" />
            Submit New Idea
          </button>
          <button className="inline-flex items-center gap-2 border border-gray-600 text-gray-400 hover:text-white hover:border-gray-400 px-6 py-3 rounded-lg font-medium transition-colors duration-200">
            <FaChartLine className="w-4 h-4" />
            View Analytics
          </button>
        </div>
      </div>

      {/* Idea Submission Form Modal */}
      <IdeaSubmissionForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmitIdea}
      />
    </div>
  );
};

export default WelcomeSection;
