const apiError = (statusCode, message = "Something went wrong", errors = []) => {
    return {
        statusCode,
        message,
        errors
    };
};

module.exports = apiError;