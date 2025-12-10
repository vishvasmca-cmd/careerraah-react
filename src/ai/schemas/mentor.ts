
import { z } from 'zod';

export const AskMentorInputSchema = z.object({
    query: z.string().describe("The user's career-related question."),
    userName: z.string().optional().describe("User's name if known."),
    ageOrStage: z.string().optional().describe("User's age or academic stage if known (e.g. '8 years old', 'Class 10')."),
    language: z.string().default('en').describe("Language for the response."),
});
export type AskMentorInput = z.infer<typeof AskMentorInputSchema>;

export const AskMentorOutputSchema = z.object({
    answer: z.string().describe("A helpful, encouraging, and age-appropriate answer to the user's question, in Markdown."),
    followUpQuestions: z.array(z.string()).describe("3 suggested follow-up questions the user can ask."),
});
export type AskMentorOutput = z.infer<typeof AskMentorOutputSchema>;
