
'use server';

import { assessUser } from '@/ai/flows/assess-user';
import { summarizeBlogPost } from '@/ai/flows/summarize-blog-posts';
import { generateCareerReport, GenerateCareerReportInput } from '@/ai/flows/generate-career-report';

export async function getSummaryAction(content: string) {
  if (!content) {
    return { error: 'Content is required.' };
  }
  try {
    const result = await summarizeBlogPost({ blogPostContent: content });
    return { summary: result.summary };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to generate summary. Please try again later.' };
  }
}

export async function getAssessmentAction(question: string, answer: string) {
  if (!question || !answer) {
    return { error: 'Question and answer are required.' };
  }
  try {
    const result = await assessUser({ question, answer });
    return { assessment: result.assessment };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to generate assessment. Please try again later.' };
  }
}

export async function getCareerReportAction(data: GenerateCareerReportInput) {
  try {
    const result = await generateCareerReport(data);
    return { report: result };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to generate career report. Please try again later.' };
  }
}
