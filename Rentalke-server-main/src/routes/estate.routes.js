const express = require('express');
const router = express.Router();
const estateController = require('../controllers/estate.controller');
const upload = require('../middleware/upload');
const { authenticate } = require('../middleware/auth');

// Routes that require authentication
router.use(authenticate);

// Create estate with image upload
router.post('/', upload.single('image'), estateController.createEstate);

// Update estate with image upload
router.put('/:id', upload.single('image'), estateController.updateEstate);

// Other estate routes
router.get('/', estateController.getAllEstates);
router.get('/manager', estateController.getManagerEstates);
router.get('/:id', estateController.getEstateById);
router.get('/manager/:id', estateController.getManagerEstateById);
router.delete('/:id', estateController.deleteEstate);

module.exports = router;
