function ApiError(statusCode, message, errors = []) {
  const error = new Error(message);

  error.name = "ApiError";
  error.statusCode = statusCode;
  error.success = false;
  error.errors = errors;

  Error.captureStackTrace(error, ApiError);

  return error;
}

function badRequest(message = "Bad request", errors = []) {
  return ApiError(400, message, errors);
}

function unauthorized(message = "Unauthorized") {
  return ApiError(401, message);
}

function forbidden(message = "Forbidden") {
  return ApiError(403, message);
}

function notFound(message = "Resource not found") {
  return ApiError(404, message);
}

function conflict(message = "Conflict") {
  return ApiError(409, message);
}

function internalServerError(message = "Internal server error") {
  return ApiError(500, message);
}


// IMPORTANT
// Default export
module.exports = ApiError;

// Named exports
module.exports.ApiError = ApiError;
module.exports.badRequest = badRequest;
module.exports.unauthorized = unauthorized;
module.exports.forbidden = forbidden;
module.exports.notFound = notFound;
module.exports.conflict = conflict;
module.exports.internalServerError = internalServerError;