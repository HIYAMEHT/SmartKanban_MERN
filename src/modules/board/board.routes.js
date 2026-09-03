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
} = require("./board.validator");

const authMiddleware = require("../../middlewares/auth.middleware");

const router = express.Router();


// =====================================================
// BOARD ROUTES
// =====================================================

router.get(
  "/",
  authMiddleware,
  getBoards
);


router.post(
  "/",
  authMiddleware,
  validateCreateBoard,
  createBoard
);


router.get(
  "/:boardId",
  authMiddleware,
  getBoard
);


router.patch(
  "/:boardId",
  authMiddleware,
  validateUpdateBoard,
  updateBoard
);


router.delete(
  "/:boardId",
  authMiddleware,
  deleteBoard
);


// =====================================================
// BOARD TASK ROUTES
// =====================================================

// Get tasks belonging to this board
router.get(
  "/:boardId/tasks",
  authMiddleware,
  getTasks
);


// Create task inside this board
router.post(
  "/:boardId/tasks",
  authMiddleware,
  createTask
);


// Update task
router.patch(
  "/tasks/:taskId",
  authMiddleware,
  updateTask
);


// Delete task
router.delete(
  "/tasks/:taskId",
  authMiddleware,
  deleteTask
);


module.exports = router;