
const { PrismaClient } = require('@prisma/client');
const { sendEmailNotification } = require('../utils/email');
const prisma = new PrismaClient();

// Send email notification
exports.sendEmail = async (req, res) => {
  try {
    const { templateId, recipients, variables } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!templateId || !recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Template ID and recipients array are required'
      });
    }

    // Get the template
    const template = await prisma.emailTemplate.findUnique({
      where: { id: templateId }
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Email template not found'
      });
    }

    // Process email for each recipient
    const notificationPromises = [];
    const emailPromises = [];

    for (const recipient of recipients) {
      // Create notification record
      const notification = prisma.emailNotification.create({
        data: {
          userId,
          templateId,
          recipient,
          variables: variables || {},
          status: 'pending'
        }
      });
      
      notificationPromises.push(notification);
      
      // Process template with variables
      let processedHtml = template.htmlContent;
      let processedSubject = template.subject;
      
      if (variables) {
        // Replace variables in subject and content
        Object.keys(variables).forEach(key => {
          const regex = new RegExp(`{{${key}}}`, 'g');
          processedSubject = processedSubject.replace(regex, variables[key]);
          processedHtml = processedHtml.replace(regex, variables[key]);
        });
      }
      
      // Queue email sending
      emailPromises.push({
        to: recipient,
        subject: processedSubject,
        html: processedHtml
      });
    }

    // Create all notification records
    const createdNotifications = await Promise.all(notificationPromises);
    
    // Send emails
    for (let i = 0; i < emailPromises.length; i++) {
      const emailData = emailPromises[i];
      try {
        await sendEmailNotification(emailData);
        
        // Update notification status to sent
        await prisma.emailNotification.update({
          where: { id: createdNotifications[i].id },
          data: { 
            status: 'sent',
            sentAt: new Date()
          }
        });
      } catch (error) {
        // Update notification with error
        await prisma.emailNotification.update({
          where: { id: createdNotifications[i].id },
          data: { 
            status: 'failed',
            errorMessage: error.message
          }
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `Email notifications queued for ${recipients.length} recipients`,
      data: createdNotifications
    });
  } catch (error) {
    console.error('Send email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email notifications',
      error: error.message
    });
  }
};

// Create system notification
exports.createNotification = async (req, res) => {
  try {
    const { userId, message } = req.body;

    // Validate required fields
    if (!userId || !message) {
      return res.status(400).json({
        success: false,
        message: 'User ID and message are required'
      });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Create notification
    const notification = await prisma.notification.create({
      data: {
        userId,
        message
      }
    });

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: notification
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create notification',
      error: error.message
    });
  }
};

// Get notifications for a user
exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    const totalCount = await prisma.notification.count({
      where: { userId }
    });

    res.status(200).json({
      success: true,
      count: notifications.length,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      data: notifications
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve notifications',
      error: error.message
    });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find notification and check ownership
    const notification = await prisma.notification.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found or not owned by user'
      });
    }

    // Update notification
    const updatedNotification = await prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: updatedNotification
    });
  } catch (error) {
    console.error('Mark notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
      error: error.message
    });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    // Update all unread notifications for the user
    await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false
      },
      data: { isRead: true }
    });

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Mark all notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read',
      error: error.message
    });
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find notification and check ownership
    const notification = await prisma.notification.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found or not owned by user'
      });
    }

    // Delete notification
    await prisma.notification.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification',
      error: error.message
    });
  }
};
