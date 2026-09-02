const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();

const app = express();

// const mongoSanitization = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");

const swaggerFile = require("./swagger-output.json");
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors({origin:process.env.CORS_ORIGIN,credentials:true}))
// app.use(mongoSanitization());
// swagger
app.use(
    "/swaggerSmart",
    swaggerUi.serve,
    swaggerUi.setup(swaggerFile, {
        swaggerOptions: { withCredentials: true },
    })
);
const workloadRouter = require("./modules/workload/routes/workload.routes");
const deadlineRouter =  require("./modules/workload/routes/deadline.routes");
const  capacityRouter = require("./modules/workload/routes/capacity.routes");
const recommendRouter = require("./modules/recommendation/recommendation.routes");
app.use("/workload", workloadRouter);
app.use("/deadline" , deadlineRouter);
app.use("/capacity" , capacityRouter);
app.use("/recommend" , recommendRouter);

module.exports = app