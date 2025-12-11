'use server';

import { generateCareerDetails } from '@/ai/flows/generate-career-details';
import { CareerDetails } from '@/ai/schemas/career-details';

export async function getAiCareerDetails(careerName: string): Promise<CareerDetails | null> {
    try {
        const data = await generateCareerDetails(careerName);
        return data;
    } catch (error) {
        console.error("AI Generation Error:", error);
        return null;
    }
}
