const express = require('express');
// const { validate } = require('../middlewares/validate.middleware');
// const { registerSchema, loginSchema, changePasswordSchema, forgotPasswordSchema, verifyOtpSchema } = require('../validators/auth.validator');
const managerAuthController = require('../controllers/manager.auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();

// Manager auth routes
router.post('/signup',  managerAuthController.register);
router.post('/login',  managerAuthController.login);
router.post('/forgot-password', managerAuthController.forgotPassword);
router.post('/reset-password', managerAuthController.resetPassword);
router.post('/change-password', authenticate,  managerAuthController.changePassword);
router.post('/verify-otp',  managerAuthController.verifyOTP);
router.post('/resend-otp', managerAuthController.resendOTP);

module.exports = router;
