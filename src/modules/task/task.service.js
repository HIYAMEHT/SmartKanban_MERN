const mongoose = require("mongoose");

const Task = require("./task.model");
const Project = require("../project/project.model");
const Board = require("../board/board.model");
const User = require("../user/user.model");

const {
  badRequest,
  notFound,
} = require("../../utils/apiError");

// =====================================================
// 1. CREATE TASK
// =====================================================

const createTaskService = async (boardId, payload, userId) => {
  const {
    title,
    description,
    assignee,
    column,
    status,
    priority,
    estimatedHours,
    skillsRequired,
    deadline,
  } = payload;

  if (!boardId) {
    throw badRequest("Board ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(boardId)) {
    throw badRequest("Invalid board ID");
  }

  if (!userId) {
    throw badRequest("User authentication is required");
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw badRequest("Invalid user ID");
  }

  // Find board
  const board = await Board.findById(boardId);

  if (!board) {
    throw notFound("Board not found");
  }

  // IMPORTANT:
  // Project should come from the board
  const projectId = board.project;

  if (!projectId) {
    throw badRequest(
      "This board is not associated with a project"
    );
  }

  // Check project
  const projectExists = await Project.findById(projectId);

  if (!projectExists) {
    throw notFound("Project not found");
  }

  // Validate assignee
  let finalAssignee = null;

  if (assignee) {
    if (!mongoose.Types.ObjectId.isValid(assignee)) {
      throw badRequest("Invalid assignee ID");
    }

    const userExists = await User.findById(assignee);

    if (!userExists) {
      throw notFound("Assignee user not found");
    }

    finalAssignee = assignee;
  }

  // Create task
  const task = await Task.create({
    title,
    description,
    project: projectId,
    board: boardId,
    column: column || "To Do",
    assignee: finalAssignee,
    status: status || "To Do",
    priority: priority || "Medium",
    estimatedHours: Number(estimatedHours) || 0,
    skillsRequired: skillsRequired || [],
    deadline,
    createdBy: userId,
  });

  // Return populated task
  return await Task.findById(task._id)
    .populate("assignee", "name email")
    .populate("project", "name")
    .populate("board", "name")
    .populate("createdBy", "name email");
};

// =====================================================
// 2. GET PROJECT TASKS
// =====================================================

const getProjectTasksService = async (projectId) => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw badRequest("Invalid project ID");
  }

  const projectExists = await Project.findById(projectId);

  if (!projectExists) {
    throw notFound("Project not found");
  }

  const tasks = await Task.find({
    project: projectId,
  })
    .populate("assignee", "name email")
    .populate("project", "name")
    .populate("board", "name")
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });

  return tasks;
};

// =====================================================
// 3. GET SINGLE TASK
// =====================================================

const getSingleTaskService = async (taskId) => {
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw badRequest("Invalid task ID");
  }

  const task = await Task.findById(taskId)
    .populate("assignee", "name email")
    .populate("project", "name")
    .populate("board", "name")
    .populate("createdBy", "name email");

  if (!task) {
    throw notFound("Task not found");
  }

  return task;
};

// =====================================================
// 4. UPDATE TASK
// =====================================================

const updateTaskService = async (taskId, payload) => {
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw badRequest("Invalid task ID");
  }

  const task = await Task.findById(taskId);

  if (!task) {
    throw notFound("Task not found");
  }

  // Never allow these fields to be changed
  delete payload.project;
  delete payload.board;
  delete payload.createdBy;

  // Validate assignee
  if (payload.assignee) {
    if (!mongoose.Types.ObjectId.isValid(payload.assignee)) {
      throw badRequest("Invalid assignee ID");
    }

    const userExists = await User.findById(payload.assignee);

    if (!userExists) {
      throw notFound("Assignee user not found");
    }
  }

  Object.assign(task, payload);

  await task.save();

  return await Task.findById(task._id)
    .populate("assignee", "name email")
    .populate("project", "name")
    .populate("board", "name")
    .populate("createdBy", "name email");
};

// =====================================================
// 5. UPDATE STATUS
// =====================================================

const updateTaskStatusService = async (taskId, status) => {
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw badRequest("Invalid task ID");
  }

  const allowedStatus = [
    "To Do",
    "In Progress",
    "Review",
    "Completed",
  ];

  if (!allowedStatus.includes(status)) {
    throw badRequest("Invalid task status");
  }

  const task = await Task.findById(taskId);

  if (!task) {
    throw notFound("Task not found");
  }

  task.status = status;

  await task.save();

  return task;
};

// =====================================================
// 6. ASSIGN TASK
// =====================================================

const assignTaskService = async (taskId, assignee) => {
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw badRequest("Invalid task ID");
  }

  if (!mongoose.Types.ObjectId.isValid(assignee)) {
    throw badRequest("Invalid assignee ID");
  }

  const task = await Task.findById(taskId);

  if (!task) {
    throw notFound("Task not found");
  }

  const userExists = await User.findById(assignee);

  if (!userExists) {
    throw notFound("User not found");
  }

  task.assignee = assignee;

  await task.save();

  return task;
};

// =====================================================
// 7. DELETE TASK
// =====================================================

const deleteTaskService = async (taskId) => {
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw badRequest("Invalid task ID");
  }

  const task = await Task.findById(taskId);

  if (!task) {
    throw notFound("Task not found");
  }

  await Task.findByIdAndDelete(taskId);

  return true;
};

module.exports = {
  createTaskService,
  getProjectTasksService,
  getSingleTaskService,
  updateTaskService,
  updateTaskStatusService,
  assignTaskService,
  deleteTaskService,
};