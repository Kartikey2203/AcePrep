const pdfParse = require("pdf-parse");
const { generateInterviewReport: generateInterviewReportAI } = require("../../services/ai.service");
const InterviewReportModel = require("../models/interviewReport.model");

async function generateInterviewReport(req, res) {
  try {
    const resumeFile = req.file;
    const resumeData = await pdfParse(new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
    const resumeContent = resumeData.text;
    const selfDescription = req.body.selfDescription;
    const jobDescription = req.body.jobDescription;
    const interviewReportbyAI = await generateInterviewReportAI({
      resume: resumeContent,
      selfDescription,
      jobDescription,
    });

    const interviewReport = await InterviewReportModel.create({
      user: req.user._id,
      resume: resumeContent,
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
    console.error("Interview report error:", error);
    res.status(500).json({ success: false, message: "Failed to generate report" });
  }
}

module.exports = { generateInterviewReport };