const mongoose = require("mongoose");

async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            retryWrites: true,
            w: "majority"
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        console.error("Note: Make sure your IP is whitelisted in MongoDB Atlas");
        console.log("Server starting without database - requests will fail until MongoDB connects");
        // Don't exit - allow server to run and retry
        setTimeout(connectToDB, 5000);
    }
}

module.exports = connectToDB;