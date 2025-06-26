const { Rating, User, Destination } = require('../models');
const { sequelize } = require('../config/database');

// @desc    Rate a destination
// @route   POST /api/ratings
// @access  Private
const rateDestination = async (req, res) => {
  try {
    const { value, destinationId } = req.body;
    
    // Check if destination exists
    const destination = await Destination.findByPk(destinationId);
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    
    // Check if user has already rated this destination
    const existingRating = await Rating.findOne({
      where: {
        destinationId,
        userId: req.user.id
      }
    });
    
    if (existingRating) {
      // Update existing rating
      existingRating.value = value;
      await existingRating.save();
      
      return res.json(existingRating);
    }
    
    // Create new rating
    const rating = await Rating.create({
      value,
      destinationId,
      userId: req.user.id
    });
    
    res.status(201).json(rating);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get ratings for a destination
// @route   GET /api/ratings/destination/:id
// @access  Public
const getDestinationRatings = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if destination exists
    const destination = await Destination.findByPk(id);
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    
    // Get all ratings for the destination
    const ratings = await Rating.findAll({
      where: { destinationId: id },
      include: {
        model: User,
        attributes: ['id', 'name', 'profilePicture']
      }
    });
    
    // Calculate average rating
    const avgRating = await Rating.findOne({
      attributes: [
        [sequelize.fn('AVG', sequelize.col('value')), 'avgRating'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalRatings']
      ],
      where: { destinationId: id },
      raw: true
    });
    
    res.json({
      ratings,
      stats: {
        average: parseFloat(avgRating.avgRating || 0).toFixed(1),
        total: parseInt(avgRating.totalRatings || 0)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a rating
// @route   PUT /api/ratings/:id
// @access  Private
const updateRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { value } = req.body;
    
    const rating = await Rating.findByPk(id);
    
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }
    
    // Check if user owns the rating
    if (rating.userId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    rating.value = value;
    await rating.save();
    
    res.json(rating);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a rating
// @route   DELETE /api/ratings/:id
// @access  Private
const deleteRating = async (req, res) => {
  try {
    const { id } = req.params;
    
    const rating = await Rating.findByPk(id);
    
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }
    
    // Check if user owns the rating or is an admin
    if (rating.userId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await rating.destroy();
    
    res.json({ message: 'Rating removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  rateDestination,
  getDestinationRatings,
  updateRating,
  deleteRating
};
