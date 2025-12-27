// components/admin/FeedbackFormsSection.jsx
import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, ThumbsUp, ThumbsDown, Eye, EyeOff, Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';

const FeedbackFormsSection = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingFeedback, setEditingFeedback] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [ratingFilter, setRatingFilter] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        ideaId: '',
        category: 'general',
        rating: 5,
        comments: '',
        suggestions: '',
        strengths: [],
        improvements: [],
        followUpRequired: false,
        followUpNotes: '',
        visibility: 'entrepreneur_only'
    });

    const categories = [
        'general', 'feasibility', 'innovation', 'market_potential', 'technical', 'presentation'
    ];

    const visibilityOptions = [
        { value: 'entrepreneur_only', label: 'Entrepreneur Only' },
        { value: 'public', label: 'Public' },
        { value: 'private', label: 'Private' }
    ];

    useEffect(() => {
        fetchFeedbacks();
        fetchIdeas();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const token = localStorage.getItem('token');
            const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";
            const response = await fetch(`${API_BASE}/api/admin/feedback`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Failed to fetch feedbacks');
            
            const data = await response.json();
            setFeedbacks(data.feedback || []);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching feedbacks:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchIdeas = async () => {
        try {
            const token = localStorage.getItem('token');
            const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";
            const response = await fetch(`${API_BASE}/api/admin/ideas`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Failed to fetch ideas');
            
            const data = await response.json();
            setIdeas(Array.isArray(data) ? data : data.ideas || []);
            console.log('Fetched ideas:', data);
        } catch (err) {
            console.error('Error fetching ideas:', err);
            setError('Failed to load ideas. Please try again.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";
            const url = editingFeedback 
                ? `${API_BASE}/api/admin/feedback/${editingFeedback._id}`
                : `${API_BASE}/api/admin/feedback`;
            
            const method = editingFeedback ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to save feedback');

            await fetchFeedbacks();
            resetForm();
            setShowForm(false);
            setEditingFeedback(null);
            
            // Show success message
            setSuccessMessage(editingFeedback ? 'Feedback updated successfully!' : 'Feedback created successfully!');
            setTimeout(() => setSuccessMessage(''), 5000);
            
        } catch (err) {
            setError(err.message);
            console.error('Error saving feedback:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (feedback) => {
        setEditingFeedback(feedback);
        setFormData({
            ideaId: feedback.idea?._id || '',
            category: feedback.category || 'general',
            rating: feedback.rating || 5,
            comments: feedback.comments || feedback.comment || '',
            suggestions: feedback.suggestions || '',
            strengths: Array.isArray(feedback.strengths) ? feedback.strengths : [],
            improvements: Array.isArray(feedback.improvements) ? feedback.improvements : [],
            followUpRequired: feedback.followUpRequired || false,
            followUpNotes: feedback.followUpNotes || '',
            visibility: feedback.visibility || 'entrepreneur_only'
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this feedback?')) return;

        try {
            const token = localStorage.getItem('token');
            const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";
            const response = await fetch(`${API_BASE}/api/admin/feedback/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Failed to delete feedback');
            
            await fetchFeedbacks();
            
            // Show success message
            setSuccessMessage('Feedback deleted successfully!');
            setTimeout(() => setSuccessMessage(''), 5000);
            
        } catch (err) {
            setError(err.message);
            console.error('Error deleting feedback:', err);
        }
    };

    const resetForm = () => {
        setFormData({
            ideaId: '',
            category: 'general',
            rating: 5,
            comments: '',
            suggestions: '',
            strengths: [],
            improvements: [],
            followUpRequired: false,
            followUpNotes: '',
            visibility: 'entrepreneur_only'
        });
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                size={16}
                className={i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
            />
        ));
    };

    const filteredFeedbacks = feedbacks.filter(feedback => {
        const matchesSearch = !searchTerm || 
            feedback.comments?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            feedback.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            feedback.suggestions?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            feedback.idea?.title?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory = !categoryFilter || feedback.category === categoryFilter;
        const matchesRating = !ratingFilter || feedback.rating === parseInt(ratingFilter);

        return matchesSearch && matchesCategory && matchesRating;
    });

    if (loading && feedbacks.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center">
                            <MessageSquare className="mr-3 text-white" />
                            Ideas Feedback
                        </h2>
                        <p className="text-white/70 mt-1">Provide comprehensive feedback for all submitted ideas</p>
                    </div>
                    <button
                        onClick={() => {
                            resetForm();
                            setEditingFeedback(null);
                            setShowForm(true);
                        }}
                        className="bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-200 transition-all duration-300 flex items-center font-medium"
                    >
                        <Plus size={20} className="mr-2" />
                        Add Feedback
                    </button>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                        <input
                            type="text"
                            placeholder="Search feedback..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-full border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:border-white/40 focus:bg-white/[0.08] bg-white/[0.05] backdrop-blur-sm transition-all duration-300 text-white placeholder-white/50"
                        />
                    </div>
                    
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:border-white/40 focus:bg-white/[0.08] bg-white/[0.05] backdrop-blur-sm transition-all duration-300 text-white"
                    >
                        <option value="" className="bg-gray-800 text-white">All Categories</option>
                        {categories.map(category => (
                            <option key={category} value={category} className="bg-gray-800 text-white">
                                {category.replace('_', ' ').toUpperCase()}
                            </option>
                        ))}
                    </select>

                    <select
                        value={ratingFilter}
                        onChange={(e) => setRatingFilter(e.target.value)}
                        className="border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:border-white/40 focus:bg-white/[0.08] bg-white/[0.05] backdrop-blur-sm transition-all duration-300 text-white"
                    >
                        <option value="" className="bg-gray-800 text-white">All Ratings</option>
                        {[5, 4, 3, 2, 1].map(rating => (
                            <option key={rating} value={rating} className="bg-gray-800 text-white">
                                {rating} Star{rating !== 1 ? 's' : ''}
                            </option>
                        ))}
                    </select>

                    <div className="text-sm text-white/70 flex items-center">
                        <Filter size={16} className="mr-1" />
                        {filteredFeedbacks.length} of {feedbacks.length} feedback items
                    </div>
                </div>

                {error && (
                    <div className="bg-gradient-to-r from-red-900/30 to-red-800/20 border border-red-500/30 rounded-lg backdrop-blur-sm px-4 py-3 mb-4">
                        <p className="text-red-400 text-sm font-manrope">{error}</p>
                    </div>
                )}

                {successMessage && (
                    <div className="bg-gradient-to-r from-green-900/30 to-green-800/20 border border-green-500/30 rounded-lg backdrop-blur-sm px-4 py-3 mb-4 flex items-center gap-3">
                        <MessageSquare className="text-green-400" size={20} />
                        <p className="text-green-400 text-sm font-manrope">{successMessage}</p>
                    </div>
                )}
            </div>

            {/* Feedback Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
                     style={{
                       backdropFilter: 'blur(20px)',
                       WebkitBackdropFilter: 'blur(20px)'
                     }}>
                    <div className="bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ml-0 md:ml-32">
                        <div className="p-6">
                            <h3 className="text-xl font-semibold mb-4 text-white">
                                {editingFeedback ? 'Edit Feedback' : 'Add New Feedback'}
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Idea Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">
                                        Select Idea *
                                    </label>
                                    <select
                                        value={formData.ideaId}
                                        onChange={(e) => setFormData({...formData, ideaId: e.target.value})}
                                        required
                                        className="w-full border border-white/20 bg-white/[0.05] text-white rounded-lg px-3 py-2 focus:outline-none focus:border-white/40 focus:bg-white/[0.08] transition-all duration-300"
                                    >
                                        <option value="" className="bg-gray-800 text-white">Choose an idea...</option>
                                        {ideas.map(idea => (
                                            <option key={idea._id} value={idea._id} className="bg-gray-800 text-white">
                                                {idea.title} - {idea.owner?.name || 'Unknown Owner'}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Category and Rating */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-2">
                                            Category
                                        </label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                                            className="w-full border border-white/20 bg-white/[0.05] text-white rounded-lg px-3 py-2 focus:outline-none focus:border-white/40 focus:bg-white/[0.08] transition-all duration-300"
                                        >
                                            {categories.map(category => (
                                                <option key={category} value={category} className="bg-gray-800 text-white">
                                                    {category.replace('_', ' ').toUpperCase()}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-2">
                                            Rating (1-5)
                                        </label>
                                        <select
                                            value={formData.rating}
                                            onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
                                            className="w-full border border-white/20 bg-white/[0.05] text-white rounded-lg px-3 py-2 focus:outline-none focus:border-white/40 focus:bg-white/[0.08] transition-all duration-300"
                                        >
                                            {[5, 4, 3, 2, 1].map(rating => (
                                                <option key={rating} value={rating} className="bg-gray-800 text-white">
                                                    {rating} - {['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating - 1]}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>



                                {/* Comments */}
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">
                                        Comments *
                                    </label>
                                    <textarea
                                        value={formData.comments}
                                        onChange={(e) => setFormData({...formData, comments: e.target.value})}
                                        required
                                        rows={4}
                                        className="w-full border border-white/20 bg-white/[0.05] text-white rounded-lg px-3 py-2 focus:outline-none focus:border-white/40 focus:bg-white/[0.08] transition-all duration-300 placeholder-white/50"
                                        placeholder="Detailed feedback comments..."
                                    />
                                </div>

                                {/* Suggestions */}
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">
                                        Suggestions
                                    </label>
                                    <textarea
                                        value={formData.suggestions}
                                        onChange={(e) => setFormData({...formData, suggestions: e.target.value})}
                                        rows={3}
                                        className="w-full border border-white/20 bg-white/[0.05] text-white rounded-lg px-3 py-2 focus:outline-none focus:border-white/40 focus:bg-white/[0.08] transition-all duration-300 placeholder-white/50"
                                        placeholder="Suggestions for improvement..."
                                    />
                                </div>

                                {/* Strengths and Improvements */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-2">
                                            Strengths (one per line)
                                        </label>
                                        <textarea
                                            value={formData.strengths.join('\n')}
                                            onChange={(e) => setFormData({...formData, strengths: e.target.value.split('\n').filter(s => s.trim())})}
                                            rows={3}
                                            className="w-full border border-white/20 bg-white/[0.05] text-white rounded-lg px-3 py-2 focus:outline-none focus:border-white/40 focus:bg-white/[0.08] transition-all duration-300 placeholder-white/50"
                                            placeholder="What works well...\nGood market research\nStrong team"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-2">
                                            Areas for Improvement (one per line)
                                        </label>
                                        <textarea
                                            value={formData.improvements.join('\n')}
                                            onChange={(e) => setFormData({...formData, improvements: e.target.value.split('\n').filter(s => s.trim())})}
                                            rows={3}
                                            className="w-full border border-white/20 bg-white/[0.05] text-white rounded-lg px-3 py-2 focus:outline-none focus:border-white/40 focus:bg-white/[0.08] transition-all duration-300 placeholder-white/50"
                                            placeholder="Areas that need improvement...\nBetter financial projections\nMore detailed timeline"
                                        />
                                    </div>
                                </div>

                                {/* Follow-up */}
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="followUp"
                                            checked={formData.followUpRequired}
                                            onChange={(e) => setFormData({...formData, followUpRequired: e.target.checked})}
                                            className="rounded border-white/30 text-white focus:ring-white/40 bg-white/10"
                                        />
                                        <label htmlFor="followUp" className="ml-2 text-sm font-medium text-white/70">
                                            Follow-up required
                                        </label>
                                    </div>

                                    {formData.followUpRequired && (
                                        <div>
                                            <label className="block text-sm font-medium text-white/70 mb-2">
                                                Follow-up Notes
                                            </label>
                                            <textarea
                                                value={formData.followUpNotes}
                                                onChange={(e) => setFormData({...formData, followUpNotes: e.target.value})}
                                                rows={2}
                                                className="w-full border border-white/20 bg-white/[0.05] text-white rounded-lg px-3 py-2 focus:outline-none focus:border-white/40 focus:bg-white/[0.08] transition-all duration-300 placeholder-white/50"
                                                placeholder="Notes for follow-up actions..."
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Visibility */}
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">
                                        Visibility
                                    </label>
                                    <select
                                        value={formData.visibility}
                                        onChange={(e) => setFormData({...formData, visibility: e.target.value})}
                                        className="w-full border border-white/20 bg-white/[0.05] text-white rounded-lg px-3 py-2 focus:outline-none focus:border-white/40 focus:bg-white/[0.08] transition-all duration-300"
                                    >
                                        {visibilityOptions.map(option => (
                                            <option key={option.value} value={option.value} className="bg-gray-800 text-white">
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Form Actions */}
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowForm(false);
                                            setEditingFeedback(null);
                                            resetForm();
                                        }}
                                        className="px-6 py-2 border border-white/20 rounded-lg text-white/70 hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-all duration-300 disabled:opacity-50 font-medium"
                                    >
                                        {loading ? 'Saving...' : (editingFeedback ? 'Update' : 'Create')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Feedback List */}
            <div className="bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl">
                <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4 text-white">Recent Feedback</h3>
                    
                    {filteredFeedbacks.length === 0 ? (
                        <div className="text-center py-12 text-white/50">
                            <MessageSquare size={48} className="mx-auto mb-4 text-white/30" />
                            <p className="text-lg mb-2 text-white/70">No feedback available yet</p>
                            <p className="text-sm text-white/50">Click "Add Feedback" above to provide feedback for ideas</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredFeedbacks.map(feedback => (
                                <div key={feedback._id} className="border border-white/10 bg-white/[0.05] rounded-lg p-4 hover:bg-white/[0.08] transition-colors">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h4 className="font-medium text-white">
                                                    Feedback for: {feedback.idea?.title || 'Unknown Idea'}
                                                </h4>
                                                <div className="flex items-center">
                                                    {renderStars(feedback.rating)}
                                                    <span className="ml-1 text-sm text-white/70">
                                                        ({feedback.rating}/5)
                                                    </span>
                                                </div>
                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                    feedback.visibility === 'public' ? 'bg-white/20 text-white border border-white/30' :
                                                    feedback.visibility === 'private' ? 'bg-white/15 text-white/80 border border-white/20' :
                                                    'bg-white/10 text-white/70 border border-white/20'
                                                }`}>
                                                    {feedback.visibility === 'private' ? (
                                                        <><EyeOff size={12} className="inline mr-1" />Private</>
                                                    ) : feedback.visibility === 'public' ? (
                                                        <><Eye size={12} className="inline mr-1" />Public</>
                                                    ) : (
                                                        <><Eye size={12} className="inline mr-1" />Entrepreneur Only</>
                                                    )}
                                                </span>
                                            </div>
                                            
                                            <div className="text-sm text-white/50 mb-2">
                                                <strong>Idea:</strong> {feedback.idea?.title || 'Unknown Idea'} |
                                                <strong className="ml-2">Category:</strong> {feedback.category?.replace('_', ' ').toUpperCase()} |
                                                <strong className="ml-2">Date:</strong> {new Date(feedback.createdAt).toLocaleDateString()}
                                            </div>
                                            
                                            <p className="text-white/70 mb-2">{feedback.comments || feedback.comment}</p>
                                            
                                            {feedback.suggestions && (
                                                <div className="text-sm text-white/80 bg-white/[0.08] border border-white/10 p-2 rounded mb-2">
                                                    <strong className="text-white">Suggestions:</strong> {feedback.suggestions}
                                                </div>
                                            )}

                                            {feedback.strengths && Array.isArray(feedback.strengths) && feedback.strengths.length > 0 && (
                                                <div className="text-sm text-white/80 bg-white/[0.08] border border-white/10 p-2 rounded mb-2">
                                                    <strong className="text-white">Strengths:</strong>
                                                    <ul className="list-disc list-inside mt-1">
                                                        {feedback.strengths.map((strength, index) => (
                                                            <li key={index}>{strength}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {feedback.improvements && Array.isArray(feedback.improvements) && feedback.improvements.length > 0 && (
                                                <div className="text-sm text-white/80 bg-white/[0.08] border border-white/10 p-2 rounded mb-2">
                                                    <strong className="text-white">Areas for Improvement:</strong>
                                                    <ul className="list-disc list-inside mt-1">
                                                        {feedback.improvements.map((improvement, index) => (
                                                            <li key={index}>{improvement}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            
                                            {feedback.followUpRequired && (
                                                <div className="flex items-center text-sm text-white/80 bg-white/[0.08] border border-white/10 p-2 rounded">
                                                    <ThumbsUp size={16} className="mr-2 text-white" />
                                                    <strong className="text-white">Follow-up required</strong>
                                                    {feedback.followUpNotes && (
                                                        <span className="ml-2">: {feedback.followUpNotes}</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="flex space-x-2 ml-4">
                                            <button
                                                onClick={() => handleEdit(feedback)}
                                                className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded transition-colors"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(feedback._id)}
                                                className="p-2 text-white/50 hover:text-red-400 hover:bg-red-900/30 rounded transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FeedbackFormsSection;