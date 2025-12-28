import React from "react";

// Simple Chart Components for Analytics Dashboard
export const SimpleBarChart = ({ data, title, height = 300 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container h-48 flex items-center justify-center">
        <p className="text-white/50">No data available</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((item) => item.value));
  const chartHeight = height - 80; // Account for labels

  // Color gradient for bars
  const barColors = [
    "from-white via-white to-white",
    "from-white/400 via-white to-white",
    "from-white via-white to-white",
    "from-white via-white to-white",
    "from-white via-white to-white",
    "from-white via-white to-white",
    "from-white via-white to-white",
    "from-white via-white to-white",
  ];

  return (
    <div className="chart-container p-4">
      {title && (
        <h3 className="text-xl font-bold text-white mb-6 text-center">
          {title}
        </h3>
      )}
      <div
        className="flex items-end justify-center gap-3 px-4"
        style={{ height: chartHeight }}
      >
        {data.map((item, index) => {
          const barHeight =
            maxValue > 0 ? (item.value / maxValue) * (chartHeight - 60) : 0;
          const percentage =
            maxValue > 0 ? ((item.value / maxValue) * 100).toFixed(1) : 0;
          const colorClass = barColors[index % barColors.length];

          return (
            <div
              key={index}
              className="flex flex-col items-center flex-1 max-w-[80px] group"
            >
              {/* Value display */}
              <div className="text-sm font-bold text-white mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 px-2 py-1 rounded-lg">
                {item.value}
              </div>

              {/* Bar */}
              <div
                className={`w-full bg-gradient-to-t ${colorClass} rounded-t-lg shadow-lg transition-all duration-500 hover:shadow-xl hover:scale-105 relative group border border-white/10`}
                style={{
                  height: `${Math.max(barHeight, 8)}px`,
                  minHeight: "8px",
                }}
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-white/40 rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Label */}
              <div className="text-xs text-white/80 mt-3 text-center max-w-full font-medium">
                <div className="truncate" title={item.label}>
                  {item.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart footer */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex justify-between items-center text-sm text-white/60">
          <span>Total: {data.reduce((sum, item) => sum + item.value, 0)}</span>
          <span>Peak: {maxValue}</span>
        </div>
      </div>
    </div>
  );
};

export const SimpleLineChart = ({ data, title, height = 200 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container h-48 flex items-center justify-center">
        <p className="text-white/50">No data available</p>
      </div>
    );
  }

  // Validate and clean data
  const validData = data.filter(
    (item) =>
      item &&
      typeof item.value === "number" &&
      !isNaN(item.value) &&
      isFinite(item.value)
  );

  if (validData.length === 0) {
    return (
      <div className="chart-container h-48 flex items-center justify-center">
        <p className="text-white/50">No valid data available</p>
      </div>
    );
  }

  const values = validData.map((item) => item.value);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const range = maxValue - minValue || 1;
  const chartHeight = height - 60;
  const chartWidth = 100;

  // Calculate points for the line - handle single data point
  const points =
    validData.length === 1
      ? `${chartWidth / 2},${chartHeight / 2}`
      : validData
          .map((item, index) => {
            const x =
              validData.length > 1
                ? (index / (validData.length - 1)) * chartWidth
                : chartWidth / 2;
            const y =
              chartHeight -
              ((item.value - minValue) / range) * (chartHeight - 40);
            return `${x},${y}`;
          })
          .join(" ");

  return (
    <div className="chart-container">
      {title && (
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      )}
      <div className="relative">
        <svg
          width="100%"
          height={height}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="overflow-visible"
        >
          {/* Grid lines */}
          <defs>
            <pattern
              id="grid"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Line */}
          {validData.length > 1 && (
            <polyline
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="3"
              points={points}
              className="drop-shadow-lg"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Area under line */}
          {validData.length > 1 && (
            <polygon
              fill="url(#areaGradient)"
              points={`0,${chartHeight} ${points} ${chartWidth},${chartHeight}`}
              opacity="0.3"
            />
          )}

          {/* Data points */}
          {validData.map((item, index) => {
            const x =
              validData.length > 1
                ? (index / (validData.length - 1)) * chartWidth
                : chartWidth / 2;
            const y =
              chartHeight -
              ((item.value - minValue) / range) * (chartHeight - 40);

            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill="white"
                  stroke="url(#lineGradient)"
                  strokeWidth="3"
                  className="hover:r-6 transition-all duration-200 cursor-pointer drop-shadow-lg"
                  filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
                />
                <text
                  x={x}
                  y={y - 12}
                  textAnchor="middle"
                  className="text-xs fill-white font-semibold opacity-0 hover:opacity-100 transition-opacity duration-200 drop-shadow-sm"
                >
                  {item.value}
                </text>
              </g>
            );
          })}

          {/* Gradients */}
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.05" />
            </linearGradient>
          </defs>
        </svg>

        {/* X-axis labels */}
        <div className="flex justify-between mt-2">
          {validData.map((item, index) => (
            <div
              key={index}
              className="text-xs text-white/60 text-center flex-1"
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const SimplePieChart = ({ data, title, height = 200 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container h-48 flex items-center justify-center">
        <p className="text-white/50">No data available</p>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = (height - 80) / 2;
  const centerX = radius + 40;
  const centerY = radius + 40;

  const colors = [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    "linear-gradient(135deg, #ff8a80 0%, #ea4c89 100%)",
  ];

  const solidColors = [
    "#667eea",
    "#f5576c",
    "#00f2fe",
    "#38f9d7",
    "#fee140",
    "#fed6e3",
    "#fcb69f",
    "#ea4c89",
  ];

  let cumulativePercentage = 0;
  const slices = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const startAngle = (cumulativePercentage / 100) * 360 - 90;
    const endAngle = ((cumulativePercentage + percentage) / 100) * 360 - 90;

    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;

    const largeArcFlag = percentage > 50 ? 1 : 0;

    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);

    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      "Z",
    ].join(" ");

    cumulativePercentage += percentage;

    return {
      ...item,
      pathData,
      percentage: percentage.toFixed(1),
      color: solidColors[index % solidColors.length],
      gradient: colors[index % colors.length],
    };
  });

  return (
    <div className="chart-container">
      {title && (
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      )}
      <div className="flex items-center justify-center lg:justify-between flex-col lg:flex-row">
        <div className="flex-shrink-0 mb-6 lg:mb-0">
          <svg
            width={radius * 2 + 80}
            height={radius * 2 + 80}
            className="drop-shadow-lg"
          >
            <defs>
              {slices.map((slice, index) => (
                <linearGradient
                  key={`gradient-${index}`}
                  id={`pieGradient-${index}`}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor={slice.color} stopOpacity="0.9" />
                  <stop
                    offset="100%"
                    stopColor={slice.color}
                    stopOpacity="0.7"
                  />
                </linearGradient>
              ))}
            </defs>
            {slices.map((slice, index) => (
              <g key={index}>
                <path
                  d={slice.pathData}
                  fill={`url(#pieGradient-${index})`}
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="2"
                  className="hover:opacity-90 transition-all duration-300 cursor-pointer transform-gpu hover:scale-105"
                  filter="drop-shadow(0 4px 8px rgba(0,0,0,0.2))"
                />
              </g>
            ))}
          </svg>
        </div>

        <div className="flex-1 lg:ml-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {slices.map((slice, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-200"
              >
                <div className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-3 shadow-lg"
                    style={{ backgroundColor: slice.color }}
                  />
                  <span className="text-white font-medium text-sm">
                    {slice.label}
                  </span>
                </div>
                <div className="text-white/80 font-semibold text-sm">
                  {slice.percentage}%
                  <span className="text-white/60 ml-1">({slice.value})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const SimpleAreaChart = ({ data, title, height = 200 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container h-48 flex items-center justify-center">
        <p className="text-white/50">No data available</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((item) => item.value));
  const chartHeight = height - 60;
  const chartWidth = 100;

  // Calculate points for the area
  const points = data
    .map((item, index) => {
      const x = (index / (data.length - 1)) * chartWidth;
      const y = chartHeight - (item.value / maxValue) * (chartHeight - 40);
      return `${x},${y}`;
    })
    .join(" ");

  const areaPoints = `0,${chartHeight} ${points} ${chartWidth},${chartHeight}`;

  return (
    <div className="chart-container">
      {title && (
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      )}
      <div className="relative">
        <svg
          width="100%"
          height={height}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="overflow-visible"
        >
          {/* Grid */}
          <defs>
            <pattern
              id="gridArea"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="0.5"
              />
            </pattern>
            <linearGradient id="areaFill" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          <rect width="100%" height="100%" fill="url(#gridArea)" />

          {/* Area */}
          <polygon
            fill="url(#areaFill)"
            points={areaPoints}
            className="drop-shadow-sm"
          />

          {/* Top line */}
          <polyline
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2"
            points={points}
            className="drop-shadow-sm"
          />

          {/* Data points */}
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * chartWidth;
            const y =
              chartHeight - (item.value / maxValue) * (chartHeight - 40);

            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="2"
                fill="white"
                stroke="#FFFFFF"
                strokeWidth="2"
                className="hover:r-3 transition-all duration-200 cursor-pointer drop-shadow-sm"
              />
            );
          })}
        </svg>

        {/* X-axis labels */}
        <div className="flex justify-between mt-2">
          {data.map((item, index) => (
            <div
              key={index}
              className="text-xs text-white/60 text-center flex-1"
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Chart utility function to prepare data
export const prepareChartData = (rawData, labelKey, valueKey) => {
  if (!rawData || !Array.isArray(rawData)) return [];

  return rawData
    .map((item) => {
      const value = Number(item[valueKey]);
      return {
        label: item[labelKey] || "Unknown",
        value: isNaN(value) || !isFinite(value) ? 0 : value,
      };
    })
    .filter(
      (item) => item.label && item.label !== "Unknown" && item.value >= 0
    );
};

// Example usage data generators for testing
export const generateSampleData = (type, count = 6) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const categories = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Environment",
    "Social",
  ];

  switch (type) {
    case "monthly":
      return months.slice(0, count).map((month) => ({
        label: month,
        value: Math.floor(Math.random() * 100) + 10,
      }));

    case "categories":
      return categories.slice(0, count).map((category) => ({
        label: category,
        value: Math.floor(Math.random() * 50) + 5,
      }));

    case "status":
      return [
        { label: "Active", value: Math.floor(Math.random() * 100) + 20 },
        { label: "Pending", value: Math.floor(Math.random() * 50) + 10 },
        { label: "Completed", value: Math.floor(Math.random() * 80) + 15 },
      ];

    default:
      return [];
  }
};
