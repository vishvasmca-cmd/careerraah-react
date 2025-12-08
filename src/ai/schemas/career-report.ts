/**
 * @fileOverview Zod schemas and TypeScript types for the career report generation flow.
 * This file centralizes the data structures used for input and output, allowing them
 * to be imported into both server and client components without violating the
 * "use server" directive constraints.
 */

import { z } from 'zod';

// Zod schema for the input, mirroring the expanded form data
export const GenerateCareerReportInputSchema = z.object({
  userRole: z.string().describe("The person viewing the report, e.g., 'student' or 'parent'."),
  currentStage: z.string().describe("The user's current academic stage (e.g., 'Class 8-10', 'Class 11-12', 'College / Graduate')."),
  board: z.string().optional().describe("The user's education board (e.g., 'CBSE', 'ICSE')."),
  stream: z.string().optional().describe("The user's academic stream if in Class 11-12 (e.g., 'Science (PCM)', 'Commerce')."),
  strongSubjects: z.array(z.string()).describe("The user's strongest or favorite subjects."),
  academicScore: z.string().describe("The user's average academic score range (e.g., '75% - 85%')."),
  examStatus: z.array(z.string()).optional().describe("Entrance exams the user is preparing for."),
  interests: z.array(z.string()).describe("The user's interests and hobbies outside of academics."),
  workStyle: z.string().optional().describe("The user's preferred work style (e.g., 'Desk Job', 'Field Work')."),
  budget: z.string().describe("The user's budget for higher education per year."),
  location: z.string().optional().describe("The user's location preference for work/study."),
  parentPressure: z.boolean().optional().describe("Whether the user feels pressure from their parents to pursue a specific career path."),
  parentQuestion: z.string().optional().describe("Any specific question or concern from the parent (for younger students)."),
  // Fields for college grads / gap year
  university: z.string().optional(),
  collegeStream: z.string().optional(),
  currentGoal: z.string().optional(),
  industryPreference: z.string().optional(),
  gapDegree: z.string().optional(),
  gapAspiration: z.string().optional(),
});
export type GenerateCareerReportInput = z.infer<typeof GenerateCareerReportInputSchema>;


const CareerSuggestionSchema = z.object({
    name: z.string().describe("The name of the suggested career path or field of exploration."),
    reason: z.string().describe("A brief explanation of why this career/field is a good fit for the user, connecting to their specific inputs."),
    path: z.string().optional().describe("The typical educational path for this career (e.g., Exam -> Degree -> Role). Only for senior students."),
    realityCheck: z.string().optional().describe("The difficulty and success rate of this path (e.g., 'Hard / ~5% Success'). Only for senior students."),
    financials: z.string().optional().describe("A summary of typical college fees vs. starting salary in India. Only for senior students."),
});

export const GenerateCareerReportOutputSchema = z.object({
  introduction: z.string().describe("A personalized introduction for the user based on their profile, acknowledging their stage and strengths."),
  topSuggestions: z.array(CareerSuggestionSchema).describe("The top 2-3 specific and actionable career suggestions or fields of exploration for the user."),
  nextSteps: z.string().describe("A bulleted list of simple, actionable next steps for the user to explore these paths (e.g., '- Watch a 'day in the life' video on YouTube', or for juniors '- Try a free coding app like Scratch')."),
  planB: z.string().optional().describe("A safe and realistic backup plan, or a note for parents for junior students."),
});
export type GenerateCareerReportOutput = z.infer<typeof GenerateCareerReportOutputSchema>;
