const express = require('express');
const { validate } = require('../middlewares/validate.middleware');
const { registerSchema, loginSchema, changePasswordSchema, forgotPasswordSchema, verifyOtpSchema } = require('../validators/auth.validator');
const clientAuthController = require('../controllers/client.auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();

// Client auth routes
router.post('/signup', validate(registerSchema), clientAuthController.register);
router.post('/login', validate(loginSchema), clientAuthController.login);
router.post('/forgot-password', validate(forgotPasswordSchema), clientAuthController.forgotPassword);
router.post('/change-password', authenticate, validate(changePasswordSchema), clientAuthController.changePassword);
router.post('/verify-otp', validate(verifyOtpSchema), clientAuthController.verifyOTP);
router.post('/resend-otp', validate(forgotPasswordSchema), clientAuthController.resendOTP);

module.exports = router;
