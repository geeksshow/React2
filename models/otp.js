import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: true
  },
  otp: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['login', 'reset_password', 'email_verification'],
    default: 'login'
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 } // Auto-delete expired OTPs
  }
}, {
  timestamps: true
});

// Create index for email and type combination
otpSchema.index({ email: 1, type: 1 });

const OTP = mongoose.model("OTP", otpSchema);

export default OTP;
