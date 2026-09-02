require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const projectRoute = require("./modules/project/project.route");
const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/user/user.routes");
const boardRoutes = require("./modules/board/board.routes");
const taskRoutes = require("./modules/task/task.route");

// Smart Workload routes
const workloadRouter = require("./modules/workload/routes/workload.routes");
const deadlineRouter = require("./modules/workload/routes/deadline.routes");
const capacityRouter = require("./modules/workload/routes/capacity.routes");
const recommendRouter = require("./modules/recommendation/recommendation.routes");

// Time Tracking & Analytics routes
const timeTrackingRoutes = require("./modules/timeTracking/timeTracking.routes");
const analyticsRoutes = require("./modules/analytics/analytics.routes");

const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

// =======================
// Security
// =======================

app.use(helmet());

// =======================
// CORS
// =======================

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || true,
    credentials: true,
  })
);

// =======================
// Body Parsers
// =======================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =======================
// Cookies
// =======================

app.use(cookieParser());

// =======================
// Health Check
// =======================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SmartKanban API is running",
  });
});

