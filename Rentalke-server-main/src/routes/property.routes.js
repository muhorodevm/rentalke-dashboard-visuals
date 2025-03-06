const express = require('express');
// const { validate } = require('../middlewares/validate.middleware');
// const { estateSchema, buildingSchema, rentalUnitSchema } = require('../validators/property.validator');
const estateController = require('../controllers/estate.controller');
const buildingController = require('../controllers/building.controller');
const unitController = require('../controllers/unit.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const upload = require('../middleware/upload');
const { uploadToCloudinary } = require('../utils/cloudinary');

const router = express.Router();

// Image upload route
router.post('/upload-images', authenticate, upload.array('images'), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No images uploaded'
            });
        }

        const uploadPromises = req.files.map(file => uploadToCloudinary(file));
        const uploadedUrls = await Promise.all(uploadPromises);

        res.json({
            success:true,
            message: 'success',
            urls: uploadedUrls
        });
    } catch (error) {
        console.error('Image upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload images',
            error: error.message
        });
    }
});

// Estate routes
router.post('/manager/estate', authenticate,  estateController.createEstate);
router.get('/manager/estates', authenticate, estateController.getManagerEstates);
router.get('/manager/estate/:id', authenticate, estateController.getManagerEstateById);
router.get('/estates/all', estateController.getAllEstates);
router.get('/estates/:id', estateController.getEstateById);
router.put('/manager/estate/:id', authenticate,estateController.updateEstate);
router.delete('/manager/estate/:id', authenticate, estateController.deleteEstate);

// Building routes
router.post('/manager/building', authenticate,  buildingController.createBuilding);
router.get('/manager/buildings', authenticate, buildingController.getManagerBuildings);
router.get('/manager/building/:id', authenticate, buildingController.getManagerBuildingById);
router.get('/buildings/all', buildingController.getAllBuildings);
router.get('/buildings/:id', buildingController.getBuildingById);
router.put('/manager/building/:id', authenticate,  buildingController.updateBuilding);
router.delete('/manager/building/:id', authenticate, buildingController.deleteBuilding);

// Rental Unit routes
router.post('/manager/rental-unit', authenticate,  unitController.createRentalUnit);
router.post('/manager/multiple-rental-units', authenticate, unitController.createMultipleRentalUnits);
router.get('/manager/rental-units', authenticate, unitController.getManagerRentalUnits);
router.get('/manager/rental-unit/:id', authenticate, unitController.getManagerRentalUnitById);
router.get('/rental-units/all', unitController.getAllRentalUnits);
router.get('/rental-units/:id', unitController.getRentalUnitById);
router.put('/manager/rental-unit/:id', authenticate,  unitController.updateRentalUnit);
router.delete('/manager/rental-unit/:id', authenticate, unitController.deleteRentalUnit);

module.exports = router;
