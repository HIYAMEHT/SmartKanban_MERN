

const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const dns  = require("dns");
dns.setServers(["8.8.8.8" , "8.8.4.4"]);
require("dotenv").config();
const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);

    console.log(
      `MongoDB connected: ${connection.connection.host}`
    );

    return connection;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

