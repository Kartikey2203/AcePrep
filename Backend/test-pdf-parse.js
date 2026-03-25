const pdfParse = require("pdf-parse");
const fs = require("fs");

(async () => {
  try {
    const dataBuffer = fs.readFileSync("./sample.pdf"); // Replace with a valid PDF file path
    const data = await pdfParse(dataBuffer);
    console.log("PDF Content:", data.text);
  } catch (error) {
    console.error("Error testing pdf-parse:", error);
  }
})();