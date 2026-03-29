const express = require("express");
const app = express()
const cookieParser=require("cookie-parser")
const cors = require("cors");

app.use(express.json());
app.use(cookieParser())

// Allow CORS from any localhost port for development
app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Allow localhost on any port
        if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
            return callback(null, true);
        }
        
        callback(new Error('CORS not allowed'));
    },
    credentials: true
}));

//  reuire all routes here
const authRoutes=require("./routes/auth.routes")
const interviewRoutes=require("./routes/interview.routes")

//  use all routes here
app.use("/api/auth",authRoutes)
app.use("/api/interview",interviewRoutes)


module.exports = app;
