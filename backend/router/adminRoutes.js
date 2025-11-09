import express from "express";  // Import the Express library to create route handlers
import { getAllUsers, deleteUser, dashboardStats } from "../controllers/adminController.js";
import { checkDemoUser } from "../middlewares/checkDemoUser.js";

// Import authentication and authorization middlewares
// - isAuthenticated ensures the user is logged in (valid token/session)
// - authorizedRoles checks that the logged-in user has the right role (e.g., Admin)
import { authorizedRoles, isAuthenticated } from "../middlewares/authMiddleware.js";

// Create a new Express router instance to define admin-specific routes
const router = express.Router();

// Admin Routes
router.get("/getallusers", isAuthenticated, authorizedRoles("Admin"), checkDemoUser, getAllUsers); // Get All Users
router.delete("/delete/:id", isAuthenticated, authorizedRoles("Admin"), checkDemoUser, deleteUser); // Delete a spacific user
router.get("/fetch/dashboard-stats", isAuthenticated, authorizedRoles("Admin"), checkDemoUser, dashboardStats);    // Fetch Dashboard stats


// Export the router so it can be used in the main server file (e.g., app.js)
export default router;