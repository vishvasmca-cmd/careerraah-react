'use server';
/**
 * @fileOverview A flow that generates a career report based on a user's assessment data.
 *
 * - generateCareerReport - A function that generates the career report.
 * - GenerateCareerReportInput - The input type for the generateCareerReport function.
 * - GenerateCareerReportOutput - The return type for the generateCareerReport function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateCareerReportInputSchema = z.object({
  currentStage: z.string().describe("The user's current academic stage (e.g., 'Class 1-5', 'Class 11-12', 'College / Graduate')."),
  strongSubjects: z.array(z.string()).describe("The user's strongest subjects."),
  interests: z.array(z.string()).describe("The user's interests and hobbies."),
  workStyle: z.string().optional().describe("The user's preferred work style (e.g., 'Desk Job', 'Field Work')."),
  budget: z.string().optional().describe("The user's budget for higher education."),
  location: z.string().optional().describe("The user's location preference for work/study."),
  parentPressure: z.boolean().optional().describe("Whether the user feels pressure from their parents to pursue a specific career path."),
  parentQuestion: z.string().optional().describe("Any specific question or concern from the parent (for younger students)."),
});
export type GenerateCareerReportInput = z.infer<typeof GenerateCareerReportInputSchema>;

const CareerSuggestionSchema = z.object({
    name: z.string().describe("The name of the suggested career path."),
    reason: z.string().describe("A brief explanation of why this career is a good fit for the user."),
});

const GenerateCareerReportOutputSchema = z.object({
  introduction: z.string().describe("A personalized introduction for the user based on their profile."),
  topSuggestions: z.array(CareerSuggestionSchema).describe("The top 2-3 career suggestions for the user."),
  nextSteps: z.string().describe("Actionable next steps for the user to explore these career paths."),
});
export type GenerateCareerReportOutput = z.infer<typeof GenerateCareerReportOutputSchema>;


export async function generateCareerReport(input: GenerateCareerReportInput): Promise<GenerateCareerReportOutput> {
    return generateCareerReportFlow(input);
}

const isJunior = (stage: string) => ['Class 1-5', 'Class 6-7', 'Class 8-10'].includes(stage);

const generateCareerReportPrompt = ai.definePrompt({
    name: 'generateCareerReportPrompt',
    input: { schema: GenerateCareerReportInputSchema },
    output: { schema: GenerateCareerReportOutputSchema },
    prompt: `You are an expert career counselor in India. Your goal is to provide a helpful and encouraging report for a student based on their assessment data.

    **User Profile:**
    - Current Stage: {{{currentStage}}}
    - Strong Subjects: {{#each strongSubjects}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
    - Interests: {{#each interests}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
    {{#if workStyle}}- Preferred Work Style: {{{workStyle}}}{{/if}}
    {{#if budget}}- College Budget: {{{budget}}}{{/if}}
    {{#if location}}- Location Preference: {{{location}}}{{/if}}
    {{#if parentPressure}}- Feels Parent Pressure for Engineering/Medical: Yes{{/if}}
    {{#if parentQuestion}}- Parent's Concern: {{{parentQuestion}}}{{/if}}

    **Your Task:**

    Based on the profile, generate a personalized career report.

    1.  **Introduction:** Write a warm and encouraging introduction (2-3 sentences). Acknowledge their current stage and one key strength from their profile.
    
    2.  **Top Suggestions:**
        {{#if (isJunior currentStage)}}
        - For this younger student, suggest 2-3 broad fields of exploration rather than specific careers. Examples: "Creative Arts & Design", "Science & Discovery", "Technology & Building".
        {{else}}
        - Suggest 2-3 specific, actionable career paths.
        {{/if}}
        - For each suggestion, provide a single sentence explaining *why* it's a good fit, linking it to their subjects and interests. For example, "Your strength in Science and interest in Helping People makes 'Healthcare' a great area to explore."

    3.  **Next Steps:** Provide a short, bulleted list of 2-3 simple, actionable next steps they can take.
        {{#if (isJunior currentStage)}}
        - Suggest fun activities. Example: "Try a block-based coding app like Scratch" or "Visit a science museum".
        {{else}}
        - Suggest concrete actions. Example: "Watch a 'day in the life' video of a Product Manager on YouTube" or "Try a free online course in UX Design".
        {{/if}}
        
    Keep the tone positive, encouraging, and tailored to the Indian context. Avoid jargon. Address the user directly.
    `,
    helpers: { isJunior }
});


const generateCareerReportFlow = ai.defineFlow(
  {
    name: 'generateCareerReportFlow',
    inputSchema: GenerateCareerReportInputSchema,
    outputSchema: GenerateCareerReportOutputSchema,
  },
  async input => {
    const {output} = await generateCareerReportPrompt(input);
    return output!;
  }
);
