import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import dotenv from 'dotenv';
import path from 'path';

// Explicitly load .env and .env.local for robustness
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const apiKey = process.env.GOOGLE_GENAI_API_KEY ||
  process.env.GOOGLE_API_KEY ||
  process.env.GEMINI_API_KEY ||
  process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!apiKey) {
  console.error("❌ NO GOOGLE API KEY FOUND IN ENVIRONMENT VARIABLES. PLEASE CHECK .env.local");
}

export const ai = genkit({
  plugins: [googleAI({ apiKey })],
  model: 'googleai/gemini-1.5-flash',
});
