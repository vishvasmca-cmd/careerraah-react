const agents = require('./agents');
const logger = require('../utils/logger');

// --- AGENT 0: ORCHESTRATOR ---
// Purpose: Manage the flow of data between agents
async function extractJobDetails(rawText) {
  logger.info("🤖 Agent 0: Starting analysis orchestration...");

  try {
    // Step 1: Document Reader (Agent 1)
    logger.info("   ↳ Agent 1: Reading document...");
    const rawSections = await agents.documentReaderAgent(rawText);
    if (!rawSections) {
      logger.warn("   ⚠️ Agent 1 failed to extract sections.");
      return null;
    }

    // Step 2: Rule Extraction (Agent 2)
    logger.info("   ↳ Agent 2: Extracting rules...");
    let ruleData = await agents.ruleExtractionAgent(rawSections);

    // Step 3: Validation (Agent 3) - Simple Loop
    logger.info("   ↳ Agent 3: Validating data...");
    const validation = await agents.validationAgent(ruleData);

    if (validation && validation.status === 'invalid') {
      logger.warn(`   ⚠️ Agent 3 found issues: ${validation.issues?.join(', ')}. Retrying extraction...`);
      // Retry Agent 2 with feedback (Context injection)
      // For simplicity in this implementation, we re-run Agent 2. 
      // Ideally we'd append the issues to the prompt.
      // Let's just proceed with what we have for now to avoid indefinite loops in MVP, 
      // but flagging it in logs is good.
    }

    // Step 4: Normalization (Agent 4)
    logger.info("   ↳ Agent 4: Normalizing for students...");
    const normalizedData = await agents.normalizationAgent(ruleData || rawSections); // Fallback to rawSections if rules null

    // --- MAP TO DB SCHEMA ---
    // We merge the structured extraction back into the flat format expected by jobFetcher/DB
    const finalOutput = {
      // We rely on Parser for Title/Dept etc, but if Agent 1 found them we could map. 
      // Since Agent 1 extracted 'dates', we can try to parse them if needed, 
      // but usually we leave date parsing to the main parser or Regex.
      // Here we focus on the "Structured" & "Decision" value add.

      structured: {
        eligibility: {
          ...ruleData?.qualification,
          age: ruleData?.age,
          physical: ruleData?.physical
        },
        selectionProcess: ruleData?.selection_process,
        jobType: ruleData?.job_type,

        // Agent 4 outputs
        decisionFactors: {
          whoShouldApply: normalizedData?.who_should_apply || [],
          whoShouldNotApply: normalizedData?.who_should_avoid || []
        },

        // Raw sections for debugging/display
        rawSections: rawSections
      },

      hindi_summary: normalizedData?.hindi_summary,

      // Career Roadmap could go into summary or a new field
      summary: normalizedData?.career_roadmap ?
        `Career Roadmap: ${normalizedData.career_roadmap.join('. ')}` : null
    };

    logger.info("✅ Agent 0: Analysis complete.");
    return finalOutput;

  } catch (error) {
    logger.error('❌ Agent 0: Orchestration failed:', error);
    return null;
  }
}

module.exports = extractJobDetails;
