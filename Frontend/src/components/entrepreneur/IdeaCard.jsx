
import { FaLightbulb, FaEye, FaUsers } from "react-icons/fa";

const IdeaCard = ({ idea, index, getStatusColor }) => {
  return (
    <div
      key={index}
      className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
            <FaLightbulb className="w-4 h-4 text-yellow-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold text-sm mb-2 truncate">
              {idea.title}
            </h4>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span
                className={`px-2 py-1 rounded-full font-medium ${getStatusColor(
                  idea.status
                )}`}
              >
                {idea.status}
              </span>
              <div className="flex items-center gap-1">
                <FaEye className="w-3 h-3" />
                <span>{idea.views}</span>
              </div>
              <div className="flex items-center gap-1">
                <FaUsers className="w-3 h-3" />
                <span>{idea.investors}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-green-400 font-semibold text-sm">
            {idea.funding}
          </p>
          <p className="text-gray-400 text-xs">
            funding
          </p>
        </div>
      </div>
    </div>
  );
};

export default IdeaCard;
