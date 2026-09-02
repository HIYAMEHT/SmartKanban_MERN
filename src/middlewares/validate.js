


const apiError = require("../utils/apiError");
const { BAD_REQUEST } = require("../utils/httpStatus");

const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => detail.message);

      return next(
        apiError(BAD_REQUEST, "Validation error", errors)
      );
    }

    req[property] = value;
    next();
  };
};

module.exports = validate;
