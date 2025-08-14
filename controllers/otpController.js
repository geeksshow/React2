import OTP from "../models/otp.js";
import User from "../models/user.js";
import { generateOTP, sendOTPEmail } from "../services/emailService.js";

// Send OTP for login
export async function sendLoginOTP(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email"
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to database
    await OTP.create({
      email: email.toLowerCase(),
      otp: otp,
      type: 'login',
      expiresAt: expiresAt
    });

    // Send OTP via email
    await sendOTPEmail(email, otp, 'login');

    res.json({
      success: true,
      message: "OTP sent successfully to your email",
      expiresIn: "10 minutes"
    });

  } catch (error) {
    console.error('Error sending login OTP:', error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: error.message
    });
  }
}

// Send OTP for password reset
export async function sendPasswordResetOTP(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email"
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to database
    await OTP.create({
      email: email.toLowerCase(),
      otp: otp,
      type: 'reset_password',
      expiresAt: expiresAt
    });

    // Send OTP via email
    await sendOTPEmail(email, otp, 'reset_password');

    res.json({
      success: true,
      message: "Password reset OTP sent successfully to your email",
      expiresIn: "10 minutes"
    });

  } catch (error) {
    console.error('Error sending password reset OTP:', error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: error.message
    });
  }
}

// Send OTP for email verification
export async function sendEmailVerificationOTP(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email"
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to database
    await OTP.create({
      email: email.toLowerCase(),
      otp: otp,
      type: 'email_verification',
      expiresAt: expiresAt
    });

    // Send OTP via email
    await sendOTPEmail(email, otp, 'email_verification');

    res.json({
      success: true,
      message: "Email verification OTP sent successfully",
      expiresIn: "10 minutes"
    });

  } catch (error) {
    console.error('Error sending email verification OTP:', error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: error.message
    });
  }
}

// Verify OTP
export async function verifyOTP(req, res) {
  try {
    const { email, otp, type = 'login' } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required"
      });
    }

    // Find the OTP
    const otpRecord = await OTP.findOne({
      email: email.toLowerCase(),
      otp: otp,
      type: type,
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP"
      });
    }

    // Mark OTP as used
    otpRecord.isUsed = true;
    await otpRecord.save();

    res.json({
      success: true,
      message: "OTP verified successfully"
    });

  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({
      success: false,
      message: "Failed to verify OTP",
      error: error.message
    });
  }
}

// Resend OTP
export async function resendOTP(req, res) {
  try {
    const { email, type = 'login' } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email"
      });
    }

    // Delete any existing unused OTPs for this email and type
    await OTP.deleteMany({
      email: email.toLowerCase(),
      type: type,
      isUsed: false
    });

    // Generate new OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save new OTP to database
    await OTP.create({
      email: email.toLowerCase(),
      otp: otp,
      type: type,
      expiresAt: expiresAt
    });

    // Send new OTP via email
    await sendOTPEmail(email, otp, type);

    res.json({
      success: true,
      message: "New OTP sent successfully",
      expiresIn: "10 minutes"
    });

  } catch (error) {
    console.error('Error resending OTP:', error);
    res.status(500).json({
      success: false,
      message: "Failed to resend OTP",
      error: error.message
    });
  }
}

// Get OTP status
export async function getOTPStatus(req, res) {
  try {
    const { email, type = 'login' } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    // Find the latest OTP for this email and type
    const otpRecord = await OTP.findOne({
      email: email.toLowerCase(),
      type: type
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.json({
        success: true,
        hasOTP: false
      });
    }

    const isExpired = new Date() > otpRecord.expiresAt;
    const canResend = isExpired || otpRecord.isUsed;

    res.json({
      success: true,
      hasOTP: true,
      isExpired: isExpired,
      isUsed: otpRecord.isUsed,
      canResend: canResend,
      expiresAt: otpRecord.expiresAt,
      timeRemaining: Math.max(0, otpRecord.expiresAt - new Date())
    });

  } catch (error) {
    console.error('Error getting OTP status:', error);
    res.status(500).json({
      success: false,
      message: "Failed to get OTP status",
      error: error.message
    });
  }
}
