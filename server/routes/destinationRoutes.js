const express = require('express');
const { 
  createDestination, 
  getDestinations, 
  getDestinationById, 
  updateDestination, 
  deleteDestination,
  removeDestinationImage 
} = require('../controllers/destinationController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

const router = express.Router();

// Error handler for multer file upload errors
const handleMulterError = (err, req, res, next) => {
  if (err instanceof Error && err.message.includes('Images only!')) {
    return res.status(400).json({ 
      message: 'File upload error: Only image files (JPEG, JPG, PNG, GIF) are allowed',
      details: err.message 
    });
  }
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ 
      message: 'File too large. Maximum file size is 5MB' 
    });
  }
  next(err);
};

// Routes
router.post('/', protect, upload.array('images', 10), handleMulterError, createDestination);
router.get('/', getDestinations);
router.get('/:id', getDestinationById);
router.put('/:id', protect, upload.array('images', 10), handleMulterError, updateDestination);
router.delete('/:id', protect, deleteDestination);
router.delete('/:id/images/:imageIndex', protect, removeDestinationImage);

module.exports = router;
