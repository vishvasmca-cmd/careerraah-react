
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
  answer: z.string().describe("A detailed, conversational answer to the user's question, formatted in Markdown."),
});
export type AnswerCareerQuestionOutput = z.infer<typeof AnswerCareerQuestionOutputSchema>;

export async function answerCareerQuestion(input: AnswerCareerQuestionInput): Promise<AnswerCareerQuestionOutput> {
  return answerCareerQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerCareerQuestionPrompt',
  input: { schema: AnswerCareerQuestionInputSchema },
  output: { format: 'text' },
  prompt: `
    ACT AS: A helpful and empathetic AI career counselor named Raah.

    CRITICAL RULE: Your response must be factually accurate and avoid hallucinations. All suggestions must be realistic. Maintain a positive, motivational tone throughout.

    YOUR TASK:
    1.  You MUST respond in the language specified by the 'language' field: {{{language}}}.
    2.  Always start your response by personally greeting the user, for example: "Of course, {{{assessmentData.userName}}}!" or "Great question, {{{assessmentData.userName}}}!".
    3.  Keep your answers precise, encouraging, and actionable. Use Markdown for formatting (lists, bolding).
    4.  If the question is about writing a note to parents, draft a supportive and informative note from the perspective of the student.
    5.  After your main answer, ALWAYS ask a relevant, open-ended follow-up question to keep the conversation going. For example, "Does this roadmap seem achievable for you?" or "Which of these skills are you most excited to learn first?".

    CONTEXT: The user has just received a detailed career report and is now asking a specific follow-up question in a chat window.

    USER'S FULL PROFILE (for context only, do not repeat it in your answer):
    - Name: {{{assessmentData.userName}}}
    - Report For: {{{assessmentData.userRole}}}
    - Academic Stage: {{{assessmentData.currentStage}}}
    - Strong Subjects: {{#each assessmentData.strongSubjects}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
    - Interests: {{#each assessmentData.interests}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
    - Budget: {{{assessmentData.budget}}}

    USER'S SPECIFIC QUESTION:
    "{{{question}}}"

    YOUR RESPONSE:
    Directly answer the user's question based on their profile and the context of the detailed report they have already seen. Follow all the rules above.
  `,
});


const answerCareerQuestionFlow = ai.defineFlow(
  {
    name: 'answerCareerQuestionFlow',
    inputSchema: AnswerCareerQuestionInputSchema,
    outputSchema: AnswerCareerQuestionOutputSchema,
  },
  async (input) => {
    const { text } = await prompt(input);
    if (!text) {
      throw new Error("Failed to generate answer from AI model.");
    }
    return { answer: text };
  }
);

