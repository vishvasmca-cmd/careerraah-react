
'use server';
/**
 * @fileOverview A flow that answers a specific follow-up question about a career path,
 * based on the user's initial assessment data.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { GenerateCareerReportInputSchema } from '@/ai/schemas/career-report';

const AnswerCareerQuestionInputSchema = z.object({
  assessmentData: GenerateCareerReportInputSchema.describe("The user's original assessment data."),
  question: z.string().describe("The specific follow-up question the user is asking."),
  language: z.string().describe("The ISO 639-1 code for the language the response should be in (e.g., 'en', 'hi')."),
});
export type AnswerCareerQuestionInput = z.infer<typeof AnswerCareerQuestionInputSchema>;

const AnswerCareerQuestionOutputSchema = z.object({
  answer: z.string().describe("A detailed answer to the user's question, formatted in Markdown."),
});
export type AnswerCareerQuestionOutput = z.infer<typeof AnswerCareerQuestionOutputSchema>;

export async function answerCareerQuestion(input: AnswerCareerQuestionInput): Promise<AnswerCareerQuestionOutput> {
  return answerCareerQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerCareerQuestionPrompt',
  input: { schema: AnswerCareerQuestionInputSchema },
  output: { schema: AnswerCareerQuestionOutputSchema },
  prompt: `
    ACT AS: A helpful and concise career counselor chatbot. Your job is to answer a user's follow-up question based on their profile.

    IMPORTANT: You MUST respond in the language specified by the 'language' field: {{{language}}}.

    CONTEXT: The user has already received an initial career summary. Now, they are asking a specific question.

    USER'S FULL PROFILE:
    - Report For: {{{assessmentData.userRole}}}
    - Academic Stage: {{{assessmentData.currentStage}}}
    - Board: {{{assessmentData.board}}}
    - Stream: {{{assessmentData.stream}}}
    - Academic Score: {{{assessmentData.academicScore}}}
    - Strong Subjects: {{#each assessmentData.strongSubjects}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
    - Interests: {{#each assessmentData.interests}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
    - Work Style: {{{assessmentData.workStyle}}}
    - College Budget: {{{assessmentData.budget}}}
    - Location Preference: {{{assessmentData.location}}}
    - Parent Pressure (Eng/Med): {{#if assessmentData.parentPressure}}Yes{{else}}No{{/if}}
    - Parent's Question: {{{assessmentData.parentQuestion}}}
    - Current Goal (if applicable): {{{assessmentData.currentGoal}}}
    - Industry Preference (if applicable): {{{assessmentData.industryPreference}}}


    USER'S QUESTION:
    "{{{question}}}"

    YOUR TASK:
    1. Directly answer the user's question.
    2. Keep the answer focused on the question. Do not repeat information they already have.
    3. Use Markdown for formatting (e.g., bullet points, bold text) to make the answer clear and easy to read.
    4. Be specific and provide actionable advice. For example, if asked for a roadmap, provide a clear, step-by-step list.
  `,
});


const answerCareerQuestionFlow = ai.defineFlow(
  {
    name: 'answerCareerQuestionFlow',
    inputSchema: AnswerCareerQuestionInputSchema,
    outputSchema: AnswerCareerQuestionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("Failed to generate answer from AI model.");
    }
    return output;
  }
);
