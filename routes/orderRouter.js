import express from "express";
import { 
    createOrder, 
    getUserOrders, 
    getOrderById, 
    cancelOrder, 
    getOrderStatus,
    getAllOrders,
    updateOrderStatus
} from "../controllers/orderController.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";

const orderRouter = express.Router();

// All order routes require authentication
orderRouter.use(authenticateToken);

// Create order from cart
orderRouter.post("/", createOrder);

// Get user's orders
orderRouter.get("/", getUserOrders);

// Get specific order by ID
orderRouter.get("/:orderId", getOrderById);

// Cancel order
orderRouter.put("/:orderId/cancel", cancelOrder);

// Get order status
orderRouter.get("/:orderId/status", getOrderStatus);

// Admin routes
orderRouter.get("/all", requireRole('admin'), getAllOrders);
orderRouter.put("/update-status/:orderId", requireRole('admin'), updateOrderStatus);

export default orderRouter;