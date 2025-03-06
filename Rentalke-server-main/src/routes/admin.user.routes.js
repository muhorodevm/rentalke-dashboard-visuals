
const express = require('express');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const userProfileController = require('../controllers/user.profile.controller');
const router = express.Router();

// Admin routes for user management (require ADMIN role)
router.get('/users', authenticate, authorize('ADMIN'), userProfileController.getAllUsers);
router.get('/users/:id', authenticate, authorize('ADMIN'), userProfileController.getUserById);
router.patch('/users/:id/role', authenticate, authorize('ADMIN'), userProfileController.updateUserRole);

module.exports = router;
