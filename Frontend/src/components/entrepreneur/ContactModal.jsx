import React from "react";
import {
  FaTimes,
  FaEnvelope,
  FaPhone,
  FaUsers,
  FaCheckCircle,
} from "react-icons/fa";

const ContactModal = ({ isOpen, onClose, fundingRequest, user }) => {
  if (!isOpen || !fundingRequest) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-2xl bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-white/20 rounded-2xl overflow-hidden shadow-2xl m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
          <div>
            <h2 className="text-2xl font-bold text-white">Contact Information</h2>
            <p className="text-white/60 mt-1 text-sm">
              {fundingRequest.idea?.title || "Funding Request"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Entrepreneur Contact */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FaUsers className="w-5 h-5 text-blue-400" />
              Your Contact Information
            </h3>
            <div className="space-y-3">
              {fundingRequest.contactEmail && (
                <div className="flex items-center gap-3">
                  <FaEnvelope className="w-5 h-5 text-white/40" />
                  <div className="flex-1">
                    <p className="text-white/60 text-xs mb-1">Email</p>
                    <p className="text-white font-medium">{fundingRequest.contactEmail}</p>
                  </div>
                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${fundingRequest.contactEmail}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Email
                  </a>
                </div>
              )}
              {fundingRequest.contactPhone && (
                <div className="flex items-center gap-3">
                  <FaPhone className="w-5 h-5 text-white/40" />
                  <div className="flex-1">
                    <p className="text-white/60 text-xs mb-1">Phone</p>
                    <p className="text-white font-medium">{fundingRequest.contactPhone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Interested Investors */}
          {fundingRequest.investorResponses && fundingRequest.investorResponses.length > 0 && (
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FaUsers className="w-5 h-5 text-green-400" />
                Interested Investors
              </h3>
              <div className="space-y-4">
                {fundingRequest.investorResponses
                  .filter(r => r.status === "interested" || r.status === "accepted")
                  .map((response, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {(response.investor?.name || "I").charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold">{response.investor?.name || "Investor"}</p>
                        {response.investor?.email && (
                          <div className="flex items-center gap-2 mt-1">
                            <FaEnvelope className="w-4 h-4 text-white/40" />
                            <p className="text-white/60 text-sm truncate">{response.investor.email}</p>
                          </div>
                        )}
                        {response.status === "accepted" && (
                          <span className="inline-flex items-center gap-1 mt-2 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                            <FaCheckCircle className="w-3 h-3" />
                            Accepted
                          </span>
                        )}
                      </div>
                      {response.investor?.email && (
                        <a
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${response.investor.email}&su=Regarding ${fundingRequest.idea?.title || 'Funding Request'}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        >
                          <FaEnvelope className="w-4 h-4" />
                          Email
                        </a>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* No investors message */}
          {(!fundingRequest.investorResponses || fundingRequest.investorResponses.filter(r => r.status === "interested" || r.status === "accepted").length === 0) && (
            <div className="bg-white/5 rounded-xl p-8 border border-white/10 text-center">
              <FaUsers className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/60 font-medium mb-1">No Interested Investors Yet</p>
              <p className="text-white/40 text-sm">Investors will appear here when they show interest in your funding request</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
