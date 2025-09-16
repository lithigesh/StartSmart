import React, { useState } from "react";
import { FaPlus, FaChartLine } from "react-icons/fa";
import IdeaSubmissionForm from "./IdeaSubmissionForm";
import { ideasAPI } from "../../services/api";

const WelcomeSection = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSubmitIdea = async (formData) => {
    try {
      // For now, send only the fields supported by the current backend
      // The complete form data can be stored locally or sent to a more comprehensive endpoint later
      const ideaData = {
        title: formData.title,
        description: formData.detailedDescription,
        category: formData.category,
        // Store additional comprehensive data in description for now
        elevatorPitch: formData.elevatorPitch,
        targetAudience: formData.targetAudience,
        problemStatement: formData.problemStatement,
        solution: formData.solution,
        // Add metadata with all form data for future use
        metadata: {
          comprehensive: true,
          formVersion: "1.0",
          allData: formData
        }
      };

      // For current backend compatibility, format description to include key info
      const comprehensiveDescription = `
${formData.detailedDescription}

ELEVATOR PITCH: ${formData.elevatorPitch}

PROBLEM STATEMENT: ${formData.problemStatement}

SOLUTION: ${formData.solution}

TARGET AUDIENCE: ${formData.targetAudience}

${formData.revenueStreams ? `REVENUE MODEL: ${formData.revenueStreams}` : ''}

${formData.fundingRequirements ? `FUNDING NEEDED: ${formData.fundingRequirements}` : ''}
      `.trim();

      const backendData = {
        title: formData.title,
        description: comprehensiveDescription,
        category: formData.category
      };

      await ideasAPI.submitIdea(backendData);
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
