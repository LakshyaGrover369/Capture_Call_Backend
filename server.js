const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const serverless = require("serverless-http");
const path = require("path");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// ✅ Safe, direct CORS config for serverless/Vercel
const allowedOrigins = [
  "https://capture-call.vercel.app",
  "http://localhost:5173",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // ✅ handles preflight
  }

  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(
  "/prospectsPhotos",
  express.static(path.join(__dirname, "prospectsPhotos"))
);

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/user"));
app.use("/api/admin", require("./routes/admin"));

// ✅ Export only the handler
module.exports.handler = serverless(app);
