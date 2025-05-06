const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const serverless = require("serverless-http");

// Load env vars
dotenv.config();

const app = express();

// CORS Configuration
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [
        "https://capture-call-frontend-vkeq-lakshyas-projects-c97e54f6.vercel.app/",
        "https://capture-call-frontend-vkeq-git-main-lakshyas-projects-c97e54f6.vercel.app/",
        "https://capture-call-frontend-vkeq-g2jvdomhn-lakshyas-projects-c97e54f6.vercel.app",
        "https://capture-call.vercel.app",
      ]
    : ["http://localhost:5173"]; // Allow localhost in development

const corsOptions = {
  origin: function (origin, callback) {
    console.log("CORS request from origin:", origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/user"));
app.use("/api/admin", require("./routes/admin"));

// Connect to database when Lambda starts
connectDB().catch(console.error);

// Export the serverless app
module.exports = serverless(app);
// Alternatively, if you need the handler export:
// module.exports.handler = serverless(app);
