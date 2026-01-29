const { TravelGuide } = require('../models');
const { User } = require('../models');
const { Op } = require('sequelize');

// Get all travel guides
exports.getAllTravelGuides = async (req, res) => {
  try {
    const { category, search } = req.query;
    
    let whereClause = {};
    
    if (category) {
      whereClause.category = category;
    }
    
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } },
        { summary: { [Op.like]: `%${search}%` } }
      ];
    }
    
    const guides = await TravelGuide.findAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'name', 'email']
      }],
      order: [['createdAt', 'DESC']]
    });
    
    res.json(guides);
  } catch (error) {
    console.error('Error fetching travel guides:', error);
    res.status(500).json({ message: 'Error fetching travel guides', error: error.message });
  }
};

// Get a single travel guide
exports.getTravelGuideById = async (req, res) => {
  try {
    const guide = await TravelGuide.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'name', 'email']
      }]
    });
    
    if (!guide) {
      return res.status(404).json({ message: 'Travel guide not found' });
    }
    
    // Increment view count
    await guide.increment('viewCount');
    
    res.json(guide);
  } catch (error) {
    console.error('Error fetching travel guide:', error);
    res.status(500).json({ message: 'Error fetching travel guide', error: error.message });
  }
};

// Create a new travel guide
exports.createTravelGuide = async (req, res) => {
  try {
    const {
      title,
      category,
      content,
      summary,
      tags
    } = req.body;
    
    // Get image path if uploaded
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    
    const newGuide = await TravelGuide.create({
      title,
      category,
      content,
      summary,
      tags: tags || [],
      image,
      userId: req.user.id
    });
    
    const guideWithAuthor = await TravelGuide.findByPk(newGuide.id, {
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'name', 'email']
      }]
    });
    
    res.status(201).json(guideWithAuthor);
  } catch (error) {
    console.error('Error creating travel guide:', error);
    res.status(500).json({ message: 'Error creating travel guide', error: error.message });
  }
};

// Update a travel guide
exports.updateTravelGuide = async (req, res) => {
  try {
    const guide = await TravelGuide.findByPk(req.params.id);
    
    if (!guide) {
      return res.status(404).json({ message: 'Travel guide not found' });
    }
    
    // Check if user owns the guide or is admin
    if (guide.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this guide' });
    }
    
    const {
      title,
      category,
      content,
      summary,
      tags
    } = req.body;
    
    // Get image path if uploaded
    const image = req.file ? `/uploads/${req.file.filename}` : guide.image;
    
    await guide.update({
      title,
      category,
      content,
      summary,
      tags: tags || guide.tags,
      image
    });
    
    const updatedGuide = await TravelGuide.findByPk(guide.id, {
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'name', 'email']
      }]
    });
    
    res.json(updatedGuide);
  } catch (error) {
    console.error('Error updating travel guide:', error);
    res.status(500).json({ message: 'Error updating travel guide', error: error.message });
  }
};

// Delete a travel guide
exports.deleteTravelGuide = async (req, res) => {
  try {
    const guide = await TravelGuide.findByPk(req.params.id);
    
    if (!guide) {
      return res.status(404).json({ message: 'Travel guide not found' });
    }
    
    // Check if user owns the guide or is admin
    if (guide.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this guide' });
    }
    
    await guide.destroy();
    res.json({ message: 'Travel guide deleted successfully' });
  } catch (error) {
    console.error('Error deleting travel guide:', error);
    res.status(500).json({ message: 'Error deleting travel guide', error: error.message });
  }
};

// Mark guide as helpful
exports.markHelpful = async (req, res) => {
  try {
    const guide = await TravelGuide.findByPk(req.params.id);
    
    if (!guide) {
      return res.status(404).json({ message: 'Travel guide not found' });
    }
    
    await guide.increment('helpfulCount');
    
    res.json(guide);
  } catch (error) {
    console.error('Error marking guide as helpful:', error);
    res.status(500).json({ message: 'Error marking guide as helpful', error: error.message });
  }
};
