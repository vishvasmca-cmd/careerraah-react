
import { z } from 'zod';

export const OnboardingAnswerInputSchema = z.object({
    userName: z.string().describe("The user's first name, if available."),
    userQuestion: z.string().describe("The initial question asked by the user."),
    grade: z.string().describe("The user's academic grade/class (e.g., '10th', '12th', 'College')."),
    location: z.string().describe("The user's location/city/country."),
    language: z.string().default('en').describe("Language code for the response (e.g., 'en', 'hi')."),
});
export type OnboardingAnswerInput = z.infer<typeof OnboardingAnswerInputSchema>;

export const OnboardingAnswerOutputSchema = z.object({
    answer: z.string().describe("A concise (max 3 sentences) answer to the user's question."),
    followUpQuestions: z.array(z.string()).describe("Exactly 3 short, relevant follow-up questions to guide the conversation further."),
});
export type OnboardingAnswerOutput = z.infer<typeof OnboardingAnswerOutputSchema>;
