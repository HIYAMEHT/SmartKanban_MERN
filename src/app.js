const express = require("express");

const projectRoute = require("./modules/project/project.route");

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/projects", projectRoute);

// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Smart Kanban API is running",
  });
});

module.exports = app;