import React from "react";
import { FaCheck } from "react-icons/fa";

const ComparisonButton = ({
  isSelected,
  onToggle,
  disabled = false,
  ideaId,
}) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle(ideaId);
      }}
      disabled={disabled}
      className={`
        absolute top-4 left-4 z-10 w-10 h-10 rounded-xl 
        border-2 flex items-center justify-center
        transition-all duration-300 transform
        backdrop-blur-md
        ${
          isSelected
            ? "bg-gradient-to-br from-white to-white border-white scale-110 shadow-lg shadow-white/30 rotate-6"
            : disabled
            ? "bg-white/5 border-white/20 cursor-not-allowed opacity-50"
            : "bg-white/10 border-white/30 hover:bg-white/20 hover:border-white/50 hover:scale-110 hover:shadow-lg hover:shadow-white/10"
        }
      `}
      title={
        disabled
          ? "Maximum 4 ideas can be selected"
          : isSelected
          ? "Remove from comparison"
          : "Add to comparison"
      }
    >
      {isSelected && (
        <FaCheck className="w-5 h-5 text-white drop-shadow-lg animate-bounce-in" />
      )}
      {!isSelected && !disabled && (
        <div className="w-4 h-4 border-2 border-white/40 rounded transition-all duration-300 group-hover:border-white"></div>
      )}
    </button>
  );
};

export default ComparisonButton;
