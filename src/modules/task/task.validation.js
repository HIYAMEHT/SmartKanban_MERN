const Joi = require("joi");

const createTaskSchema = Joi.object({
  title: Joi.string().trim().min(3).max(200).required(),

  description: Joi.string().trim().max(2000).allow("", null),

  project: Joi.string().hex().length(24).required(),

  assignee: Joi.string().hex().length(24).allow(null, ""),

  status: Joi.string()
    .valid("To Do", "In Progress", "Review", "Completed")
    .default("To Do"),

  priority: Joi.string().valid("Low", "Medium", "High").default("Medium"),

  estimatedHours: Joi.number().min(0).default(0),

  skillsRequired: Joi.array().items(Joi.string().trim()).default([]),

  deadline: Joi.date().required(),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

const updateTaskSchema = Joi.object({
  title: Joi.string().trim().min(3).max(200),

  description: Joi.string().trim().max(2000).allow("", null),

  assignee: Joi.string().hex().length(24).allow(null, ""),

  priority: Joi.string().valid("Low", "Medium", "High"),

  estimatedHours: Joi.number().min(0),

  skillsRequired: Joi.array().items(Joi.string().trim()),

  deadline: Joi.date(),
})
  .min(1)
  .options({
    abortEarly: false,
    stripUnknown: true,
  });

const updateTaskStatusSchema = Joi.object({
  status: Joi.string()
    .valid("To Do", "In Progress", "Review", "Completed")
    .required(),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

const assignTaskSchema = Joi.object({
  assignee: Joi.string().hex().length(24).required(),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

module.exports = {
  createTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
  assignTaskSchema,
};
