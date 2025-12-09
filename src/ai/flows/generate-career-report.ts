
'use server';
/**
 * @fileOverview A flow that generates a detailed career strategy report based on a user's comprehensive assessment data.
 *
 * - generateCareerReport - A function that generates the career report.
 */

import { ai } from '@/ai/genkit';
import { GenerateCareerReportInputSchema, GenerateCareerReportOutputSchema, PromptInputSchema, type GenerateCareerReportInput, type GenerateCareerReportOutput } from '@/ai/schemas/career-report';
import { generateGroupACareerReportPrompt } from '@/ai/prompts/group-a-report';
import { generateStandardCareerReportPrompt } from '@/ai/prompts/standard-report';

export async function generateCareerReport(input: GenerateCareerReportInput): Promise<GenerateCareerReportOutput> {
  return generateCareerReportFlow(input);
}


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
      isCurious: input.childNewSituation === 'curious',
      isGroupB: input.currentStage === 'Class 6-8',
      isClass9: input.currentStage === 'Class 9',
      isClass10: input.currentStage === 'Class 10',
      isClass11: input.currentStage === 'Class 11',
      isClass12: input.currentStage === 'Class 12',
    };

    const promptToUse = promptInput.isYoungest
      ? generateGroupACareerReportPrompt
      : generateStandardCareerReportPrompt;

    const { output } = await promptToUse(promptInput);
    if (!output) {
      throw new Error("Failed to generate report from AI model.");
    }
    // Make sure to return the expected 'reportContent' property
    return { reportContent: output.reportContent };
  }
);

