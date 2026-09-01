const asyncHandler = require("../../utils/asyncHandler");
const { OK } = require("../../utils/httpStatus");
const timerService = require("./timeTracking.service") ;


const startTimerController = asyncHandler(async (req, res) => {

  const { taskId } = req.body;

  const userId = req.user.userId;

  const timeLog = await timerService.startTimer(userId, taskId);

  res.status(OK).json(timeLog);
});

const stopTimerController = asyncHandler(async (req, res) => {

  const userId = req.user.userId;

  const updatedTimeLog = await timerService.stopTimer(userId);

  res.status(OK).json(updatedTimeLog);
});

module.exports = {
    startTimerController ,
    stopTimerController
}
