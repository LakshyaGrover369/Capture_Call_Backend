const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const serverless = require("serverless-http");

// Load env vars
dotenv.config();

const app = express();
const PORT = 4000;

app.use(cors({ origin: "*" }));
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/user"));
app.use("/api/admin", require("./routes/admin"));

app.get("/", () => {
  console.log(`App is running on port ${PORT}`);
});
// Connect to database when Lambda starts
connectDB().catch(console.error);
app.listen(PORT, () => {
  console.log(`Server is running on port no ${PORT}`);
});

// Export the serverless app

// module.exports = serverless(app);
module.exports = app;
// Alternatively, if you need the handler export:
// module.exports.handler = serverless(app);
