
import { Ollama } from "ollama";

async function testOllama() {
    console.log("Testing Ollama Cloud Setup...");
    const ollama = new Ollama();

    try {
        const response = await ollama.chat({
            model: "gpt-oss:120b-cloud",
            messages: [{ role: "user", content: "Explain quantum computing in one sentence." }],
            stream: false,
        });

        console.log("Response from Ollama:");
        console.log(response.message.content);
        console.log("\nSuccess! Ollama is configured correctly.");
    } catch (error) {
        console.error("Error connecting to Ollama:", error);
    }
}

testOllama();
