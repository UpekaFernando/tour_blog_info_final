const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  createComment, 
  getCommentsByDestination, 
  updateComment, 
  deleteComment 
} = require('../controllers/commentController');

// POST /api/comments
router.post('/', protect, createComment);

// GET /api/comments/destination/:id
router.get('/destination/:id', getCommentsByDestination);

// PUT /api/comments/:id
router.put('/:id', protect, updateComment);

// DELETE /api/comments/:id
router.delete('/:id', protect, deleteComment);

module.exports = router;
