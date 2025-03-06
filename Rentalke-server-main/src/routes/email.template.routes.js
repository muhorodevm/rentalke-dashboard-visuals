
const express = require('express');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const emailTemplateController = require('../controllers/email.template.controller');
const router = express.Router();

// Email template routes (Admin only)
router.post('/', authenticate, authorize('ADMIN'), emailTemplateController.createTemplate);
router.get('/', authenticate, authorize('ADMIN'), emailTemplateController.getAllTemplates);
router.get('/:id', authenticate, authorize('ADMIN'), emailTemplateController.getTemplateById);
router.put('/:id', authenticate, authorize('ADMIN'), emailTemplateController.updateTemplate);
router.delete('/:id', authenticate, authorize('ADMIN'), emailTemplateController.deleteTemplate);

module.exports = router;
