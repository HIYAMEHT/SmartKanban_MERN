const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();

const app = express();

// const mongoSanitization = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors({origin:process.env.CORS_ORIGIN,credentials:true}))
// app.use(mongoSanitization());


module.exports = app