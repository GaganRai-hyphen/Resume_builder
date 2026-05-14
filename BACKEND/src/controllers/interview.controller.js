const pdfParse = require("pdf-parse");
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

// Recursive search helper to locate target keys regardless of nesting wrappers
function findKeyRecursively(obj, targetKey) {
    if (!obj || typeof obj !== "object") return undefined;
    if (obj[targetKey] !== undefined) return obj[targetKey];

    for (const key in obj) {
        const result = findKeyRecursively(obj[key], targetKey);
        if (result !== undefined) return result;
    }
    return undefined;
}

async function generateInterViewReportController(req, res) {
    try {
        const { selfDescription, jobDescription } = req.body;

        if (!jobDescription) {
            return res.status(400).json({ message: "Job description is required" });
        }

        let extractedText = "";
        if (req.file && req.file.buffer) {
            // Using your exact working PDF extraction logic
            const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
            extractedText = resumeContent.text || resumeContent;
        } else if (!selfDescription) {
            return res.status(400).json({ message: "Please provide either a Resume PDF or a Self Description" });
        }

        console.log("Generating AI Interview Report...");
        const interViewReportByAi = await generateInterviewReport({
            resume: extractedText,
            selfDescription,
            jobDescription
        });

        console.log("🔥 Raw AI Output received successfully.");

        // 1. Extract raw properties recursively from the object tree
        const rawScore = findKeyRecursively(interViewReportByAi, "matchScore");
        const rawTitle = findKeyRecursively(interViewReportByAi, "title");
        const rawTech = findKeyRecursively(interViewReportByAi, "technicalQuestions");
        const rawBehav = findKeyRecursively(interViewReportByAi, "behavioralQuestions");
        const rawSkills = findKeyRecursively(interViewReportByAi, "skillGaps");
        const rawPlan = findKeyRecursively(interViewReportByAi, "preparationPlan");

        // 2. BULLETPROOF SANITIZATION & MAPPING
        // Always return objects matching your Mongoose embedded schema perfectly.
        const technicalQuestions = Array.isArray(rawTech) 
            ? rawTech.filter(Boolean).map(item => {
                if (typeof item === "string") {
                    return { question: item, intention: "Technical Evaluation", answer: "Standard implementation required." };
                }
                return {
                    question: String(item.question || "Core Technical Assessment Question"),
                    intention: String(item.intention || "Evaluate underlying framework proficiency"),
                    answer: String(item.answer || "Demonstrate core foundational principles through highly structured solutions.")
                };
            })
            : [];

        const behavioralQuestions = Array.isArray(rawBehav) 
            ? rawBehav.filter(Boolean).map(item => {
                if (typeof item === "string") {
                    return { question: item, intention: "Behavioral Alignment", answer: "Use STAR method." };
                }
                return {
                    question: String(item.question || "Situational Leadership Assessment"),
                    intention: String(item.intention || "Evaluate behavioral alignment and soft skills"),
                    answer: String(item.answer || "Formulate responses using standard behavioral metric patterns.")
                };
            })
            : [];

        // FIXED: Strictly cast to embedded objects to satisfy Mongoose validation
        const skillGaps = Array.isArray(rawSkills) 
            ? rawSkills.filter(Boolean).map(item => {
                // If Gemini just returns an array of strings, wrap them into valid embedded objects
                if (typeof item === "string") {
                    return { skill: item, severity: "medium" };
                }
                return {
                    skill: String(item.skill || "General Domain Gap"),
                    severity: ["low", "medium", "high"].includes(item.severity) ? item.severity : "medium"
                };
            })
            : [];

        const preparationPlan = Array.isArray(rawPlan) 
            ? rawPlan.filter(Boolean).map((item, index) => {
                if (typeof item === "string") {
                    return { day: index + 1, focus: item, tasks: ["Review practical documentation."] };
                }
                return {
                    day: Number(item.day) || (index + 1),
                    focus: String(item.focus || "Core Subject Optimization"),
                    tasks: Array.isArray(item.tasks) && item.tasks.length > 0 
                        ? item.tasks.map(task => String(task)) 
                        : ["Review implementation strategies and practical documentation."]
                };
            })
            : [];

        console.log("📊 Final Mapped Records ->", {
            matchScore: Number(rawScore) || 80,
            technicalQuestions: technicalQuestions.length,
            behavioralQuestions: behavioralQuestions.length,
            skillGaps: skillGaps.length,
            preparationPlan: preparationPlan.length
        });

        // 3. Save fully mapped records straight into MongoDB
        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: extractedText,
            selfDescription,
            jobDescription,
            title: rawTitle || "Target Role Interview Strategy",
            matchScore: Number(rawScore) || 80,
            technicalQuestions,
            behavioralQuestions,
            skillGaps,
            preparationPlan
        });

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        });

    } catch (error) {
        console.error("🔥 Controller Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

async function getInterviewReportByIdController(req, res) {
    const { interviewId } = req.params;
    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id });

    if (!interviewReport) {
        return res.status(404).json({ message: "Interview report not found." });
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    });
}

async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    });
}

async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params;
    const interviewReport = await interviewReportModel.findById(interviewReportId);

    if (!interviewReport) {
        return res.status(404).json({ message: "Interview report not found." });
    }

    const { resume, jobDescription, selfDescription } = interviewReport;
    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription });

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    });

    res.send(pdfBuffer);
}

module.exports = { 
    generateInterViewReportController, 
    getInterviewReportByIdController, 
    getAllInterviewReportsController, 
    generateResumePdfController 
};