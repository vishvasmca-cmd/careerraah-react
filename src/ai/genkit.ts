import { genkit } from 'genkit';
import { ollama } from 'genkitx-ollama';
// import { googleAI } from '@genkit-ai/google-genai';
import dotenv from 'dotenv';
import path from 'path';

// Explicitly load .env and .env.local for robustness
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const ai = genkit({
  plugins: [
    // googleAI(),
    ollama({
      models: [{ name: 'llama3-70b-8192' }],
      serverAddress: process.env.OLLAMA_BASE_URL || 'https://api.groq.com/openai/v1',
      // Note: Groq requires an API Key. genkitx-ollama might not support custom headers natively 
      // in all versions. If this fails, consider using the 'openai' plugin with Groq's base URL.
    }),
  ],
  model: 'ollama/llama3-70b-8192',
});
