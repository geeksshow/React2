import express from "express";
import { 
    getUserCart, 
    addToCart, 
    updateCartItem, 
    removeFromCart, 
    clearCart,
    getCartCount
} from "../controllers/cartController.js";
import { authenticateToken } from "../middleware/auth.js";

const cartRouter = express.Router();

// All cart routes require authentication
cartRouter.use(authenticateToken);

// Get user's cart
cartRouter.get("/", getUserCart);

// Add item to cart
cartRouter.post("/add", addToCart);

// Update cart item quantity
cartRouter.put("/update", updateCartItem);

// Remove item from cart
cartRouter.delete("/remove", removeFromCart);

// Clear entire cart
cartRouter.delete("/clear", clearCart);

// Get cart count (for navbar)
cartRouter.get("/count", getCartCount);

export default cartRouter;
