const asyncHandler = require("../../utils/asyncHandler");
const { OK } = require("../../utils/httpStatus");
const analyticsService = require("./analytics.service");


// GET /analytics/tasks
const getTaskTimeAnalyticsController = asyncHandler(
  async (req, res) => {

    const data = await analyticsService.getTaskTimeAnalytics();

    res.status(OK).json(data);
  }
);


// GET /analytics/users
const getUserTimeAnalyticsController = asyncHandler(
  async (req, res) => {

    const data = await analyticsService.getUserTimeAnalytics();

    res.status(OK).json(data);
  }
);


// GET /analytics/projects
const getProjectTimeAnalyticsController = asyncHandler(
  async (req, res) => {

    const data = await analyticsService.getProjectTimeAnalytics();

    res.status(OK).json(data);
  }
);


// GET /analytics/bottlenecks
const getBottleneckAnalyticsController = asyncHandler(
  async (req, res) => {

    const data = await analyticsService.getBottleneckAnalytics();

    res.status(OK).json(data);
  }
);


module.exports = {
  getTaskTimeAnalyticsController,
  getUserTimeAnalyticsController,
  getProjectTimeAnalyticsController,
  getBottleneckAnalyticsController,
};