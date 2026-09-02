const Joi = require("joi");

const getTaskRecommendationsSchema = Joi.object({
  taskId: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages({
      "string.empty": "Task ID is required",
      "any.required": "Task ID is required",
      "string.hex": "Task ID must be a valid MongoDB ObjectId",
      "string.length": "Task ID must be 24 characters",
    }),
});

const assignTaskSchema = Joi.object({
  taskId: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages({
      "string.empty": "Task ID is required",
      "any.required": "Task ID is required",
      "string.hex": "Task ID must be a valid MongoDB ObjectId",
      "string.length": "Task ID must be 24 characters",
    }),

  userId: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages({
      "string.empty": "User ID is required",
      "any.required": "User ID is required",
      "string.hex": "User ID must be a valid MongoDB ObjectId",
      "string.length": "User ID must be 24 characters",
    }),
});

module.exports = {
  getTaskRecommendationsSchema,
  assignTaskSchema,
};