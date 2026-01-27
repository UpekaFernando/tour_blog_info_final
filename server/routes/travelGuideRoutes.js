const express = require('express');
const router = express.Router();
const travelGuideController = require('../controllers/travelGuideController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', travelGuideController.getAllTravelGuides);
router.get('/:id', travelGuideController.getTravelGuideById);

// Protected routes (require authentication)
router.post('/', protect, upload.single('image'), travelGuideController.createTravelGuide);
router.put('/:id', protect, upload.single('image'), travelGuideController.updateTravelGuide);
router.delete('/:id', protect, travelGuideController.deleteTravelGuide);
router.post('/:id/helpful', protect, travelGuideController.markHelpful);

module.exports = router;
