import express from "express";
import { 
    createUser, 
    loginUser, 
    getUserProfile, 
    updateUserProfile, 
    changePassword, 
    logout, 
    getAllUsers, 
    toggleUserBlock, 
    changeUserRole,
    deleteUser
} from "../controllers/userController.js";
import { 
    authenticateToken, 
    requireRole, 
    isAdmin 
} from "../middleware/auth.js";
import {
    validateRegistration,
    validateLogin,
    validateProfileUpdate,
    validatePasswordChange,
    validateUserBlock,
    validateUserRole,
    handleValidationErrors,
    sanitizeInput
} from "../middleware/validation.js";

const userRouter = express.Router();

// Public routes (no authentication required)
userRouter.post("/register", sanitizeInput, validateRegistration, handleValidationErrors, createUser);
userRouter.post("/login", sanitizeInput, validateLogin, handleValidationErrors, loginUser);

// Protected routes (authentication required)
userRouter.get("/profile", authenticateToken, getUserProfile);
userRouter.put("/profile", authenticateToken, sanitizeInput, validateProfileUpdate, handleValidationErrors, updateUserProfile);
userRouter.put("/change-password", authenticateToken, validatePasswordChange, handleValidationErrors, changePassword);
userRouter.post("/logout", authenticateToken, logout);

// Admin only routes
userRouter.get("/all", authenticateToken, isAdmin, getAllUsers);
userRouter.put("/:userId/block", authenticateToken, isAdmin, validateUserBlock, handleValidationErrors, toggleUserBlock);
userRouter.put("/:userId/unblock", authenticateToken, isAdmin, validateUserBlock, handleValidationErrors, toggleUserBlock);
userRouter.put("/:userId/promote", authenticateToken, isAdmin, validateUserRole, handleValidationErrors, changeUserRole);
userRouter.put("/:userId/role", authenticateToken, isAdmin, validateUserRole, handleValidationErrors, changeUserRole);

// User account management (user can delete their own account, admin can delete any)
userRouter.delete("/:userId", authenticateToken, deleteUser);

export default userRouter;