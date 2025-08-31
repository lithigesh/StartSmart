// services/aiAnalysis.service.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Google Generative AI client with the API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generates a SWOT analysis, a viability score, and a product roadmap for a startup idea.
 * @param {string} title - The title of the startup idea.
 * @param {string} description - A detailed description of the startup idea.
 * @returns {Promise<object>} A promise that resolves to an object containing the analysis.
 */
async function generateSwotAndRoadmap(title, description) {
    try {
        // --- MODEL SELECTION ---
        // We use 'gemini-1.5-flash-latest' as it's a fast, modern, and highly capable model
        // suitable for generating structured JSON data. The previous 'gemini-pro' is often deprecated.
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

        // --- PROMPT ENGINEERING ---
        // A detailed prompt is crucial for getting reliable, structured JSON output.
        // We specify the exact keys, data types, and provide a clear example.
        const prompt = `
            Analyze the following startup idea and provide a structured analysis.
            Idea Title: "${title}"
            Idea Description: "${description}"

            Your task is to return the analysis in a clean JSON format, and nothing else. The JSON object must have the following keys: "score", "swot", "roadmap".

            - "score": A viability score from 1 to 100, representing the idea's potential for success. This should be a number.
            - "swot": An object with four string keys: "strengths", "weaknesses", "opportunities", and "threats". Each value should be a concise paragraph.
            - "roadmap": An array of 3-5 strings, where each string is a key milestone for the first year (e.g., "MVP Development", "Beta Launch", "Secure Seed Funding").

            Example of the exact JSON output format required:
            {
              "score": 85,
              "swot": {
                "strengths": "The idea addresses a clear and growing market need for sustainable energy solutions.",
                "weaknesses": "High initial hardware costs and competition from established energy companies could be significant barriers.",
                "opportunities": "Government incentives for green technology and increasing consumer awareness provide a favorable market environment.",
                "threats": "Potential regulatory changes and rapid technological shifts in the IoT space could impact long-term viability."
              },
              "roadmap": [
                "Q1: Finalize hardware prototype and develop core software platform.",
                "Q2: Launch a pilot program with 50 households to gather data and feedback.",
                "Q3: Iterate on the product based on pilot feedback and prepare for a larger beta launch.",
                "Q4: Secure seed funding and establish manufacturing partnerships."
              ]
            }
        `;

        // --- API CALL ---
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // --- RESPONSE CLEANING ---
        // The API might wrap the JSON in markdown backticks (```json ... ```).
        // This cleaning step removes them to ensure the string can be parsed correctly.
        const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
        
        // --- PARSING AND RETURNING ---
        return JSON.parse(jsonString);

    } catch (error) {
        // Log the detailed error from the API for debugging purposes.
        console.error("Error calling Gemini API:", error);
        // Throw a generic, user-friendly error to be caught by the controller.
        throw new Error("Failed to generate AI analysis.");
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
    console.log(`Fetching MOCK market trends for: ${keyword}`);
    return Promise.resolve([
        { year: 2021, popularity: Math.floor(Math.random() * 50) + 20 },
        { year: 2022, popularity: Math.floor(Math.random() * 50) + 30 },
        { year: 2023, popularity: Math.floor(Math.random() * 50) + 50 },
    ]);
}

// Export the functions to be used in other parts of the application
module.exports = { generateSwotAndRoadmap, getMarketTrends };