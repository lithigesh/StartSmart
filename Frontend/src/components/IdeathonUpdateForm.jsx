import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaTimes } from 'react-icons/fa';
import UpdateSuccessModal from './UpdateSuccessModal';

const IdeathonUpdateForm = ({ registration, onClose, onSuccess }) => {
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [formData, setFormData] = useState({
        teamName: registration.teamName || '',
        projectTitle: registration.projectTitle || '',
        techStack: registration.techStack || '',
        teamMembers: registration.teamMembers?.map(m => m.name).join(', ') || '',
        githubRepo: registration.githubRepo || '',
        additionalInfo: registration.additionalInfo || ''
    });
    const [loading, setLoading] = useState(false);

    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            // Convert team members string to array of objects
            const teamMembersArray = formData.teamMembers
                .split(',')
                .map(name => name.trim())
                .filter(name => name)
                .map(name => ({
                    name,
                    email: registration.teamMembers?.find(m => m.name === name)?.email || `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
                    role: 'Team Member'
                }));

            const updateData = {
                teamName: formData.teamName,
                projectTitle: formData.projectTitle,
                techStack: formData.techStack,
                teamMembers: teamMembersArray,
                githubRepo: formData.githubRepo,
                additionalInfo: formData.additionalInfo
            };

            // Make the update request
            const response = await axios.put(
                `${API_BASE}/api/ideathons/${registration.ideathon._id}/registrations/${registration._id}`,
                updateData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                // Get the updated registration data
                const updatedRegistrationData = {
                    ...registration,
                    ...updateData,
                    _id: registration._id,
                    ideathon: registration.ideathon
                };
                
                // Show success toast
                toast.success('Registration details updated successfully!');
                
                // Call onSuccess with the updated registration data
                onSuccess(updatedRegistrationData);
                
                // Close the form
                onClose();
            }
        } catch (error) {
            console.error('Error updating registration:', error);
            toast.error(error.response?.data?.message || 'Failed to update registration details');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900/95 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Update Registration Details</h2>
                    <button
                        onClick={onClose}
                        className="text-white/60 hover:text-white transition-colors"
                    >
                        <FaTimes className="text-xl" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-white/70 text-sm font-medium mb-2">
                            Team Name
                        </label>
                        <input
                            type="text"
                            name="teamName"
                            value={formData.teamName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/30"
                            placeholder="Enter team name"
                        />
                    </div>

                    <div>
                        <label className="block text-white/70 text-sm font-medium mb-2">
                            Project Title
                        </label>
                        <input
                            type="text"
                            name="projectTitle"
                            value={formData.projectTitle}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/30"
                            placeholder="Enter project title"
                        />
                    </div>

                    <div>
                        <label className="block text-white/70 text-sm font-medium mb-2">
                            Tech Stack
                        </label>
                        <input
                            type="text"
                            name="techStack"
                            value={formData.techStack}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/30"
                            placeholder="Enter tech stack (e.g., React, Node.js, MongoDB)"
                        />
                    </div>

                    <div>
                        <label className="block text-white/70 text-sm font-medium mb-2">
                            Team Members (comma-separated)
                        </label>
                        <input
                            type="text"
                            name="teamMembers"
                            value={formData.teamMembers}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/30"
                            placeholder="Enter team member names, separated by commas"
                        />
                    </div>

                    <div>
                        <label className="block text-white/70 text-sm font-medium mb-2">
                            GitHub Repository
                        </label>
                        <input
                            type="url"
                            name="githubRepo"
                            value={formData.githubRepo}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/30"
                            placeholder="Enter GitHub repository URL"
                        />
                    </div>

                    <div>
                        <label className="block text-white/70 text-sm font-medium mb-2">
                            Additional Information
                        </label>
                        <textarea
                            name="additionalInfo"
                            value={formData.additionalInfo}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/30 h-32 resize-none"
                            placeholder="Any additional information"
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-500 transition-colors ${
                                loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {loading ? 'Updating...' : 'Update Registration'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
            {showSuccessModal && <UpdateSuccessModal />}
        </div>
    );
};

export default IdeathonUpdateForm;