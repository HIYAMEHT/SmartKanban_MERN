const taskService = require("./task.service");

const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/apiResponse");
const { badRequest } = require("../../utils/apiError");

// =====================================================
// 1. CREATE TASK
// POST /api/tasks
// =====================================================

const createTaskController = asyncHandler(async (req, res) => {
  const boardId = req.params.boardId || req.body.board;

  if (!boardId) {
    throw badRequest("Board ID is required");
  }

  const userId =
    req.user?.userId ||
    req.user?._id ||
    req.user?.id;

  if (!userId) {
    throw badRequest("User authentication is required");
  }

  const task = await taskService.createTaskService(
    boardId,
    req.body,
    userId
  );

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        task,
        "Task created successfully"
      )
    );
});

// =====================================================
// 2. GET PROJECT TASKS
// GET /api/tasks/project/:projectId
// =====================================================

const getProjectTasksController = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  if (!projectId) {
    throw badRequest("Project ID is required");
  }

  const tasks =
    await taskService.getProjectTasksService(projectId);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        tasks,
        "Tasks fetched successfully"
      )
    );
});

// =====================================================
// 3. GET SINGLE TASK
// GET /api/tasks/:taskId
// =====================================================

const getSingleTaskController = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  if (!taskId) {
    throw badRequest("Task ID is required");
  }

  const task =
    await taskService.getSingleTaskService(taskId);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        task,
        "Task fetched successfully"
      )
    );
});

// =====================================================
// 4. UPDATE TASK
// PATCH /api/tasks/:taskId
// =====================================================

const updateTaskController = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  if (!taskId) {
    throw badRequest("Task ID is required");
  }

  const task =
    await taskService.updateTaskService(
      taskId,
      req.body
    );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        task,
        "Task updated successfully"
      )
    );
});

// =====================================================
// 5. UPDATE STATUS
// PATCH /api/tasks/:taskId/status
// =====================================================

const updateTaskStatusController = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;

  if (!taskId) {
    throw badRequest("Task ID is required");
  }

  if (!status) {
    throw badRequest("Status is required");
  }

  const task =
    await taskService.updateTaskStatusService(
      taskId,
      status
    );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        task,
        "Task status updated successfully"
      )
    );
});

// =====================================================
// 6. ASSIGN TASK
// PATCH /api/tasks/:taskId/assign
// =====================================================

const assignTaskController = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { assignee } = req.body;

  if (!taskId) {
    throw badRequest("Task ID is required");
  }

  if (!assignee) {
    throw badRequest("Assignee is required");
  }

  const task =
    await taskService.assignTaskService(
      taskId,
      assignee
    );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        task,
        "Task assigned successfully"
      )
    );
});

// =====================================================
// 7. DELETE TASK
// DELETE /api/tasks/:taskId
// =====================================================

const deleteTaskController = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  if (!taskId) {
    throw badRequest("Task ID is required");
  }

  await taskService.deleteTaskService(taskId);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        true,
        "Task deleted successfully"
      )
    );
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