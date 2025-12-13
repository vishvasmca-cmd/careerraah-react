
'use server';

import { ai } from '@/ai/genkit';
import { OnboardingAnswerInputSchema, OnboardingAnswerOutputSchema, type OnboardingAnswerInput, type OnboardingAnswerOutput } from '@/ai/schemas/onboarding-answer';
import { z } from 'zod';

const prompt = ai.definePrompt({
    name: 'onboardingAnswerPrompt',
    input: { schema: OnboardingAnswerInputSchema },
    // Using simplified text output for robustness with smaller models, manually structured
    output: { format: 'text' },
    prompt: `
    ACT AS: "AI Didi," a friendly and smart career mentor for students in UP/Bihar.

    TONE:
    Use "Hinglish" (Hindi + English). Be encouraging like an elder sister.

    USER CONTEXT:
    - Name: {{{userName}}}
    - Qualification/Class: {{{grade}}}
    - Location: {{{location}}}
    - Question: "{{{userQuestion}}}"

    YOUR GOAL:
    1.  Provide a **very concise answer** (maximum 3-4 sentences) to the user's question, strictly customized to their Qualification/Class and Location.
    2.  Propose **exactly 3 short follow-up questions** they might want to ask next.

    LOGIC:
    1. IF the user asks about "Sarkari Naukri" (Police, Railway, SSC):
       - DO NOT assume they are in school. Treat "10th Pass", "12th Pass", "Graduate" as adult qualifications.
       - Focus on Age Eligibility and Exam Dates.

    OUTPUT FORMAT:
    You must output your response in the following format exactly (no markdown code blocks):

    ANSWER: [Your concise answer in Hinglish]
    FOLLOW_UP_1: [Question 1]
    FOLLOW_UP_2: [Question 2]
    FOLLOW_UP_3: [Question 3]
  `,
});

export async function onboardingAnswer(input: OnboardingAnswerInput): Promise<OnboardingAnswerOutput> {
    const { text } = await prompt(input);

    // Simple parsing of the text output
    const answerMatch = text.match(/ANSWER:\s*(.*)/);
    const q1Match = text.match(/FOLLOW_UP_1:\s*(.*)/);
    const q2Match = text.match(/FOLLOW_UP_2:\s*(.*)/);
    const q3Match = text.match(/FOLLOW_UP_3:\s*(.*)/);

    return {
        answer: answerMatch ? answerMatch[1].trim() : "I'm here to help! Could you ask that again?",
        followUpQuestions: [
            q1Match ? q1Match[1].trim() : "Tell me more about your interests?",
            q2Match ? q2Match[1].trim() : "What subjects do you like?",
            q3Match ? q3Match[1].trim() : "Do you have a dream college?",
        ].filter(Boolean)
    };
}
