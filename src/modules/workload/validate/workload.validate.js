
const Joi = require("joi");

// GET /workload/project/:projectId
const getProjectWorkloadSchema = Joi.object({
  projectId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "any.required": "Project ID is required",
      "string.empty": "Project ID is required",
      "string.pattern.base": "Invalid project ID",
    }),
});

// GET /workload/member/:userId
const getMemberWorkloadSchema = Joi.object({
  userId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "any.required": "User ID is required",
      "string.empty": "User ID is required",
      "string.pattern.base": "Invalid user ID",
    }),
});

module.exports = {
  getProjectWorkloadSchema,
  getMemberWorkloadSchema,
};