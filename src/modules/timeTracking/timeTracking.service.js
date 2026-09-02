const apiError = require('../../utils/apiError') ;
const TimeLog = require('../timeTracking/timeTracking.model')
const Task = require("../../models/task.model");
const {CONFLICT, NOT_FOUND} = require('../../utils/httpStatus');

const startTimer = async (userId, taskId) => {

  const ExistingTimer = await TimeLog.findOne({
    user: userId,
    status: "Running"
  });

  if (ExistingTimer) {
    throw apiError(
      CONFLICT,
      "The timer is already running for a task"
    );
  }

  const taskExist = await Task.findById(taskId);

  if (!taskExist) {
    throw apiError(NOT_FOUND, "Task not found");
  }

  const timeLog = await TimeLog.create({
    user: userId,
    task: taskId,
    startTime: new Date(),
    durationSeconds: 0,
    status: "Running"
  });

  return timeLog;
};

const stopTimer = async (userId) => {

  const runningTimer = await TimeLog.findOne({
    user: userId,
    status: "Running"
  });

  if (!runningTimer) {
    throw apiError(
      NOT_FOUND,
      "Running timer for this task is not found"
    );
  }

  runningTimer.endTime = new Date();

  runningTimer.durationSeconds =
    (runningTimer.endTime - runningTimer.startTime) / 1000;

  runningTimer.status = "Completed";

  await runningTimer.save();

  return runningTimer;
};

module.exports = {startTimer,stopTimer} ;