const express = require("express");

const analyticsRouter = express.Router();

const {
  getTaskTimeAnalyticsController,
} = require("./analytics.controller");

analyticsRouter.get(
  "/tasks/time",
  getTaskTimeAnalyticsController
);

module.exports = analyticsRouter;