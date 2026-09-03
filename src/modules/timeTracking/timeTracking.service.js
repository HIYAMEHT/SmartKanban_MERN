const mongoose = require("mongoose");

const TimeLog = require("./timeTracking.model");
const Task = require("../task/task.model");

const {
  badRequest,
  notFound,
  conflict,
} = require("../../utils/apiError");


// =====================================================
// START TIMER
// =====================================================

const startTimer = async (userId, taskId) => {

  // ---------------------------------------------------
  // Validate user
  // ---------------------------------------------------

  if (!userId) {
    throw badRequest(
      "User authentication is required"
    );
  }

  if (
    !mongoose.Types.ObjectId.isValid(userId)
  ) {
    throw badRequest(
      "Invalid user ID"
    );
  }


  // ---------------------------------------------------
  // Validate task
  // ---------------------------------------------------

  if (!taskId) {
    throw badRequest(
      "Task ID is required"
    );
  }

  if (
    !mongoose.Types.ObjectId.isValid(taskId)
  ) {
    throw badRequest(
      "Invalid task ID"
    );
  }


  // ---------------------------------------------------
  // Check if user already has a running timer
  // ---------------------------------------------------

  const existingTimer =
    await TimeLog.findOne({
      user: userId,
      status: "Running",
    });

  if (existingTimer) {
    throw conflict(
      "The timer is already running for a task"
    );
  }


  // ---------------------------------------------------
  // Check task exists
  // ---------------------------------------------------

  const taskExists =
    await Task.findById(taskId);

  if (!taskExists) {
    throw notFound(
      "Task not found"
    );
  }


  // ---------------------------------------------------
  // Create timer
  // ---------------------------------------------------

  const timeLog =
    await TimeLog.create({
      user: userId,
      task: taskId,
      startTime: new Date(),
      endTime: null,
      durationSeconds: 0,
      status: "Running",
    });


  // Return populated task
  await timeLog.populate(
    "task",
    "title estimatedHours"
  );


  return timeLog;
};


// =====================================================
// STOP TIMER
// =====================================================

const stopTimer = async (userId) => {

  if (!userId) {
    throw badRequest(
      "User authentication is required"
    );
  }


  // ---------------------------------------------------
  // Find running timer
  // ---------------------------------------------------

  const runningTimer =
    await TimeLog.findOne({
      user: userId,
      status: "Running",
    });


  if (!runningTimer) {
    throw notFound(
      "No running timer found"
    );
  }


  // ---------------------------------------------------
  // Calculate duration
  // ---------------------------------------------------

  const endTime = new Date();

  const durationSeconds =
    Math.floor(
      (endTime - runningTimer.startTime) /
        1000
    );


  // ---------------------------------------------------
  // Update timer
  // ---------------------------------------------------

  runningTimer.endTime = endTime;

  runningTimer.durationSeconds =
    Math.max(durationSeconds, 0);

  runningTimer.status =
    "Completed";


  await runningTimer.save();


  // Populate task
  await runningTimer.populate(
    "task",
    "title estimatedHours"
  );


  return runningTimer;
};


// =====================================================
// GET ACTIVE TIMER
// =====================================================

const getActiveTimerService =
  async (userId) => {

    if (!userId) {
      throw badRequest(
        "User authentication is required"
      );
    }


    const activeTimer =
      await TimeLog.findOne({
        user: userId,
        status: "Running",
      })
        .populate(
          "task",
          "title estimatedHours"
        )
        .sort({
          startTime: -1,
        });


    return activeTimer;
  };


module.exports = {
  startTimer,
  stopTimer,
  getActiveTimerService,
};