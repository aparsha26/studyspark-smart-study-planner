
export const notFound = (req, res, next) => {
    res.status(404);

    next(new Error(`Route not found: ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, next) => {
    const status = res.statusCode === 200
        ? 500
        : res.statusCode;

    res.status(status).json({
        success: false,
        message: err.message,
        stack: process.env.NODE_ENV === "production"
            ? undefined
            : err.stack
    });
};
//Agar API route nahi milta ya server mein error aata hai toh proper error response deta hai.