import express from "express";
import { 
    deleteProduct, 
    getProductById, 
    getProducts, 
    saveProducts, 
    updateProduct,
    submitProduct,
    getPendingProducts,
    reviewProduct,
    addProduct,
    getAllProducts
} from "../controllers/productController.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";

const productRouter = express.Router();

// Public routes
productRouter.get("/", getProducts);
productRouter.get("/all", getAllProducts);
productRouter.get("/getproduct/:product_id", getProductById);

// User routes (require authentication)
productRouter.post("/submit", authenticateToken, submitProduct);

// Admin routes (require authentication and admin role)
productRouter.post("/add", authenticateToken, requireRole('admin'), addProduct);
productRouter.post("/", authenticateToken, requireRole('admin'), saveProducts);
productRouter.delete("/:product_id", authenticateToken, requireRole('admin'), deleteProduct);
productRouter.put("/:product_id", authenticateToken, requireRole('admin'), updateProduct);
productRouter.put("/update/:product_id", authenticateToken, requireRole('admin'), updateProduct);
productRouter.get("/pending", authenticateToken, requireRole('admin'), getPendingProducts);
productRouter.post("/:productId/review", authenticateToken, requireRole('admin'), reviewProduct);

export default productRouter; 