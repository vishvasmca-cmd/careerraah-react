
'use server';
/**
 * @fileOverview A flow that generates a detailed career strategy report based on a user's comprehensive assessment data.
 *
 * - generateCareerReport - A function that generates the career report.
 */

import { ai } from '@/ai/genkit';
import { GenerateCareerReportInputSchema, GenerateCareerReportOutputSchema, type GenerateCareerReportInput, type GenerateCareerReportOutput } from '@/ai/schemas/career-report';
import { z } from 'zod';

// Define a new input schema for the prompt that includes the isParent flag
const PromptInputSchema = GenerateCareerReportInputSchema.extend({
  isParent: z.boolean(),
});

export async function generateCareerReport(input: GenerateCareerReportInput): Promise<GenerateCareerReportOutput> {
    return generateCareerReportFlow(input);
}

const generateCareerReportPrompt = ai.definePrompt({
    name: 'generateCareerReportPrompt',
    input: { schema: PromptInputSchema }, // Use the extended schema
    output: { schema: GenerateCareerReportOutputSchema },
    prompt: `
        {{#if isParent}}
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
    // Pre-compute the isParent flag to simplify the Handlebars template
    const promptInput = {
      ...input,
      isParent: input.userRole === 'parent',
    };

    const {output} = await generateCareerReportPrompt(promptInput);
    if (!output) {
      throw new Error("Failed to generate report from AI model.");
    }
    return output;
  }
);
