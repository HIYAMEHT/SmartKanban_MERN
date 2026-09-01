const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const projectRoute = require("./modules/project/project.route");
const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/user/user.routes");

const app = express();

// =======================
// Middleware
// =======================

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// =======================
// Routes
// =======================



app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoute);

// =======================
// 404 Handler
// =======================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Smart Kanban API is running",
  });
});
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

module.exports = app;