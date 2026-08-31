const capacityService = require("../services/capacity.service");
const asyncHandler = require("../../../utils/asyncHandler");
const apiResponse = require("../../../utils/apiResponse");
const { OK } = require("../../../utils/httpStatus");

const getMemberCapacity = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const data = await capacityService.getMemberCapacity(userId);

  res.status(OK).json(OK,data,"Member capacity fetch successfully");
});

module.exports = {
  getMemberCapacity,
};