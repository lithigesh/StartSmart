import React from 'react';

const UpdateSuccessModal = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]">
            <div className="bg-emerald-600 rounded-lg p-6 shadow-xl max-w-md mx-auto text-center transform transition-all scale-110 animate-fade-in">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-white text-xl font-bold mb-2">Update Successful!</h3>
                <p className="text-white/90 mb-4">Your registration details have been updated successfully.</p>
            </div>
        </div>
    );
};

export default UpdateSuccessModal;