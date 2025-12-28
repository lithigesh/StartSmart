import React from "react";
import { FaSync } from "react-icons/fa";

const ErrorMessage = ({ error, onRetry, onDismiss }) => {
  if (!error) return null;

  return (
    <div className="mb-6 bg-white/10 border border-white/20 rounded-lg p-4">
      <div className="flex justify-between items-start">
        <p className="text-white/80 font-manrope">{error}</p>
        <div className="flex gap-2">
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-white/80 hover:text-white/80 text-sm flex items-center gap-1"
              title="Retry"
            >
              <FaSync className="w-3 h-3" />
            </button>
          )}
          <button
            onClick={onDismiss}
            className="text-white/80 hover:text-white/80 text-sm"
            title="Dismiss"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
