import React from 'react';
import { FaTimes, FaCheckCircle, FaClock, FaFileAlt } from 'react-icons/fa';

const IdeathonRegistrationDetails = ({ registration, onClose }) => {
  if (!registration) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white">Registration Details</h2>
          <button
            onClick={onClose}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Status Banner */}
          <div className="mb-6 p-4 bg-white/20 border border-white/30 rounded-lg flex items-center gap-3">
            {registration.status === 'approved' ? (
              <FaCheckCircle className="w-5 h-5 text-white/90" />
            ) : (
              <FaClock className="w-5 h-5 text-white/70" />
            )}
            <div>
              <h3 className="text-white font-medium">
                Registration Status: {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
              </h3>
              <p className="text-white/60 text-sm">
                Submitted on {new Date(registration.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Team Information */}
          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-medium text-white mb-4">Team Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/60 text-sm mb-1">Team Name</label>
                  <p className="text-white">{registration.teamName}</p>
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-1">Email</label>
                  <p className="text-white">{registration.email}</p>
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-1">Phone</label>
                  <p className="text-white">{registration.phoneNumber}</p>
                </div>
                {registration.githubUrl && (
                  <div>
                    <label className="block text-white/60 text-sm mb-1">GitHub</label>
                    <a 
                      href={registration.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-white/90 hover:text-white/90"
                    >
                      View Repository
                    </a>
                  </div>
                )}
              </div>
            </section>

            {/* Team Members */}
            {registration.teamMembers && registration.teamMembers.length > 0 && (
              <section>
                <h3 className="text-lg font-medium text-white mb-4">Team Members</h3>
                <div className="space-y-2">
                  {registration.teamMembers.map((member, index) => (
                    <div 
                      key={index}
                      className="p-3 bg-gray-800/50 rounded-lg flex items-center justify-between"
                    >
                      <div>
                        <p className="text-white">{member.name}</p>
                        <p className="text-white/60 text-sm">{member.role}</p>
                      </div>
                      <p className="text-white/60 text-sm">{member.email}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Project Details */}
            <section>
              <h3 className="text-lg font-medium text-white mb-4">Project Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-white/60 text-sm mb-1">Project Title</label>
                  <p className="text-white">{registration.projectTitle}</p>
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-1">Abstract</label>
                  <p className="text-white whitespace-pre-wrap">{registration.abstractDetails}</p>
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-1">Problem Statement</label>
                  <p className="text-white whitespace-pre-wrap">{registration.problemStatement}</p>
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-1">Pitch Details</label>
                  <p className="text-white whitespace-pre-wrap">{registration.pitchDetails}</p>
                </div>
              </div>
            </section>

            {/* Documents */}
            {registration.documents && registration.documents.length > 0 && (
              <section>
                <h3 className="text-lg font-medium text-white mb-4">Supporting Documents</h3>
                <div className="space-y-2">
                  {registration.documents.map((doc, index) => (
                    <a
                      key={index}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-gray-800/50 rounded-lg flex items-center gap-3 hover:bg-gray-800 transition-colors"
                    >
                      <FaFileAlt className="w-4 h-4 text-white/90" />
                      <span className="text-white">{doc.name}</span>
                    </a>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeathonRegistrationDetails;