// AssessUser story implementation
'use server';
/**
 * @fileOverview Implements the AI assessment tool for students and parents.
 *
 * - assessUser - An asynchronous function that accepts assessment input and returns the AI's assessment.
 * - AssessUserInput - The input type for the assessUser function, including the assessment question and student's answer.
 * - AssessUserOutput - The output type for the assessUser function, providing an assessment of the student's answer.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssessUserInputSchema = z.object({
  question: z.string().describe('The assessment question.'),
  answer: z.string().describe('The student\'s answer to the question.'),
});
export type AssessUserInput = z.infer<typeof AssessUserInputSchema>;

const AssessUserOutputSchema = z.object({
  assessment: z.string().describe('The AI assessment of the student\'s answer.'),
});
export type AssessUserOutput = z.infer<typeof AssessUserOutputSchema>;

export async function assessUser(input: AssessUserInput): Promise<AssessUserOutput> {
  return assessUserFlow(input);
}

const assessUserPrompt = ai.definePrompt({
  name: 'assessUserPrompt',
  input: {schema: AssessUserInputSchema},
  output: {schema: AssessUserOutputSchema},
  prompt: `You are an AI assessment tool that helps students and parents assess student's performance.

  Question: {{{question}}}
  Answer: {{{answer}}}

  Please provide a detailed assessment of the student's answer. Focus on accuracy, completeness, and understanding of the underlying concepts.`,
});

const assessUserFlow = ai.defineFlow(
  {
    name: 'assessUserFlow',
    inputSchema: AssessUserInputSchema,
    outputSchema: AssessUserOutputSchema,
  },
  async input => {
    const {output} = await assessUserPrompt(input);
    return output!;
  }
);
