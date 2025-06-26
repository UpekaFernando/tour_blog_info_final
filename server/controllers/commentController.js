const { Comment, User, Destination } = require('../models');

// @desc    Create a new comment
// @route   POST /api/comments
// @access  Private
const createComment = async (req, res) => {
  try {
    const { content, destinationId } = req.body;
    
    // Check if destination exists
    const destination = await Destination.findByPk(destinationId);
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    
    const comment = await Comment.create({
      content,
      destinationId,
      userId: req.user.id
    });
    
    const commentWithUser = await Comment.findByPk(comment.id, {
      include: {
        model: User,
        attributes: ['id', 'name', 'profilePicture']
      }
    });
    
    res.status(201).json(commentWithUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get comments by destination
// @route   GET /api/comments/destination/:id
// @access  Public
const getCommentsByDestination = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if destination exists
    const destination = await Destination.findByPk(id);
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    
    const comments = await Comment.findAll({
      where: { destinationId: id },
      include: {
        model: User,
        attributes: ['id', 'name', 'profilePicture']
      },
      order: [['createdAt', 'DESC']]
    });
    
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a comment
// @route   PUT /api/comments/:id
// @access  Private
const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    
    const comment = await Comment.findByPk(id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if user owns the comment
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    comment.content = content;
    await comment.save();
    
    const updatedComment = await Comment.findByPk(id, {
      include: {
        model: User,
        attributes: ['id', 'name', 'profilePicture']
      }
    });
    
    res.json(updatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    
    const comment = await Comment.findByPk(id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if user owns the comment or is an admin
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await comment.destroy();
    
    res.json({ message: 'Comment removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createComment,
  getCommentsByDestination,
  updateComment,
  deleteComment
};
