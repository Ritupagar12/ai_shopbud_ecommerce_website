import express from "express";
import { authorizedRoles, isAuthenticated } from "../middlewares/authMiddleware.js";
import { deleteOrder, fetchAllOrders, fetchMyOrders, fetchSingleOrder, placeNewOrder, updateOrderStatus } from "../controllers/orderController.js";
import { checkDemoUser } from "../middlewares/checkDemoUser.js";

const router = express.Router();

//place a new order for a logged-in user
router.post("/new", isAuthenticated, placeNewOrder);

router.get("/:orderId", isAuthenticated, fetchSingleOrder);

router.get("/orders/me", isAuthenticated, fetchMyOrders);

router.get("/admin/getall", isAuthenticated, authorizedRoles("Admin"), checkDemoUser, fetchAllOrders);

router.put("/admin/update/:orderId", isAuthenticated, authorizedRoles("Admin"), checkDemoUser, updateOrderStatus);

router.delete("/admin/delete/:orderId", isAuthenticated, authorizedRoles("Admin"), checkDemoUser, deleteOrder);
// Export router so it can be imported into app.js
export default router;