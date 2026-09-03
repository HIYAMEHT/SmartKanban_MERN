const express = require("express");

const timeTrackingRouter =
  express.Router();

const timeTrackingController =
  require("./timeTracking.controller");

const authMiddleware =
  require("../../middlewares/auth.middleware");


// START
timeTrackingRouter.post(
  "/start",
  authMiddleware,
  timeTrackingController.startTimerController
);


// STOP
timeTrackingRouter.post(
  "/stop",
  authMiddleware,
  timeTrackingController.stopTimerController
);


// ACTIVE
timeTrackingRouter.get(
  "/active",
  authMiddleware,
  timeTrackingController.getActiveTimerController
);


module.exports =
  timeTrackingRouter;