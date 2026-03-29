require('dotenv').config();
const mongoose = require('mongoose');
const InterviewReportModel = require('./backend/src/models/interviewReport.model');

async function check() {
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/aceprep");
  const reports = await InterviewReportModel.find({});
  console.log("Total Reports:", reports.length);
  const users = new Set();
  reports.forEach(r => {
      console.log(`Report ID: ${r._id}, User: ${r.user}`);
      users.add(r.user?.toString());
  });
  console.log("Unique User IDs in Reports:", Array.from(users));
  process.exit(0);
}
check();
