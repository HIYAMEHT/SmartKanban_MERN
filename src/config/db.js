const mongoose  = require("mongoose");
const dns  = require("dns");
dns.setServers(["8.8.8.8" , "8.8.4.4"]);
require("dotenv").config();
const url = process.env.MONGO_URL;
const connectDB = async ()=>{
    try{
    await mongoose.connect(url);
     console.log("database connection established");
    }
    catch(err){
        console.log("database connection error " ,err);
    }
}

module.exports =  connectDB;