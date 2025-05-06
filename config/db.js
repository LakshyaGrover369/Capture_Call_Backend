const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Modern MongoDB connection (no deprecated options needed)
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn; // Return the connection object
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error; // Throw instead of process.exit for serverless
  }
};

// For serverless environments - cache the connection
let cachedConnection = null;

module.exports = async () => {
  if (cachedConnection) {
    return cachedConnection;
  }
  cachedConnection = await connectDB();
  return cachedConnection;
};
