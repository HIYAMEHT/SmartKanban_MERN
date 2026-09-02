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

// =======================
// Routes
// =======================

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoute);
app.use("/api/boards", boardRoutes);
app.use("/api/tasks", taskRoutes);

// =======================
// Error Middleware
// =======================

app.use(errorMiddleware);

// =======================
// 404 Handler
// =======================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

module.exports = app;