const express = require('express');
// const { validate } = require('../middlewares/validate.middleware');
// const { registerSchema, loginSchema, changePasswordSchema, forgotPasswordSchema, verifyOtpSchema } = require('../validators/auth.validator');
const adminAuthController = require('../controllers/admin.auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();

// Admin auth routes
router.post('/signup',adminAuthController.register);
router.post('/login',  adminAuthController.login);
router.post('/forgot-password', adminAuthController.forgotPassword);
router.post('/reset-password', adminAuthController.resetPassword);
router.post('/change-password', authenticate, adminAuthController.changePassword);
router.post('/verify-otp',adminAuthController.verifyOTP);
router.post('/resend-otp',  adminAuthController.resendOTP);

module.exports = router;
