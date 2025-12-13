const model = require('./gemini');
const logger = require('../utils/logger');

async function generateSEOArticle(jobData) {
    try {
        const prompt = `
        You are a Senior Editor for "CareerRaah.com", a leading Indian job portal.
        
        **Goal:** Write a unique, high-ranking SEO article in Hindi about this job.
        
        **Input Data:**
        ${JSON.stringify(jobData, null, 2)}
        
        **Guidelines:**
        1. **Transformation:** Do NOT copy the official text. Rewrite it completely. Use your own words to explain the opportunity.
        2. **Language:** "Hindi" (Write primarily in Hindi, using English terms only for technical words if necessary).
        3. **Structure:**
           - **Catchy Title:** Click-worthy but honest (e.g. "Railway mein 10th pass ke liye bharti - Salary 30,000!").
           - **Introduction:** Hook the reader. Why is this a good job?
           - **Key Details:** Table-like presentation of Dates, Fees, Age.
           - **Step-by-Step Apply:** Simple guide on how to fill the form.
           - **FAQ Section:** 3 common questions students ask.
        4. **SEO:** Include high-volume keywords naturally.

        **Output Schema (Return ONLY this JSON):**
        {
          "title": "string (The H1 Title)",
          "slug": "string (URL-friendly-slug-english)",
          "metaDescription": "string (150 chars for Google search result)",
          "keywords": ["string", "string"],
          "articleBody": "string (The full article content in HTML format. Use <h2>, <ul>, <p>, <strong> tags. Do NOT use <h1> or <html>)"
        }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean markdown
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(jsonStr);

    } catch (error) {
        logger.error('Error generating SEO Article:', error);
        return null; // Return null on failure so we don't save bad data
    }
}

module.exports = generateSEOArticle;
