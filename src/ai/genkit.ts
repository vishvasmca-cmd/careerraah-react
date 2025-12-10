import { genkit } from 'genkit';
// import { ollama } from 'genkitx-ollama';
import { openai } from 'genkitx-openai';
// import { googleAI } from '@genkit-ai/google-genai';
import dotenv from 'dotenv';
import path from 'path';

// Explicitly load .env and .env.local for robustness
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const ai = genkit({
  plugins: [
    // googleAI(),
    // ollama({ ... }),
    openai({
      apiKey: process.env.OLLAMA_API_KEY || process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1',
    }),
  ],
  model: 'openai/llama3-70b-8192',
});
