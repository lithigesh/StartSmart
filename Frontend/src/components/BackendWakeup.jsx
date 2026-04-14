import React from "react";
import { Server, X, Loader2 } from "lucide-react";
import { useBackendStatus } from "../context/BackendStatusContext";

/**
 * BackendWakeup Component
 * Finalized text layout with a line break for "Please wait ~30s."
 */
const BackendWakeup = () => {
  const { isAwake, isWakingUp, hasInteracted, dismissWakeup } = useBackendStatus();

  // Show if backend is asleep, waking up, and user has tried to interact.
  const shouldShow = (!isAwake && isWakingUp && hasInteracted);

  if (!shouldShow) return null;

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[10000] animate-in fade-in slide-in-from-top-4 duration-500 w-[max-content]">
      {/* Permanent Fixed Outer Glow */}
      <div className="absolute inset-0 bg-white/[0.08] blur-2xl rounded-2xl -z-10"></div>

      <div className="bg-black/60 border border-white/20 shadow-[0_16px_60px_-10px_rgba(0,0,0,0.6)] rounded-xl py-4 px-6 pr-11 min-w-[320px] max-w-[95vw] backdrop-blur-[20px] ring-1 ring-white/10 relative overflow-hidden">
        
        {/* Fixed Static Highlight */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

        <div className="flex items-start gap-4 relative z-10">
          {/* Spinner Icon with Static Glow */}
          <div className="flex-shrink-0 pt-1 relative">
             <div className="absolute inset-0 bg-white/10 blur-md rounded-full"></div>
             <Loader2 className="w-5 h-5 text-white animate-spin stroke-[2.5px] relative z-10 opacity-90" />
          </div>
          
          <div className="flex flex-col">
            {/* Title */}
            <h3 className="text-white font-bold text-[14px] tracking-tight leading-none mb-2">
              Waking up backend...
            </h3>
            
            {/* Split Subtext */}
            <div className="flex flex-col gap-1">
                <p className="text-white/60 text-[12px] leading-none font-medium">
                  Render free tier spins down after inactivity.
                </p>
                <p className="text-white/60 text-[12px] leading-none font-bold">
                  Please wait ~30s.
                </p>
            </div>
          </div>
        </div>

        {/* Compact Close Button */}
        <button 
          onClick={dismissWakeup}
          className="absolute top-1/2 -translate-y-1/2 right-3 text-white/40 hover:text-white transition-all p-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg flex items-center justify-center backdrop-blur-md"
          aria-label="Close"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
};

export default BackendWakeup;
