const apiResponse = require("../../../utils/apiResponse");
const asyncHandler = require("../../../utils/asyncHandler");
const { OK } = require("../../../utils/httpStatus");
const deadlineService = require("../services/deadline.service");

// GET /deadline-prediction/:taskId
const getDeadlinePrediction =  asyncHandler(async (req, res, next) => {
 
    const { taskId } = req.params;

    const data = await deadlineService.getDeadlinePrediction(taskId);

    res.status(OK).json(apiResponse(OK,data,"Deadline prediction fetch successfully"));
 
});

module.exports = {
  getDeadlinePrediction,
};