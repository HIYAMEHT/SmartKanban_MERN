require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/user/user.routes");
const boardRoutes = require("./modules/board/board.routes");
const timeTrackingRoutes = require("./modules/timeTracking/timeTracking.routes");
const analyticsRoutes = require("./modules/analytics/analytics.routes");

const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SmartKanban API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/boards", boardRoutes);

app.use("/api/time-tracking", timeTrackingRoutes);
app.use("/api/analytics", analyticsRoutes);

app.use(errorMiddleware);

module.exports = app;