const express = require('express');
const router = express.Router();
const localServiceController = require('../controllers/localServiceController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', localServiceController.getAllLocalServices);
router.get('/:id', localServiceController.getLocalServiceById);

// Protected routes (require authentication)
router.post('/', protect, upload.single('image'), localServiceController.createLocalService);
router.put('/:id', protect, upload.single('image'), localServiceController.updateLocalService);
router.delete('/:id', protect, localServiceController.deleteLocalService);
router.post('/:id/rate', protect, localServiceController.rateLocalService);

module.exports = router;

