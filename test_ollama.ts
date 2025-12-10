
import { generateCareerReport } from './src/ai/flows/generate-career-report';

async function main() {
    console.log("Starting Ollama Test...");
    try {
        const input = {
            userName: "Vishvas",
            userRole: "student",
            language: "en",
            currentStage: "Class 10",
            board: "CBSE",
            academicScore: "85% - 90%",
            strongSubjects: ["Mathematics", "Physics", "Computer Science"],
            interests: ["Coding", "Robotics", "Video Games"],
            budget: "10L - 15L per year",
            parentPressure: false,
            parentQuestion: "What is the best engineering college for me?"
        };

        console.log("Sending request to Ollama...");
        const result = await generateCareerReport(input);
        console.log("Response received!");
        console.log("---------------------------------------------------");
        console.log(result.reportContent.substring(0, 500) + "...");
        console.log("---------------------------------------------------");
        console.log("test_ollama.ts completed successfully.");
    } catch (error) {
        console.error("Error executing Ollama test:", error);
    }
}

main();
