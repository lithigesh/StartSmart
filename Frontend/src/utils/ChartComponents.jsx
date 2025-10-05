import React from 'react';

// Simple Chart Components for Analytics Dashboard
export const SimpleBarChart = ({ data, title, height = 200 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container h-48 flex items-center justify-center">
        <p className="text-white/50">No data available</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(item => item.value));
  const chartHeight = height - 60; // Account for labels

  return (
    <div className="chart-container">
      {title && <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>}
      <div className="flex items-end justify-between" style={{ height: chartHeight }}>
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * (chartHeight - 40);
          const percentage = ((item.value / maxValue) * 100).toFixed(1);
          
          return (
            <div key={index} className="flex flex-col items-center flex-1 mx-1">
              <div className="text-xs text-white/70 mb-1 text-center font-medium">
                {item.value}
              </div>
              <div 
                className="w-full bg-gradient-to-t from-blue-500/80 to-purple-500/80 rounded-t transition-all duration-500 hover:from-blue-400/90 hover:to-purple-400/90 relative group"
                style={{ height: `${barHeight}px`, minHeight: '4px' }}
              >
                {/* Hover tooltip */}
                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded whitespace-nowrap transition-opacity duration-200">
                  {percentage}%
                </div>
              </div>
              <div className="text-xs text-white/60 mt-2 text-center max-w-full truncate">
                {item.label}
              </div>
            </div>
          );
        })}
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

  const maxValue = Math.max(...data.map(item => item.value));
  const minValue = Math.min(...data.map(item => item.value));
  const range = maxValue - minValue || 1;
  const chartHeight = height - 60;
  const chartWidth = 100;

  // Calculate points for the line
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * chartWidth;
    const y = chartHeight - (((item.value - minValue) / range) * (chartHeight - 40));
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="chart-container">
      {title && <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>}
      <div className="relative">
        <svg 
          width="100%" 
          height={height} 
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="overflow-visible"
        >
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Line */}
          <polyline
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            points={points}
            className="drop-shadow-sm"
          />
          
          {/* Area under line */}
          <polygon
            fill="url(#areaGradient)"
            points={`0,${chartHeight} ${points} ${chartWidth},${chartHeight}`}
            opacity="0.3"
          />
          
          {/* Data points */}
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * chartWidth;
            const y = chartHeight - (((item.value - minValue) / range) * (chartHeight - 40));
            
            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r="3"
                  fill="white"
                  stroke="url(#lineGradient)"
                  strokeWidth="2"
                  className="hover:r-4 transition-all duration-200 cursor-pointer"
                />
                <text
                  x={x}
                  y={y - 10}
                  textAnchor="middle"
                  className="text-xs fill-white/70 opacity-0 hover:opacity-100 transition-opacity duration-200"
                >
                  {item.value}
                </text>
              </g>
            );
          })}
          
          {/* Gradients */}
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* X-axis labels */}
        <div className="flex justify-between mt-2">
          {data.map((item, index) => (
            <div key={index} className="text-xs text-white/60 text-center flex-1">
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
    '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', 
    '#ef4444', '#06b6d4', '#84cc16', '#f97316'
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
      'Z'
    ].join(' ');
    
    cumulativePercentage += percentage;
    
    return {
      ...item,
      pathData,
      percentage: percentage.toFixed(1),
      color: colors[index % colors.length]
    };
  });

  return (
    <div className="chart-container">
      {title && <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>}
      <div className="flex items-center justify-between">
        <svg width={radius * 2 + 80} height={radius * 2 + 80}>
          {slices.map((slice, index) => (
            <g key={index}>
              <path
                d={slice.pathData}
                fill={slice.color}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1"
                className="hover:opacity-80 transition-opacity duration-200 cursor-pointer"
                opacity="0.8"
              />
            </g>
          ))}
        </svg>
        
        <div className="flex-1 ml-6">
          <div className="space-y-2">
            {slices.map((slice, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: slice.color }}
                  />
                  <span className="text-white/80">{slice.label}</span>
                </div>
                <div className="text-white/60">
                  {slice.percentage}% ({slice.value})
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

  const maxValue = Math.max(...data.map(item => item.value));
  const chartHeight = height - 60;
  const chartWidth = 100;

  // Calculate points for the area
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * chartWidth;
    const y = chartHeight - ((item.value / maxValue) * (chartHeight - 40));
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `0,${chartHeight} ${points} ${chartWidth},${chartHeight}`;

  return (
    <div className="chart-container">
      {title && <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>}
      <div className="relative">
        <svg 
          width="100%" 
          height={height} 
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="overflow-visible"
        >
          {/* Grid */}
          <defs>
            <pattern id="gridArea" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
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
            stroke="#6366f1"
            strokeWidth="2"
            points={points}
            className="drop-shadow-sm"
          />
          
          {/* Data points */}
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * chartWidth;
            const y = chartHeight - ((item.value / maxValue) * (chartHeight - 40));
            
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="2"
                fill="white"
                stroke="#6366f1"
                strokeWidth="2"
                className="hover:r-3 transition-all duration-200 cursor-pointer drop-shadow-sm"
              />
            );
          })}
        </svg>
        
        {/* X-axis labels */}
        <div className="flex justify-between mt-2">
          {data.map((item, index) => (
            <div key={index} className="text-xs text-white/60 text-center flex-1">
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
  
  return rawData.map(item => ({
    label: item[labelKey] || 'Unknown',
    value: Number(item[valueKey]) || 0
  }));
};

// Example usage data generators for testing
export const generateSampleData = (type, count = 6) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const categories = ['Technology', 'Healthcare', 'Finance', 'Education', 'Environment', 'Social'];
  
  switch (type) {
    case 'monthly':
      return months.slice(0, count).map(month => ({
        label: month,
        value: Math.floor(Math.random() * 100) + 10
      }));
    
    case 'categories':
      return categories.slice(0, count).map(category => ({
        label: category,
        value: Math.floor(Math.random() * 50) + 5
      }));
    
    case 'status':
      return [
        { label: 'Active', value: Math.floor(Math.random() * 100) + 20 },
        { label: 'Pending', value: Math.floor(Math.random() * 50) + 10 },
        { label: 'Completed', value: Math.floor(Math.random() * 80) + 15 }
      ];
    
    default:
      return [];
  }
};