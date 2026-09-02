const express = require("express");
const router = express.Router();
const recommendationController = require("./recommendation.controller");
const validate = require("../../middlewares/validate");
const {
  getTaskRecommendationsSchema,
  assignTaskSchema,
} = require("./recommendation.validate");
// Get task recommendations
router.get("/task/:taskId",validate(getTaskRecommendationsSchema , "params"), recommendationController.getTaskRecommendations);

// Assign task to a user
router.post("/assign-task",validate(assignTaskSchema), recommendationController.assignTask);

module.exports = router;
