const { GoogleGenerativeAI } = require("@google/generative-ai");
const {z} = require("zod");
const {zodToJsonSchema} = require("zod-to-json-schema");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);

async function invokeGeminiAi(){
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
    const result = await model.generateContent("Hello, What is the capital of France?");
    const response = result.response;
    const text = response.text();
    console.log(text);
}

const interviewReportSchema = z.object({
    technicalQuestions:z.array(z.object({
        question:z.string().describe("Technical question"),
        intention:z.string().describe("Intention of the technical question"),
      answer:z.string().describe("How to answer the technical question, what to include and what to avoid"),
    })).describe("Technical questions based on the job description and resume"),


    behavioralQuestions:z.array(z.object({  
        question:z.string().describe("Behavioral question"),
        intention:z.string().describe("Intention of the behavioral question"),
        answer:z.string().describe("How to answer the behavioral question, what to include and what to avoid"),
    })).describe("Behavioral questions based on the job description and resume"),
    

    skillGapAnalysis:z.object({
        skill:z.string().describe("Skill which are lacking in the resume"),
        severity:z.enum(["low","medium","high"]).describe("Severity of the skill gap"),
        
    }).describe("Skill gap analysis based on the job description and resume"),

preparationPlanSchema:z.object({
    day:z.number().describe("Day of the preparation plan"),
    topic:z.string().describe("Topic to prepare"),
    duration:z.string().describe("Duration to prepare the topic"),
    resources:z.array(z.string()).describe("Resources to prepare the topic"),
}).describe("Preparation plan based on the job description and resume"),
});

async function generateInterviewReport(resume,selfDescription,jobDescription){
    
    const prompt = `
    You are an expert career coach and interview preparation assistant.
    Your task is to analyze the provided resume and self-description against the job description and generate a comprehensive interview preparation report.
    
    Resume: ${resume}
    Self-Description: ${selfDescription}
    Job Description: ${jobDescription}
    
    Please provide the response in the following JSON format:
    ${JSON.stringify(zodToJsonSchema(interviewReportSchema))}
    `
    const responce = await model.generateContent({
        model:"gemini-3-flash-preview",
        contents:[
            {
                role:"user",
                parts:[
                    {
                        text:prompt
                    }
                ]
            }
        ],
        config:{
            responseMimeType:"application/json",
            responseSchema:{
                jsonSchema:zodToJsonSchema(interviewReportSchema)
            }
        }
    })
}

module.exports = {
    invokeGeminiAi
}

// async function generateContent(prompt) {
//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const text = response.text();
//     return text;
// }