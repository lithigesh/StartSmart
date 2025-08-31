// services/aiAnalysis.service.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateSwotAndRoadmap(title, description) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
            Analyze the following startup idea and provide a structured analysis.
            Idea Title: "${title}"
            Idea Description: "${description}"

            Provide the output in a clean JSON format with the following keys: "score", "swot", "roadmap".
            - "score": A viability score from 1 to 100 based on the idea's potential.
            - "swot": An object with four keys: "strengths", "weaknesses", "opportunities", and "threats". Each should be a concise paragraph.
            - "roadmap": An array of 3-5 key milestones for the first year (e.g., "MVP Development", "Beta Launch", "Secure Seed Funding").

            Example JSON output format:
            {
              "score": 85,
              "swot": {
                "strengths": "The idea addresses a clear market need...",
                "weaknesses": "High competition from established players...",
                "opportunities": "Growing market trends indicate...",
                "threats": "Potential regulatory hurdles..."
              },
              "roadmap": [
                "Q1: Develop and test MVP",
                "Q2: Onboard first 100 beta users",
                "Q3: Gather feedback and iterate",
                "Q4: Prepare for seed funding round"
              ]
            }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Clean the response to make sure it's valid JSON
        const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonString);

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate AI analysis.");
    }
}

// Placeholder for Google Trends API
async function getMarketTrends(keyword) {
    // In a real application, you would use a library like 'google-trends-api'
    // This is a mock response for demonstration
    console.log(`Fetching market trends for: ${keyword}`);
    return [
        { year: 2021, popularity: Math.floor(Math.random() * 50) + 20 },
        { year: 2022, popularity: Math.floor(Math.random() * 50) + 30 },
        { year: 2023, popularity: Math.floor(Math.random() * 50) + 50 },
    ];
}

module.exports = { generateSwotAndRoadmap, getMarketTrends };