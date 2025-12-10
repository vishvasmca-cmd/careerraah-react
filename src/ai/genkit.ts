import { genkit } from 'genkit';
// import { ollama } from 'genkitx-ollama';
import { googleAI } from '@genkit-ai/google-genai';
import dotenv from 'dotenv';
import path from 'path';

// Explicitly load .env and .env.local for robustness
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const ai = genkit({
  plugins: [
    googleAI(),
    // ollama({
    //   models: [{ name: 'gpt-oss:120b-cloud' }],
    //   serverAddress: 'http://127.0.0.1:11434',
    // }),
  ],
  model: 'googleai/gemini-1.5-flash',
});
