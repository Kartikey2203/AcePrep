const jwt = require("jsonwebtoken");
const blacklistTokenModel = require("../models/blacklist.model");

async function authMiddleware(req, res, next) {
  const token = req.cookies.token;
  console.log("authMiddleware - Token present:", !!token);
  console.log("authMiddleware - Cookies:", Object.keys(req.cookies));
  
  if (!token) {
    console.error("authMiddleware - No token found in cookies");
    return res.status(400).json({ message: "No token found" });
  }

  const isTokenBlacklisted = await blacklistTokenModel.findOne({ token });
  if (isTokenBlacklisted) {
    console.error("authMiddleware - Token is blacklisted");
    return res.status(400).json({ message: "Token is invalid" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;
    console.log("authMiddleware - User authenticated:", req.user.id);
    next();
  } catch (error) {
    console.error("authMiddleware - Token verification failed:", error.message);
    return res.status(400).json({ message: "Invalid token" });
  }
}

module.exports = authMiddleware;