
'use server';
/**
 * @fileOverview A flow that generates a detailed career strategy report based on a user's comprehensive assessment data.
 *
 * - generateCareerReport - A function that generates the career report.
 */

import { ai } from '@/ai/genkit';
import { GenerateCareerReportInputSchema, GenerateCareerReportOutputSchema, type GenerateCareerReportInput, type GenerateCareerReportOutput } from '@/ai/schemas/career-report';

export async function generateCareerReport(input: GenerateCareerReportInput): Promise<GenerateCareerReportOutput> {
    return generateCareerReportFlow(input);
}

const generateCareerReportPrompt = ai.definePrompt({
    name: 'generateCareerReportPrompt',
    input: { schema: GenerateCareerReportInputSchema },
    output: { schema: GenerateCareerReportOutputSchema },
    prompt: `
    ACT AS: A top-tier, empathetic Career Counselor for Indian students. Your advice is practical, encouraging, and highly personalized. Your tone should adjust based on the 'userRole'. If it's a 'parent', be slightly more formal and reassuring. If it's a 'student', be more direct and encouraging.

    Analyze the user's profile and generate a career report with two fields: 'recommendedClusters' and 'topCareerPaths'.

    USER PROFILE:
    - Report For: {{{userRole}}}
    - Academic Stage: {{{currentStage}}}
    - Board: {{{board}}}
    - Stream: {{{stream}}}
    - Academic Score: {{{academicScore}}}
    - Strong Subjects: {{#each strongSubjects}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
    - Interests: {{#each interests}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
    - Work Style: {{{workStyle}}}
    - College Budget: {{{budget}}} (This is a CRITICAL constraint)
    - Location Preference: {{{location}}}
    - Parent Pressure (Eng/Med): {{#if parentPressure}}Yes{{else}}No{{/if}}
    - Parent's Question: {{{parentQuestion}}}
    - Current Goal (if applicable): {{{currentGoal}}}
    - Industry Preference (if applicable): {{{industryPreference}}}

    YOUR TASK:
    Generate a JSON object that strictly follows the output schema.

    1.  **recommendedClusters**:
        - A short and precise summary (not more than 100 words) of the 2-3 broad career fields that are a good fit for the user, linking to their interests and subjects.

    2.  **topCareerPaths**:
        - An array of exactly 3 JSON objects.
        - For each object, you must provide these exact keys and value types:
            - **name** (string): The career title (e.g., "Product Manager").
            - **reason** (string): A sharp, single sentence linking their profile to the career. (e.g., "Your blend of business interest, leadership qualities, and strong academics makes this a great fit.").
            - **path** (string): The typical path. (e.g., "B.Tech -> MBA -> APM Role").
            - **realityCheck** (string): Difficulty and approx. success rate. (e.g., "Hard / ~10% chance to enter top firms").
            - **financials** (string): Approx. fees vs. starting salary. (e.g., "Fees: ₹15-25L, Salary: ₹18-30LPA").
    `,
});


const generateCareerReportFlow = ai.defineFlow(
  {
    name: 'generateCareerReportFlow',
    inputSchema: GenerateCareerReportInputSchema,
    outputSchema: GenerateCareerReportOutputSchema,
  },
  async input => {
    const {output} = await generateCareerReportPrompt(input);
    if (!output) {
      throw new Error("Failed to generate report from AI model.");
    }
    return output;
  }
);
