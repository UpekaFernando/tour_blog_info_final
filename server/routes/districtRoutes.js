const express = require('express');
const { 
  createDistrict, 
  getDistricts, 
  getDistrictById, 
  updateDistrict, 
  deleteDistrict 
} = require('../controllers/districtController');
const { protect, admin } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

const router = express.Router();

// Routes
router.post('/', protect, admin, upload.single('image'), createDistrict);
router.get('/', getDistricts);
router.get('/:id', getDistrictById);
router.put('/:id', protect, admin, upload.single('image'), updateDistrict);
router.delete('/:id', protect, admin, deleteDistrict);

module.exports = router;
