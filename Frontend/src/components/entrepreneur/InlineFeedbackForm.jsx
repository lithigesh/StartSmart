// components/entrepreneur/InlineFeedbackForm.jsx
import React, { useState } from 'react';
import { 
    MessageSquare, 
    Star, 
    Send, 
    Bug, 
    Lightbulb, 
    Monitor,
    CheckCircle,
    AlertCircle,
    X
} from 'lucide-react';

const InlineFeedbackForm = ({ onSubmitSuccess }) => {
    const [formData, setFormData] = useState({
        category: 'general',
        title: '',
        description: '',
        overallRating: 5,
        recommendationScore: 7,
        contactForFollowUp: false
    });
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const categories = [
        { value: 'general', label: 'General', icon: MessageSquare, color: 'text-white/90' },
        { value: 'bug_report', label: 'Bug Report', icon: Bug, color: 'text-white/80' },
        { value: 'feature_request', label: 'Feature Request', icon: Lightbulb, color: 'text-white/70' },
        { value: 'ui_ux', label: 'UI/UX', icon: Monitor, color: 'text-white/90' },
        { value: 'performance', label: 'Performance', icon: CheckCircle, color: 'text-white/90' },
        { value: 'security', label: 'Security', icon: AlertCircle, color: 'text-white/80' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const trimmedTitle = formData.title.trim();
        const trimmedDescription = formData.description.trim();
        
        if (!trimmedTitle || !trimmedDescription) {
            alert('Please fill in all required fields');
            return;
        }
        
        if (trimmedTitle.length < 5) {
            alert('Title must be at least 5 characters long');
            return;
        }
        
        if (trimmedDescription.length < 10) {
            alert('Description must be at least 10 characters long');
            return;
        }

        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";
            
            // Detect browser info
            const userAgent = navigator.userAgent;
            let browserName = 'Unknown';
            let browserVersion = 'Unknown';
            let os = 'Unknown';

            if (userAgent.indexOf('Chrome') > -1) {
                browserName = 'Chrome';
                browserVersion = userAgent.match(/Chrome\/([0-9.]+)/)?.[1] || 'Unknown';
            } else if (userAgent.indexOf('Firefox') > -1) {
                browserName = 'Firefox';
                browserVersion = userAgent.match(/Firefox\/([0-9.]+)/)?.[1] || 'Unknown';
            } else if (userAgent.indexOf('Safari') > -1) {
                browserName = 'Safari';
                browserVersion = userAgent.match(/Version\/([0-9.]+)/)?.[1] || 'Unknown';
            }

            if (userAgent.indexOf('Windows') > -1) os = 'Windows';
            else if (userAgent.indexOf('Mac') > -1) os = 'macOS';
            else if (userAgent.indexOf('Linux') > -1) os = 'Linux';

            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
            const isTablet = /iPad|Android(?!.*Mobile)/i.test(userAgent);
            let deviceType = 'desktop';
            if (isMobile && !isTablet) deviceType = 'mobile';
            else if (isTablet) deviceType = 'tablet';

            const feedbackData = {
                ...formData,
                ratings: {
                    usability: formData.overallRating,
                    performance: formData.overallRating,
                    features: formData.overallRating,
                    design: formData.overallRating
                },
                frequencyOfUse: 'weekly',
                mostUsedFeatures: [],
                suggestedImprovements: [],
                browserInfo: {
                    userAgent,
                    browserName,
                    browserVersion,
                    os
                },
                deviceInfo: {
                    deviceType,
                    screenResolution: `${screen.width}x${screen.height}`
                }
            };

            const response = await fetch(`${API_BASE}/api/app-feedback`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(feedbackData)
            });

            if (response.ok) {
                alert('Feedback submitted successfully!');
                setFormData({
                    category: 'general',
                    title: '',
                    description: '',
                    overallRating: 5,
                    recommendationScore: 7,
                    contactForFollowUp: false
                });
                setShowForm(false);
                onSubmitSuccess && onSubmitSuccess();
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('Error submitting feedback. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const renderStars = (rating, setRating) => {
        return (
            <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={20}
                        className={`${
                            star <= rating
                                ? 'text-white/70 fill-current'
                                : 'text-gray-600'
                        } cursor-pointer hover:text-white/70 transition-colors`}
                        onClick={() => setRating(star)}
                    />
                ))}
            </div>
        );
    };

    if (!showForm) {
        return (
            <div className="text-center">
                <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors duration-200 font-medium"
                >
                    <MessageSquare size={18} />
                    Submit Feedback
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Submit Feedback</h3>
                <button
                    onClick={() => setShowForm(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category Selection */}
                <div>
                    <label className="block text-white/80 text-sm font-medium mb-3">
                        Feedback Category *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {categories.map((category) => {
                            const IconComponent = category.icon;
                            return (
                                <button
                                    key={category.value}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, category: category.value }))}
                                    className={`p-3 rounded-lg border-2 transition-colors flex items-center space-x-2 text-sm ${
                                        formData.category === category.value
                                            ? 'border-white bg-white/20/10 text-white/90'
                                            : 'border-gray-600 hover:border-gray-500 text-gray-300'
                                    }`}
                                >
                                    <IconComponent size={16} className={category.color} />
                                    <span className="font-medium">{category.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Title */}
                <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                        Title *
                    </label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none ${
                            formData.title.trim().length > 0 && formData.title.trim().length < 5
                                ? 'border-white focus:border-white'
                                : 'border-gray-600 focus:border-white'
                        }`}
                        placeholder="Brief summary of your feedback"
                        required
                    />
                    <div className="text-xs text-gray-400 mt-1">
                        {formData.title.length}/50 characters {formData.title.trim().length < 5 && formData.title.trim().length > 0 && '(5 minimum)'}
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                        Description *
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                        className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none resize-none ${
                            formData.description.trim().length > 0 && formData.description.trim().length < 10
                                ? 'border-white focus:border-white'
                                : 'border-gray-600 focus:border-white'
                        }`}
                        placeholder="Please provide detailed feedback..."
                        required
                    />
                    <div className="text-xs text-gray-400 mt-1">
                        {formData.description.length}/500 characters {formData.description.trim().length < 10 && formData.description.trim().length > 0 && '(10 minimum)'}
                    </div>
                </div>

                {/* Ratings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">
                            Overall Rating *
                        </label>
                        <div className="flex items-center space-x-2">
                            {renderStars(formData.overallRating, (rating) => 
                                setFormData(prev => ({ ...prev, overallRating: rating }))
                            )}
                            <span className="text-white ml-2">({formData.overallRating}/5)</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">
                            Recommendation Score * (0-10)
                        </label>
                        <div className="flex items-center space-x-3">
                            <input
                                type="range"
                                min="0"
                                max="10"
                                value={formData.recommendationScore}
                                onChange={(e) => setFormData(prev => ({ 
                                    ...prev, 
                                    recommendationScore: parseInt(e.target.value) 
                                }))}
                                className="flex-1"
                            />
                            <span className="text-white font-medium w-8">{formData.recommendationScore}</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>Not likely</span>
                            <span>Very likely</span>
                        </div>
                    </div>
                </div>

                {/* Contact Preference */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="contactForFollowUp"
                        checked={formData.contactForFollowUp}
                        onChange={(e) => setFormData(prev => ({ ...prev, contactForFollowUp: e.target.checked }))}
                        className="rounded border-gray-600 text-white/90 focus:ring-white bg-gray-700"
                    />
                    <label htmlFor="contactForFollowUp" className="ml-2 text-sm text-gray-300">
                        I'm okay with being contacted for follow-up questions
                    </label>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-4">
                    <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="px-6 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting || formData.title.trim().length < 5 || formData.description.trim().length < 10}
                        className="px-6 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 disabled:opacity-50 flex items-center space-x-2 transition-colors"
                    >
                        {submitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Submitting...</span>
                            </>
                        ) : (
                            <>
                                <Send size={16} />
                                <span>Submit Feedback</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default InlineFeedbackForm;