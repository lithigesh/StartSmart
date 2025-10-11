import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaTimes, FaPlus, FaTrash } from 'react-icons/fa';

const IdeathonProgressForm = ({ registration, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [newMilestone, setNewMilestone] = useState('');
    const [showFinalSubmission, setShowFinalSubmission] = useState(false);
    const [finalSubm                    {/* Final Submission Form */}
                    {!showFinalSubmission && registration.progressStatus === 'Ready for Submission' && (
                        <div className="mt-4 border-t border-white/10 pt-4">
                            <button
                                type="button"
                                onClick={() => setShowFinalSubmission(true)}
                                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-500 transition-colors flex items-center justify-center gap-2"
                            >
                                <span className="text-lg">🚀</span>
                                Submit Final Project
                            </button>
                            <p className="text-white/60 text-sm text-center mt-2">
                                Ready to submit your final project? Click here to proceed with the submission.
                            </p>
                        </div>
                    )}
                </form>
            </div>
        </div>

        {/* Final Submission Modal */}
        {showFinalSubmission && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-gray-900/95 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white">Final Project Submission</h2>
                        <button
                            onClick={() => setShowFinalSubmission(false)}ta, setFinalSubmissionData] = useState({
        projectSummary: '',
        technicalImplementation: '',
        challenges: '',
        futureEnhancements: '',
        teamContributions: '',
        demoVideo: '',
        githubFinalRepo: '',
        liveDemoLink: '',
        additionalMaterials: []
    });
    const [formData, setFormData] = useState({
        progressStatus: registration.progressStatus || 'Not Started',
        currentProgress: registration.currentProgress || 0,
        currentMilestone: registration.currentMilestone || '',
        projectUpdates: registration.projectUpdates || '',
        challengesFaced: registration.challengesFaced || '',
        nextSteps: registration.nextSteps || '',
        resourcesNeeded: registration.resourcesNeeded || '',
        feedback: registration.feedback || '',
        milestones: registration.milestones || []
    });

    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

    const progressOptions = [
        { value: 'Not Started', label: 'Not Started' },
        { value: 'Planning Phase', label: 'Planning Phase' },
        { value: 'Initial Development', label: 'Initial Development' },
        { value: 'Advanced Development', label: 'Advanced Development' },
        { value: 'Testing & Refinement', label: 'Testing & Refinement' },
        { value: 'Ready for Submission', label: 'Ready for Submission' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            // Calculate current progress based on milestone completion
            const completedMilestones = formData.milestones.filter(m => m.completed).length;
            const totalMilestones = formData.milestones.length;
            const calculatedProgress = totalMilestones ? (completedMilestones / totalMilestones) * 100 : 0;

            const updateData = {
                progressStatus: formData.progressStatus,
                currentProgress: calculatedProgress,
                currentMilestone: formData.currentMilestone,
                milestones: formData.milestones,
                projectUpdates: formData.projectUpdates,
                challengesFaced: formData.challengesFaced,
                nextSteps: formData.nextSteps,
                resourcesNeeded: formData.resourcesNeeded,
                feedback: formData.feedback
            };

            const response = await axios.put(
                `${API_BASE}/api/ideathons/registrations/${registration._id}/progress`,
                updateData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                // Merge the updated data with the existing registration
                const updatedRegistration = {
                    ...registration,
                    ...updateData
                };

                toast.success('Progress updated successfully!', {
                    duration: 4000,
                    position: 'top-center',
                });

                // Call onSuccess with updated data and close immediately
                onSuccess(updatedRegistration);
                onClose();
            }
        } catch (error) {
            console.error('Error updating progress:', error);
            toast.error(error.response?.data?.message || 'Failed to update progress');
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

    const handleFinalSubmissionChange = (e) => {
        const { name, value } = e.target;
        setFinalSubmissionData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFinalSubmission = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await axios.post(
                `${API_BASE}/api/ideathons/registrations/${registration._id}/final-submission`,
                finalSubmissionData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                toast.success('Final project submitted successfully!', {
                    duration: 4000,
                    position: 'top-center',
                });

                // Update the registration with the latest data
                onSuccess(response.data.data);
                setShowFinalSubmission(false);
                onClose();
            }
        } catch (error) {
            console.error('Error submitting final project:', error);
            toast.error(error.response?.data?.message || 'Failed to submit final project');
        } finally {
            setLoading(false);
        }
    };

    const addMilestone = () => {
        if (!newMilestone.trim()) return;

        const now = new Date();
        setFormData(prev => ({
            ...prev,
            milestones: [
                ...prev.milestones,
                {
                    title: newMilestone.trim(),
                    description: '',
                    completed: false,
                    completedDate: null,
                    dueDate: new Date(now.setDate(now.getDate() + 14)), // Set default due date to 2 weeks from now
                    createdAt: new Date()
                }
            ]
        }));
        setNewMilestone('');

        // Recalculate progress after adding milestone
        const updatedMilestones = [...formData.milestones, {
            title: newMilestone.trim(),
            completed: false
        }];
        const completedCount = updatedMilestones.filter(m => m.completed).length;
        const newProgress = (completedCount / updatedMilestones.length) * 100;
        setFormData(prev => ({
            ...prev,
            currentProgress: newProgress
        }));
    };

    const toggleMilestone = (index) => {
        setFormData(prev => ({
            ...prev,
            milestones: prev.milestones.map((milestone, i) => {
                if (i === index) {
                    return {
                        ...milestone,
                        completed: !milestone.completed,
                        completedDate: !milestone.completed ? new Date() : null
                    };
                }
                return milestone;
            })
        }));
    };

    const removeMilestone = (index) => {
        setFormData(prev => ({
            ...prev,
            milestones: prev.milestones.filter((_, i) => i !== index)
        }));
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-gray-900/95 rounded-xl p-6 w-full max-w-4xl my-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Track Project Progress</h2>
                    <button
                        onClick={onClose}
                        className="text-white/60 hover:text-white transition-colors"
                    >
                        <FaTimes className="text-xl" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="w-full">
                            <label className="block text-white/70 text-sm font-medium mb-2">
                                Project Status
                            </label>
                            <select
                                name="progressStatus"
                                value={formData.progressStatus}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all hover:border-white/20 hover:bg-white/10"
                        >
                            {progressOptions.map(option => (
                                <option 
                                    key={option.value} 
                                    value={option.value}
                                    className="bg-gray-800 text-white"
                                >
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-white/70 text-sm font-medium mb-2">
                            Current Milestone
                        </label>
                        <textarea
                            name="currentMilestone"
                            value={formData.currentMilestone}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/30 h-24 resize-none"
                            placeholder="Describe your current milestone or achievement"
                        />
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-6 border border-white/10 hover:border-white/20 transition-colors">
                        <label className="block text-white/70 text-sm font-medium mb-3">
                            Project Updates
                            <span className="text-emerald-400 ml-1 text-xs">*</span>
                        </label>
                        <textarea
                            name="projectUpdates"
                            value={formData.projectUpdates}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50 h-32 resize-none transition-all"
                            placeholder="What progress have you made since the last update?"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-white/70 text-sm font-medium mb-2">
                            Challenges Faced
                        </label>
                        <textarea
                            name="challengesFaced"
                            value={formData.challengesFaced}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/30 h-24 resize-none"
                            placeholder="What challenges are you currently facing?"
                        />
                    </div>

                    <div>
                        <label className="block text-white/70 text-sm font-medium mb-2">
                            Next Steps
                        </label>
                        <textarea
                            name="nextSteps"
                            value={formData.nextSteps}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/30 h-24 resize-none"
                            placeholder="What are your planned next steps?"
                        />
                    </div>

                    <div>
                        <label className="block text-white/70 text-sm font-medium mb-2">
                            Resources Needed
                        </label>
                        <textarea
                            name="resourcesNeeded"
                            value={formData.resourcesNeeded}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/30 h-24 resize-none"
                            placeholder="What resources or support do you need?"
                        />
                    </div>

                    <div className="bg-white/5 rounded-lg p-6 border border-white/10 hover:border-white/20 transition-colors">
                        <label className="block text-white/70 text-sm font-medium mb-3">
                            Project Progress
                        </label>
                        <div className="relative">
                            <div className="flex mb-3 items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-white font-semibold inline-block py-1.5 px-3 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                                        {((formData.milestones.filter(m => m.completed).length / Math.max(1, formData.milestones.length)) * 100).toFixed(0)}% Complete
                                    </span>
                                    <span className="text-white/50 text-sm">
                                        {formData.milestones.filter(m => m.completed).length} of {formData.milestones.length} milestones completed
                                    </span>
                                </div>
                            </div>
                            <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-white/10">
                                <div
                                    style={{ width: `${(formData.milestones.filter(m => m.completed).length / Math.max(1, formData.milestones.length)) * 100}%` }}
                                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500 transition-all duration-500 ease-in-out rounded-full"
                                ></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 rounded-lg p-6 border border-white/10 hover:border-white/20 transition-colors">
                        <label className="block text-white/70 text-sm font-medium mb-3">
                            Project Milestones
                            <span className="text-emerald-400 ml-1 text-xs">*</span>
                        </label>
                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMilestone}
                                    onChange={(e) => setNewMilestone(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMilestone())}
                                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50 transition-all hover:border-white/20"
                                    placeholder="Enter milestone title and press Enter"
                                />
                                <button
                                    type="button"
                                    onClick={addMilestone}
                                    className="px-4 py-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/30 transition-all"
                                >
                                    <FaPlus />
                                </button>
                            </div>
                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                {formData.milestones.map((milestone, index) => (
                                    <div key={index} 
                                         className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                                            milestone.completed 
                                            ? 'bg-emerald-500/10 border border-emerald-500/20' 
                                            : 'bg-white/5 border border-white/10 hover:border-white/20'
                                         }`}>
                                        <input
                                            type="checkbox"
                                            checked={milestone.completed}
                                            onChange={() => toggleMilestone(index)}
                                            className="form-checkbox h-5 w-5 text-emerald-500 rounded border-white/30 bg-white/5 transition-colors"
                                        />
                                        <div className="flex-1">
                                            <span className={`text-sm ${milestone.completed ? 'text-emerald-400 line-through' : 'text-white'}`}>
                                                {milestone.title}
                                            </span>
                                            {milestone.completedDate && (
                                                <div className="text-xs text-emerald-400/70 mt-1">
                                                    Completed on {new Date(milestone.completedDate).toLocaleDateString()}
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeMilestone(index)}
                                            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all"
                                        >
                                            <FaTrash size={14} />
                                        </button>
                                    </div>
                                ))}
                                {formData.milestones.length === 0 && (
                                    <div className="text-center py-8 text-white/40">
                                        No milestones added yet. Add your first milestone above.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-500 transition-colors ${
                                loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                    
                    {!showFinalSubmission && registration.progressStatus === 'Ready for Submission' && (
                        <div className="mt-4 border-t border-white/10 pt-4">
                            <button
                                type="button"
                                onClick={() => setShowFinalSubmission(true)}
                                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-500 transition-colors flex items-center justify-center gap-2"
                            >
                                <span className="text-lg">🚀</span>
                                Submit Final Project
                            </button>
                            <p className="text-white/60 text-sm text-center mt-2">
                                Ready to submit your final project? Click here to proceed with the submission.
                            </p>
                        </div>
                    )}

                    {!showFinalSubmission && registration.progressStatus !== 'Ready for Submission' && (
                        <div className="mt-4 border-t border-white/10 pt-4">
                            <p className="text-white/60 text-sm text-center">
                                Set your progress status to "Ready for Submission" to enable final project submission.
                            </p>
                        </div>
                    )}
                </form>

                {/* Final Submission Form */}
                {showFinalSubmission && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-gray-900/95 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white">Final Project Submission</h2>
                                <button
                                    onClick={() => setShowFinalSubmission(false)}
                                    className="text-white/60 hover:text-white transition-colors"
                                >
                                    <FaTimes className="text-xl" />
                                </button>
                            </div>

                            <form onSubmit={handleFinalSubmission} className="space-y-4">
                                <div>
                                    <label className="block text-white/70 text-sm font-medium mb-2">
                                        Project Summary *
                                    </label>
                                    <textarea
                                        name="projectSummary"
                                        value={finalSubmissionData.projectSummary}
                                        onChange={handleFinalSubmissionChange}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/30 h-32 resize-none"
                                        placeholder="Provide a comprehensive summary of your project"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-white/70 text-sm font-medium mb-2">
                                        Technical Implementation *
                                    </label>
                                    <textarea
                                        name="technicalImplementation"
                                        value={finalSubmissionData.technicalImplementation}
                                        onChange={handleFinalSubmissionChange}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/30 h-32 resize-none"
                                        placeholder="Describe the technical aspects and implementation details"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-white/70 text-sm font-medium mb-2">
                                        Challenges Faced
                                    </label>
                                    <textarea
                                        name="challenges"
                                        value={finalSubmissionData.challenges}
                                        onChange={handleFinalSubmissionChange}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/30 h-24 resize-none"
                                        placeholder="Describe the challenges you encountered and how you overcame them"
                                    />
                                </div>

                                <div>
                                    <label className="block text-white/70 text-sm font-medium mb-2">
                                        Future Enhancements
                                    </label>
                                    <textarea
                                        name="futureEnhancements"
                                        value={finalSubmissionData.futureEnhancements}
                                        onChange={handleFinalSubmissionChange}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/30 h-24 resize-none"
                                        placeholder="Describe potential future improvements and features"
                                    />
                                </div>

                                <div>
                                    <label className="block text-white/70 text-sm font-medium mb-2">
                                        Team Contributions
                                    </label>
                                    <textarea
                                        name="teamContributions"
                                        value={finalSubmissionData.teamContributions}
                                        onChange={handleFinalSubmissionChange}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/30 h-24 resize-none"
                                        placeholder="Detail the contributions of each team member"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-white/70 text-sm font-medium mb-2">
                                            Demo Video Link
                                        </label>
                                        <input
                                            type="url"
                                            name="demoVideo"
                                            value={finalSubmissionData.demoVideo}
                                            onChange={handleFinalSubmissionChange}
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/30"
                                            placeholder="URL to your demo video"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-white/70 text-sm font-medium mb-2">
                                            GitHub Repository *
                                        </label>
                                        <input
                                            type="url"
                                            name="githubFinalRepo"
                                            value={finalSubmissionData.githubFinalRepo}
                                            onChange={handleFinalSubmissionChange}
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/30"
                                            placeholder="URL to your GitHub repository"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-white/70 text-sm font-medium mb-2">
                                            Live Demo Link
                                        </label>
                                        <input
                                            type="url"
                                            name="liveDemoLink"
                                            value={finalSubmissionData.liveDemoLink}
                                            onChange={handleFinalSubmissionChange}
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/30"
                                            placeholder="URL to your live demo"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-6">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-500 transition-colors ${
                                            loading ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                    >
                                        {loading ? 'Submitting...' : 'Submit Final Project'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowFinalSubmission(false)}
                                        className="flex-1 px-6 py-3 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IdeathonProgressForm;