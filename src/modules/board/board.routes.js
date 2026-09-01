const express = require("express");
const {
  getBoards,
  createBoard,
  getBoard,
  updateBoard,
  deleteBoard,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("./board.controller");
const {
  validateCreateBoard,
  validateUpdateBoard,
  validateCreateTask,
  validateUpdateTask,
} = require("./board.validator");
const authMiddleware = require("../../middlewares/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, getBoards);
router.post("/", authMiddleware, validateCreateBoard, createBoard);
router.get("/:boardId", authMiddleware, getBoard);
router.patch("/:boardId", authMiddleware, validateUpdateBoard, updateBoard);
router.delete("/:boardId", authMiddleware, deleteBoard);

router.get("/:boardId/tasks", authMiddleware, getTasks);
router.post("/:boardId/tasks", authMiddleware, validateCreateTask, createTask);
router.patch("/tasks/:taskId", authMiddleware, validateUpdateTask, updateTask);
router.delete("/tasks/:taskId", authMiddleware, deleteTask);

module.exports = router;
