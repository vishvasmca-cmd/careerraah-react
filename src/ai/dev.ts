import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-blog-posts.ts';
import '@/ai/flows/assess-user.ts';
import '@/ai/flows/generate-career-report.ts';
import '@/ai/flows/answer-career-question.ts';
import '@/ai/flows/generate-video.ts';
