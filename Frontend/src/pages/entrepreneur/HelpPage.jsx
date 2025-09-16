import React from "react";
import { FaQuestionCircle, FaEnvelope, FaPhone, FaBook, FaLifeRing, FaComments } from "react-icons/fa";
import SideBar from "../../components/entrepreneur/SideBar";
import DashboardHeader from "../../components/entrepreneur/DashboardHeader";

const HelpPage = () => {
  const faqs = [
    {
      question: "How do I submit a new idea?",
      answer: "Click the 'Submit New Idea' button on your dashboard and fill out the comprehensive form with details about your startup concept."
    },
    {
      question: "How does the AI analysis work?",
      answer: "Our AI system analyzes your idea based on market trends, competition, feasibility, and potential for success, providing a score and detailed feedback."
    },
    {
      question: "How can I connect with investors?",
      answer: "Investors can view your ideas if they match their investment criteria. You'll receive notifications when investors show interest."
    },
    {
      question: "What happens after I receive funding interest?",
      answer: "You can communicate directly with interested investors through our platform and proceed with negotiations and due diligence."
    }
  ];

  return (
    <div className="min-h-screen bg-black flex">
      <SideBar />
      
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Help & Support</h1>
              <p className="text-white/60">Get help and find answers to your questions</p>
            </div>

            {/* Contact Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FaEnvelope className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">Email Support</h3>
                <p className="text-white/60 text-sm mb-4">Get help via email within 24 hours</p>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm">
                  Contact Us
                </button>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FaComments className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">Live Chat</h3>
                <p className="text-white/60 text-sm mb-4">Chat with our support team</p>
                <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm">
                  Start Chat
                </button>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FaBook className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">Documentation</h3>
                <p className="text-white/60 text-sm mb-4">Browse our comprehensive guides</p>
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm">
                  View Docs
                </button>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <FaQuestionCircle className="text-yellow-400" />
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-white/10 pb-4 last:border-b-0">
                    <h4 className="text-white font-medium mb-2">{faq.question}</h4>
                    <p className="text-white/70 text-sm">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;