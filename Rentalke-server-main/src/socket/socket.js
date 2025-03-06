
const socketIO = require('socket.io');
const { authenticateSocket, canMessageUser } = require('../middlewares/socket.middleware');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function setupSocketIO(server) {
  const io = socketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL || '*',
      methods: ['GET', 'POST']
    }
  });

  // Set up authentication middleware
  io.use(authenticateSocket);

  const connectedUsers = new Map();

  io.on('connection', async (socket) => {
    const userId = socket.user.id;
    console.log(`User connected: ${userId}`);
    
    // Track connected user
    connectedUsers.set(userId, socket.id);
    
    // Emit user online status to relevant users
    socket.broadcast.emit('user_status', { userId, status: 'online' });
    
    // Join room for user-specific events
    socket.join(`user:${userId}`);
    
    // Handle private messages
    socket.on('private_message', async (data) => {
      try {
        const { receiverId, message } = data;
        const senderId = socket.user.id;
        
        // Validate input
        if (!receiverId || !message) {
          socket.emit('error', { message: 'Receiver ID and message are required' });
          return;
        }

        // Get receiver
        const receiver = await prisma.user.findUnique({
          where: { id: receiverId },
          select: { id: true, role: true }
        });

        if (!receiver) {
          socket.emit('error', { message: 'Receiver not found' });
          return;
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
          socket.emit('error', { message: 'You do not have permission to message this user' });
          return;
        }

        // Save message to database
        const newMessage = await prisma.message.create({
          data: {
            senderId,
            receiverId,
            message,
            status: 'SENT'
          }
        });

        // Get sender info for the receiver
        const senderInfo = {
          id: socket.user.id,
          firstName: socket.user.firstName,
          lastName: socket.user.lastName,
          email: socket.user.email,
          role: socket.user.role
        };

        // Emit message to receiver if online
        if (connectedUsers.has(receiverId)) {
          const receiverSocketId = connectedUsers.get(receiverId);
          io.to(receiverSocketId).emit('new_message', {
            message: newMessage,
            sender: senderInfo
          });
          
          // Update message status to delivered
          await prisma.message.update({
            where: { id: newMessage.id },
            data: { status: 'DELIVERED' }
          });
        }
        
        // Emit to sender as confirmation
        socket.emit('message_sent', { message: newMessage });
        
      } catch (error) {
        console.error('Socket message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });
    
    // Handle message read status
    socket.on('mark_read', async (data) => {
      try {
        const { messageId } = data;
        const userId = socket.user.id;
        
        // Update message as read
        const message = await prisma.message.findFirst({
          where: {
            id: messageId,
            receiverId: userId,
            isRead: false
          }
        });
        
        if (message) {
          await prisma.message.update({
            where: { id: messageId },
            data: { 
              isRead: true,
              status: 'READ'
            }
          });
          
          // Notify sender that message is read
          if (connectedUsers.has(message.senderId)) {
            const senderSocketId = connectedUsers.get(message.senderId);
            io.to(senderSocketId).emit('message_read', { messageId });
          }
        }
      } catch (error) {
        console.error('Mark read error:', error);
      }
    });
    
    // Handle typing indicator
    socket.on('typing', (data) => {
      const { receiverId, isTyping } = data;
      
      if (connectedUsers.has(receiverId)) {
        const receiverSocketId = connectedUsers.get(receiverId);
        io.to(receiverSocketId).emit('user_typing', {
          userId: socket.user.id,
          isTyping
        });
      }
    });
    
    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${userId}`);
      
      // Remove from connected users
      connectedUsers.delete(userId);
      
      // Emit offline status
      socket.broadcast.emit('user_status', { userId, status: 'offline' });
    });
  });

  return io;
}

module.exports = setupSocketIO;
