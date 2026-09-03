const Joi = require("joi");

// =====================================================
// COMMON VALIDATION MIDDLEWARE
// =====================================================

const validateSchema = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details
        .map((detail) => detail.message)
        .join(", "),
    });
  }

  req.body = value;

  next();
};

// =====================================================
// CREATE BOARD
// =====================================================

const createBoardSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(80)
    .required(),

  description: Joi.string()
    .trim()
    .max(500)
    .allow("", null)
    .default(""),

  members: Joi.array()
    .items(
      Joi.string()
        .hex()
        .length(24)
    )
    .default([]),

  columns: Joi.array()
    .items(
      Joi.object({
        name: Joi.string()
          .trim()
          .min(1)
          .max(50)
          .required(),

        order: Joi.number()
          .integer()
          .min(0)
          .default(0),
      })
    )
    .default([]),
});

// =====================================================
// UPDATE BOARD
// =====================================================

const updateBoardSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(80),

  description: Joi.string()
    .trim()
    .max(500)
    .allow("", null),

  isArchived: Joi.boolean(),

  columns: Joi.array().items(
    Joi.object({
      name: Joi.string()
        .trim()
        .min(1)
        .max(50)
        .required(),

      order: Joi.number()
        .integer()
        .min(0)
        .default(0),
    })
  ),
}).min(1);

// =====================================================
// CREATE TASK
// =====================================================

const createTaskSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(2)
    .max(120)
    .required(),

  description: Joi.string()
    .trim()
    .max(1000)
    .allow("", null)
    .default(""),

  project: Joi.string()
    .hex()
    .length(24)
    .required(),

  column: Joi.string()
    .trim()
    .min(1)
    .required(),

  assignee: Joi.string()
    .hex()
    .length(24)
    .allow(null)
    .optional(),

  priority: Joi.string()
    .valid("low", "medium", "high")
    .default("medium"),

  deadline: Joi.date()
    .iso()
    .allow(null)
    .optional(),

  estimatedHours: Joi.number()
    .min(0)
    .default(0),

  status: Joi.string()
    .valid(
      "todo",
      "in-progress",
      "review",
      "completed"
    )
    .default("todo"),
});

// =====================================================
// UPDATE TASK
// =====================================================

const updateTaskSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(2)
    .max(120),

  description: Joi.string()
    .trim()
    .max(1000)
    .allow("", null),

  project: Joi.string()
    .hex()
    .length(24),

  column: Joi.string()
    .trim()
    .min(1),

  assignee: Joi.string()
    .hex()
    .length(24)
    .allow(null),

  priority: Joi.string()
    .valid("low", "medium", "high"),

  deadline: Joi.date()
    .iso()
    .allow(null),

  estimatedHours: Joi.number()
    .min(0),

  status: Joi.string()
    .valid(
      "todo",
      "in-progress",
      "review",
      "completed"
    ),
}).min(1);

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  validateCreateBoard:
    validateSchema(createBoardSchema),

  validateUpdateBoard:
    validateSchema(updateBoardSchema),

  validateCreateTask:
    validateSchema(createTaskSchema),

  validateUpdateTask:
    validateSchema(updateTaskSchema),
};