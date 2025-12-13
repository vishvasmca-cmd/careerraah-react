
const model = require('./gemini');
const logger = require('../utils/logger');

async function generateHindiSummary(jobDetails) {
    try {
        const prompt = `
    You are a career counselor helping Indian students. 
    Rewrite the following job details into a helpful, easy - to - understand summary in "Hinglish"(Hindi + English mix).
    
    ** Rules:**
    1. ** Do NOT just translate.** Read the details and explain it like a friend("Dekho, isme 10th pass chahiye...").
    2. ** Focus on Value:** Highlight Salary, Age, and Location first.
    3. ** Tone:** Encouraging, simple, and direct.Avoid legal jargon.
    4. ** Call to Action:** Tell them to check the official link.
    
    ** Input Data:**
    ${JSON.stringify(jobDetails, null, 2)}
    
    ** Output:**
    A short, bulleted summary in Hinglish.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();

    } catch (error) {
        logger.error('Error generating Hindi summary:', error);
        return "Summary unavailable.";
    }
}

module.exports = generateHindiSummary;
