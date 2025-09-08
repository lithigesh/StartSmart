import React from "react";
import { FaSpinner } from "react-icons/fa";

const LoadingSpinner = ({ message = "Loading dashboard..." }) => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <FaSpinner className="w-8 h-8 text-white animate-spin mx-auto mb-4" />
        <p className="text-white font-manrope">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
