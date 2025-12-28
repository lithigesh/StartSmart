import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import EmptyState from './EmptyState';
import IdeathonUpdateForm from './IdeathonUpdateForm';
import IdeathonProgressForm from './IdeathonProgressForm';
import IdeathonRegistrationStats from './IdeathonRegistrationStats';
import { FaChevronDown, FaChevronUp, FaEdit, FaChartBar, FaTasks, FaSignOutAlt } from 'react-icons/fa';

const MyRegisteredIdeathons = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedId, setExpandedId] = useState(null);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [showProgressForm, setShowProgressForm] = useState(false);
    const [selectedRegistration, setSelectedRegistration] = useState(null);

    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await axios.get(`${API_BASE}/api/ideathons/my-registrations`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if (response.data && Array.isArray(response.data.data)) {
                setRegistrations(response.data.data);
            } else {
                setRegistrations([]);
            }
            setError(null);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching registrations:', error);
            setError(error.response?.data?.message || 'Failed to fetch registrations');
            toast.error(error.response?.data?.message || 'Failed to fetch registrations');
            setRegistrations([]);
            setLoading(false);
        }
    };

    const handleWithdraw = async (registrationId, ideathonTitle) => {
        if (!window.confirm(`Are you sure you want to withdraw from "${ideathonTitle}"? This action cannot be undone.`)) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await axios.delete(`${API_BASE}/api/ideathons/registrations/${registrationId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                toast.success('Successfully withdrawn from ideathon');
                fetchRegistrations(); // Refresh the list
            }
        } catch (error) {
            console.error('Error withdrawing from ideathon:', error);
            toast.error(error.response?.data?.message || 'Failed to withdraw from ideathon');
        }
    };

    if (loading) {
        return (
            <div className="bg-white/5 rounded-lg p-6">
                <div className="flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <p className="text-red-400">{error}</p>
            </div>
        );
    }

    if (!registrations || registrations.length === 0) {
        return <EmptyState 
            message="You haven't registered for any ideathons yet"
            description="Start exploring ideathons and register for ones that interest you!"
        />;
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4 text-white">My Registered Ideathons</h2>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {registrations.map((registration) => (
                    <div 
                        key={registration._id || Math.random()}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all duration-300"
                    >
                        <div className="space-y-3">
                            <div className="flex justify-between items-start">
                                <h3 className="text-lg font-semibold text-white">{registration.ideathon?.title}</h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${
                                    registration.ideathon?.status === 'ongoing' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                    registration.ideathon?.status === 'completed' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                                    'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                                }`}>
                                    {registration.ideathon?.status ? 
                                        registration.ideathon.status.charAt(0).toUpperCase() + registration.ideathon.status.slice(1) 
                                        : 'Unknown'}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedRegistration(registration);
                                        setShowUpdateForm(true);
                                    }}
                                    className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-xs font-semibold hover:bg-blue-500/30 transition-colors flex items-center gap-1 whitespace-nowrap"
                                >
                                    <FaEdit size={12} />
                                    Edit Details
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleWithdraw(registration._id, registration.ideathon?.title);
                                    }}
                                    className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-xs font-semibold hover:bg-red-500/30 transition-colors flex items-center gap-1 whitespace-nowrap"
                                >
                                    <FaSignOutAlt size={12} />
                                    Withdraw
                                </button>
                            </div>
                        </div>

                        <div className="text-sm text-white/60 mb-4">{registration.ideathon?.theme}</div>

                        <button
                            onClick={() => setExpandedId(expandedId === registration._id ? null : registration._id)}
                            className="w-full px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300 flex items-center justify-between mb-4"
                        >
                            <span>View Details</span>
                            {expandedId === registration._id ? <FaChevronUp /> : <FaChevronDown />}
                        </button>

                        <div className={`space-y-3 transition-all duration-300 overflow-hidden ${expandedId === registration._id ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="text-white/80 bg-white/5 p-3 rounded-lg">
                                <span className="font-medium text-white/90">Team Name:</span> {registration.teamName}
                            </div>
                            
                            <div className="text-white/80 bg-white/5 p-3 rounded-lg">
                                <span className="font-medium text-white/90">Project:</span> {registration.projectTitle}
                            </div>

                            {registration.techStack && (
                                <div className="text-white/80 bg-white/5 p-3 rounded-lg">
                                    <span className="font-medium text-white/90">Tech Stack:</span> {registration.techStack}
                                </div>
                            )}

                            {registration.githubRepo && (
                                <div className="text-white/80 bg-white/5 p-3 rounded-lg">
                                    <span className="font-medium text-white/90">GitHub Repository:</span>{' '}
                                    <a href={registration.githubRepo} target="_blank" rel="noopener noreferrer" 
                                       className="text-blue-400 hover:text-blue-300">
                                        {registration.githubRepo}
                                    </a>
                                </div>
                            )}

                            <div className="text-white/80 bg-white/5 p-3 rounded-lg">
                                <span className="font-medium text-white/90">Event Dates:</span>{' '}
                                {registration.ideathon?.startDate && registration.ideathon?.endDate ? 
                                    `${new Date(registration.ideathon.startDate).toLocaleDateString()} - ${new Date(registration.ideathon.endDate).toLocaleDateString()}`
                                    : 'Dates not specified'
                                }
                            </div>

                            {registration.ideathon?.fundingPrizes && (
                                <div className="text-white/80 bg-white/5 p-3 rounded-lg">
                                    <span className="font-medium text-white/90">Prize Pool:</span> {registration.ideathon.fundingPrizes}
                                </div>
                            )}

                            {registration.teamMembers && registration.teamMembers.length > 0 && (
                                <div className="text-white/80 bg-white/5 p-3 rounded-lg">
                                    <span className="font-medium text-white/90">Team Members:</span>
                                    <ul className="mt-2 list-disc list-inside">
                                        {registration.teamMembers.map((member, index) => (
                                            <li key={index} className="ml-2">{member.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {registration.pitchDetails && (
                                <div className="text-white/80 bg-white/5 p-3 rounded-lg">
                                    <span className="font-medium text-white/90">Pitch Details:</span>
                                    <p className="mt-2">{registration.pitchDetails}</p>
                                </div>
                            )}

                            {registration.progressStatus && (
                                <div className="text-white/80 bg-white/5 p-3 rounded-lg">
                                    <span className="font-medium text-white/90">Project Progress:</span>
                                    <div className="mt-2">
                                        <div className={`inline-block px-3 py-1 rounded-full text-sm ${
                                            registration.progressStatus === 'planning' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                            registration.progressStatus === 'development' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                            registration.progressStatus === 'testing' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                                            registration.progressStatus === 'finalizing' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                                            'bg-green-500/20 text-green-400 border border-green-500/30'
                                        }`}>
                                            {registration.progressStatus.charAt(0).toUpperCase() + registration.progressStatus.slice(1)}
                                        </div>
                                    </div>
                                    {registration.currentMilestone && (
                                        <div className="mt-3">
                                            <span className="font-medium text-white/90">Current Milestone:</span>
                                            <p className="mt-1 text-white/80">{registration.currentMilestone}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {registration.additionalInfo && (
                                <div className="text-white/80 bg-white/5 p-3 rounded-lg">
                                    <span className="font-medium text-white/90">Additional Information:</span>
                                    <p className="mt-2">{registration.additionalInfo}</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {showUpdateForm && selectedRegistration && (
                <IdeathonUpdateForm
                    registration={selectedRegistration}
                    onClose={() => {
                        setShowUpdateForm(false);
                        setSelectedRegistration(null);
                    }}
                    onSuccess={async (updatedRegistration) => {
                        // Refresh the data by fetching again
                        await fetchRegistrations();
                        
                        // Maintain expanded state for the updated registration
                        setExpandedId(updatedRegistration._id);
                        
                        // Clear update form
                        setShowUpdateForm(false);
                        setSelectedRegistration(null);
                        
                        // Show success message
                        toast.success('Registration details updated successfully!');
                    }}
                />
            )}

            {showProgressForm && selectedRegistration && (
                <IdeathonProgressForm
                    registration={selectedRegistration}
                    onClose={() => {
                        setShowProgressForm(false);
                        setSelectedRegistration(null);
                    }}
                    onSuccess={(updatedRegistration) => {
                        // Update registrations state
                        setRegistrations(prevRegistrations =>
                            prevRegistrations.map(reg =>
                                reg._id === updatedRegistration._id ? updatedRegistration : reg
                            )
                        );
                        
                        // Maintain expanded state for the updated registration
                        setExpandedId(updatedRegistration._id);
                        
                        // Clear progress form
                        setShowProgressForm(false);
                        setSelectedRegistration(null);
                    }}
                />
            )}
        </div>
    );
};

export default MyRegisteredIdeathons;