import React from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaLightbulb } from "react-icons/fa";

const WelcomeSection = () => {
  const navigate = useNavigate();

  const handleSubmitIdea = () => {
    // Navigate to the new 3-form idea submission system
    navigate("/submit-idea");
  };

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="relative">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
            <FaLightbulb className="w-6 h-6 text-gray-800" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              Ready to innovate?
            </h2>
            <p className="text-gray-400">Transform your ideas into reality</p>
          </div>
        </div>

        <p className="text-gray-300 mb-6 max-w-2xl">
          Your dashboard to manage ideas, track progress, and connect with
          investors. Start by submitting your next big idea and watch it
          transform into reality.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleSubmitIdea}
            className="inline-flex items-center gap-2 bg-white text-black hover:bg-white/90 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            <FaPlus className="w-4 h-4" />
            Submit New Idea
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
