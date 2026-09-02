const express = require("express");

const timeTrackingRouter = express.Router();

const timeTrackingController = require("./timeTracking.controller");
const authMiddleware = require("../../middlewares/auth.middleware");

timeTrackingRouter.post(
  "/start",
  authMiddleware,
  timeTrackingController.startTimerController
);

timeTrackingRouter.post(
  "/stop",
  authMiddleware,
  timeTrackingController.stopTimerController
);

module.exports = timeTrackingRouter;