const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const axios = require("axios");

async function testInterviewAPI() {
  try {
    // Check if a test PDF exists, otherwise create a minimal one
    const testPdfPath = path.join(__dirname, "test-resume.pdf");
    
    // Create form data
    const form = new FormData();
    
    // Check for existing PDF files in the directory
    const files = fs.readdirSync(__dirname);
    const pdfFile = files.find(f => f.endsWith(".pdf"));
    
    if (pdfFile) {
      form.append("resume", fs.createReadStream(path.join(__dirname, pdfFile)));
    } else {
      // If no PDF found, create a simple test file
      console.log("No PDF file found. Create a test resume PDF first.");
      return;
    }
    
    form.append("selfDescription", "I am a passionate full stack developer with strong programming skills");
    form.append("jobDescription", "We are looking for a Full Stack Developer proficient in Node.js, React, and MongoDB");
    
    // Make the request
    const response = await axios.post("http://localhost:3000/api/interview/", form, {
      headers: form.getHeaders(),
    });
    
    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
  }
}

testInterviewAPI();
