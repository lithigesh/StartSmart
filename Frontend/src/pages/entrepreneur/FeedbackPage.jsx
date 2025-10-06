// pages/entrepreneur/FeedbackPage.jsx
import React from "react";
import FeedbackCard from "../../components/entrepreneur/FeedbackCard";
import InlineFeedbackForm from "../../components/entrepreneur/InlineFeedbackForm";
import {
  FaComment,
  FaEdit,
  FaFileAlt,
  FaChartBar,
} from "react-icons/fa";

const FeedbackPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            App Feedback
          </h2>
          <p className="text-white/60">
            Share your thoughts and help us improve StartSmart
          </p>
        </div>
        
        {/* Feedback Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Feedback Card */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FaComment className="text-blue-400" />
              Quick Feedback
            </h3>
            <FeedbackCard />
          </div>
          
          {/* Detailed Feedback Form */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FaEdit className="text-green-400" />
              Submit Feedback
            </h3>
            <InlineFeedbackForm onSubmitSuccess={() => {
              window.location.reload();
            }} />
          </div>
        </div>
        
        {/* Feedback Options */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            More Feedback Options
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => window.location.href = '/feedback'}
              className="flex items-center justify-between p-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 text-white"
            >
              <div className="flex items-center gap-3">
                <FaFileAlt className="text-xl" />
                <div className="text-left">
                  <div className="font-medium">Detailed Form</div>
                  <div className="text-sm text-blue-100">Complete feedback form</div>
                </div>
              </div>
              <div className="text-blue-200">→</div>
            </button>
            
            <div className="p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <FaChartBar className="text-green-400" />
                <span className="font-medium text-white">Your Stats</span>
              </div>
              <div className="text-sm text-gray-300">
                Track your feedback history
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;