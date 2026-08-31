const asyncHandler = require("../../utils/asyncHandler");
const recommendationService = require("./recommendation.service");

// GET /recommendations/task/:taskId
const getTaskRecommendations =asyncHandler(  async (req, res) => {
 
    const { taskId } = req.params;

    const data =
      await recommendationService.getTaskRecommendations(taskId);

    res.status(OK).json(OK,data,"Task recommendation fetch successfully");
  
});


// POST /recommendations/assign-task
const assignTask = asyncHandler(async (req, res) => {
 
    const { taskId, userId } = req.body;

    const data =
      await recommendationService.assignTask(
        taskId,
        userId
      );

    res.status(200).json(data);
 
});


module.exports = {
  getTaskRecommendations,
  assignTask,
};