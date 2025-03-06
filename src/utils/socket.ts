
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/context/AuthContext";

// Define message type
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  status: 'SENT' | 'DELIVERED' | 'READ';
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

// Define user object structure
export interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  role: string;
  profileImage: string | null;
}

// Define conversation type
export interface Conversation {
  user: User;
  latestMessage: Message;
  unreadCount: number;
}

let socket: Socket | null = null;

export const initializeSocket = (token: string): Socket => {
  if (socket) return socket;

  const SOCKET_URL = import.meta.env.VITE_API_URL || 'https://rentalke-server-2.onrender.com';
  
  socket = io(SOCKET_URL, {
    auth: { token }
  });

  socket.on('connect', () => {
    console.log('Socket connected');
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  return socket;
};

export const closeSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const useSocketEvents = (
  onNewMessage?: (data: { message: Message; sender: User }) => void,
  onMessageSent?: (data: { message: Message }) => void,
  onMessageRead?: (data: { messageId: string }) => void,
  onUserTyping?: (data: { userId: string; isTyping: boolean }) => void,
  onUserStatus?: (data: { userId: string; status: string }) => void
) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!socket || !isAuthenticated) return;

  // Setup event listeners
  if (onNewMessage) {
    socket.on('new_message', onNewMessage);
  }
  
  if (onMessageSent) {
    socket.on('message_sent', onMessageSent);
  }
  
  if (onMessageRead) {
    socket.on('message_read', onMessageRead);
  }
  
  if (onUserTyping) {
    socket.on('user_typing', onUserTyping);
  }
  
  if (onUserStatus) {
    socket.on('user_status', onUserStatus);
  }

  // Return cleanup function
  return () => {
    if (socket) {
      if (onNewMessage) socket.off('new_message', onNewMessage);
      if (onMessageSent) socket.off('message_sent', onMessageSent);
      if (onMessageRead) socket.off('message_read', onMessageRead);
      if (onUserTyping) socket.off('user_typing', onUserTyping);
      if (onUserStatus) socket.off('user_status', onUserStatus);
    }
  };
};

// Send message
export const sendMessage = (receiverId: string, message: string): void => {
  if (socket) {
    socket.emit('private_message', { receiverId, message });
  }
};

// Mark message as read
export const markMessageAsRead = (messageId: string): void => {
  if (socket) {
    socket.emit('mark_read', { messageId });
  }
};

// Typing indicator
export const sendTypingStatus = (receiverId: string, isTyping: boolean): void => {
  if (socket) {
    socket.emit('typing', { receiverId, isTyping });
  }
};
