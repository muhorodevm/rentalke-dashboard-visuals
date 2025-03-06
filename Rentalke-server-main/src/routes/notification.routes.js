
const express = require('express');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const notificationController = require('../controllers/notification.controller');
const router = express.Router();

// Admin email notification routes
router.post('/email', authenticate, authorize('ADMIN'), notificationController.sendEmail);

// System notification routes (admin only can create)
router.post('/', authenticate, authorize('ADMIN'), notificationController.createNotification);

// User notification routes (any authenticated user)
router.get('/', authenticate, notificationController.getUserNotifications);
router.patch('/:id/read', authenticate, notificationController.markAsRead);
router.patch('/read-all', authenticate, notificationController.markAllAsRead);
router.delete('/:id', authenticate, notificationController.deleteNotification);

module.exports = router;
