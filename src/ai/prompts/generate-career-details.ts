import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { CareerDetailsSchema } from '@/ai/schemas/career-details';

export const GenerateCareerDetailsInputSchema = z.object({
    careerName: z.string(),
});

export const generateCareerDetailsPrompt = ai.definePrompt({
    name: 'generateCareerDetailsPrompt',
    input: { schema: GenerateCareerDetailsInputSchema },
    output: { schema: CareerDetailsSchema },
    prompt: `
    ACT AS: An expert Indian Career Counselor and Data Analyst acting as a "Career Encyclopedia."

    TASK: Generate a structured, data-driven, and culturally relevant profile for the career: "{{careerName}}".

    CONTEXT: This data will be shown to Indian parents to help them make informed decisions for their child's future.

    GUIDELINES:
    1.  **Salary & Financials:** Provide realistic figures for the Indian market in Lakhs per Annum (LPA).
    2.  **Edu Cost:** Estimate the average cost of education in India (e.g., B.Tech cost, MBBS cost).
    3.  **Risk:** Be honest about job security and competition.
    4.  **Fit Check:** Provide 3 deeply insightful questions that a parent can observe in their child.
    5.  **Icon:** Select the most appropriate Lucide React icon name (e.g., Rocket, Stethoscope, Gavel, etc.).
    6.  **Trust/Suraksha Score:** Score from 1-10 based on job security and long-term demand in India.
    7.  **Category:** Choose one of: Future Tech, Medical, Creative Arts, Legal, Data Science, Finance, Management, Science & Research, Sports, Civil Services, or Other.
    8.  **Image Hint:** A simple, descriptive 2-3 word search query for Unsplash (e.g., "coding laptop", "doctor stethoscope").
    
    RETURN JSON matching the schema.
  `,
});
