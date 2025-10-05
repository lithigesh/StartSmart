// components/admin/SustainabilityScoringSection.jsx
import React, { useState, useEffect } from 'react';
import { Leaf, Globe, DollarSign, TrendingUp, Plus, Edit2, Trash2, Search, Filter, Award, Target } from 'lucide-react';

const SustainabilityScoringSection = () => {
    const [assessments, setAssessments] = useState([]);
    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingAssessment, setEditingAssessment] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [scoreFilter, setScoreFilter] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        idea: '',
        // Environmental Impact
        carbonFootprint: 3,
        resourceUsage: 3,
        wasteReduction: 3,
        renewableEnergyUse: 3,
        // Social Impact
        communityBenefit: 3,
        inclusivityAccessibility: 3,
        jobCreation: 3,
        ethicalPractices: 3,
        // Economic Sustainability
        economicViability: 3,
        costEffectiveness: 3,
        marketDemand: 3,
        scalabilityPotential: 3,
        // Additional fields
        sdgAlignment: [],
        certifications: '',
        notes: '',
        recommendations: ''
    });

    const sdgOptions = [
        'No Poverty', 'Zero Hunger', 'Good Health and Well-being', 'Quality Education',
        'Gender Equality', 'Clean Water and Sanitation', 'Affordable and Clean Energy',
        'Decent Work and Economic Growth', 'Industry, Innovation and Infrastructure',
        'Reduced Inequalities', 'Sustainable Cities and Communities',
        'Responsible Consumption and Production', 'Climate Action', 'Life Below Water',
        'Life on Land', 'Peace, Justice and Strong Institutions', 'Partnerships for the Goals'
    ];

    const scoreLabels = {
        1: 'Very Poor',
        2: 'Poor', 
        3: 'Average',
        4: 'Good',
        5: 'Excellent'
    };

    useEffect(() => {
        fetchAssessments();
        fetchIdeas();
    }, []);

    const fetchAssessments = async () => {
        try {
            const token = localStorage.getItem('token');
            const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";
            const response = await fetch(`${API_BASE}/api/admin/sustainability`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Failed to fetch assessments');
            
            const data = await response.json();
            setAssessments(data.assessments || []);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching assessments:', err);
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
            setIdeas(data.ideas || []);
        } catch (err) {
            console.error('Error fetching ideas:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";
            const url = editingAssessment 
                ? `${API_BASE}/api/admin/sustainability/${editingAssessment._id}`
                : `${API_BASE}/api/admin/sustainability`;
            
            const method = editingAssessment ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to save assessment');

            await fetchAssessments();
            resetForm();
            setShowForm(false);
            setEditingAssessment(null);
            
            // Show success message
            setSuccessMessage(editingAssessment ? 'Sustainability assessment updated successfully!' : 'Sustainability assessment created successfully!');
            setTimeout(() => setSuccessMessage(''), 5000);
            
        } catch (err) {
            setError(err.message);
            console.error('Error saving assessment:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (assessment) => {
        setEditingAssessment(assessment);
        setFormData({
            idea: assessment.idea?._id || '',
            carbonFootprint: assessment.environmentalImpact?.carbonFootprint || 3,
            resourceUsage: assessment.environmentalImpact?.resourceUsage || 3,
            wasteReduction: assessment.environmentalImpact?.wasteReduction || 3,
            renewableEnergyUse: assessment.environmentalImpact?.renewableEnergyUse || 3,
            communityBenefit: assessment.socialImpact?.communityBenefit || 3,
            inclusivityAccessibility: assessment.socialImpact?.inclusivityAccessibility || 3,
            jobCreation: assessment.socialImpact?.jobCreation || 3,
            ethicalPractices: assessment.socialImpact?.ethicalPractices || 3,
            economicViability: assessment.economicSustainability?.economicViability || 3,
            costEffectiveness: assessment.economicSustainability?.costEffectiveness || 3,
            marketDemand: assessment.economicSustainability?.marketDemand || 3,
            scalabilityPotential: assessment.economicSustainability?.scalabilityPotential || 3,
            sdgAlignment: assessment.sdgAlignment || [],
            certifications: assessment.certifications || '',
            notes: assessment.notes || '',
            recommendations: assessment.recommendations || ''
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this sustainability assessment?')) return;

        try {
            const token = localStorage.getItem('token');
            const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";
            const response = await fetch(`${API_BASE}/api/admin/sustainability/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Failed to delete assessment');
            
            await fetchAssessments();
            
            // Show success message
            setSuccessMessage('Sustainability assessment deleted successfully!');
            setTimeout(() => setSuccessMessage(''), 5000);
            
        } catch (err) {
            setError(err.message);
            console.error('Error deleting assessment:', err);
        }
    };

    const resetForm = () => {
        setFormData({
            idea: '',
            carbonFootprint: 3,
            resourceUsage: 3,
            wasteReduction: 3,
            renewableEnergyUse: 3,
            communityBenefit: 3,
            inclusivityAccessibility: 3,
            jobCreation: 3,
            ethicalPractices: 3,
            economicViability: 3,
            costEffectiveness: 3,
            marketDemand: 3,
            scalabilityPotential: 3,
            sdgAlignment: [],
            certifications: '',
            notes: '',
            recommendations: ''
        });
    };

    const handleSdgChange = (sdg) => {
        const updatedSdgs = formData.sdgAlignment.includes(sdg)
            ? formData.sdgAlignment.filter(s => s !== sdg)
            : [...formData.sdgAlignment, sdg];
        setFormData({...formData, sdgAlignment: updatedSdgs});
    };

    const getScoreColor = (score) => {
        if (score >= 4.5) return 'text-green-600 bg-green-100';
        if (score >= 3.5) return 'text-blue-600 bg-blue-100';
        if (score >= 2.5) return 'text-yellow-600 bg-yellow-100';
        return 'text-red-600 bg-red-100';
    };

    const ScoreSlider = ({ label, value, onChange, icon: Icon }) => (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="flex items-center text-sm font-medium text-gray-700">
                    <Icon size={16} className="mr-2" />
                    {label}
                </label>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getScoreColor(value)}`}>
                    {value} - {scoreLabels[value]}
                </span>
            </div>
            <input
                type="range"
                min="1"
                max="5"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
            </div>
        </div>
    );

    const filteredAssessments = assessments.filter(assessment => {
        const matchesSearch = !searchTerm || 
            assessment.idea?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            assessment.notes?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesScore = !scoreFilter || 
            (scoreFilter === 'high' && assessment.overallScore >= 4) ||
            (scoreFilter === 'medium' && assessment.overallScore >= 2.5 && assessment.overallScore < 4) ||
            (scoreFilter === 'low' && assessment.overallScore < 2.5);

        return matchesSearch && matchesScore;
    });

    if (loading && assessments.length === 0) {
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
            <div className="bg-gradient-to-br from-white/95 to-green-50/90 backdrop-blur-sm rounded-xl shadow-lg border border-green-100/50 p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                            <Leaf className="mr-3 text-green-600" />
                            Sustainability Scoring
                        </h2>
                        <p className="text-gray-600 mt-1">Evaluate environmental, social, and economic sustainability</p>
                    </div>
                    <button
                        onClick={() => {
                            resetForm();
                            setEditingAssessment(null);
                            setShowForm(true);
                        }}
                        className="enhanced-button bg-gradient-to-r from-green-500/90 to-green-600/90 text-white px-6 py-3 rounded-lg hover:from-green-400/95 hover:to-green-500/95 transition-all duration-300 flex items-center shadow-lg backdrop-blur-sm border border-green-400/30"
                    >
                        <Plus size={20} className="mr-2" />
                        New Assessment
                    </button>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search assessments..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500/50 focus:border-green-400 bg-white/70 backdrop-blur-sm transition-all duration-200"
                        />
                    </div>
                    
                    <select
                        value={scoreFilter}
                        onChange={(e) => setScoreFilter(e.target.value)}
                        className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500/50 focus:border-green-400 bg-white/70 backdrop-blur-sm transition-all duration-200"
                    >
                        <option value="">All Scores</option>
                        <option value="high">High (4.0+)</option>
                        <option value="medium">Medium (2.5-3.9)</option>
                        <option value="low">Low (&lt; 2.5)</option>
                    </select>

                    <div className="text-sm text-gray-600 flex items-center">
                        <Filter size={16} className="mr-1" />
                        {filteredAssessments.length} of {assessments.length} assessments
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-3">
                        <Leaf className="text-green-600" size={20} />
                        {successMessage}
                    </div>
                )}
            </div>

            {/* Assessment Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gradient-to-br from-white/95 to-green-50/90 backdrop-blur-md rounded-xl shadow-2xl border border-green-200/50 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h3 className="text-xl font-semibold mb-4">
                                {editingAssessment ? 'Edit Sustainability Assessment' : 'New Sustainability Assessment'}
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Idea Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Idea *
                                    </label>
                                    <select
                                        value={formData.idea}
                                        onChange={(e) => setFormData({...formData, idea: e.target.value})}
                                        required
                                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    >
                                        <option value="">Choose an idea...</option>
                                        {ideas.map(idea => (
                                            <option key={idea._id} value={idea._id}>
                                                {idea.title} - {idea.owner?.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Environmental Impact */}
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h4 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                                        <Globe className="mr-2" />
                                        Environmental Impact
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <ScoreSlider
                                            label="Carbon Footprint Reduction"
                                            value={formData.carbonFootprint}
                                            onChange={(value) => setFormData({...formData, carbonFootprint: value})}
                                            icon={TrendingUp}
                                        />
                                        <ScoreSlider
                                            label="Resource Usage Efficiency"
                                            value={formData.resourceUsage}
                                            onChange={(value) => setFormData({...formData, resourceUsage: value})}
                                            icon={Target}
                                        />
                                        <ScoreSlider
                                            label="Waste Reduction"
                                            value={formData.wasteReduction}
                                            onChange={(value) => setFormData({...formData, wasteReduction: value})}
                                            icon={Leaf}
                                        />
                                        <ScoreSlider
                                            label="Renewable Energy Use"
                                            value={formData.renewableEnergyUse}
                                            onChange={(value) => setFormData({...formData, renewableEnergyUse: value})}
                                            icon={Globe}
                                        />
                                    </div>
                                </div>

                                {/* Social Impact */}
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                                        <Globe className="mr-2" />
                                        Social Impact
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <ScoreSlider
                                            label="Community Benefit"
                                            value={formData.communityBenefit}
                                            onChange={(value) => setFormData({...formData, communityBenefit: value})}
                                            icon={Globe}
                                        />
                                        <ScoreSlider
                                            label="Inclusivity & Accessibility"
                                            value={formData.inclusivityAccessibility}
                                            onChange={(value) => setFormData({...formData, inclusivityAccessibility: value})}
                                            icon={Target}
                                        />
                                        <ScoreSlider
                                            label="Job Creation Potential"
                                            value={formData.jobCreation}
                                            onChange={(value) => setFormData({...formData, jobCreation: value})}
                                            icon={TrendingUp}
                                        />
                                        <ScoreSlider
                                            label="Ethical Practices"
                                            value={formData.ethicalPractices}
                                            onChange={(value) => setFormData({...formData, ethicalPractices: value})}
                                            icon={Award}
                                        />
                                    </div>
                                </div>

                                {/* Economic Sustainability */}
                                <div className="bg-yellow-50 p-4 rounded-lg">
                                    <h4 className="text-lg font-semibold text-yellow-800 mb-4 flex items-center">
                                        <DollarSign className="mr-2" />
                                        Economic Sustainability
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <ScoreSlider
                                            label="Economic Viability"
                                            value={formData.economicViability}
                                            onChange={(value) => setFormData({...formData, economicViability: value})}
                                            icon={DollarSign}
                                        />
                                        <ScoreSlider
                                            label="Cost Effectiveness"
                                            value={formData.costEffectiveness}
                                            onChange={(value) => setFormData({...formData, costEffectiveness: value})}
                                            icon={Target}
                                        />
                                        <ScoreSlider
                                            label="Market Demand"
                                            value={formData.marketDemand}
                                            onChange={(value) => setFormData({...formData, marketDemand: value})}
                                            icon={TrendingUp}
                                        />
                                        <ScoreSlider
                                            label="Scalability Potential"
                                            value={formData.scalabilityPotential}
                                            onChange={(value) => setFormData({...formData, scalabilityPotential: value})}
                                            icon={Globe}
                                        />
                                    </div>
                                </div>

                                {/* SDG Alignment */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        UN SDG Alignment
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                                        {sdgOptions.map(sdg => (
                                            <label key={sdg} className="flex items-center text-sm">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.sdgAlignment.includes(sdg)}
                                                    onChange={() => handleSdgChange(sdg)}
                                                    className="rounded border-gray-300 text-green-600 focus:ring-green-500 mr-2"
                                                />
                                                <span className="truncate">{sdg}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Additional Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Certifications
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.certifications}
                                            onChange={(e) => setFormData({...formData, certifications: e.target.value})}
                                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            placeholder="B-Corp, ISO 14001, etc."
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Assessment Notes
                                    </label>
                                    <textarea
                                        value={formData.notes}
                                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                        rows={3}
                                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        placeholder="Additional notes about the sustainability assessment..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Recommendations
                                    </label>
                                    <textarea
                                        value={formData.recommendations}
                                        onChange={(e) => setFormData({...formData, recommendations: e.target.value})}
                                        rows={3}
                                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        placeholder="Recommendations for improving sustainability..."
                                    />
                                </div>

                                {/* Form Actions */}
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowForm(false);
                                            setEditingAssessment(null);
                                            resetForm();
                                        }}
                                        className="enhanced-button px-6 py-2 border border-gray-300/70 rounded-lg text-gray-700 hover:bg-gray-50/80 backdrop-blur-sm transition-all duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="enhanced-button px-6 py-2 bg-gradient-to-r from-green-500/90 to-green-600/90 text-white rounded-lg hover:from-green-400/95 hover:to-green-500/95 transition-all duration-300 disabled:opacity-50 shadow-lg backdrop-blur-sm border border-green-400/30"
                                    >
                                        {loading ? 'Saving...' : (editingAssessment ? 'Update' : 'Create')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Assessments List */}
            <div className="bg-gradient-to-br from-white/95 to-green-50/30 backdrop-blur-sm rounded-xl shadow-lg border border-green-100/50">
                <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Sustainability Assessments</h3>
                    
                    {filteredAssessments.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <Leaf size={48} className="mx-auto mb-4 text-gray-300" />
                            <p>No sustainability assessments found matching your criteria.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredAssessments.map(assessment => (
                                <div key={assessment._id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h4 className="font-medium text-gray-900">
                                                    {assessment.idea?.title || 'Unknown Idea'}
                                                </h4>
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(assessment.overallScore)}`}>
                                                    Overall: {assessment.overallScore?.toFixed(1)}/5.0
                                                </span>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                                                <div className="bg-green-50 p-3 rounded">
                                                    <div className="flex items-center mb-1">
                                                        <Globe size={16} className="mr-2 text-green-600" />
                                                        <span className="text-sm font-medium text-green-800">Environmental</span>
                                                    </div>
                                                    <span className="text-lg font-bold text-green-700">
                                                        {assessment.environmentalImpact?.score?.toFixed(1) || 'N/A'}
                                                    </span>
                                                </div>
                                                
                                                <div className="bg-blue-50 p-3 rounded">
                                                    <div className="flex items-center mb-1">
                                                        <Globe size={16} className="mr-2 text-blue-600" />
                                                        <span className="text-sm font-medium text-blue-800">Social</span>
                                                    </div>
                                                    <span className="text-lg font-bold text-blue-700">
                                                        {assessment.socialImpact?.score?.toFixed(1) || 'N/A'}
                                                    </span>
                                                </div>
                                                
                                                <div className="bg-yellow-50 p-3 rounded">
                                                    <div className="flex items-center mb-1">
                                                        <DollarSign size={16} className="mr-2 text-yellow-600" />
                                                        <span className="text-sm font-medium text-yellow-800">Economic</span>
                                                    </div>
                                                    <span className="text-lg font-bold text-yellow-700">
                                                        {assessment.economicSustainability?.score?.toFixed(1) || 'N/A'}
                                                    </span>
                                                </div>
                                            </div>

                                            {assessment.sdgAlignment && assessment.sdgAlignment.length > 0 && (
                                                <div className="mb-2">
                                                    <span className="text-sm font-medium text-gray-700">SDG Alignment: </span>
                                                    <span className="text-sm text-gray-600">
                                                        {assessment.sdgAlignment.slice(0, 3).join(', ')}
                                                        {assessment.sdgAlignment.length > 3 && ` +${assessment.sdgAlignment.length - 3} more`}
                                                    </span>
                                                </div>
                                            )}

                                            {assessment.notes && (
                                                <p className="text-sm text-gray-600 mb-2">{assessment.notes}</p>
                                            )}

                                            <div className="text-xs text-gray-500">
                                                Assessed on {new Date(assessment.createdAt).toLocaleDateString()} by {assessment.assessor?.name || 'Admin'}
                                            </div>
                                        </div>
                                        
                                        <div className="flex space-x-2 ml-4">
                                            <button
                                                onClick={() => handleEdit(assessment)}
                                                className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(assessment._id)}
                                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
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

export default SustainabilityScoringSection;