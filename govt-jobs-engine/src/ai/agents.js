const { getSpecificModel } = require('./gemini');
const logger = require('../utils/logger');

// --- Helper: Run AI Agent ---
async function runAgent(agentName, modelName, systemPrompt, userPrompt) {
    try {
        const model = getSpecificModel(modelName);

        const result = await model.generateContent({
            contents: [
                { role: 'user', parts: [{ text: systemPrompt + "\n\n" + userPrompt }] }
            ],
            generationConfig: {
                responseMimeType: "application/json" // Force JSON
            }
        });

        const response = await result.response;
        const text = response.text();

        // Clean JSON
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);

    } catch (error) {
        logger.error(`[${agentName}] Error:`, error);
        return null;
    }
}

// --- AGENT 1: DOCUMENT READER ---
// Purpose: Read notification like a human and segment it.
async function documentReaderAgent(rawText) {
    const systemPrompt = `
You are a government job document reader.
You do NOT summarize or interpret.
You ONLY identify and extract relevant sections exactly as written.

Think like a clerk reading an official notification.
`;

    const userPrompt = `
You are given raw text extracted from a government job notification
(PDF or website).

Your task:
Identify and extract the following sections if present:

1. Education / Qualification
2. Age Limit and Relaxation
3. Physical Standards (Height, Chest, Weight, Running, etc.)
4. Selection Process
5. Important Dates
6. Job Location / Posting
7. Any special conditions or notes

Rules:
- Copy text as-is (do NOT rephrase)
- If a section is missing, return null
- Do not guess or infer

Return STRICT JSON only.

Input Text:
${rawText.substring(0, 30000)}

Output JSON Schema:
{
  "education": "... or null",
  "age": "... or null",
  "physical": "... or null",
  "selection": "... or null",
  "dates": "... or null",
  "location": "... or null",
  "notes": "... or null"
}
`;

    return await runAgent('Agent 1 (Reader)', 'gemini-1.5-flash', systemPrompt, userPrompt);
}

// --- AGENT 2: RULE EXTRACTION ---
// Purpose: Convert text -> structured eligibility logic
async function ruleExtractionAgent(extractedSections) {
    const systemPrompt = `
You are CareerRaah AI, an expert in Indian government job eligibility rules.

You understand:
- Category-based age relaxation
- Physical standards variations
- Typical govt job patterns

You must reason carefully and output clean structured data.
`;

    const userPrompt = `
Using the extracted sections below, convert the information into
structured eligibility rules.

Extracted Data:
${JSON.stringify(extractedSections, null, 2)}

Rules:
- If age relaxation says "as per govt rules":
  - OBC = +3 years
  - SC/ST = +5 years
- If physical standards mention "relaxation for reserved categories",
  map them correctly
- Do NOT invent data
- If something is unclear, set value to null

Return STRICT JSON only.

Output Schema:
{
  "qualification": {
    "minimum": "10th | 12th | ITI | Diploma | Graduate | Postgraduate | PhD",
    "stream": "Science | Arts | Commerce | Any | null",
    "notes": "string or null"
  },
  "age": {
    "min": number,
    "max_general": number,
    "max_obc": number,
    "max_sc_st": number
  },
  "physical": {
    "male_height_general_cm": number | null,
    "male_height_reserved_cm": number | null,
    "female_height_general_cm": number | null,
    "chest_cm": number | null
  },
  "selection_process": ["Exam", "Physical Test", "Interview", "Document Verification"],
  "job_type": "Office | Field | Uniformed | Research | Teaching"
}
`;

    const result = await runAgent('Agent 2 (Rules)', 'gemini-1.5-pro', systemPrompt, userPrompt);
    // Fallback if Pro fails or returns null
    if (!result) {
        return await runAgent('Agent 2 (Rules - Retry)', 'gemini-2.0-flash-exp', systemPrompt, userPrompt);
    }
    return result;
}

// --- AGENT 3: VALIDATION ---
// Purpose: Catch hallucinations & logic errors
async function validationAgent(ruleData) {
    const systemPrompt = `
You are a government job data auditor.

Your job is to verify extracted eligibility data.
You must be strict and skeptical.
`;

    const userPrompt = `
Validate the following structured government job data.

Check for:
- Unrealistic age limits
- Impossible physical standards
- Qualification mismatch with job type
- Missing critical fields

If valid, return status = "valid".
If invalid, return status = "invalid" with reasons.

Input Data:
${JSON.stringify(ruleData, null, 2)}

Return STRICT JSON only.

Output Schema:
{
  "status": "valid | invalid",
  "issues": ["string"]
}
`;

    return await runAgent('Agent 3 (Validation)', 'gemini-1.5-flash', systemPrompt, userPrompt);
}

// --- AGENT 4: NORMALIZATION ---
// Purpose: Make data student-friendly + CareerRaah-ready
async function normalizationAgent(validatedData) {
    const systemPrompt = `
You are CareerRaah AI, a Hindi-first career mentor.

You explain government jobs to Hindi-medium students
in simple, honest language.

No promotion. No legal tone.
`;

    const userPrompt = `
Using the validated job data below, generate:

1. Simple Hindi job explanation
2. Who should apply
3. Who should avoid
4. Career progression roadmap (short)

Rules:
- Use simple Hindi (Hinglish allowed)
- Max 3–4 bullet points per section
- Be honest and practical

Job Data:
${JSON.stringify(validatedData, null, 2)}

Return STRICT JSON only.

Output Schema:
{
  "hindi_summary": "string",
  "who_should_apply": ["string (In Hindi/Hinglish)"],
  "who_should_avoid": ["string (In Hindi/Hinglish)"],
  "career_roadmap": ["string (In Hindi/Hinglish)"]
}
`;

    const result = await runAgent('Agent 4 (Normalizer)', 'gemini-1.5-pro', systemPrompt, userPrompt);
    if (!result) {
        return await runAgent('Agent 4 (Normalizer - Retry)', 'gemini-2.0-flash-exp', systemPrompt, userPrompt);
    }
    return result;
}

module.exports = {
    documentReaderAgent,
    ruleExtractionAgent,
    validationAgent,
    normalizationAgent
};
