// Custom Error class extending the default Error
class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message); // Call the parent constructor with the message
        this.statusCode = statusCode; // Add a statusCode property
    }
}

// Express error-handling middleware
export const errorMiddleware = (err, req, res, next) => {
    // Set default message and status code if not provided
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;

    // Handle MongoDB duplicate key error (optional for NoSQL projects)
    if (err.code === 11000) {
        const message = `Duplicate field value entered`;
        err = new ErrorHandler(message, 400);
    }
    // Handle invalid JWT error
    if (err.name === "JsonWebTokenError") {
        const message = "JSON Web Token is invalid, try again";
        err = new ErrorHandler(message, 400);
    }
    // Handle expired JWT token
    if (err.name === "TokenExpiredError") {
        const message = "JSON Web Token is expired, try again";
        err = new ErrorHandler(message, 400);
    }
    // Handle validation errors (like from Mongoose or other validators)
    const errorMessage = err.errors
        ? Object.values(err.errors)
            .map(error => error.message)
            .join(" ")
        : err.message;

    // Send the JSON response
    return res.status(err.statusCode).json({
        success: false,
        message: errorMessage
    })

};

// Export the ErrorHandler class as default (optional)
export default ErrorHandler;