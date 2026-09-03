const Board = require("./board.model");
const Task = require("../task/task.model");
const ApiError = require("../../utils/apiError");

const getAllBoards = async (userId) => {
  const boards = await Board.find({
    $or: [{ owner: userId }, { members: userId }],
  })
    .populate("owner", "name email")
    .populate("members", "name email")
    .sort({ updatedAt: -1 });

  return boards;
};

const createBoard = async (userId, data) => {
  const board = await Board.create({
    ...data,
    owner: userId,
    members: Array.from(new Set([userId, ...(data.members || [])])),
    columns:
      data.columns && data.columns.length
        ? data.columns
        : [
            { name: "To Do", order: 0 },
            { name: "In Progress", order: 1 },
            { name: "Done", order: 2 },
          ],
  });

  return board;
};

const getBoardById = async (boardId, userId) => {
  const board = await Board.findOne({
    _id: boardId,
    $or: [{ owner: userId }, { members: userId }],
  })
    .populate("owner", "name email")
    .populate("members", "name email");

  if (!board) {
    throw new ApiError(404, "Board not found");
  }

  return board;
};

const updateBoard = async (boardId, userId, data) => {
  const board = await Board.findOneAndUpdate(
    { _id: boardId, owner: userId },
    { $set: data },
    { new: true, runValidators: true },
  )
    .populate("owner", "name email")
    .populate("members", "name email");

  if (!board) {
    throw new ApiError(404, "Board not found or not authorized");
  }

  return board;
};

const deleteBoard = async (boardId, userId) => {
  const board = await Board.findOneAndDelete({ _id: boardId, owner: userId });

  if (!board) {
    throw new ApiError(404, "Board not found or not authorized");
  }

  await Task.deleteMany({ board: boardId });

  return { deleted: true, boardId };
};

const getBoardTasks = async (boardId, userId) => {
  const board = await Board.findOne({
    _id: boardId,
    $or: [{ owner: userId }, { members: userId }],
  });

  if (!board) {
    throw new ApiError(404, "Board not found");
  }

  const tasks = await Task.find({ board: boardId })
    .populate("assignee", "name email")
    .populate("createdBy", "name email")
    .sort({ updatedAt: -1 });

  return tasks;
};

const createTask = async (boardId, userId, data) => {
  const board = await Board.findOne({
    _id: boardId,
    $or: [{ owner: userId }, { members: userId }],
  });

  if (!board) {
    throw new ApiError(404, "Board not found");
  }

  // Normalize status
  let status = "To Do";
  if (data.status) {
    const s = String(data.status).toLowerCase();
    if (s === "in progress" || s === "in-progress") status = "In Progress";
    else if (s === "review") status = "Review";
    else if (s === "done" || s === "completed") status = "Completed";
    else if (s === "to do" || s === "todo") status = "To Do";
  }

  // Normalize priority
  let priority = "Medium";
  if (data.priority) {
    const p = String(data.priority).toLowerCase();
    if (p === "low") priority = "Low";
    else if (p === "high") priority = "High";
    else if (p === "medium") priority = "Medium";
  }

  // Column
  const column = data.column || (status === "Completed" ? "Done" : status);

  // Deadline
  const deadline = data.deadline || data.dueDate || new Date(Date.now() + 7 * 86400000);

  // Project: if not provided in payload, check if user has any project
  let project = data.project;
  if (!project) {
    const ProjectModel = require("../project/project.model");
    const userProj = await ProjectModel.findOne({
      $or: [{ owner: userId }, { "members.user": userId }],
    });
    if (userProj) {
      project = userProj._id;
    }
  }

  const task = await Task.create({
    ...data,
    board: boardId,
    project,
    createdBy: userId,
    column,
    status,
    priority,
    deadline,
  });

  return task;
};

const updateTask = async (taskId, userId, data) => {
  const task = await Task.findOne({ _id: taskId, createdBy: userId });

  if (!task) {
    throw new ApiError(404, "Task not found or not authorized");
  }

  Object.assign(task, data);
  await task.save();

  return task;
};

const deleteTask = async (taskId, userId) => {
  const task = await Task.findOneAndDelete({ _id: taskId, createdBy: userId });

  if (!task) {
    throw new ApiError(404, "Task not found or not authorized");
  }

  return { deleted: true, taskId };
};

module.exports = {
  getAllBoards,
  createBoard,
  getBoardById,
  updateBoard,
  deleteBoard,
  getBoardTasks,
  createTask,
  updateTask,
  deleteTask,
};
