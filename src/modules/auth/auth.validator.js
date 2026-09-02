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

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(6).required(),
  bio: Joi.string().trim().max(500).allow("", null).optional(),
  role: Joi.string().valid("user", "admin").optional(),
  skills: Joi.array().items(Joi.string().trim().min(1)).default([]),
  availability: Joi.object({
    status: Joi.string().valid("available", "unavailable").optional(),
    hoursPerDay: Joi.number().min(0).max(24).optional(),
  }).optional(),
}).unknown(true);

const loginSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(6).required(),
});

const validateRegister = validateSchema(registerSchema);
const validateLogin = validateSchema(loginSchema);

module.exports = {
  validateRegister,
  validateLogin,
};
