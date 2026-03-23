require("dotenv").config();
const app=require("./src/app");
const connectToDB=require("./src/config/database");
// const {invokeGeminiAi} = require("./services/ai.service");

connectToDB();
// invokeGeminiAi().catch(err => console.error("AI Error:", err.message));
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
 