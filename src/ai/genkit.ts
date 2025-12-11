import { genkit, z } from 'genkit';
import { ollama } from 'genkitx-ollama';
import { openAI } from 'genkitx-openai';
// import { googleAI } from '@genkit-ai/google-genai';
import dotenv from 'dotenv';
import path from 'path';

// Explicitly load .env and .env.local for robustness
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const ai = genkit({
  plugins: [
    // googleAI(),
    // Keep Ollama available as backup or for other flows if needed, but not default
    ollama({
      models: [{ name: 'llama3.2:1b' }],
      serverAddress: 'http://127.0.0.1:11434',
    }),
    openAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1',
      models: [
        {
          name: 'llama-3.3-70b-versatile',
          info: {
            label: 'Groq Llama 3.3 70B',
            versions: ['llama-3.3-70b-versatile'],
            supports: { multiturn: true, tools: true, media: false, systemRole: true }
          },
          configSchema: z.object({
            temperature: z.number().optional(),
            maxOutputTokens: z.number().optional(),
            topP: z.number().optional(),
            stopSequences: z.array(z.string()).optional(),
          })
        },
        {
          name: 'llama-3.1-8b-instant',
          info: {
            label: 'Groq Llama 3.1 8B',
            versions: ['llama-3.1-8b-instant'],
            supports: { multiturn: true, tools: true, media: false, systemRole: true }
          },
          configSchema: z.object({
            temperature: z.number().optional(),
            maxOutputTokens: z.number().optional(),
            topP: z.number().optional(),
            stopSequences: z.array(z.string()).optional(),
          })
        }
      ]
    }),
  ],
  model: 'openai/llama-3.1-8b-instant', // Default to Groq Cloud model
});
