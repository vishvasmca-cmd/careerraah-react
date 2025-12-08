
'use server';

import { assessUser } from '@/ai/flows/assess-user';
import { summarizeBlogPost } from '@/ai/flows/summarize-blog-posts';
import { generateCareerReport } from '@/ai/flows/generate-career-report';
import type { GenerateCareerReportInput } from '@/ai/schemas/career-report';
import { answerCareerQuestion } from '@/ai/flows/answer-career-question';
import { generateVideo } from '@/ai/flows/generate-video';


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
    console.error("Action Error:", error);
    return { error: 'Failed to generate career report from the AI model. Please try again later.' };
  }
}

export async function getCareerQuestionAnswerAction(
  assessmentData: GenerateCareerReportInput,
  question: string,
  language: string,
) {
  try {
    const result = await answerCareerQuestion({ assessmentData, question, language });
    return { answer: result.answer };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to get an answer. Please try again later.' };
  }
}

export async function getVideoAction(prompt: string) {
  if (!prompt) {
    return { error: 'Prompt is required.' };
  }
  try {
    const result = await generateVideo({ prompt });
    return { videoUrl: result.videoUrl };
  } catch (error: any) {
    console.error('Error in getVideoAction:', error);
    // Provide a more user-friendly error message
    const message = error.message.includes('GEMINI_API_KEY')
      ? 'The API key is missing. Please check the server configuration.'
      : 'Failed to generate video. The model may be busy or the request could not be processed. Please try again later.';
    return { error: message };
  }
}
