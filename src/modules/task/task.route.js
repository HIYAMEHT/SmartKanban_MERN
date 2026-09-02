const express = require("express");

const taskController = require("./task.controller");

const validationMiddleware = require("../../middlewares/validationMiddleware");

const {
  createTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
  assignTaskSchema,
} = require("../task/task.validation");

const router = express.Router();

// 1. Create Task
router.post(
  "/",
  validationMiddleware(createTaskSchema),
  taskController.createTaskController,
);

// 2. Get all tasks of a project
router.get("/project/:projectId", taskController.getProjectTasksController);

// 3. Get single task
router.get("/:taskId", taskController.getSingleTaskController);

// 4. Update task
router.patch(
  "/:taskId",
  validationMiddleware(updateTaskSchema),
  taskController.updateTaskController,
);

// 5. Change task status
router.patch(
  "/:taskId/status",
  validationMiddleware(updateTaskStatusSchema),
  taskController.updateTaskStatusController,
);

// 6. Assign task
router.patch(
  "/:taskId/assign",
  validationMiddleware(assignTaskSchema),
  taskController.assignTaskController,
);

// 7. Delete task
router.delete("/:taskId", taskController.deleteTaskController);

module.exports = router;
