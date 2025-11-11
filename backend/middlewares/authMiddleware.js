import jwt from "jsonwebtoken"; // Import JWT library to verify and sign tokens
import { catchAsyncErrors } from './catchAsyncError.js'; // Middleware wrapper to catch errors in async functions
import ErrorHandler from "./errorMiddleware.js"; // Custom error handler class
import database from "../database/db.js"; // PostgreSQL client instance

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
   // const { token } = req.cookies; // Read JWT token from cookie
   let token = req.cookies.token;

   if(!token && req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
   }
    if (!token) {
        // If token is missing, user is not logged in
        return next(new ErrorHandler("Please login to access this resource.", 401));
    }
    // Verify the JWT token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // Fetch user from database using ID stored in token
    const user = await database.query(
        "SELECT * FROM users WHERE id = $1 LIMIT 1"  // SQL query to get user
        , [decoded.id] // Use decoded token ID
    );
    // Attach user info to request object so next middleware/controllers can use it
    req.user = user.rows[0];
    next();  // Continue to next middleware or route handler
});

//This checks whether the logged-in user has permission to access a route based on their role.
export const authorizedRoles = (...roles) => {
    return (req, res, next) => {
        // Check if the user's role is included in the allowed roles
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(
                    `Role: ${req.user.role} is not allowed to access this resource.`,
                    403
                )
            );
        }
        next();  // Continue if user role is allowed
    };
};