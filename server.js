const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const serverless = require("serverless-http");
const path = require("path");

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Configure CORS properly
const corsOptions = {
  origin: ["https://capture-call.vercel.app", "http://localhost:5173"], // allow frontend origins
  credentials: true, // allow cookies, authorization headers
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(
  "/prospectsPhotos",
  express.static(path.join(__dirname, "prospectsPhotos"))
);

// Routes
app.use("/api/auth", authRoutes); // Use the imported routes
app.use("/api/users", userRoutes); // Use the imported routes
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export the app for serverless deployment
module.exports = app;
module.exports.handler = serverless(app);
