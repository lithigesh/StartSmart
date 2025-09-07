import React from "react";
import {
  FaLightbulb,
  FaHeartBroken,
  FaSearch,
  FaSpinner,
} from "react-icons/fa";

const EmptyState = ({
  type = "ideas",
  title,
  description,
  action,
  actionText,
  loading = false,
}) => {
  const getIcon = () => {
    switch (type) {
      case "ideas":
        return <FaLightbulb className="w-16 h-16 text-white/20 mx-auto mb-4" />;
      case "interested":
        return (
          <FaHeartBroken className="w-16 h-16 text-white/20 mx-auto mb-4" />
        );
      case "search":
        return <FaSearch className="w-16 h-16 text-white/20 mx-auto mb-4" />;
      case "loading":
        return (
          <FaSpinner className="w-16 h-16 text-white/20 mx-auto mb-4 animate-spin" />
        );
      default:
        return <FaLightbulb className="w-16 h-16 text-white/20 mx-auto mb-4" />;
    }
  };

  const getDefaultContent = () => {
    switch (type) {
      case "ideas":
        return {
          title: "No Ideas Available",
          description:
            "There are no ideas to display at the moment. Check back later for new opportunities.",
        };
      case "interested":
        return {
          title: "No Interested Ideas",
          description:
            "You haven't shown interest in any ideas yet. Browse available ideas to get started.",
        };
      case "search":
        return {
          title: "No Results Found",
          description:
            "No ideas match your current filters. Try adjusting your search criteria.",
        };
      case "loading":
        return {
          title: "Loading...",
          description: "Please wait while we fetch the latest data.",
        };
      default:
        return {
          title: "No Data Available",
          description: "There's nothing to show here right now.",
        };
    }
  };

  const defaultContent = getDefaultContent();

  return (
    <div className="text-center py-12">
      {loading ? (
        <FaSpinner className="w-16 h-16 text-white/20 mx-auto mb-4 animate-spin" />
      ) : (
        getIcon()
      )}

      <h3 className="text-white font-manrope font-semibold text-lg mb-2">
        {title || defaultContent.title}
      </h3>

      <p className="text-white/60 font-manrope mb-6 max-w-md mx-auto">
        {description || defaultContent.description}
      </p>

      {action && actionText && (
        <button
          onClick={action}
          className="btn bg-white text-black hover:bg-gray-100 rounded-lg px-6 py-2 font-manrope font-medium transition-all duration-300 hover:scale-105"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
