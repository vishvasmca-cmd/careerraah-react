
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
    ACT AS: A top-tier, empathetic Career Counselor for Indian students. You have deep knowledge of the Indian education system, competitive exams, and the modern job market. Your advice is practical, encouraging, and highly personalized.

    TONE: Mentor-like, realistic, and motivational. Avoid generic advice. Be specific and actionable. Your tone should adjust based on the 'userRole'. If it's a 'parent', be slightly more formal and reassuring. If it's a 'student', be more direct and encouraging.

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

    YOUR TASK: Generate a short and precise career report based on the user's profile.

    THE REPORT MUST INCLUDE:

    1.  **Recommended Career Clusters:**
        - A short and precise summary (not more than 100 words) of the 2-3 broad career fields that are a good fit for the user, linking to their interests and subjects.

    2.  **Top 3 Best-Fit Career Paths:**
        - An array of 3 objects in a field named 'topCareerPaths'.
        - For each object in the array, you must provide:
            - **name:** The career title (e.g., "Product Manager").
            - **reason:** A sharp, single sentence linking their profile to the career. (e.g., "Your blend of business interest, leadership qualities, and strong academics makes this a great fit.").
            - **path:** The typical path. (e.g., "B.Tech -> MBA -> APM Role").
            - **realityCheck:** Difficulty and approx. success rate. (e.g., "Hard / ~10% chance to enter top firms").
            - **financials:** Approx. fees vs. starting salary. (e.g., "Fees: ₹15-25L, Salary: ₹18-30LPA").
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
