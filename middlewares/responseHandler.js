const sendResponse = (res, statusCode, status, message, data = null) => {
    res.status(statusCode).json({
        status,
        message,
        data,
    });
};

const sendSuccess = (res, message, data) => {
    sendResponse(res, 200, 'success', message, data);
};

const sendError = (res, message, statusCode = 500) => {
    sendResponse(res, statusCode, 'error', message);
};

module.exports = {
    sendSuccess,
    sendError,
};
