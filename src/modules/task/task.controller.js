const taskService = require("./task.service");

const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/apiResponse");
const { badRequest } = require("../../utils/apiError");

// 1. Create Task
const createTaskController = asyncHandler(async (req, res) => {
  const task = await taskService.createTaskService(req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, "Task created successfully", task));
});

// 2. Get Project Tasks
const getProjectTasksController = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  if (!projectId) {
    throw badRequest("Project ID is required");
  }

  const tasks = await taskService.getProjectTasksService(projectId);

  return res
    .status(200)
    .json(new ApiResponse(200, "Tasks fetched successfully", tasks));
});

// 3. Get Single Task
const getSingleTaskController = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  if (!taskId) {
    throw badRequest("Task ID is required");
  }

  const task = await taskService.getSingleTaskService(taskId);

  return res
    .status(200)
    .json(new ApiResponse(200, "Task fetched successfully", task));
});

// 4. Update Task
const updateTaskController = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  if (!taskId) {
    throw badRequest("Task ID is required");
  }

  const task = await taskService.updateTaskService(taskId, req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, "Task updated successfully", task));
});

// 5. Update Task Status
const updateTaskStatusController = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;

  if (!taskId) {
    throw badRequest("Task ID is required");
  }

  if (!status) {
    throw badRequest("Status is required");
  }

  const task = await taskService.updateTaskStatusService(taskId, status);

  return res
    .status(200)
    .json(new ApiResponse(200, "Task status updated successfully", task));
});

// 6. Assign Task
const assignTaskController = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { assignee } = req.body;

  if (!taskId) {
    throw badRequest("Task ID is required");
  }

  if (!assignee) {
    throw badRequest("Assignee is required");
  }

  const task = await taskService.assignTaskService(taskId, assignee);

  return res
    .status(200)
    .json(new ApiResponse(200, "Task assigned successfully", task));
});

// 7. Delete Task
const deleteTaskController = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  if (!taskId) {
    throw badRequest("Task ID is required");
  }

  await taskService.deleteTaskService(taskId);

  return res
    .status(200)
    .json(new ApiResponse(200, "Task deleted successfully"));
});

module.exports = {
  createTaskController,
  getProjectTasksController,
  getSingleTaskController,
  updateTaskController,
  updateTaskStatusController,
  assignTaskController,
  deleteTaskController,
};
