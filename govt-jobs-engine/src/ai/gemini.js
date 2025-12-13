require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const logger = require('../utils/logger');

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    logger.warn('Gemini API Key missing in .env');
}

const genAI = new GoogleGenerativeAI(apiKey);
const defaultModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

// Helper to get specific models (Flash, Pro, etc.)
const getModel = (modelName) => genAI.getGenerativeModel({ model: modelName });

module.exports = {
    ...defaultModel,
    generateContent: (args) => defaultModel.generateContent(args), // Proxy for backward compat
    getSpecificModel: getModel
};
