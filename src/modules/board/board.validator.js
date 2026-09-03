const Joi = require("joi");

const validateSchema = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details.map((detail) => detail.message).join(", "),
    });
  }

  req.body = value;
  next();
};

const createBoardSchema = Joi.object({
  name: Joi.string().trim().min(2).max(80).required(),
  description: Joi.string().trim().max(500).allow("", null).default(""),
  members: Joi.array().items(Joi.string().hex().length(24)).default([]),
  columns: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().trim().min(1).max(50).required(),
        order: Joi.number().integer().min(0).default(0),
      }),
    )
    .default([]),
}).unknown(true);

const updateBoardSchema = Joi.object({
  name: Joi.string().trim().min(2).max(80),
  description: Joi.string().trim().max(500).allow("", null),
  isArchived: Joi.boolean(),
  columns: Joi.array().items(
    Joi.object({
      name: Joi.string().trim().min(1).max(50).required(),
      order: Joi.number().integer().min(0).default(0),
    }),
  ),
})
  .min(1)
  .unknown(true);

const createTaskSchema = Joi.object({
  title: Joi.string().trim().min(2).max(120).required(),
  description: Joi.string().trim().max(1000).allow("", null).default(""),
  column: Joi.string().trim().min(1).optional(),
  project: Joi.string().hex().length(24).optional(),
  assignee: Joi.string().hex().length(24).allow(null, "").optional(),
  priority: Joi.string().valid("low", "medium", "high", "Low", "Medium", "High").default("Medium"),
  dueDate: Joi.date().iso().allow(null, "").optional(),
  deadline: Joi.date().allow(null, "").optional(),
  status: Joi.string().valid("todo", "to do", "in-progress", "in progress", "review", "done", "completed", "To Do", "In Progress", "Review", "Completed").default("To Do"),
  estimatedHours: Joi.number().min(0).optional(),
  skillsRequired: Joi.array().items(Joi.string()).optional(),
}).unknown(true);

const updateTaskSchema = Joi.object({
  title: Joi.string().trim().min(2).max(120),
  description: Joi.string().trim().max(1000).allow("", null),
  column: Joi.string().trim().min(1),
  project: Joi.string().hex().length(24).allow(null, ""),
  assignee: Joi.string().hex().length(24).allow(null, ""),
  priority: Joi.string().valid("low", "medium", "high", "Low", "Medium", "High"),
  dueDate: Joi.date().iso().allow(null, ""),
  deadline: Joi.date().allow(null, ""),
  status: Joi.string().valid("todo", "to do", "in-progress", "in progress", "review", "done", "completed", "To Do", "In Progress", "Review", "Completed"),
  estimatedHours: Joi.number().min(0),
  skillsRequired: Joi.array().items(Joi.string()),
})
  .min(1)
  .unknown(true);

module.exports = {
  validateCreateBoard: validateSchema(createBoardSchema),
  validateUpdateBoard: validateSchema(updateBoardSchema),
  validateCreateTask: validateSchema(createTaskSchema),
  validateUpdateTask: validateSchema(updateTaskSchema),
};
