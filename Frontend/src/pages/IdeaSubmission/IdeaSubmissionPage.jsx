import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ErrorBoundary from '../../components/ErrorBoundary';
import IdeaMasterForm from './components/IdeaMasterForm';
import toast from 'react-hot-toast';

const IdeaSubmissionPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle successful form submission
  const handleFormSuccess = (result) => {
    if (result.success && result.data) {
      // Show success toast with transparency
      toast.success('Idea submitted successfully!', {
        duration: 3000,
        position: 'bottom-right',
        style: {
          background: 'rgba(16, 185, 129, 0.9)',
          color: '#fff',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        },
        icon: '✓',
      });
      
      // Navigate back to entrepreneur dashboard after brief delay
      setTimeout(() => {
        navigate('/entrepreneur');
      }, 1500);
    }
  };

  // Handle form submission errors
  const handleFormError = (error) => {
    toast.error(error || 'Failed to submit idea', {
      duration: 4000,
      position: 'bottom-right',
      style: {
        background: 'rgba(239, 68, 68, 0.9)',
        color: '#fff',
        borderRadius: '12px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      },
    });
  };

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
        <div className="bg-black/95 backdrop-blur-xl border-b border-white/20 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                    <span className="text-5xl">💡</span>
                    Submit Your Idea
                  </h1>
                  <p className="mt-2 text-gray-300 text-lg">
                    Share your innovative concept and start your entrepreneurial journey
                  </p>
                </div>
                <button
                  onClick={() => navigate('/entrepreneur')}
                  className="px-6 py-3 text-gray-300 hover:text-white focus:outline-none transition-all hover:scale-105 flex items-center gap-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10"
                >
                  ← Back
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <IdeaMasterForm
            onSuccess={handleFormSuccess}
            onError={handleFormError}
          />
        </div>

        {/* Footer */}
        <div className="bg-black/95 border-t border-white/10 py-6 mt-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-400 text-sm">
              Need help? Contact our support team or check the FAQ section
            </p>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default IdeaSubmissionPage;