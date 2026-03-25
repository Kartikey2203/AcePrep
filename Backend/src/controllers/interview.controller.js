const pdfParse = require("pdf-parse");
const { generateInterviewReport: generateInterviewReportAI } = require("../../services/ai.service");
const InterviewReportModel = require("../models/interviewReport.model");

async function generateInterviewReport(req, res) {
  try {
    // Try multiple pdfjs versions — malformed PDFs (bad XRef) often parse with a different version
    const pdfVersions = ['v2.0.550', 'v1.10.100', 'v1.10.88', 'v1.9.426'];
    let resumeData = null;
    for (const version of pdfVersions) {
      try {
        resumeData = await pdfParse(req.file.buffer, { version });
        break;
      } catch (e) {
        if (version === pdfVersions[pdfVersions.length - 1]) throw e;
      }
    }
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
      message: "Interview report generated successfully.",
      interviewReport,
    });
  } catch (error) {
    console.error("Interview report error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to generate report" });
  }
}

module.exports = { generateInterviewReport };