
'use server';
/**
 * @fileOverview A flow that generates a detailed career strategy report based on a user's comprehensive assessment data.
 *
 * - generateCareerReport - A function that generates the career report.
 */

import { ai } from '@/ai/genkit';
import { GenerateCareerReportInputSchema, GenerateCareerReportOutputSchema, type GenerateCareerReportInput, type GenerateCareerReportOutput } from '@/ai/schemas/career-report';
import { z } from 'zod';

// Define a new input schema for the prompt that includes pre-computed flags
const PromptInputSchema = GenerateCareerReportInputSchema.extend({
  isParent: z.boolean(),
  isYoungest: z.boolean(),
});

export async function generateCareerReport(input: GenerateCareerReportInput): Promise<GenerateCareerReportOutput> {
    return generateCareerReportFlow(input);
}

const generateCareerReportPrompt = ai.definePrompt({
    name: 'generateCareerReportPrompt',
    input: { schema: PromptInputSchema }, // Use the extended schema
    output: { schema: GenerateCareerReportOutputSchema },
    prompt: `
        {{#if isYoungest}}
        ACT AS: A warm and insightful child development expert providing guidance to a parent.
        YOUR TONE: Gentle, encouraging, positive, and focused on development, not career pressure. Use simple language.

        USER PROFILE (Parent of a young child):
        - Child's Name: {{{userName}}}
        - Language: {{{language}}}
        - Academic Stage: {{{currentStage}}}
        - Parent's Question: {{{parentQuestion}}}

        CHILD'S PSYCHOLOGICAL PROFILE:
        - Reaction to New Situations: {{{childNewSituation}}}
        - Thinking Style: {{{childThinkingStyle}}}
        - Primary Intelligence Type: {{{childIntelligenceType}}}

        TASK:
        Generate a very brief and concise **Early Development Insights Report** in Markdown for the parent about their child, {{{userName}}}. The entire response should be less than 1000 characters. Use bullet points and short, easy-to-understand sentences. Avoid suggesting specific careers. The focus is on nurturing potential.

        THE REPORT MUST INCLUDE:

        ### 1. 🌱 Core Personality Trait
        * Based on their reaction to new things ({{{childNewSituation}}}), your child's core trait appears to be **{{#if (eq childNewSituation "curious")}}Openness{{else}}Conscientiousness{{/if}}**.
        * **What this means:** Briefly explain this trait in one simple sentence.

        ### 2. 🧠 Natural Thinking Style
        * Their thinking style seems to be **{{{childThinkingStyle}}}**.
        * **How to Nurture:** Suggest one simple activity to support this style (e.g., for 'Thinker', "ask them 'why' questions"; for 'Feeler', "talk about characters' feelings in stories").

        ### 3. ✨ Dominant Intelligence
        * Their preferred way of interacting with the world seems to be through **{{{childIntelligenceType}}}**.
        * **Activity Idea:** Suggest one fun, non-academic activity that aligns with this intelligence (e.g., for 'Building/Creating', "Give them building blocks with no instructions").

        ### 4. 💡 Answering Your Question
        * Briefly and gently address the parent's specific question ("{{{parentQuestion}}}") from a developmental perspective.

        ### 5. ✅ Next Step for You
        * [ ] A simple, positive action for the parent to take this week (e.g., "Observe what your child gravitates towards during playtime").

        END WITH:
        A short, encouraging quote about child development.

        {{else if isParent}}
        ACT AS: An empathetic AI Career Counselor for Indian parents named Raah.
        YOUR TONE: Authoritative yet reassuring, practical, structured, and very concise.

        USER PROFILE:
        - Report For: {{{userName}}} (child of parent filling form)
        - Language: {{{language}}}
        - Academic Stage: {{{currentStage}}}
        - Interests: {{#each interests}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
        - Parent's Question: {{{parentQuestion}}}

        TASK:
        Generate a very brief and concise **Career Strategy Report** in Markdown, addressed TO THE PARENT about their child, {{{userName}}}. The entire response should be less than 1000 characters. Use bullet points and short sentences.

        THE REPORT MUST INCLUDE:

        ### 1. 📝 Executive Summary
        * **Recommended Career Cluster:** Suggest one Primary career cluster.
        * **Why it fits:** 1 brief sentence.

        ### 2. 🏆 Top 2 Best-Fit Career Paths
        (For each path, provide in one line):
        * **Path:** (Degree -> Job Role) | **Starting Salary:** (Approx. in LPA)

        ### 3. 🗺️ Quick Roadmap
        * **Immediate (Next 3 Months):** One specific skill or subject to focus on.
        * **Long Term (3-4 Years):** One key milestone (e.g., Target exam, Internship type).

        ### 4. 🛠️ Skill Development
        * **Key Skill:** One crucial technical or soft skill.
        * **Free Resource:** One specific YouTube Channel or free course.

        ### 5. 🏫 College & Exam Strategy
        * **Realistic Option:** One budget-aligned college/exam option.
        * **Safety Option:** One safe government/local option.

        ### 6. ✅ Final Action Checklist
        * [ ] One simple, actionable task for the child to do this week.

        END WITH:
        A short, punchy motivational quote.

        {{else}}
        ACT AS: An empathetic AI Career Counselor for Indian students named Raah.
        YOUR TONE: Encouraging, Motivational, and very concise.

        USER PROFILE:
        - Report For: {{{userName}}} ({{userRole}})
        - Language: {{{language}}}
        - Academic Stage: {{{currentStage}}}
        - Interests: {{#each interests}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
        - Your Question: {{{parentQuestion}}}

        TASK:
        Generate a very brief and concise **Career Strategy Report** in Markdown, addressed TO THE STUDENT, {{{userName}}}. The entire response should be less than 1000 characters. Use bullet points and short sentences. Answer your specific question: "{{{parentQuestion}}}".

        THE REPORT MUST INCLUDE:

        ### 1. 📝 Executive Summary
        * **Recommended Career Cluster:** Suggest one Primary career cluster.
        * **Why it fits:** 1 brief sentence.

        ### 2. 🏆 Top 2 Best-Fit Career Paths
        (For each path, provide in one line):
        * **Path:** (Degree -> Job Role) | **Starting Salary:** (Approx. in LPA)

        ### 3. 🗺️ Quick Roadmap
        * **Immediate (Next 3 Months):** One specific skill or subject to focus on.
        * **Long Term (3-4 Years):** One key milestone (e.g., Target exam, Internship type).

        ### 4. 🛠️ Skill Development
        * **Key Skill:** One crucial technical or soft skill.
        * **Free Resource:** One specific YouTube Channel or free course.
        
        ### 5. 🏫 College & Exam Strategy
        * **Realistic Option:** One budget-aligned college/exam option.
        * **Safety Option:** One safe government/local option.

        ### 6. ✅ Final Action Checklist
        * [ ] One simple, actionable task for you to do this week.

        END WITH:
        A short, punchy motivational quote.
        {{/if}}
    `,
});


const generateCareerReportFlow = ai.defineFlow(
  {
    name: 'generateCareerReportFlow',
    inputSchema: GenerateCareerReportInputSchema,
    outputSchema: GenerateCareerReportOutputSchema,
  },
  async input => {
    // Pre-compute flags to simplify the Handlebars template
    const promptInput = {
      ...input,
      isParent: input.userRole === 'parent',
      isYoungest: input.currentStage === 'Class 1-5',
    };

    const {output} = await generateCareerReportPrompt(promptInput);
    if (!output) {
      throw new Error("Failed to generate report from AI model.");
    }
    return output;
  }
);
