const express = require("express");

const timeTrackingRouter = express.Router();

const {
  startTimerController,
  stopTimerController,
} = require("./timeTracking.controller");

timeTrackingRouter.post("/start", startTimerController);

timeTrackingRouter.post("/stop", stopTimerController);

module.exports = timeTrackingRouter;