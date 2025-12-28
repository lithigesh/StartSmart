import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ErrorBoundary from '../../components/ErrorBoundary';
import IdeaMasterForm from './components/IdeaMasterForm';
import TeamResourceForm from './components/TeamResourceForm';
import BusinessAimForm from './components/BusinessAimForm';

const IdeaSubmissionPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState('idea');
  const [formData, setFormData] = useState({
    idea: {},
    team: {},
    business: {}
  });
  const [savedData, setSavedData] = useState({
    ideaId: null,
    teamResourceId: null,
    businessAimId: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  // Check if user is authenticated and has entrepreneur role
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role !== 'entrepreneur') {
      navigate('/');
      return;
    }
  }, [user, navigate]);

  // Handle tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSubmitError('');
    setSubmitSuccess('');
  };

  // Handle form data changes
  const handleFormDataChange = (tab, data) => {
    setFormData(prev => ({
      ...prev,
      [tab]: data
    }));
  };

  // Handle successful form submission
  const handleFormSuccess = (tab, result) => {
    if (result.success && result.data) {
      if (tab === 'idea') {
        setSavedData(prev => ({
          ...prev,
          ideaId: result.data._id || result.data.id
        }));
        setSubmitSuccess('Idea master saved successfully!');
        
        // Auto-navigate to team tab if this is a new submission
        if (!savedData.ideaId) {
          setTimeout(() => {
            setActiveTab('team');
            setSubmitSuccess('');
          }, 2000);
        }
      } else if (tab === 'team') {
        setSavedData(prev => ({
          ...prev,
          teamResourceId: result.data._id || result.data.id
        }));
        setSubmitSuccess('Team & resources saved successfully!');
        
        // Auto-navigate to business tab
        setTimeout(() => {
          setActiveTab('business');
          setSubmitSuccess('');
        }, 2000);
      } else if (tab === 'business') {
        setSavedData(prev => ({
          ...prev,
          businessAimId: result.data._id || result.data.id
        }));
        setSubmitSuccess('Business aim saved successfully! Your complete idea submission is ready.');
        
        // Navigate to entrepreneur dashboard after completion
        setTimeout(() => {
          navigate('/entrepreneur');
        }, 3000);
      }
    }
  };

  // Handle form submission errors
  const handleFormError = (tab, error) => {
    setSubmitError(error);
  };

  const tabs = [
    {
      id: 'idea',
      name: 'Idea Master',
      description: 'Core concept & problem',
      icon: '💡',
      completed: !!savedData.ideaId
    },
    {
      id: 'team',
      name: 'Team & Resources',
      description: 'Team structure & needs',
      icon: '👥',
      completed: !!savedData.teamResourceId,
      disabled: false // Allow access to enable smooth navigation
    },
    {
      id: 'business',
      name: 'Business Aim',
      description: 'Strategy & financials',
      icon: '📈',
      completed: !!savedData.businessAimId,
      disabled: false // Allow access to enable smooth navigation
    }
  ];

  if (!user || user.role !== 'entrepreneur') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-black">
        {/* Header */}
        <div className="bg-black/95 backdrop-blur-xl border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white">Submit Your Idea</h1>
                  <p className="mt-2 text-gray-400">
                    Transform your innovative concept into a comprehensive business proposal through our structured 3-step process.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/entrepreneur')}
                  className="px-4 py-2 text-gray-400 hover:text-white focus:outline-none"
                >
                  ← Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="bg-black/95 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4">
              <nav className="flex space-x-8" aria-label="Tabs">
                {tabs.map((tab, index) => {
                  const isActive = activeTab === tab.id;
                  const isCompleted = tab.completed;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`
                        flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                        ${isActive 
                          ? 'bg-black/95 border-2 border-white text-white' 
                          : isCompleted
                            ? 'bg-black/95 border-2 border-green-500 text-green-400 hover:bg-gray-700'
                            : 'bg-black/95 border-2 border-gray-600 text-gray-400 hover:bg-gray-700'
                        }
                      `}
                    >
                      <span className="text-2xl">{tab.icon}</span>
                      <div className="text-left">
                        <div className="font-medium flex items-center">
                          {tab.name}
                          {isCompleted && (
                            <span className="ml-2 text-green-400">
                              ✓
                            </span>
                          )}
                        </div>
                        <div className="text-sm opacity-75">{tab.description}</div>
                      </div>
                      {index < tabs.length - 1 && (
                        <div className="hidden md:block ml-4 text-gray-500">→</div>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {submitSuccess && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <div className="bg-green-900 border border-green-500 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-green-400 text-xl">✓</span>
                </div>
                <div className="ml-3">
                  <p className="text-green-400">{submitSuccess}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {submitError && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <div className="bg-red-900 border border-red-500 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-red-400 text-xl">✕</span>
                </div>
                <div className="ml-3">
                  <p className="text-red-400">{submitError}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'idea' && (
            <IdeaMasterForm
              onDataChange={(data) => handleFormDataChange('idea', data)}
              onSuccess={(result) => handleFormSuccess('idea', result)}
              onError={(error) => handleFormError('idea', error)}
              initialData={formData.idea}
              isEditMode={!!savedData.ideaId}
            />
          )}

          {activeTab === 'team' && (
            <TeamResourceForm
              onDataChange={(data) => handleFormDataChange('team', data)}
              onSuccess={(result) => handleFormSuccess('team', result)}
              onError={(error) => handleFormError('team', error)}
              initialData={formData.team}
              ideaId={savedData.ideaId}
              isEditMode={!!savedData.teamResourceId}
            />
          )}

          {activeTab === 'business' && (
            <BusinessAimForm
              onDataChange={(data) => handleFormDataChange('business', data)}
              onSuccess={(result) => handleFormSuccess('business', result)}
              onError={(error) => handleFormError('business', error)}
              initialData={formData.business}
              ideaId={savedData.ideaId}
              isEditMode={!!savedData.businessAimId}
            />
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-900 border-t border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center text-sm text-gray-400">
              <div>
                <p>Step {tabs.findIndex(tab => tab.id === activeTab) + 1} of {tabs.length}</p>
              </div>
              <div className="flex space-x-4">
                {activeTab !== 'idea' && (
                  <button
                    onClick={() => {
                      const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
                      if (currentIndex > 0) {
                        handleTabChange(tabs[currentIndex - 1].id);
                      }
                    }}
                    className="text-white hover:text-gray-300"
                  >
                    ← Previous
                  </button>
                )}
                {activeTab !== 'business' && (
                  <button
                    onClick={() => {
                      const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
                      if (currentIndex < tabs.length - 1) {
                        handleTabChange(tabs[currentIndex + 1].id);
                      }
                    }}
                    className="text-white hover:text-gray-300"
                  >
                    Next →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default IdeaSubmissionPage;