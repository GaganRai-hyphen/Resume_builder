const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

// Define the precise structure required for your database records
const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job description"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question that can be asked in the interview"),
        intention: z.string().describe("The intention of the interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question that can be asked in the interview"),
        intention: z.string().describe("The intention of the interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap")
    })).describe("List of skill gaps along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan"),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day")
    })).describe("A day-wise preparation plan for the candidate to follow"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
});

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    // Explicitly enforcing the target keys inside the prompt text reinforces perfect schema extraction
    const prompt = `Analyze the candidate's profile against the job description and generate a comprehensive interview preparation report.

Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}

IMPORTANT: You MUST respond strictly with a valid JSON object. Do NOT wrap the JSON inside markdown code blocks. The JSON object MUST contain exactly these root keys:
- "matchScore": an integer between 0 and 100.
- "title": a string representing the target role title.
- "technicalQuestions": an array of objects, each having exactly "question", "intention", and "answer" keys.
- "behavioralQuestions": an array of objects, each having exactly "question", "intention", and "answer" keys.
- "skillGaps": an array of objects, each having exactly "skill" and "severity" keys (severity must be "low", "medium", or "high").
- "preparationPlan": an array of objects, each having exactly "day" (number), "focus" (string), and "tasks" (array of strings) keys.`;

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            // Wrap in zodToJsonSchema to avoid SDK validation errors
            responseSchema: zodToJsonSchema(interviewReportSchema),
        }
    });

    // Safely strip markdown backticks without relying on complex multiline regex
    let rawText = response.text || "";
    if (rawText.includes("```")) {
        rawText = rawText.replaceAll("```json", "")
                         .replaceAll("```JSON", "")
                         .replaceAll("```", "")
                         .trim();
    }

    return JSON.parse(rawText);
}

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
        format: "A4", 
        margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    });

    await browser.close();
    return pdfBuffer;
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    });

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        The response should be a JSON object with a single field "html" which contains the HTML content of the resume tailored to the job description. Make it ATS friendly, simple, and professional.`;

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema),
        }
    });

    const jsonContent = JSON.parse(response.text);
    return await generatePdfFromHtml(jsonContent.html);
}

module.exports = { generateInterviewReport, generateResumePdf };