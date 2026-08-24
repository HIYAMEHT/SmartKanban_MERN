const connectDB = require("./config/db")
const express =require("express");
const app = require("./app");
require("dotenv").config();
const PORT = process.env.PORT ;
app.use("/" , (req,res)=>{
res.status(404).send("page not found");
});

const start  = async ()=>{
    try{
await connectDB();
    }
    catch(err){
        console.error("database connection failed" , err.message);
    }
    const server = app.listen(PORT,()=>{
        console.log(`server is listening on port : ${PORT}`);
    })
}
start();                                   