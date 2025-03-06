
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true, firstName: true, lastName: true }
    });

    if (!user) {
      return next(new Error('Authentication error: Invalid token'));
    }

    // Attach user to socket
    socket.user = user;
    next();
  } catch (error) {
    console.error('Socket authentication error:', error);
    next(new Error('Authentication error: ' + (error.message || 'Invalid token')));
  }
};

exports.canMessageUser = async (senderId, receiverId, senderRole, receiverRole) => {
  // Role-based messaging validation
  // Admin can message anyone
  if (senderRole === 'ADMIN') {
    return true;
  }
  
  // Manager can message Admin and Clients
  if (senderRole === 'MANAGER') {
    return ['ADMIN', 'CLIENT'].includes(receiverRole);
  }
  
  // Client can message Admin and Manager
  if (senderRole === 'CLIENT') {
    return ['ADMIN', 'MANAGER'].includes(receiverRole);
  }
  
  return false;
};
