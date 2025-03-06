
const express = require('express');
const multer = require('multer');
const path = require('path');
const { authenticate } = require('../middlewares/auth.middleware');
const userProfileController = require('../controllers/user.profile.controller');
const router = express.Router();

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${path.basename(file.originalname)}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Profile routes
router.get('/', authenticate, userProfileController.getProfile);
router.patch('/', authenticate, userProfileController.updateProfile);
router.post('/upload-image', authenticate, upload.single('image'), userProfileController.uploadProfileImage);

module.exports = router;
