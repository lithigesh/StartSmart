import React from "react";
import { FaSync } from "react-icons/fa";

const ErrorMessage = ({ error, onRetry, onDismiss }) => {
  if (!error) return null;

  return (
    <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
      <div className="flex justify-between items-start">
        <p className="text-red-400 font-manrope">{error}</p>
        <div className="flex gap-2">
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-red-300 hover:text-red-100 text-sm flex items-center gap-1"
              title="Retry"
            >
              <FaSync className="w-3 h-3" />
            </button>
          )}
          <button
            onClick={onDismiss}
            className="text-red-300 hover:text-red-100 text-sm"
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
