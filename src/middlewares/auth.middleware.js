const ApiError = require("../utils/apiError");
const { verifyToken } = require("../utils/jwt");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies && req.cookies.accessToken;
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : cookieToken;

  if (!token) {
    return next(new ApiError(401, "Authentication token is required"));
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return next(new ApiError(401, "Session expired. Please login again."));
  }
};

module.exports = authMiddleware;
