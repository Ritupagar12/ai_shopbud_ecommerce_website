import express from "express";
import { forgotPassword, getUser, login, logout, register, resetPassword, updatePassword, updateProfile } from "../controllers/authController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router(); // Create a router instance

// Routes are split into public (register, login, forgot password) and protected (logout, get user) routes.
// isAuthenticated middleware ensures protected routes can only be accessed by logged-in users.


// Public Routes: This routes can be accessed without Logging in
router.post("/register", register); 
// Route to create a new user account
// Expects name, email, and password in the request body

router.post("/login", login);
// Route to log in a user
// Expects email and password in the request body

router.post("/password/forgot", forgotPassword); 
// Route to request a password reset
// Expects email in the request body
// Sends a reset link to the user's email

router.put("/password/reset/:token", resetPassword); 
// Route to reset the password using a token sent via email
// Expects new password and confirmPassword in the request body

// Protected routes (require authentication)
// These routes require the user to be logged in
// The isAuthenticated middleware validates the JWT token
router.get("/logout", isAuthenticated, logout); 
// Route for logout 
// // Only logged-in users can logout

router.get("/me", isAuthenticated, getUser); 
// Route to get currently logged-in user's info  
// Only logged-in users can get their

router.put("/password/update", isAuthenticated, updatePassword); 
// Allows the logged-in user to update their password
// Expects currentPassword, newPassword, confirmNewPassword in the request body

router.put("/profile/update", isAuthenticated, updateProfile);
// Allows the logged-in user to update their profile
// Can update name, email, and optionally the avatar image

export default router; 
// Export the router to use in app.js
