const express = require("express");
const app = express()
const cookieParser=require("cookie-parser")

app.use(express.json());
app.use(cookieParser())

//  reuire all routes here
const authRoutes=require("./routes/auth.routes")

//  use all routes here
app.use("/api/auth",authRoutes)


module.exports = app;
