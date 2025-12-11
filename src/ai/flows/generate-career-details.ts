'use server';

import { ai } from '@/ai/genkit';
import { GenerateCareerDetailsInputSchema, generateCareerDetailsPrompt } from '@/ai/prompts/generate-career-details';
import { CareerDetailsSchema, type CareerDetails } from '@/ai/schemas/career-details';

export async function generateCareerDetails(carrierName: string): Promise<CareerDetails> {
    return generateCareerDetailsFlow({ careerName: carrierName });
}

const generateCareerDetailsFlow = ai.defineFlow(
    {
        name: 'generateCareerDetailsFlow',
        inputSchema: GenerateCareerDetailsInputSchema,
        outputSchema: CareerDetailsSchema,
    },
    async (input) => {
        const { output } = await generateCareerDetailsPrompt(input);
        if (!output) {
            throw new Error("Failed to generate career details.");
        }
        return output;
    }
);
