const asyncHandler = require("../../utils/asyncHandler");
const { OK } = require("../../utils/httpStatus");
const analyticsService = require("./analytics.service");

const getTaskTimeAnalyticsController = asyncHandler(async (req, res) => {
  const data = await analyticsService.getTaskTimeAnalytics();

  res.status(OK).json(data);
});

module.exports = {
  getTaskTimeAnalyticsController,
};