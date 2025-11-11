const { Destination, District, User } = require('../models');

// @desc    Create a new destination
// @route   POST /api/destinations
// @access  Private
const createDestination = async (req, res) => {
  try {
    console.log('=== Creating Destination ===');
    console.log('User:', req.user ? req.user.id : 'No user');
    console.log('Body:', req.body);
    console.log('Files:', req.files ? req.files.length : 'No files');
    
    const { title, description, districtId, location, bestTimeToVisit, travelTips } = req.body;

    // Validate required fields
    if (!title || !description || !districtId || !bestTimeToVisit || !travelTips) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        received: { title, description, districtId, bestTimeToVisit, travelTips }
      });
    }

    // Parse location if it's a JSON string
    let parsedLocation = location;
    if (typeof location === 'string') {
      try {
        parsedLocation = JSON.parse(location);
      } catch (err) {
        return res.status(400).json({ message: 'Invalid location format' });
      }
    }

    let images = [];
    if (req.files) {
      images = req.files.map(file => `/uploads/${file.filename}`);
    }

    console.log('Creating destination with:', {
      title,
      description,
      districtId,
      images,
      location: parsedLocation,
      authorId: req.user.id,
      bestTimeToVisit,
      travelTips
    });

    const destination = await Destination.create({
      title,
      description,
      districtId,
      images,
      location: parsedLocation,
      authorId: req.user.id,
      bestTimeToVisit,      travelTips
    });

    console.log('Destination created successfully:', destination.id);

    if (destination) {      // Get destination with district and author details
      const populatedDestination = await Destination.findByPk(destination.id, {
        include: [
          { model: District, attributes: ['name', 'province'] },
          { model: User, as: 'author', attributes: ['name'] }
        ]
      });

      console.log('Returning populated destination:', populatedDestination);
      res.status(201).json(populatedDestination);
    } else {
      res.status(400).json({ message: 'Invalid destination data' });
    }
  } catch (error) {
    console.error('Error creating destination:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all destinations
// @route   GET /api/destinations
// @access  Public
const getDestinations = async (req, res) => {
  try {
    const { district } = req.query;
    
    let whereClause = {};
    if (district) {
      whereClause.districtId = district;
    }
      const destinations = await Destination.findAll({
      where: whereClause,
      include: [
        { model: District, attributes: ['name', 'province'] },
        { model: User, as: 'author', attributes: ['name'] }
      ]
    });
    
    res.json(destinations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a destination by ID
// @route   GET /api/destinations/:id
// @access  Public
const getDestinationById = async (req, res) => {
  try {    const destination = await Destination.findByPk(req.params.id, {
      include: [
        { model: District, attributes: ['name', 'province'] },
        { model: User, as: 'author', attributes: ['name'] }
      ]
    });
    
    if (destination) {
      res.json(destination);
    } else {
      res.status(404).json({ message: 'Destination not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a destination
// @route   PUT /api/destinations/:id
// @access  Private
const updateDestination = async (req, res) => {
  try {
    console.log('=== UPDATE DESTINATION REQUEST ===');
    console.log('Request body:', req.body);
    console.log('Uploaded files:', req.files);
    console.log('Number of files:', req.files ? req.files.length : 0);
    
    const { title, description, districtId, location, bestTimeToVisit, travelTips, existingImages } = req.body;
    
    const destination = await Destination.findByPk(req.params.id, {
      include: [
        { model: District, attributes: ['name', 'province'] },
        { model: User, as: 'author', attributes: ['name'] }
      ]
    });
    
    // Check if destination exists
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    
    // Make sure user is the destination author or an admin
    if (destination.authorId !== req.user.id && !req.user.isAdmin) {
      return res.status(401).json({ message: 'Not authorized to update this destination' });
    }

    // Parse location if it's a JSON string
    let parsedLocation = location;
    if (typeof location === 'string') {
      try {
        parsedLocation = JSON.parse(location);
      } catch (err) {
        parsedLocation = destination.location;
      }
    }

    // Handle images - start with existing images that weren't removed
    let images = [];
    if (existingImages) {
      try {
        images = typeof existingImages === 'string' ? JSON.parse(existingImages) : existingImages;
      } catch (err) {
        images = destination.images || [];
      }
    } else {
      images = destination.images || [];
    }

    // Add new images if any
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      images = [...images, ...newImages];
      console.log('New images uploaded:', newImages);
    }

    console.log('Updating destination with images:', images);
    console.log('req.files:', req.files);
    console.log('existingImages from request:', existingImages);

    // Update destination
    await destination.update({
      title: title || destination.title,
      description: description || destination.description,
      districtId: districtId || destination.districtId,
      location: parsedLocation || destination.location,
      bestTimeToVisit: bestTimeToVisit || destination.bestTimeToVisit,
      travelTips: travelTips || destination.travelTips,
      images: images
    });
    
    // Get updated destination with associations
    const updatedDestination = await Destination.findByPk(destination.id, {
      include: [
        { model: District, attributes: ['name', 'province'] },
        { model: User, as: 'author', attributes: ['name'] }
      ]
    });
    
    console.log('Destination updated successfully');
    res.json(updatedDestination);
  } catch (error) {
    console.error('Error updating destination:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a destination
// @route   DELETE /api/destinations/:id
// @access  Private
const deleteDestination = async (req, res) => {
  try {
    const destination = await Destination.findByPk(req.params.id);
    
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    
    // Make sure user is the destination author or an admin
    if (destination.authorId !== req.user.id && !req.user.isAdmin) {
      return res.status(401).json({ message: 'Not authorized to delete this destination' });
    }
    
    await destination.destroy();
    res.json({ message: 'Destination removed' });
  } catch (error) {
    console.error('Error deleting destination:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Remove an image from a destination
// @route   DELETE /api/destinations/:id/images/:imageIndex
// @access  Private
const removeDestinationImage = async (req, res) => {
  try {
    const { id, imageIndex } = req.params;
    const destination = await Destination.findByPk(id);
    
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    
    // Make sure user is the destination author or an admin
    if (destination.authorId !== req.user.id && !req.user.isAdmin) {
      return res.status(401).json({ message: 'Not authorized to update this destination' });
    }
    
    // Remove image at index
    if (destination.images && destination.images.length > imageIndex) {
      const updatedImages = [...destination.images];
      updatedImages.splice(imageIndex, 1);
      await destination.update({ images: updatedImages });
      res.json({ message: 'Image removed' });
    } else {
      res.status(400).json({ message: 'Image index out of bounds' });
    }
  } catch (error) {
    console.error('Error removing image:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createDestination,
  getDestinations,
  getDestinationById,
  updateDestination,
  deleteDestination,
  removeDestinationImage
};
