const pdfParse = require("pdf-parse");
const { generateInterviewReport: generateInterviewReportAI, generateResumePDF: generateResumePDFAI } = require("../../services/ai.service");
const InterviewReportModel = require("../models/interviewReport.model");


/*
*@description:Generate interview report
*/
async function generateInterviewReport(req, res) {
  try {
    console.log("generateInterviewReport - req.file:", req.file ? `size: ${req.file.size}` : "NO FILE");
    console.log("generateInterviewReport - req.body:", Object.keys(req.body));
    console.log("generateInterviewReport - req.user:", req.user ? req.user.id : "NO USER");
    
    const resumeFile = req.file;
    
    if (!resumeFile) {
      console.error("Error: Resume file is required");
      return res.status(400).json({ success: false, message: "Resume file is required" });
    }
    
    if (!req.body.selfDescription || !req.body.jobDescription) {
      console.error("Error: Missing self description or job description");
      return res.status(400).json({ success: false, message: "Self description and job description are required" });
    }

    let resumeContent = "";
    let resumeBuffer = null;
    let resumeMimeType = null;

    try {
      // Parse PDF if it's a PDF
      if (resumeFile.mimetype === "application/pdf" || resumeFile.originalname.toLowerCase().endsWith(".pdf")) {
        const resumeData = await pdfParse(resumeFile.buffer);
        resumeContent = resumeData.text;
      } else {
        resumeContent = resumeFile.buffer.toString("utf-8"); // Fallback for txt docs
      }
    } catch (parseError) {
      console.warn("Failed to parse document text locally, falling back to AI:", parseError.message);
      // Give the buffer to Gemini instead
      resumeContent = "";
      resumeBuffer = resumeFile.buffer;
      resumeMimeType = resumeFile.mimetype === "application/pdf" ? "application/pdf" : "text/plain";
    }
    
    const selfDescription = req.body.selfDescription;
    const jobDescription = req.body.jobDescription;
    
    console.log("Generating interview report with:", { resumeSize: resumeContent.length, hasBuffer: !!resumeBuffer, selfDescription, jobDescription });
    
    const interviewReportbyAI = await generateInterviewReportAI({
      resume: resumeContent,
      resumeBuffer,
      resumeMimeType,
      selfDescription,
      jobDescription,
    });

    const interviewReport = await InterviewReportModel.create({
      user: req.user.id,
      resume: resumeContent || "Parsed by AI directly from document.",
      selfDescription,
      jobDescription,
      ...interviewReportbyAI,
      skillGap: interviewReportbyAI.skillGaps,
    });

    res.status(201).json({
      success: true,
      message: "Interview report generated successfully",
      data: interviewReport,
    });
  } catch (error) {
    console.error("Interview report error:", error?.message || error);
    const errorMessage = error?.message || "Failed to generate report";
    if (error?.status === 503 || (errorMessage && errorMessage.toLowerCase().includes("unavailable"))) {
      return res.status(503).json({ success: false, message: "AI service unavailable right now due to high demand. Please try again in a moment." });
    }
    res.status(500).json({ success: false, message: errorMessage });
  }
}

/*
*@description:Generate interview report
*/

async function getInterviewReport(req, res) {
  try {
    const interviewReport = await InterviewReportModel.findById(req.params.id);
    res.status(200).json({
      success: true,
      message: "Interview report fetched successfully",
      data: interviewReport,
    });
  } catch (error) {
    console.error("Interview report error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch report" });
  }
}

/*
*@description:Get all interview reports
*/

async function getAllInterviewReports(req, res) {
  try {
    // Handle old tokens that might have stored _id instead of id
    const userId = req.user.id || req.user._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Invalid user token configuration" });
    }

    const interviewReports = await InterviewReportModel.find({ user: userId }).sort({ createdAt: -1 })
    .populate("user", "username")
    .select("-resume -selfDescription -__v -technicalQuestions -behavioralQuestions -skillGap -preparationPlan");
    res.status(200).json({
      success: true,
      message: "Interview reports fetched successfully",
      data: interviewReports,
    });
  } catch (error) {
    console.error("Interview report error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch reports" });
  }
}

/*
*@description:Generate resume PDF
*/

async function generateResumePDF(req, res) {
  const {interviewReportId}=req.params;
  const interviewReport = await InterviewReportModel.findById(interviewReportId);
  if(!interviewReport){
    return res.status(404).json({ success: false, message: "Interview report not found" });
  }
  const {resume,jobDescription,selfDescription}=interviewReport;
  const resumePDFBuffer = await generateResumePDFAI(resume,jobDescription,selfDescription);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=resume.pdf");
  res.send(resumePDFBuffer);
}
module.exports = { generateInterviewReport, getInterviewReport, getAllInterviewReports, generateResumePDF };