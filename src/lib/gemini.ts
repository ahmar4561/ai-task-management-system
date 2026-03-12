import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

export async function analyzeTask(taskDescription: string, mode: "architect" | "developer" = "architect") {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    // Mode-based prompts for dual functionality
    const architectPrompt = `
    You are a Senior Full Stack Developer and Project Manager. 
    Analyze this request: "${taskDescription}".

    STRICT OPERATIONAL RULES:
    1. If the request is NOT related to software development, coding, UI/UX, or technical project management, return exactly this JSON:
       { "error": "rejection", "message": "I am a dedicated Development Roadmap AI. I can only assist with coding, architecture, and project management tasks. Would you like to build a project related to that instead?" }

    2. If valid, return ONLY a JSON response:
       {
         "priority": "High/Medium/Low",
         "category": "Frontend/Backend/Database/DevOps/Design",
         "estimatedTime": "X hours/mins",
         "subtasks": [
           { "title": "step 1", "priority": "High/Medium/Low", "category": "Frontend/Backend/..." },
           { "title": "step 2", "priority": "High/Medium/Low", "category": "Frontend/Backend/..." }
         ]
       }
    STRICT: No markdown, No backticks. Only raw JSON.`;

    const developerPrompt = `
    You are an expert Full Stack Developer. 
    Task: Provide a complete code solution and a brief explanation for: "${taskDescription}".

    STRICT OPERATIONAL RULES:
    1. Provide high-quality, production-ready code.
    2. After the code, provide a "Logic Explanation" section explaining what tools were used and why.
    3. Return the response in a structured JSON format:
       {
         "code": "The full code snippet here",
         "explanation": "Brief step-by-step logic explanation here",
         "language": "e.g. typescript/javascript/tsx"
       }
    STRICT: No markdown outside the JSON values. Only raw JSON.`;

    const finalPrompt = mode === "developer" ? developerPrompt : architectPrompt;

    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    const text = response.text();

    // Cleaning the response to ensure valid JSON
    return text.replace(/```json|```/g, "").trim();

  } catch (error: any) {
    console.error("Gemini Error:", error);
    throw new Error(error.message || "AI Analysis failed");
  }
}