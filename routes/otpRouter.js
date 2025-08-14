import express from "express";
import { 
    sendLoginOTP, 
    sendPasswordResetOTP, 
    sendEmailVerificationOTP, 
    verifyOTP, 
    resendOTP, 
    getOTPStatus 
} from "../controllers/otpController.js";

const otpRouter = express.Router();

// Send OTP for login
otpRouter.post("/send-login", sendLoginOTP);

// Send OTP for password reset
otpRouter.post("/send-reset", sendPasswordResetOTP);

// Send OTP for email verification
otpRouter.post("/send-verification", sendEmailVerificationOTP);

// Verify OTP
otpRouter.post("/verify", verifyOTP);

// Resend OTP
otpRouter.post("/resend", resendOTP);

// Get OTP status
otpRouter.get("/status", getOTPStatus);

export default otpRouter;
