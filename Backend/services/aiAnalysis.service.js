// services/aiAnalysis.service.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the Google Generative AI client with the API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generates a comprehensive SWOT analysis, viability score, and product roadmap for a startup idea.
 * Now enhanced to use all comprehensive data from the idea submission form.
 * @param {object} ideaData - The complete idea object with all fields from the form.
 * @returns {Promise<object>} A promise that resolves to an object containing the enhanced analysis.
 */
async function generateSwotAndRoadmap(ideaData) {
  try {
    // --- MODEL SELECTION ---
    // Using 'gemini-1.5-flash-latest' for fast, structured JSON output
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
    });

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
                "[Array of 5-7 strategic milestones as strings with timeframes included, e.g., 'Q1 2024: Complete MVP development and initial testing', 'Q2 2024: Secure Series A funding', etc.]"
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
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

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
        "Q1: Market research and MVP development",
        "Q2: Beta testing and user feedback collection",
        "Q3: Product refinement and initial market launch",
        "Q4: Customer acquisition and growth optimization",
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
      "Error calling Gemini API for comprehensive analysis:",
      error
    );
    console.error("Raw response text:", error.message);

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
 * Fetches mock market trend data for a given keyword.
 * In a real application, this would call an API like Google Trends.
 * @param {string} keyword - The keyword or category to get trends for.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of trend data.
 */
async function getMarketTrends(keyword) {
  // This is a mock response for demonstration purposes.
  // A real implementation would use a library like 'google-trends-api'.
  return Promise.resolve([
    { year: 2021, popularity: Math.floor(Math.random() * 50) + 20 },
    { year: 2022, popularity: Math.floor(Math.random() * 50) + 30 },
    { year: 2023, popularity: Math.floor(Math.random() * 50) + 50 },
  ]);
}

// Export the functions to be used in other parts of the application
module.exports = { generateSwotAndRoadmap, getMarketTrends };
