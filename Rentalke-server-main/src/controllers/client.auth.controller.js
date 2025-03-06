const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { generateOTP, isOTPExpired } = require('../utils/otp.util');
const { 
  sendVerificationEmail, 
  sendResetPasswordEmail, 
  sendWelcomeEmail 
} = require('../utils/email.util');

const prisma = new PrismaClient();

// Generate JWT Token
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// Client Registration
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;
    const role = 'CLIENT';

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Delete any existing pending user with this email
    await prisma.pendingUser.deleteMany({
      where: { 
        email,
        role: 'CLIENT'
      }
    });

    // Create pending user
    const pendingUser = await prisma.pendingUser.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        role: 'CLIENT',
        otp
      }
    });

    // Send verification email
    await sendVerificationEmail(email, otp, firstName);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify your email with the OTP sent.'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register user',
      error: error.message
    });
  }
};

// Client Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findFirst({
      where: { 
        email,
        role: 'CLIENT'
      }
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    const token = generateToken(user.id, user.role);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

// Client Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findFirst({
      where: { 
        email,
        role: 'CLIENT'
      }
    });

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    const otp = generateOTP();
    await prisma.user.update({
      where: { id: user.id },
      data: { resetPasswordOTP: otp }
    });

    // Send reset OTP email
    await sendResetPasswordEmail(email, otp, user.firstName);

    res.status(200).json({ 
      success: true,
      message: 'Password reset OTP sent to your email' 
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process forgot password request',
      error: error.message
    });
  }
};

// Client Change Password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id; // From auth middleware

    const user = await prisma.user.findFirst({
      where: { 
        id: userId,
        role: 'CLIENT'
      }
    });

    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      return res.status(401).json({ 
        success: false,
        message: 'Current password is incorrect' 
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    res.status(200).json({ 
      success: true,
      message: 'Password changed successfully' 
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: error.message
    });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find pending user
    const pendingUser = await prisma.pendingUser.findFirst({
      where: { 
        email,
        role: 'CLIENT'
      }
    });

    if (!pendingUser) {
      return res.status(404).json({
        success: false,
        message: 'No pending verification found for this email'
      });
    }

    // Check OTP
    if (pendingUser.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Check if OTP is expired
    if (isOTPExpired(pendingUser.createdAt)) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired'
      });
    }

    // Create verified user
    const user = await prisma.user.create({
      data: {
        email: pendingUser.email,
        password: pendingUser.password,
        firstName: pendingUser.firstName,
        lastName: pendingUser.lastName,
        phone: pendingUser.phone,
        role: 'CLIENT'
      }
    });

    // Delete pending user
    await prisma.pendingUser.delete({
      where: { email }
    });

    // Generate token
    const token = generateToken(user.id, user.role);

    // Send welcome email
    await sendWelcomeEmail(user.email, user.firstName);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify email',
      error: error.message
    });
  }
};

// Resend OTP
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Find pending user
    const pendingUser = await prisma.pendingUser.findFirst({
      where: { 
        email,
        role: 'CLIENT'
      }
    });

    if (!pendingUser) {
      return res.status(404).json({
        success: false,
        message: 'No pending verification found for this email'
      });
    }

    // Generate new OTP
    const otp = generateOTP();

    // Update pending user with new OTP
    await prisma.pendingUser.update({
      where: { email },
      data: { 
        otp,
        createdAt: new Date() // Reset OTP timer
      }
    });

    // Send new OTP email
    await sendVerificationEmail(email, otp, pendingUser.firstName);

    res.status(200).json({
      success: true,
      message: 'New OTP sent successfully'
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend OTP',
      error: error.message
    });
  }
};
