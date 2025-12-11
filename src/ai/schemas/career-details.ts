import { z } from 'zod';

export const CareerDetailsSchema = z.object({
    name: z.string(),
    category: z.string().describe("Best fitting category like Future Tech, Medical, Arts, Sports, etc."),
    iconName: z.string().describe("Name of a Lucide React icon, e.g., Rocket, Heart, Gavel, Code, etc."),
    salary: z.object({
        low: z.number().describe("Min annual salary in Lakhs INR"),
        high: z.number().describe("Max annual salary in Lakhs INR"),
    }),
    risk: z.enum(['Low', 'Medium', 'High', 'Very High']),
    trustScore: z.number().min(1).max(10).describe("Career safety score out of 10"),
    description: z.string().describe("Short 2-line description for parents"),
    imageHint: z.string().describe("Short visual description for image search"),
    financials: z.object({
        eduCost: z.number().describe("Avg education cost in Lakhs"),
        startSalary: z.number().describe("Avg starting salary in Lakhs"),
    }),
    roadmap: z.array(z.object({
        step: z.string(),
        desc: z.string(),
    })).max(4),
    fitCheck: z.array(z.string()).describe("3 questions to check if child fits this career"),
});

export type CareerDetails = z.infer<typeof CareerDetailsSchema>;
