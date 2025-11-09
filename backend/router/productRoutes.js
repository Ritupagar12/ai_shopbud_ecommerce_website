import express from "express";

import { createProduct, deleteProduct, deleteReview, fetchAIFilteredProducts, fetchSingleProduct, postProductReview, updateProduct } from "../controllers/productController.js";
import { fetchAllProducts } from "../controllers/productController.js";
import { authorizedRoles, isAuthenticated } from "../middlewares/authMiddleware.js";
import { checkDemoUser } from "../middlewares/checkDemoUser.js";

const router = express.Router();

// Route to create a new product (Admin only)
router.post('/admin/create', isAuthenticated, authorizedRoles("Admin"), checkDemoUser, createProduct); // Protected route — only authenticated users can create products

// Public route to fetch all products (supports filtering, search, pagination)
router.get("/", fetchAllProducts);

// Update an existing product — Admin only
router.put("/admin/update/:productId", isAuthenticated, authorizedRoles("Admin"),checkDemoUser, updateProduct);

// Delete a product — Admin only
router.delete("/admin/delete/:productId", isAuthenticated, authorizedRoles("Admin"), checkDemoUser, deleteProduct);

// Fetch a single product by ID (public)
router.get("/singleProduct/:productId", fetchSingleProduct);

// Logged-in users can post or update reviews
router.put("/post-new/review/:productId", isAuthenticated, postProductReview);

// Logged-in users can delete their own reviews
router.delete("/delete/review/:productId", isAuthenticated, deleteReview);

// Authenticated users can use AI search filtering
router.post("/ai-search", isAuthenticated, fetchAIFilteredProducts);

export default router;  // Export the router to use in app.js