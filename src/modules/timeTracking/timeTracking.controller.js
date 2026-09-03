const asyncHandler = require("../../utils/asyncHandler");
const { OK } = require("../../utils/httpStatus");
const timerService = require("./timeTracking.service");


// =====================================================
// START TIMER
// POST /api/time-tracking/start
// =====================================================

const startTimerController = asyncHandler(async (req, res) => {
  const { taskId } = req.body;

  const userId =
    req.user?.userId ||
    req.user?._id ||
    req.user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "User authentication is required",
    });
  }

  if (!taskId) {
    return res.status(400).json({
      success: false,
      message: "Task ID is required",
    });
  }

  const timeLog = await timerService.startTimer(
    userId,
    taskId
  );

  return res.status(OK).json({
    success: true,
    message: "Timer started successfully",
    data: timeLog,
  });
});


// =====================================================
// STOP TIMER
// POST /api/time-tracking/stop
// =====================================================

const stopTimerController = asyncHandler(async (req, res) => {
  const userId =
    req.user?.userId ||
    req.user?._id ||
    req.user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "User authentication is required",
    });
  }

  const updatedTimeLog =
    await timerService.stopTimer(userId);

  return res.status(OK).json({
    success: true,
    message: "Timer stopped successfully",
    data: updatedTimeLog,
  });
});


// =====================================================
// GET ACTIVE TIMER
// GET /api/time-tracking/active
// =====================================================

const getActiveTimerController = asyncHandler(
  async (req, res) => {

    const userId =
      req.user?.userId ||
      req.user?._id ||
      req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication is required",
      });
    }

    const activeTimer =
      await timerService.getActiveTimerService(
        userId
      );

    return res.status(OK).json({
      success: true,
      message: "Active timer fetched successfully",
      data: activeTimer,
    });
  }
);


module.exports = {
  startTimerController,
  stopTimerController,
  getActiveTimerController,
};