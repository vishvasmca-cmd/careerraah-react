
import { answerCareerQuestion } from './src/ai/flows/answer-career-question';
import { GenerateCareerReportInput } from './src/ai/schemas/career-report';

async function main() {
    console.log("Starting Chat Flow Test...");

    // Mock Assessment Data
    const mockAssessmentData: GenerateCareerReportInput = {
        userName: "TestUser",
        userRole: "student",
        language: "en",
        currentStage: "Class 10",
        board: "CBSE",
        academicScore: "90%",
        strongSubjects: ["Math", "Physics"],
        interests: ["Coding"],
        budget: "10L",
        parentPressure: false,
        parentQuestion: "Engineering?"
    };

    try {
        console.log("Sending 'Hello' question...");
        const result = await answerCareerQuestion({
            assessmentData: mockAssessmentData,
            question: "What are the top colleges for CS?",
            language: "en"
        });

        console.log("---------------------------------------------------");
        console.log("ANSWER RECEIVED:");
        console.log("---------------------------------------------------");
        console.log(result.answer);
        console.log("---------------------------------------------------");
    } catch (error) {
        console.error("CRASH DETECTED:");
        console.error(error);
    }
}

main();
