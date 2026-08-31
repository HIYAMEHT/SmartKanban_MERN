const Joi = require("joi");

const getDeadlinePredictionSchema = Joi.object({
  taskId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "any.required": "Task ID is required",
      "string.empty": "Task ID is required",
      "string.pattern.base": "Invalid task ID",
    }),
});

module.exports = {
  getDeadlinePredictionSchema,
};