const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(
  cors({
    origin: "https://capture-call.vercel.app",
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/user"));
app.use("/api/admin", require("./routes/admin"));

// Root route with proper response
app.get("/", (req, res) => {
  res.send(`App is running on port ${PORT}`);
});

// Connect to DB and start server
connectDB().catch(console.error);

app.listen(PORT, () => {
  console.log(`Server is running on port no ${PORT}`);
});

module.exports = app;
