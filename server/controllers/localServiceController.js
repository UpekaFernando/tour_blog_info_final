const { LocalService } = require('../models');
const { User } = require('../models');
const { Op } = require('sequelize');

// Get all local services
exports.getAllLocalServices = async (req, res) => {
  try {
    const { category, district, search } = req.query;
    
    let whereClause = {};
    
    if (category) {
      whereClause.category = category;
    }
    
    if (district) {
      whereClause.district = district;
    }
    
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } }
      ];
    }
    
    const services = await LocalService.findAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }],
      order: [['createdAt', 'DESC']]
    });
    
    res.json(services);
  } catch (error) {
    console.error('Error fetching local services:', error);
    res.status(500).json({ message: 'Error fetching local services', error: error.message });
  }
};

// Get a single local service
exports.getLocalServiceById = async (req, res) => {
  try {
    const service = await LocalService.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }]
    });
    
    if (!service) {
      return res.status(404).json({ message: 'Local service not found' });
    }
    
    res.json(service);
  } catch (error) {
    console.error('Error fetching local service:', error);
    res.status(500).json({ message: 'Error fetching local service', error: error.message });
  }
};

// Create a new local service
exports.createLocalService = async (req, res) => {
  try {
    const {
      name,
      category,
      subcategory,
      description,
      location,
      district,
      address,
      phone,
      email,
      website,
      priceRange,
      openHours,
      features,
      specialties,
      amenities,
      services
    } = req.body;
    
    // Get image path if uploaded
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    
    const newService = await LocalService.create({
      name,
      category,
      subcategory,
      description,
      location,
      district,
      address,
      phone,
      email,
      website,
      priceRange,
      openHours,
      image,
      features: features || [],
      specialties: specialties || [],
      amenities: amenities || [],
      services: services || [],
      userId: req.user.id
    });
    
    const serviceWithUser = await LocalService.findByPk(newService.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }]
    });
    
    res.status(201).json(serviceWithUser);
  } catch (error) {
    console.error('Error creating local service:', error);
    res.status(500).json({ message: 'Error creating local service', error: error.message });
  }
};

// Update a local service
exports.updateLocalService = async (req, res) => {
  try {
    const service = await LocalService.findByPk(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Local service not found' });
    }
    
    // Check if user owns the service or is admin
    if (service.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this service' });
    }
    
    const {
      name,
      category,
      subcategory,
      description,
      location,
      district,
      address,
      phone,
      email,
      website,
      priceRange,
      openHours,
      features,
      specialties,
      amenities,
      services: servicesData
    } = req.body;
    
    // Get image path if uploaded
    const image = req.file ? `/uploads/${req.file.filename}` : service.image;
    
    await service.update({
      name,
      category,
      subcategory,
      description,
      location,
      district,
      address,
      phone,
      email,
      website,
      priceRange,
      openHours,
      image,
      features: features || service.features,
      specialties: specialties || service.specialties,
      amenities: amenities || service.amenities,
      services: servicesData || service.services
    });
    
    const updatedService = await LocalService.findByPk(service.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }]
    });
    
    res.json(updatedService);
  } catch (error) {
    console.error('Error updating local service:', error);
    res.status(500).json({ message: 'Error updating local service', error: error.message });
  }
};

// Delete a local service
exports.deleteLocalService = async (req, res) => {
  try {
    const service = await LocalService.findByPk(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Local service not found' });
    }
    
    // Check if user owns the service or is admin
    if (service.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this service' });
    }
    
    await service.destroy();
    res.json({ message: 'Local service deleted successfully' });
  } catch (error) {
    console.error('Error deleting local service:', error);
    res.status(500).json({ message: 'Error deleting local service', error: error.message });
  }
};

// Rate a local service
exports.rateLocalService = async (req, res) => {
  try {
    const { rating } = req.body;
    const service = await LocalService.findByPk(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Local service not found' });
    }
    
    if (rating < 0 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 0 and 5' });
    }
    
    // Update rating (in a real app, you'd track individual ratings)
    await service.update({ rating });
    
    res.json(service);
  } catch (error) {
    console.error('Error rating local service:', error);
    res.status(500).json({ message: 'Error rating local service', error: error.message });
  }
};
