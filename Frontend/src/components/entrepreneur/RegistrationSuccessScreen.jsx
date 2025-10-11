import React from 'react';
import {
  FaCheck,
  FaUsers,
  FaEnvelope,
  FaMobile,
  FaIdCard,
  FaGithub,
  FaFileAlt,
  FaTrophy
} from 'react-icons/fa';

const RegistrationSuccessScreen = ({ registrationData, ideathonTitle, onClose }) => {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-xl" 
        onClick={onClose}
      ></div>
      
      {/* Success Card */}
      <div className="relative w-full max-w-2xl mx-4 bg-black border border-white/20 rounded-2xl overflow-hidden z-[80]">
        {/* Success Header */}
        <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 p-8 text-center border-b border-green-500/30">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
            <FaCheck className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Registration Successful!</h2>
          <p className="text-green-400">You've successfully registered for {ideathonTitle}</p>
        </div>

        {/* Registration Details */}
        <div className="p-6 space-y-6">
          {/* Team Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <FaUsers className="text-blue-400" />
              Team Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <span className="text-white/60 text-sm">Team Name</span>
                <p className="text-white font-medium mt-1">{registrationData.teamName}</p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <span className="text-white/60 text-sm">Team Members</span>
                <p className="text-white font-medium mt-1">{registrationData.teamMembers || 'No additional members'}</p>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <FaIdCard className="text-blue-400" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-lg border border-white/10 flex items-start gap-3">
                <FaEnvelope className="text-white/40 mt-1" />
                <div>
                  <span className="text-white/60 text-sm block">Email</span>
                  <p className="text-white font-medium">{registrationData.email}</p>
                </div>
              </div>
              <div className="p-4 bg-white/5 rounded-lg border border-white/10 flex items-start gap-3">
                <FaMobile className="text-white/40 mt-1" />
                <div>
                  <span className="text-white/60 text-sm block">Mobile</span>
                  <p className="text-white font-medium">{registrationData.mobileNumber}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <FaTrophy className="text-blue-400" />
              Project Details
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <span className="text-white/60 text-sm block">Project Title</span>
                <p className="text-white font-medium mt-1">{registrationData.projectTitle}</p>
              </div>
              
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <span className="text-white/60 text-sm block mb-2">Problem Statement</span>
                <p className="text-white whitespace-pre-wrap">{registrationData.problemStatement}</p>
              </div>

              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <span className="text-white/60 text-sm block mb-2">Project Abstract</span>
                <p className="text-white whitespace-pre-wrap">{registrationData.abstractDetails}</p>
              </div>
              
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <span className="text-white/60 text-sm block mb-2">Pitch Details</span>
                <p className="text-white whitespace-pre-wrap">{registrationData.pitchDetails}</p>
              </div>

              {registrationData.githubUrl && (
                <div className="p-4 bg-white/5 rounded-lg border border-white/10 flex items-start gap-3">
                  <FaGithub className="text-white/40 mt-1" />
                  <div>
                    <span className="text-white/60 text-sm block">GitHub Repository</span>
                    <a 
                      href={registrationData.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 font-medium break-all"
                    >
                      {registrationData.githubUrl}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Documents */}
          {registrationData.documents && registrationData.documents.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <FaFileAlt className="text-blue-400" />
                Uploaded Documents
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {registrationData.documents.map((doc, index) => (
                  <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FaFileAlt className="text-white/40" />
                      <span className="text-white">{doc.name}</span>
                    </div>
                    <span className="text-white/60 text-sm">
                      {(doc.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-black">
          <div className="flex flex-col items-center text-center">
            <p className="text-white/60 mb-4">
              You'll receive a confirmation email shortly with these details.
              You can view your registration status in your dashboard.
            </p>
            <button
              onClick={onClose}
              className="px-8 py-3 bg-white text-black hover:bg-white/90 font-semibold rounded-lg transition-all duration-200"
            >
              Back to Ideathons
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSuccessScreen;