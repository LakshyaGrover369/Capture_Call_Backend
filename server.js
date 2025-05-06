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
  "https://capture-call.vercel.app",
  "http://localhost:5173",
];

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
// app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(
  "/prospectsPhotos",
  express.static(path.join(__dirname, "prospectsPhotos"))
);
// const PORT = process.env.PORT || 5000; // Use environment variable or default to 5000

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/user"));
app.use("/api/admin", require("./routes/admin"));

// ✅ Export only the handler
module.exports.handler = serverless(app);
// module.exports = app; // For local testing, if needed
