const express = require("express");
const interviewRouter = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const interviewController = require("../controllers/interview.controller");
const upload = require("../middlewares/file.middleware");

/**
 * @route POST /api/interview/generate-report
 * @description Generate interview report on the basis of resume, self description and job description
 * @access Private
 */
interviewRouter.post(
  "/",
  authMiddleware,
  upload.single("resume"),
  interviewController.generateInterviewReport
);

/**
 * @route GET /api/interview/get-report/:id
 * @description Get interview report
 * @access Private
 */
interviewRouter.get(
  "/:id",
  authMiddleware,
  interviewController.getInterviewReport
);

/**
 * @route GET /api/interview/
 * @description Get all interview reports for the current user
 * @access Private
 */
interviewRouter.get(
  "/",
  authMiddleware,
  interviewController.getAllInterviewReports
);

/**
 * @route POST /api/interview/generate-resume-pdf/:id
 * @description Generate resume PDF
 * @access Private
 */
interviewRouter.post(
  "/resume/pdf/:interviewReportId",
  authMiddleware,
  interviewController.generateResumePDF
);

module.exports = interviewRouter;
