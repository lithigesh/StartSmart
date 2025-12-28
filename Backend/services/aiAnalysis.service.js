// services/aiAnalysis.service.js

// Initialize OpenRouter API configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
// Model can be configured in .env or defaults to gpt-4o-mini
// Options: "openai/gpt-4o-mini", "google/gemini-2.0-flash-exp:free", "anthropic/claude-3-haiku"
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";

// Validate API key on module load
if (!OPENROUTER_API_KEY) {
  console.error("⚠️  WARNING: OPENROUTER_API_KEY is not configured in .env file!");
  console.error("⚠️  AI analysis will fail without a valid API key.");
}

/**
 * Generates a comprehensive SWOT analysis, viability score, and product roadmap for a startup idea.
 * Now enhanced to use all comprehensive data from the idea submission form.
 * @param {object} ideaData - The complete idea object with all fields from the form.
 * @returns {Promise<object>} A promise that resolves to an object containing the enhanced analysis.
 */
async function generateSwotAndRoadmap(ideaData) {
  // Check if API key is available
  if (!OPENROUTER_API_KEY) {
    throw new Error("OpenRouter API key is not configured. Please add OPENROUTER_API_KEY to your .env file.");
  }
  try {
    // --- MODEL SELECTION ---
    // Using OpenRouter with 'openai/gpt-4o-mini' for reliable AI analysis
    // This model is cost-effective and has high availability

    // --- ENHANCED COMPREHENSIVE PROMPT ---
    const prompt = `
            As an expert startup analyst and venture capitalist, analyze this comprehensive startup idea and provide a detailed assessment.

            === STARTUP IDEA ANALYSIS ===
            
            📋 BASIC INFORMATION:
            - Title: "${ideaData.title}"
            - Elevator Pitch: "${ideaData.elevatorPitch}"
            - Description: "${ideaData.description}"
            - Category: "${ideaData.category}"
            - Target Audience: "${ideaData.targetAudience}"

            🎯 PROBLEM & SOLUTION:
            - Problem Statement: "${ideaData.problemStatement}"
            - Solution: "${ideaData.solution}"
            - Competitors: "${ideaData.competitors || "Not specified"}"

            💼 BUSINESS MODEL:
            - Revenue Streams: "${ideaData.revenueStreams || "Not specified"}"
            - Pricing Strategy: "${ideaData.pricingStrategy || "Not specified"}"
            - Key Partnerships: "${ideaData.keyPartnerships || "Not specified"}"

            📈 MARKET & GROWTH:
            - Market Size: "${ideaData.marketSize || "Not specified"}"
            - Go-to-Market Strategy: "${
              ideaData.goToMarketStrategy || "Not specified"
            }"
            - Scalability Plan: "${ideaData.scalabilityPlan || "Not specified"}"

            🔧 TECHNICAL REQUIREMENTS:
            - Technology Stack: "${ideaData.technologyStack || "Not specified"}"
            - Development Roadmap: "${
              ideaData.developmentRoadmap || "Not specified"
            }"
            - Anticipated Challenges: "${
              ideaData.challengesAnticipated || "Not specified"
            }"

            🌱 SUSTAINABILITY & IMPACT:
            - Eco-Friendly Practices: "${
              ideaData.ecoFriendlyPractices || "Not specified"
            }"
            - Social Impact: "${ideaData.socialImpact || "Not specified"}"

            💰 FUNDING & INVESTMENT:
            - Funding Requirements: "${
              ideaData.fundingRequirements || "Not specified"
            }"
            - Use of Funds: "${ideaData.useOfFunds || "Not specified"}"
            - Equity Offer: "${ideaData.equityOffer || "Not specified"}"

            === ANALYSIS REQUIREMENTS ===

            Based on this comprehensive information, provide a detailed analysis in JSON format with the following structure:

            {
              "score": [1-100 integer - Overall viability score based on all factors],
              "swot": {
                "strengths": "[Detailed analysis of internal strengths - consider market fit, team capabilities, technology advantages, unique value proposition, revenue model strength, competitive advantages]",
                "weaknesses": "[Detailed analysis of internal weaknesses - consider execution risks, resource constraints, technical challenges, market entry barriers, financial sustainability]",
                "opportunities": "[Detailed analysis of external opportunities - consider market trends, regulatory environment, technological advances, partnership potential, expansion possibilities]",
                "threats": "[Detailed analysis of external threats - consider competitive landscape, market risks, regulatory changes, technological disruption, economic factors]"
              },
              "roadmap": [
                "[Array of exactly 8 strategic milestones as strings, one for each quarter starting from Q1 2026 through Q4 2027, e.g., 'Q1 2026: Complete MVP development and initial testing', 'Q2 2026: Secure Series A funding', etc.]"
              ],
              "recommendations": {
                "immediate_actions": "[3-4 specific actions to take in the next 3 months]",
                "risk_mitigation": "[Key risks identified and how to address them]",
                "growth_strategy": "[Specific recommendations for scaling the business]",
                "funding_advice": "[Assessment of funding requirements and suggestions]"
              },
              "market_assessment": {
                "market_size_evaluation": "[Assessment of the stated market size and potential]",
                "competitive_positioning": "[Analysis of competitive landscape and positioning]",
                "customer_validation": "[Assessment of target audience and market demand]"
              }
            }

            === ANALYSIS GUIDELINES ===
            - Consider the comprehensiveness and quality of the information provided
            - Factor in the realistic feasibility of the technical implementation
            - Assess the market opportunity and competitive landscape
            - Evaluate the business model sustainability and revenue potential
            - Consider the team's apparent understanding of their market and challenges
            - Account for the social and environmental impact potential
            - Provide actionable, specific insights rather than generic advice
            - Score should reflect realistic market potential, execution feasibility, and competitive advantage

            Return ONLY the JSON object, no additional text or formatting.
        `;

    // --- API CALL ---
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://startsmart-frontend.vercel.app",
        "X-Title": "StartSmart AI Analysis",
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenRouter API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const text = data.choices[0].message.content;

    // --- RESPONSE CLEANING ---
    const jsonString = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // --- PARSING AND VALIDATION ---
    const analysis = JSON.parse(jsonString);

    // Validate required fields and provide defaults if missing
    if (!analysis.score || analysis.score < 1 || analysis.score > 100) {
      analysis.score = 50; // Default neutral score
    }

    if (!analysis.swot) {
      analysis.swot = {
        strengths: "Analysis pending - insufficient data provided",
        weaknesses: "Analysis pending - insufficient data provided",
        opportunities: "Analysis pending - insufficient data provided",
        threats: "Analysis pending - insufficient data provided",
      };
    }

    if (!analysis.roadmap || !Array.isArray(analysis.roadmap)) {
      analysis.roadmap = [
        "Q1 2026: Market research and MVP development",
        "Q2 2026: Beta testing and user feedback collection",
        "Q3 2026: Product refinement and initial market launch",
        "Q4 2026: Customer acquisition and growth optimization",
        "Q1 2027: Scale marketing efforts and expand customer base",
        "Q2 2027: Develop strategic partnerships and explore new markets",
        "Q3 2027: Enhance product features based on user feedback",
        "Q4 2027: Evaluate Series A funding and expansion opportunities",
      ];
    } else {
      // Convert roadmap objects to strings if needed
      analysis.roadmap = analysis.roadmap.map((item) => {
        if (typeof item === "object" && item.milestone) {
          return `${item.timeframe || "TBD"}: ${item.milestone}`;
        }
        return typeof item === "string" ? item : String(item);
      });
    }

    return analysis;
  } catch (error) {
    console.error(
      "Error calling OpenRouter API for comprehensive analysis:",
      error
    );
    console.error("Error details:", error.message);

    // Return a structured fallback response
    return {
      score: 50,
      swot: {
        strengths:
          "AI analysis temporarily unavailable. Manual review recommended.",
        weaknesses:
          "AI analysis temporarily unavailable. Manual review recommended.",
        opportunities:
          "AI analysis temporarily unavailable. Manual review recommended.",
        threats:
          "AI analysis temporarily unavailable. Manual review recommended.",
      },
      roadmap: [
        "Q1: Conduct thorough market research and competitive analysis",
        "Q2: Develop minimum viable product (MVP)",
        "Q3: Test MVP with target customers and gather feedback",
        "Q4: Refine product and prepare for market launch",
      ],
      recommendations: {
        immediate_actions:
          "AI analysis unavailable - conduct manual business analysis",
        risk_mitigation:
          "AI analysis unavailable - identify risks through market research",
        growth_strategy:
          "AI analysis unavailable - develop strategy based on market feedback",
        funding_advice:
          "AI analysis unavailable - consult with financial advisors",
      },
      market_assessment: {
        market_size_evaluation:
          "AI analysis unavailable - conduct independent market sizing",
        competitive_positioning:
          "AI analysis unavailable - perform competitive analysis",
        customer_validation:
          "AI analysis unavailable - validate through customer interviews",
      },
    };
  }
}

/**
 * Fetches AI-powered market trend analysis for a given keyword.
 * Uses OpenRouter API to provide realistic market trend insights.
 * @param {string} keyword - The keyword or category to get trends for.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of trend data.
 */
async function getMarketTrends(keyword) {
  // Check if API key is available
  if (!OPENROUTER_API_KEY) {
    console.warn("OpenRouter API key not configured, returning default trends");
    return [
      { year: 2023, popularity: 50 },
      { year: 2024, popularity: 55 },
      { year: 2025, popularity: 60 },
      { year: 2026, popularity: 65 },
      { year: 2027, popularity: 70 },
      { year: 2028, popularity: 75 },
      { year: 2029, popularity: 78 },
      { year: 2030, popularity: 80 },
    ];
  }

  try {
    const prompt = `
      As a market research analyst, provide realistic market trend data for the following keyword/industry: "${keyword}"
      
      Analyze the market trends from 2023 to 2030, considering:
      - Market growth patterns
      - Consumer interest levels
      - Industry developments
      - Search trends and public interest
      - Market maturity and adoption rates
      
      Return ONLY a JSON array with this exact structure (no additional text):
      [
        { "year": 2023, "popularity": [0-100 integer], "insight": "brief insight about this year" },
        { "year": 2024, "popularity": [0-100 integer], "insight": "brief insight about this year" },
        { "year": 2025, "popularity": [0-100 integer], "insight": "brief insight about this year" },
        { "year": 2026, "popularity": [0-100 integer], "insight": "brief insight about this year" },
        { "year": 2027, "popularity": [0-100 integer], "insight": "brief insight about this year" },
        { "year": 2028, "popularity": [0-100 integer], "insight": "brief insight about this year" },
        { "year": 2029, "popularity": [0-100 integer], "insight": "brief insight about this year" },
        { "year": 2030, "popularity": [0-100 integer], "insight": "brief insight about this year" }
      ]
      
      Popularity scale: 0-20 = Niche/Emerging, 21-40 = Growing, 41-60 = Established, 61-80 = High Growth, 81-100 = Mainstream/Peak
    `;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "StartSmart Market Trends",
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      console.error("OpenRouter API error for market trends");
      throw new Error("API error");
    }

    const data = await response.json();
    const text = data.choices[0].message.content;

    // Clean and parse the response
    const jsonString = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const trends = JSON.parse(jsonString);

    // Validate the response structure
    if (Array.isArray(trends) && trends.length > 0) {
      return trends;
    } else {
      throw new Error("Invalid response format");
    }

  } catch (error) {
    console.error("Error fetching market trends:", error.message);
    
    // Fallback to reasonable default trend data
    return [
      { year: 2023, popularity: 50, insight: "Market data unavailable - showing baseline trends" },
      { year: 2024, popularity: 55, insight: "Market data unavailable - showing baseline trends" },
      { year: 2025, popularity: 60, insight: "Market data unavailable - showing baseline trends" },
      { year: 2026, popularity: 65, insight: "Market data unavailable - showing baseline trends" },
      { year: 2027, popularity: 70, insight: "Market data unavailable - showing baseline trends" },
      { year: 2028, popularity: 75, insight: "Market data unavailable - showing baseline trends" },
      { year: 2029, popularity: 78, insight: "Market data unavailable - showing baseline trends" },
      { year: 2030, popularity: 80, insight: "Market data unavailable - showing baseline trends" },
    ];
  }
}

// Export the functions to be used in other parts of the application
module.exports = { generateSwotAndRoadmap, getMarketTrends };
