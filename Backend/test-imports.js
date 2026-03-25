// Test if all imports work
try {
  console.log("Testing auth.middleware...");
  const authMiddleware = require("./src/middlewares/auth.middleware");
  console.log("✓ authMiddleware type:", typeof authMiddleware);
  
  console.log("Testing file.middleware...");
  const upload = require("./src/middlewares/file.middleware");
  console.log("✓ upload type:", typeof upload);
  console.log("✓ upload.single type:", typeof upload.single);
  
  console.log("Testing interview.controller...");
  const interviewController = require("./src/controllers/interview.controller");
  console.log("✓ interviewController.generateInterviewReport type:", typeof interviewController.generateInterviewReport);
  
  console.log("\n✓ All imports successful");
  process.exit(0);
} catch (err) {
  console.error("✗ Import error:", err.message);
  process.exit(1);
}
