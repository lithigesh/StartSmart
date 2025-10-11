import React from 'react';
import { FaTimes } from 'react-icons/fa';

const IdeathonRegistrationModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto">
      {/* Backdrop with blur */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-xl" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl mx-4 my-8 bg-black border border-white/20 rounded-2xl overflow-hidden z-[101] shadow-2xl">
        <div className="max-h-[90vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default IdeathonRegistrationModal;