const ApiError = require("../utils/apiError");

const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Authentication required"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(403, "You are not authorized for this action")
      );
    }

    next();
  };
};

module.exports = authorizeRole;