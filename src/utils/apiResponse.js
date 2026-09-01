function ApiResponse(statusCode, data, message = "Success") {
  return {
    statusCode,
    success: statusCode < 400,
    message,
    data,
  };
}

module.exports = ApiResponse;
