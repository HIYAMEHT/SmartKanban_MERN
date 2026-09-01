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

const profileUpdateSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50),
  bio: Joi.string().trim().max(500).allow(""),
}).min(1);

const skillsUpdateSchema = Joi.object({
  skills: Joi.array()
    .items(Joi.string().trim().min(1).required())
    .min(1)
    .required(),
});

const availabilityUpdateSchema = Joi.object({
  status: Joi.string().valid("available", "unavailable"),
  hoursPerDay: Joi.number().min(0).max(24),
}).min(1);

const validateProfileUpdate = validateSchema(profileUpdateSchema);
const validateSkillsUpdate = validateSchema(skillsUpdateSchema);
const validateAvailabilityUpdate = validateSchema(availabilityUpdateSchema);

module.exports = {
  validateProfileUpdate,
  validateSkillsUpdate,
  validateAvailabilityUpdate,
};
