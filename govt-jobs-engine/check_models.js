require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function list() {
    try {
        // Note: older SDKs might not expose listModels easily on genAI instance, 
        // but let's try assuming it's usually on the manager. 
        // Actually the SDK structure is slightly different.
        // If listModels isn't available, we'll try a simple generate with 'gemini-pro' and catch error.
        // But wait, there is no top-level listModels in GoogleGenerativeAI class in v0.1.
        // We have to use ModelManager if exposed, or just guess.

        // Attempt 1: naive check
        console.log("Checking gemini-pro...");
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const res = await model.generateContent("Test");
            console.log("gemini-pro is WORKING");
        } catch (e) { console.log("gemini-pro FAILED: " + e.message); }

        console.log("Checking gemini-1.5-flash...");
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const res = await model.generateContent("Test");
            console.log("gemini-1.5-flash is WORKING");
        } catch (e) { console.log("gemini-1.5-flash FAILED: " + e.message); }

        console.log("Checking gemini-1.0-pro...");
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
            const res = await model.generateContent("Test");
            console.log("gemini-1.0-pro is WORKING");
        } catch (e) { console.log("gemini-1.0-pro FAILED: " + e.message); }

    } catch (error) {
        console.error("Global Error", error);
    }
}

list();
