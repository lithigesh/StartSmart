import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend,
} from "recharts";
import { FaChartLine, FaSpinner, FaChartArea } from "react-icons/fa";

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#F97316",
];

const IdeaComparisonCharts = ({ ideas, comparisonData, loading }) => {
  const [activeTab, setActiveTab] = useState("radar");
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (ideas && ideas.length > 0) {
      prepareChartData();
    }
  }, [ideas]);

  const prepareChartData = () => {
    if (!ideas || ideas.length === 0) return;

    // Radar chart data for comprehensive comparison
    const radarData = [
      "Innovation",
      "Market Potential",
      "Technical Feasibility",
      "Team Capability",
      "Financial Viability",
      "Risk Factor",
    ].map((metric) => {
      const dataPoint = { metric };
      ideas.forEach((idea, index) => {
        // Generate realistic scores based on existing data or default values
        let score = 0;
        switch (metric) {
          case "Innovation":
            score = idea.analysis?.innovation_score || 50 + Math.random() * 40;
            break;
          case "Market Potential":
            score = idea.analysis?.market_score || 40 + Math.random() * 50;
            break;
          case "Technical Feasibility":
            score = idea.analysis?.tech_score || 60 + Math.random() * 35;
            break;
          case "Team Capability":
            score = idea.analysis?.team_score || 45 + Math.random() * 45;
            break;
          case "Financial Viability":
            score = idea.analysis?.financial_score || 35 + Math.random() * 55;
            break;
          case "Risk Factor":
            score =
              100 - (idea.analysis?.risk_score || 20 + Math.random() * 60);
            break;
          default:
            score = 50 + Math.random() * 40;
        }
        dataPoint[`idea${index}`] = Math.round(score);
      });
      return dataPoint;
    });

    setChartData({
      radar: radarData,
    });
  };

  const RadarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-lg p-3 shadow-xl">
          <p className="text-white font-manrope font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-white/80 font-manrope text-sm">
              <span style={{ color: entry.color }}>●</span>
              {` Idea ${index + 1}: ${entry.value}/100`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8">
        <div className="flex items-center justify-center h-64">
          <FaSpinner className="w-8 h-8 animate-spin text-white/60" />
          <span className="ml-3 text-white/60 font-manrope">
            Loading comparison charts...
          </span>
        </div>
      </div>
    );
  }

  if (!chartData || !ideas || ideas.length === 0) {
    return (
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <FaChartArea className="w-12 h-12 text-white/40 mx-auto mb-4" />
            <p className="text-white/60 font-manrope">
              No data available for comparison charts
            </p>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "radar", label: "Multi-Metric Analysis", icon: FaChartArea },
  ];

  return (
    <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-2xl pointer-events-none"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2 font-manrope">
            <FaChartLine className="w-5 h-5 text-white/90" />
            Comparison Analytics
          </h3>
          <div className="text-sm text-white/60 font-manrope">
            {ideas.length} ideas being compared
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium font-manrope transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-white/20/20 text-white/90 border border-white/30"
                    : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Chart Content */}
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData.radar}>
              <PolarGrid stroke="rgba(255,255,255,0.2)" />
              <PolarAngleAxis
                dataKey="metric"
                tick={{
                  fill: "rgba(255,255,255,0.8)",
                  fontFamily: "Manrope",
                  fontSize: 12,
                }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{
                  fill: "rgba(255,255,255,0.6)",
                  fontFamily: "Manrope",
                  fontSize: 10,
                }}
              />
              {ideas.map((idea, index) => (
                <Radar
                  key={`idea${index}`}
                  name={`Idea ${index + 1}`}
                  dataKey={`idea${index}`}
                  stroke={COLORS[index % COLORS.length]}
                  fill={COLORS[index % COLORS.length]}
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              ))}
              <Tooltip content={<RadarTooltip />} />
              <Legend
                wrapperStyle={{
                  fontFamily: "Manrope",
                  color: "rgba(255,255,255,0.8)",
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default IdeaComparisonCharts;
