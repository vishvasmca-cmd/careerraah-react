
'use server';
/**
 * @fileOverview A flow that generates a detailed career strategy report based on a user's comprehensive assessment data.
 *
 * - generateCareerReport - A function that generates the career report.
 */

import { ai } from '@/ai/genkit';
import { GenerateCareerReportInputSchema, GenerateCareerReportOutputSchema, type GenerateCareerReportInput } from '@/ai/schemas/career-report';

export async function generateCareerReport(input: GenerateCareerReportInput): Promise<GenerateCareerReportOutput> {
    return generateCareerReportFlow(input);
}

const isJunior = (stage: string) => ['Class 1-5', 'Class 6-7', 'Class 8-10'].includes(stage);

const generateCareerReportPrompt = ai.definePrompt({
    name: 'generateCareerReportPrompt',
    input: { schema: GenerateCareerReportInputSchema },
    output: { schema: GenerateCareerReportOutputSchema },
    prompt: `
    ACT AS: A top-tier, empathetic Career Counselor for Indian students. You have deep knowledge of the Indian education system (CBSE, ICSE, State Boards), competitive exams (JEE, NEET, CLAT, etc.), university tiers, and the modern job market. Your advice is practical, encouraging, and highly personalized.

    TONE: Mentor-like, realistic, and motivational. Avoid generic advice. Be specific and actionable.

    USER PROFILE:
    - Academic Stage: {{{currentStage}}}
    - Board: {{{board}}}
    - Stream: {{{stream}}}
    - Academic Score: {{{academicScore}}}
    - Strong Subjects: {{#each strongSubjects}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
    - Interests: {{#each interests}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
    - Work Style: {{{workStyle}}}
    - College Budget: {{{budget}}} (This is a CRITICAL constraint)
    - Location Preference: {{{location}}}
    - Parent Pressure (Eng/Med): {{#if parentPressure}}Yes{{else}}No{{/if}}
    - Parent's Question: {{{parentQuestion}}}
    - Current Goal (if applicable): {{{currentGoal}}}
    - Industry Preference (if applicable): {{{industryPreference}}}

    YOUR TASK: Generate a personalized career report based on the user's profile.

    {{#if (isJunior currentStage)}}
    
    *** JUNIOR STUDENT (CLASS 1-10) REPORT STRUCTURE ***

    1.  **Introduction:**
        - Write a warm, encouraging introduction (2-3 sentences). Acknowledge their stage (e.g., "It's great that you're exploring your interests in Class {{currentStage}}!").
        - Mention one positive aspect from their profile (e.g., "Your interest in 'Building/Creating' is a fantastic strength.").

    2.  **Top Suggestions (Fields of Exploration):**
        - Suggest 2-3 broad FIELDS of exploration, not specific careers. Examples: "Creative Arts & Design", "Technology & Problem Solving", "Science & Nature".
        - For each field, write a single sentence explaining WHY it's a good fit, linking it to their subjects and interests. (e.g., "Because you enjoy 'Mathematics' and 'Solving Puzzles', the 'Technology & Problem Solving' field could be very exciting for you.").

    3.  **Next Steps (Fun Activities):**
        - Provide a bulleted list of 2-3 simple, fun, and actionable next steps. These should be activities, not career research.
        - Examples:
            - "- Try a free block-based coding app like Scratch to see if you enjoy making games."
            - "- Visit a local science museum or planetarium on a weekend."
            - "- Start a small project, like creating a comic strip or writing a short story."

    4.  **Plan B (Note for Parents):**
        - If the parent asked a specific question in 'parentQuestion', address it directly and gently here.
        - Example: "A note for parents: A love for drawing can lead to many stable careers today, such as UI/UX Design or Animation, which are in high demand. Encouraging this creativity now is a great investment."

    {{else}}

    *** SENIOR STUDENT (CLASS 11+ / GRADUATE) REPORT STRUCTURE ***

    1.  **Introduction:**
        - Write a concise, personalized introduction (2 sentences). Acknowledge their current stage and a key data point (e.g., "As a {{currentStage}} student with strong scores in {{academicScore}}, you have several strong paths available.").

    2.  **Top Suggestions (Career Paths):**
        - Provide 2-3 specific, actionable career paths.
        - For each path, populate the following:
            - **name:** The career title (e.g., "Product Manager").
            - **reason:** A sharp, single sentence linking their profile to the career. (e.g., "Your blend of business interest, leadership qualities, and strong academics makes this a great fit.").
            - **path:** The typical path. (e.g., "B.Tech -> MBA -> APM Role").
            - **realityCheck:** Difficulty and approx. success rate. (e.g., "Hard / ~10% chance to enter top firms").
            - **financials:** Approx. fees vs. starting salary. (e.g., "Fees: ₹15-25L, Salary: ₹18-30LPA").

    3.  **Next Steps (Actionable Research):**
        - Provide a short, bulleted list of 2-3 concrete research steps.
        - Examples:
            - "- Watch three 'Day in the Life of a Data Scientist' videos on YouTube."
            - "- Find and follow 5 top Product Managers on LinkedIn or Twitter."
            - "- Try a free introductory course on 'UX Design Fundamentals' on Coursera or Udemy."

    4.  **Plan B (The Realistic Fallback):**
        - Provide a safe, logical backup plan.
        - If they are targeting a high-risk/high-reward path (like JEE/UPSC), this is CRUCIAL.
        - The Plan B should leverage the same core skills but have a higher probability of success. (e.g., "If top IITs are missed, a B.Tech in CS from a good Tier-2 college followed by a great portfolio still leads to excellent software engineering jobs.").
        - If parent pressure is noted, gently address it: "This also serves as an excellent alternative to discuss with your parents, showcasing strong earning potential outside of traditional medicine/engineering."

    {{/if}}
    `,
    helpers: { isJunior }
});


const generateCareerReportFlow = ai.defineFlow(
  {
    name: 'generateCareerReportFlow',
    inputSchema: GenerateCareerReportInputSchema,
    outputSchema: GenerateCareerReportOutputSchema,
  },
  async input => {
    const {output} = await generateCareerReportPrompt(input);
    if (!output) {
      throw new Error("Failed to generate report from AI model.");
    }
    return output;
  }
);
