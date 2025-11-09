// checkDemoUser.js
import ErrorHandler from "./errorMiddleware.js";
export const checkDemoUser = (req, res, next) => {
    // Replace this email with your demo admin email
    const demoEmail = "admin@demo.com";

    // If the logged-in user is the demo admin
    if (req.user && req.user.email === demoEmail) {
        // Block all write requests (POST, PUT, PATCH, DELETE)
        if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
            return next(
                new ErrorHandler("Read-only demo mode: cannot modify data.", 403)
            );
        }
    }

    next(); // Allow all other requests
};