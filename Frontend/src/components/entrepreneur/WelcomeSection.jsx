import React, { useState } from "react";
import { FaPlus, FaChartLine } from "react-icons/fa";
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
    <div className="mb-8">
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 right-4 w-1 h-1 bg-white/40 rounded-full animate-ping"></div>
          <div className="absolute bottom-6 left-8 w-1 h-1 bg-white/35 rounded-full animate-bounce"></div>
        </div>

        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-manrope font-bold text-white mb-4">
            Ready to innovate?
          </h2>
          <p className="text-white/70 font-manrope mb-6 max-w-2xl">
            Your dashboard to manage ideas, track progress, and connect with
            investors. Start by submitting your next big idea and watch it
            transform into reality.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => setIsFormOpen(true)}
              className="btn bg-white text-black hover:bg-gray-100 rounded-lg px-6 py-3 font-manrope font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <FaPlus className="w-4 h-4" />
              Submit New Idea
            </button>
            <button className="btn btn-outline border-white text-white hover:bg-white hover:text-black rounded-lg px-6 py-3 font-manrope font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2">
              <FaChartLine className="w-4 h-4" />
              View Analytics
            </button>
          </div>
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
