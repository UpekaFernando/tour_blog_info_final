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

// Routes
router.post('/', protect, upload.array('images', 10), createDestination);
router.get('/', getDestinations);
router.get('/:id', getDestinationById);
router.put('/:id', protect, upload.array('images', 10), updateDestination);
router.delete('/:id', protect, deleteDestination);
router.delete('/:id/images/:imageIndex', protect, removeDestinationImage);

module.exports = router;
