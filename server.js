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
  "https://capture-call-frontend-vkeq-lakshyas-projects-c97e54f6.vercel.app/",
  "https://capture-call-frontend-vkeq-git-main-lakshyas-projects-c97e54f6.vercel.app/",
  "capture-call-frontend-vkeq-g2jvdomhn-lakshyas-projects-c97e54f6.vercel.app",
  "https://capture-call.vercel.app",
  "http://localhost:5173",
];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

app.use(cors(corsOptions));

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
