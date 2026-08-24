const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = async () => {
    const connection = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB connected stablished `);
};

dotenv.config();
module.exports = connectDB;