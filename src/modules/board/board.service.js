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

  const task = await Task.create({
    ...data,
    board: boardId,
    createdBy: userId,
    status: data.status || "todo",
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
