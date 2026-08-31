


const Joi = require("joi");

// GET /recommendations/task/:taskId
const getTaskRecommendationsSchema = Joi.object({
  taskId: Joi.string()
    .required()
    .messages({
      "string.empty": "Task ID is required",
      "any.required": "Task ID is required",
    }),
});

// POST /recommendations/assign-task
const assignTaskSchema = Joi.object({
  taskId: Joi.string()
    .required()
    .messages({
      "string.empty": "Task ID is required",
      "any.required": "Task ID is required",
    }),

  userId: Joi.string()
    .required()
    .messages({
      "string.empty": "User ID is required",
      "any.required": "User ID is required",
    }),
});

module.exports = {
  getTaskRecommendationsSchema,
  assignTaskSchema,
};
