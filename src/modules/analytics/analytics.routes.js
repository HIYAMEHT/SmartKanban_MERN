const express = require("express");

const analyticsRouter = express.Router();

const analyticsController = require("./analytics.controller");

const authMiddleware = require("../../middlewares/auth.middleware");

// Task time analytics
analyticsRouter.get(
  "/tasks",
  authMiddleware,
  analyticsController.getTaskTimeAnalyticsController
);


// User time analytics
analyticsRouter.get(
  "/users",
  authMiddleware,
  analyticsController.getUserTimeAnalyticsController
);


// Project time analytics
analyticsRouter.get(
  "/projects",
  authMiddleware,
  analyticsController.getProjectTimeAnalyticsController
);


// Bottleneck analytics
analyticsRouter.get(
  "/bottlenecks",
  authMiddleware,
  analyticsController.getBottleneckAnalyticsController
);


module.exports = analyticsRouter;