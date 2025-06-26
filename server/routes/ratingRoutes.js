const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  rateDestination, 
  getDestinationRatings, 
  updateRating, 
  deleteRating 
} = require('../controllers/ratingController');

// POST /api/ratings
router.post('/', protect, rateDestination);

// GET /api/ratings/destination/:id
router.get('/destination/:id', getDestinationRatings);

// PUT /api/ratings/:id
router.put('/:id', protect, updateRating);

// DELETE /api/ratings/:id
router.delete('/:id', protect, deleteRating);

module.exports = router;
