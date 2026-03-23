const express = require("express");
const app = express()
const cookieParser=require("cookie-parser")
const cors = require("cors");

app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

//  reuire all routes here
const authRoutes=require("./routes/auth.routes")

//  use all routes here
app.use("/api/auth",authRoutes)


module.exports = app;
