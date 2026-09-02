const Joi = require("joi");

const getMemberCapacitySchema = Joi.object({
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
  getMemberCapacitySchema,
};