const { GoogleGenAI } = require("@google/genai")


const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})




async function callWithRetry(fn, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await fn();
        } catch (err) {
            const is429 = err?.status === 429 || err?.message?.includes("429") || err?.message?.includes("RESOURCE_EXHAUSTED");
            if (is429 && attempt < retries) {
                // Parse retryDelay from error message e.g. "Please retry in 18.9s"
                const match = err.message?.match(/retry in (\d+(\.\d+)?)/i);
                const waitMs = match ? Math.ceil(parseFloat(match[1])) * 1000 : 20000;
                console.log(`Rate limited. Retrying in ${waitMs / 1000}s (attempt ${attempt}/${retries})...`);
                await new Promise(r => setTimeout(r, waitMs));
            } else {
                throw err;
            }
        }
    }
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `You are an expert interview coach and career advisor. Analyze the following candidate profile and job description, then generate a comprehensive interview preparation report.

CANDIDATE RESUME:
${resume}

CANDIDATE SELF-DESCRIPTION:
${selfDescription}

JOB DESCRIPTION:
${jobDescription}

Generate a detailed JSON report with ALL of the following fields filled out completely. Do NOT leave any array empty.

Return ONLY a valid JSON object with this EXACT structure:
{
  "title": "<job title from job description>",
  "matchScore": <number 0-100 indicating how well the candidate matches the job>,
  "technicalQuestions": [
    {
      "question": "<specific technical question based on job requirements and candidate background>",
      "intention": "<why an interviewer would ask this question>",
      "answer": "<detailed guide on how to answer this question with key points to cover>"
    }
  ],
  "behavioralQuestions": [
    {
      "question": "<behavioral question using STAR method topics>",
      "intention": "<why an interviewer would ask this question>",
      "answer": "<how to structure and answer this using the STAR method with specific examples>"
    }
  ],
  "skillGaps": [
    {
      "skill": "<skill the candidate is missing or weak in based on job requirements>",
      "severity": "<low|medium|high>"
    }
  ],
  "preparationPlan": [
    {
      "day": <day number starting from 1>,
      "focus": "<main topic to focus on this day>",
      "tasks": ["<specific task 1>", "<specific task 2>", "<specific task 3>"]
    }
  ]
}

REQUIREMENTS:
- technicalQuestions: generate at least 5 questions specific to the job requirements
- behavioralQuestions: generate at least 3 questions
- skillGaps: identify at least 2-3 gaps comparing resume to job requirements  
- preparationPlan: create a 7-day preparation plan
- matchScore: be honest and precise based on skill alignment
- All answers must be detailed and actionable, not generic

Return ONLY the JSON, no markdown, no explanation.`

    const response = await callWithRetry(() => ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
        }
    }));

    const text = response.text;
    if (!text) throw new Error("Empty response from Gemini AI");
    return JSON.parse(text);
}
module.exports = { generateInterviewReport}

// async function generateContent(prompt) {
//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const text = response.text();
//     return text;
// }