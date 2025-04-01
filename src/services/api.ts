
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://rentalke-server-2.onrender.com/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout to prevent hanging requests
  timeout: 15000,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors or timeouts gracefully
    if (error.code === 'ECONNABORTED' || !error.response) {
      console.error('Network error or timeout:', error.message);
      return Promise.reject(new Error('Network error. Please check your connection and try again.'));
    }
    return Promise.reject(error);
  }
);

// Profile API
export const profileApi = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data: any) => api.patch('/profile', data),
  uploadProfileImage: (formData: FormData) => 
    api.post('/profile/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
};

// Messages API
export const messagesApi = {
  getAllConversations: () => api.get('/messages/conversations'),
  getConversation: (userId: string, page = 1, limit = 20) => 
    api.get(`/messages/conversations/${userId}?page=${page}&limit=${limit}`),
  sendMessage: (receiverId: string, message: string) => 
    api.post('/messages', { receiverId, message }),
  deleteMessage: (messageId: string) => api.delete(`/messages/${messageId}`),
};

// Notifications API
export const notificationsApi = {
  getNotifications: (page = 1, limit = 10) => 
    api.get(`/notifications?page=${page}&limit=${limit}`),
  markAsRead: (notificationId: string) => 
    api.patch(`/notifications/${notificationId}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
  deleteNotification: (notificationId: string) => 
    api.delete(`/notifications/${notificationId}`),
};

// Admin User Management API
export const adminApi = {
  getAllUsers: (page = 1, limit = 10, search = '', role = '') => 
    api.get(`/admin/users?page=${page}&limit=${limit}&search=${search}&role=${role}`),
  getUserById: (userId: string) => api.get(`/admin/users/${userId}`),
  updateUserRole: (userId: string, data: { role?: string, department?: string, position?: string }) => 
    api.patch(`/admin/users/${userId}/role`, data),
  deleteUser: (userId: string) => api.delete(`/admin/users/${userId}`),
};

// Email Templates API
export const emailTemplatesApi = {
  getAllTemplates: () => api.get('/email-templates'),
  getTemplateById: (templateId: string) => api.get(`/email-templates/${templateId}`),
  createTemplate: (data: any) => api.post('/email-templates', data),
  updateTemplate: (templateId: string, data: any) => api.put(`/email-templates/${templateId}`, data),
  deleteTemplate: (templateId: string) => api.delete(`/email-templates/${templateId}`),
  sendEmailNotification: (data: { templateId: string, recipients: string[], variables?: any }) => 
    api.post('/notifications/email', data),
};

export default api;
