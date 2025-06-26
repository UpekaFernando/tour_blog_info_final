const District = require('../models/District');

// @desc    Create a new district
// @route   POST /api/districts
// @access  Private/Admin
const createDistrict = async (req, res) => {
  try {
    const { name, description, mapCoordinates, province } = req.body;
      // Check if district already exists
    const districtExists = await District.findOne({ where: { name } });
    if (districtExists) {
      return res.status(400).json({ message: 'District already exists' });
    }

    let imageUrl = '';
    if (req.file) {
      imageUrl = `/${req.file.path}`;
    }

    const district = await District.create({
      name,
      description,
      mapCoordinates,
      imageUrl,
      province
    });

    if (district) {
      res.status(201).json(district);
    } else {
      res.status(400).json({ message: 'Invalid district data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all districts
// @route   GET /api/districts
// @access  Public
const getDistricts = async (req, res) => {
  try {
    const districts = await District.findAll();
    res.json(districts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a district by ID
// @route   GET /api/districts/:id
// @access  Public
const getDistrictById = async (req, res) => {
  try {
    const district = await District.findByPk(req.params.id);
    
    if (district) {
      res.json(district);
    } else {
      res.status(404).json({ message: 'District not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a district
// @route   PUT /api/districts/:id
// @access  Private/Admin
const updateDistrict = async (req, res) => {
  try {
    const { name, description, mapCoordinates, province } = req.body;
    
    const district = await District.findByPk(req.params.id);
    
    if (district) {
      district.name = name || district.name;
      district.description = description || district.description;
      district.mapCoordinates = mapCoordinates || district.mapCoordinates;
      district.province = province || district.province;
      
      if (req.file) {
        district.imageUrl = `/${req.file.path}`;
      }

      const updatedDistrict = await district.save();
      res.json(updatedDistrict);
    } else {
      res.status(404).json({ message: 'District not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a district
// @route   DELETE /api/districts/:id
// @access  Private/Admin
const deleteDistrict = async (req, res) => {
  try {
    const district = await District.findByPk(req.params.id);
    
    if (district) {
      await district.destroy();
      res.json({ message: 'District removed' });
    } else {
      res.status(404).json({ message: 'District not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createDistrict,
  getDistricts,
  getDistrictById,
  updateDistrict,
  deleteDistrict,
};
