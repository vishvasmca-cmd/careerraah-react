/**
 * @fileOverview Zod schemas and TypeScript types for the career report generation flow.
 * This file centralizes the data structures used for input and output, allowing them
 * to be imported into both server and client components without violating the
 * "use server" directive constraints.
 */

import { z } from 'zod';

// Zod schema for the input, mirroring the expanded form data
export const GenerateCareerReportInputSchema = z.object({
  // Core User Info
  userName: z.string().optional().describe("The name of the user for whom the report is generated."),
  userRole: z.string().optional().describe("The person viewing the report, e.g., 'student' or 'parent'."),
  language: z.string().describe("The ISO 639-1 code for the language the response should be in (e.g., 'en', 'hi')."),
  
  // Current Academic Status
  currentStage: z.string().describe("The user's current academic stage (e.g., 'Class 8-10', 'Class 11-12', 'College / Graduate')."),
  board: z.string().optional().describe("The user's education board (e.g., 'CBSE', 'ICSE')."),
  stream: z.string().optional().describe("The user's academic stream if in Class 11-12 (e.g., 'Science (PCM)', 'Commerce')."),
  academicScore: z.string().describe("The user's average academic score range (e.g., '75% - 85%')."),
  examStatus: z.array(z.string()).optional().describe("Entrance exams the user is preparing for."),

  // Personal Profile
  strongSubjects: z.array(z.string()).describe("The user's strongest or favorite subjects."),
  interests: z.array(z.string()).describe("The user's interests and hobbies outside of academics."),
  workStyle: z.string().optional().describe("The user's preferred work style (e.g., 'Desk Job', 'Field Work')."),
  
  // Goals and Constraints
  budget: z.string().describe("The user's budget for higher education per year."),
  location: z.string().optional().describe("The user's location preference for work/study."),
  parentPressure: z.boolean().optional().describe("Whether the user feels pressure from their parents to pursue a specific career path."),
  parentQuestion: z.string().optional().describe("Any specific question or concern from the user (parent or student)."),

  // Fields for College Grads / Gap Year
  university: z.string().optional().describe("University/college name if applicable."),
  collegeStream: z.string().optional().describe("Stream/degree if in college (e.g., B.Tech in CS)."),
  currentGoal: z.string().optional().describe("Primary goal if in college or on a gap year."),
  industryPreference: z.string().optional().describe("Industry preference if looking for a job."),
  gapDegree: z.string().optional().describe("Degree completed before taking a gap year."),
  gapAspiration: z.string().optional().describe("Main aspiration during the gap year."),
});
export type GenerateCareerReportInput = z.infer<typeof GenerateCareerReportInputSchema>;

export const GenerateCareerReportOutputSchema = z.object({
  reportContent: z.string().describe("The full, detailed career strategy report in Markdown format."),
});
export type GenerateCareerReportOutput = z.infer<typeof GenerateCareerReportOutputSchema>;
