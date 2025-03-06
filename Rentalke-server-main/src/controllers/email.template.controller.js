
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create new email template
exports.createTemplate = async (req, res) => {
  try {
    const { name, subject, htmlContent, variables, description } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!name || !subject || !htmlContent) {
      return res.status(400).json({
        success: false,
        message: 'Name, subject, and HTML content are required'
      });
    }

    // Check if template with same name already exists
    const existingTemplate = await prisma.emailTemplate.findUnique({
      where: { name }
    });

    if (existingTemplate) {
      return res.status(400).json({
        success: false,
        message: 'Template with this name already exists'
      });
    }

    // Create template
    const template = await prisma.emailTemplate.create({
      data: {
        name,
        subject,
        htmlContent,
        variables: variables || [],
        description,
        createdById: userId
      }
    });

    res.status(201).json({
      success: true,
      message: 'Email template created successfully',
      data: template
    });
  } catch (error) {
    console.error('Create template error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create email template',
      error: error.message
    });
  }
};

// Get all email templates
exports.getAllTemplates = async (req, res) => {
  try {
    const templates = await prisma.emailTemplate.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      count: templates.length,
      data: templates
    });
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve email templates',
      error: error.message
    });
  }
};

// Get template by ID
exports.getTemplateById = async (req, res) => {
  try {
    const { id } = req.params;

    const template = await prisma.emailTemplate.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Email template not found'
      });
    }

    res.status(200).json({
      success: true,
      data: template
    });
  } catch (error) {
    console.error('Get template error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve email template',
      error: error.message
    });
  }
};

// Update template
exports.updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, subject, htmlContent, variables, description } = req.body;

    // Check if template exists
    const existingTemplate = await prisma.emailTemplate.findUnique({
      where: { id }
    });

    if (!existingTemplate) {
      return res.status(404).json({
        success: false,
        message: 'Email template not found'
      });
    }

    // If name is changed, check if new name already exists
    if (name && name !== existingTemplate.name) {
      const templateWithSameName = await prisma.emailTemplate.findUnique({
        where: { name }
      });

      if (templateWithSameName) {
        return res.status(400).json({
          success: false,
          message: 'Template with this name already exists'
        });
      }
    }

    // Update template
    const updatedTemplate = await prisma.emailTemplate.update({
      where: { id },
      data: {
        name: name || existingTemplate.name,
        subject: subject || existingTemplate.subject,
        htmlContent: htmlContent || existingTemplate.htmlContent,
        variables: variables || existingTemplate.variables,
        description: description || existingTemplate.description
      }
    });

    res.status(200).json({
      success: true,
      message: 'Email template updated successfully',
      data: updatedTemplate
    });
  } catch (error) {
    console.error('Update template error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update email template',
      error: error.message
    });
  }
};

// Delete template
exports.deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if template exists
    const existingTemplate = await prisma.emailTemplate.findUnique({
      where: { id }
    });

    if (!existingTemplate) {
      return res.status(404).json({
        success: false,
        message: 'Email template not found'
      });
    }

    // Check if template is used in any notifications
    const notificationsUsingTemplate = await prisma.emailNotification.findFirst({
      where: { templateId: id }
    });

    if (notificationsUsingTemplate) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete template as it is used in notifications'
      });
    }

    // Delete template
    await prisma.emailTemplate.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: 'Email template deleted successfully'
    });
  } catch (error) {
    console.error('Delete template error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete email template',
      error: error.message
    });
  }
};
