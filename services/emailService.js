import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create transporter (you can use Gmail, Outlook, or any SMTP service)
const createTransporter = () => {
  // Check if environment variables are set
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    throw new Error('EMAIL_USER and EMAIL_PASSWORD must be set in .env file');
  }

  console.log('Creating email transporter with:', {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD ? '***SET***' : 'NOT SET'
  });

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Generate OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP Email
export const sendOTPEmail = async (email, otp, type = 'login') => {
  try {
    const transporter = createTransporter();
    
    let subject, htmlContent;
    
    switch (type) {
      case 'login':
        subject = 'Your Login OTP - RAW Agro';
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">RAW Agro</h1>
            </div>
            <div style="padding: 30px; background: #f9fafb;">
              <h2 style="color: #1f2937; margin-bottom: 20px;">Your Login OTP</h2>
              <p style="color: #6b7280; margin-bottom: 20px;">
                You requested a login OTP. Use the following code to access your account:
              </p>
              <div style="background: #ffffff; border: 2px solid #10b981; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0;">
                <h1 style="color: #10b981; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
              </div>
              <p style="color: #6b7280; margin-bottom: 20px;">
                This OTP is valid for 10 minutes. Do not share this code with anyone.
              </p>
              <p style="color: #6b7280; font-size: 14px;">
                If you didn't request this OTP, please ignore this email.
              </p>
            </div>
            <div style="background: #f3f4f6; padding: 20px; text-align: center;">
              <p style="color: #9ca3af; margin: 0; font-size: 14px;">
                © 2024 RAW Agro. All rights reserved.
              </p>
            </div>
          </div>
        `;
        break;
        
      case 'reset_password':
        subject = 'Password Reset OTP - RAW Agro';
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">RAW Agro</h1>
            </div>
            <div style="padding: 30px; background: #f9fafb;">
              <h2 style="color: #1f2937; margin-bottom: 20px;">Password Reset OTP</h2>
              <p style="color: #6b7280; margin-bottom: 20px;">
                You requested to reset your password. Use the following OTP to proceed:
              </p>
              <div style="background: #ffffff; border: 2px solid #10b981; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0;">
                <h1 style="color: #10b981; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
              </div>
              <p style="color: #6b7280; margin-bottom: 20px;">
                This OTP is valid for 10 minutes. Enter it in the password reset form.
              </p>
              <p style="color: #6b7280; font-size: 14px;">
                If you didn't request a password reset, please ignore this email.
              </p>
            </div>
            <div style="background: #f3f4f6; padding: 20px; text-align: center;">
              <p style="color: #9ca3af; margin: 0; font-size: 14px;">
                © 2024 RAW Agro. All rights reserved.
              </p>
            </div>
          </div>
        `;
        break;
        
      case 'email_verification':
        subject = 'Email Verification OTP - RAW Agro';
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">RAW Agro</h1>
            </div>
            <div style="padding: 30px; background: #f9fafb;">
              <h2 style="color: #1f2937; margin-bottom: 20px;">Email Verification OTP</h2>
              <p style="color: #6b7280; margin-bottom: 20px;">
                Please verify your email address by entering the following OTP:
              </p>
              <div style="background: #ffffff; border: 2px solid #10b981; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0;">
                <h1 style="color: #10b981; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
              </div>
              <p style="color: #6b7280; margin-bottom: 20px;">
                This OTP is valid for 10 minutes. Enter it to complete your registration.
              </p>
              <p style="color: #6b7280; font-size: 14px;">
                Thank you for choosing RAW Agro!
              </p>
            </div>
            <div style="background: #f3f4f6; padding: 20px; text-align: center;">
              <p style="color: #9ca3af; margin: 0; font-size: 14px;">
                © 2024 RAW Agro. All rights reserved.
              </p>
            </div>
          </div>
        `;
        break;
        
      default:
        subject = 'Your OTP - RAW Agro';
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">RAW Agro</h1>
            </div>
            <div style="padding: 30px; background: #f9fafb;">
              <h2 style="color: #1f2937; margin-bottom: 20px;">Your OTP</h2>
              <p style="color: #6b7280; margin-bottom: 20px;">
                Use the following OTP to proceed:
              </p>
              <div style="background: #ffffff; border: 2px solid #10b981; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0;">
                <h1 style="color: #10b981; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
              </div>
              <p style="color: #6b7280; margin-bottom: 20px;">
                This OTP is valid for 10 minutes.
              </p>
            </div>
            <div style="background: #f3f4f6; padding: 20px; text-align: center;">
              <p style="color: #9ca3af; margin: 0; font-size: 14px;">
                © 2024 RAW Agro. All rights reserved.
              </p>
            </div>
          </div>
        `;
    }
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      html: htmlContent
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return true;
    
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send OTP email');
  }
};

// Send SMS OTP (placeholder for future implementation)
export const sendSMSOTP = async (phone, otp) => {
  // This is a placeholder for SMS functionality
  // You can integrate with services like Twilio, AWS SNS, etc.
  console.log(`SMS OTP ${otp} sent to ${phone}`);
  return true;
};
