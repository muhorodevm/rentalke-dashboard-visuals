
const { PrismaClient } = require('@prisma/client');
const { canMessageUser } = require('../middlewares/socket.middleware');
const prisma = new PrismaClient();

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user.id;

    if (!receiverId || !message) {
      return res.status(400).json({
        success: false,
        message: 'Receiver ID and message content are required'
      });
    }

    // Check if receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
      select: { id: true, role: true }
    });

    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'Receiver not found'
      });
    }

    // Check if sender can message receiver based on roles
    const sender = await prisma.user.findUnique({
      where: { id: senderId },
      select: { id: true, role: true }
    });

    const canMessage = await canMessageUser(
      senderId, 
      receiverId,
      sender.role,
      receiver.role
    );

    if (!canMessage) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to message this user'
      });
    }

    // Create message
    const newMessage = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        message,
        status: 'SENT'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
};

// Get conversation between two users
exports.getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Check if the other user exists
    const otherUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, firstName: true, lastName: true, email: true, role: true, profileImage: true }
    });

    if (!otherUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get messages between the two users
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: currentUserId, receiverId: userId },
          { senderId: userId, receiverId: currentUserId }
        ]
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    // Count total messages
    const totalCount = await prisma.message.count({
      where: {
        OR: [
          { senderId: currentUserId, receiverId: userId },
          { senderId: userId, receiverId: currentUserId }
        ]
      }
    });

    // Mark unread messages as read
    await prisma.message.updateMany({
      where: {
        senderId: userId,
        receiverId: currentUserId,
        isRead: false
      },
      data: { 
        isRead: true,
        status: 'READ'
      }
    });

    res.status(200).json({
      success: true,
      count: messages.length,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      otherUser,
      data: messages.reverse() // Return in chronological order
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve conversation',
      error: error.message
    });
  }
};

// Get all conversations for a user
exports.getAllConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get unique user IDs that the current user has conversed with
    const sentMessages = await prisma.message.findMany({
      where: { senderId: userId },
      select: { receiverId: true },
      distinct: ['receiverId']
    });

    const receivedMessages = await prisma.message.findMany({
      where: { receiverId: userId },
      select: { senderId: true },
      distinct: ['senderId']
    });

    // Combine and deduplicate user IDs
    const conversationUserIds = [...new Set([
      ...sentMessages.map(m => m.receiverId),
      ...receivedMessages.map(m => m.senderId)
    ])];

    // Get user details and latest message for each conversation
    const conversations = [];

    for (const otherUserId of conversationUserIds) {
      // Get user details
      const otherUser = await prisma.user.findUnique({
        where: { id: otherUserId },
        select: { 
          id: true, 
          firstName: true, 
          lastName: true, 
          email: true,
          role: true,
          profileImage: true
        }
      });

      // Get latest message
      const latestMessage = await prisma.message.findFirst({
        where: {
          OR: [
            { senderId: userId, receiverId: otherUserId },
            { senderId: otherUserId, receiverId: userId }
          ]
        },
        orderBy: { createdAt: 'desc' }
      });

      // Count unread messages
      const unreadCount = await prisma.message.count({
        where: {
          senderId: otherUserId,
          receiverId: userId,
          isRead: false
        }
      });

      conversations.push({
        user: otherUser,
        latestMessage,
        unreadCount
      });
    }

    // Sort by latest message
    conversations.sort((a, b) => {
      return new Date(b.latestMessage.createdAt) - new Date(a.latestMessage.createdAt);
    });

    res.status(200).json({
      success: true,
      count: conversations.length,
      data: conversations
    });
  } catch (error) {
    console.error('Get all conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve conversations',
      error: error.message
    });
  }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if message exists and belongs to user
    const message = await prisma.message.findFirst({
      where: {
        id,
        senderId: userId
      }
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found or you do not have permission to delete it'
      });
    }

    // Delete message
    await prisma.message.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete message',
      error: error.message
    });
  }
};
