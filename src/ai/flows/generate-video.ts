'use server';
/**
 * @fileOverview A Genkit flow for generating video from a text prompt using Veo.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'zod';
import { MediaPart } from 'genkit';

const GenerateVideoInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate the video from.'),
});
export type GenerateVideoInput = z.infer<typeof GenerateVideoInputSchema>;

const GenerateVideoOutputSchema = z.object({
  videoUrl: z.string().describe('The data URI of the generated video.'),
});
export type GenerateVideoOutput = z.infer<typeof GenerateVideoOutputSchema>;

export async function generateVideo(
  input: GenerateVideoInput
): Promise<GenerateVideoOutput> {
  return generateVideoFlow(input);
}

// Helper function to download the video from the temporary URL and convert it to a data URI
async function videoUrlToDataUri(video: MediaPart): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      'GEMINI_API_KEY environment variable is not set. Please add it to your .env file.'
    );
  }

  // The 'node-fetch' library is required for this to work in a Node.js environment.
  const fetch = (await import('node-fetch')).default;

  // The URL provided in the media part needs the API key appended to be accessed.
  const videoDownloadUrl = `${video.media!.url}&key=${process.env.GEMINI_API_KEY}`;

  const response = await fetch(videoDownloadUrl);

  if (!response.ok || !response.body) {
    throw new Error(`Failed to download video: ${response.statusText}`);
  }

  // Read the response body into a buffer
  const videoBuffer = await response.buffer();
  const base64Video = videoBuffer.toString('base64');
  const contentType = response.headers.get('content-type') || 'video/mp4';

  return `data:${contentType};base64,${base64Video}`;
}

const generateVideoFlow = ai.defineFlow(
  {
    name: 'generateVideoFlow',
    inputSchema: GenerateVideoInputSchema,
    outputSchema: GenerateVideoOutputSchema,
  },
  async ({ prompt }) => {
    // 1. Start the video generation process. Veo returns an operation immediately.
    let { operation } = await ai.generate({
      model: googleAI.model('veo-2.0-generate-001'),
      prompt: prompt,
      config: {
        durationSeconds: 8, // Generate an 8-second video
        aspectRatio: '16:9', // Widescreen
      },
    });

    if (!operation) {
      throw new Error('Video generation operation did not start.');
    }

    // 2. Poll the operation status until it's complete.
    // This is crucial because video generation is a long-running task.
    while (!operation.done) {
      console.log('Checking video generation status...');
      // Wait for 5 seconds before checking again.
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.checkOperation(operation);
    }

    // 3. Handle potential errors during generation.
    if (operation.error) {
      throw new Error(
        `Video generation failed: ${operation.error.message}`
      );
    }

    // 4. Extract the video from the completed operation's result.
    const video = operation.output?.message?.content.find(p => !!p.media);
    if (!video) {
      throw new Error('Generated video not found in the operation result.');
    }

    // 5. Download the video from its temporary URL and convert it to a data URI
    const dataUri = await videoUrlToDataUri(video);

    return { videoUrl: dataUri };
  }
);
