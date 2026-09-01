const boardService = require("./board.service");
const ApiResponse = require("../../utils/apiResponse");
const asyncHandler = require("../../utils/asyncHandler");

const getBoards = asyncHandler(async (req, res) => {
  const boards = await boardService.getAllBoards(req.user.userId);
  return res
    .status(200)
    .json(new ApiResponse(200, boards, "Boards fetched successfully"));
});

const createBoard = asyncHandler(async (req, res) => {
  const board = await boardService.createBoard(req.user.userId, req.body);
  return res
    .status(201)
    .json(new ApiResponse(201, board, "Board created successfully"));
});

const getBoard = asyncHandler(async (req, res) => {
  const board = await boardService.getBoardById(
    req.params.boardId,
    req.user.userId,
  );
  return res
    .status(200)
    .json(new ApiResponse(200, board, "Board fetched successfully"));
});

const updateBoard = asyncHandler(async (req, res) => {
  const board = await boardService.updateBoard(
    req.params.boardId,
    req.user.userId,
    req.body,
  );
  return res
    .status(200)
    .json(new ApiResponse(200, board, "Board updated successfully"));
});

const deleteBoard = asyncHandler(async (req, res) => {
  const result = await boardService.deleteBoard(
    req.params.boardId,
    req.user.userId,
  );
  return res
    .status(200)
    .json(new ApiResponse(200, result, "Board deleted successfully"));
});

const getTasks = asyncHandler(async (req, res) => {
  const tasks = await boardService.getBoardTasks(
    req.params.boardId,
    req.user.userId,
  );
  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Tasks fetched successfully"));
});

const createTask = asyncHandler(async (req, res) => {
  const task = await boardService.createTask(
    req.params.boardId,
    req.user.userId,
    req.body,
  );
  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task created successfully"));
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await boardService.updateTask(
    req.params.taskId,
    req.user.userId,
    req.body,
  );
  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task updated successfully"));
});

const deleteTask = asyncHandler(async (req, res) => {
  const result = await boardService.deleteTask(
    req.params.taskId,
    req.user.userId,
  );
  return res
    .status(200)
    .json(new ApiResponse(200, result, "Task deleted successfully"));
});

module.exports = {
  getBoards,
  createBoard,
  getBoard,
  updateBoard,
  deleteBoard,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
