const asyncHandler = require("../../../utils/asyncHandler");
const deadlineService = require("../services/deadline.service");

// GET /deadline-prediction/:taskId
const getDeadlinePrediction =  asyncHandler(async (req, res, next) => {
 
    const { taskId } = req.params;

    const data = await deadlineService.getDeadlinePrediction(taskId);

    res.status(OK).json(OK,data,"Deadline prediction fetch successfully");
 
});

module.exports = {
  getDeadlinePrediction,
};