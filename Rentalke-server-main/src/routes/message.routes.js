
const express = require('express');
const { authenticate } = require('../middlewares/auth.middleware');
const messageController = require('../controllers/message.controller');
const router = express.Router();

// Message routes
router.post('/', authenticate, messageController.sendMessage);
router.get('/conversations', authenticate, messageController.getAllConversations);
router.get('/conversations/:userId', authenticate, messageController.getConversation);
router.delete('/:id', authenticate, messageController.deleteMessage);

module.exports = router;
