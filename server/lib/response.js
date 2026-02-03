/**
 * Utility to standardize API responses
 */

export const successResponse = (res, data, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

export const errorResponse = (res, error = 'Internal Server Error', statusCode = 500) => {
    return res.status(statusCode).json({
        success: false,
        error: typeof error === 'string' ? error : error.message || 'Server Error'
    });
};
