const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Destination = sequelize.define('Destination', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  images: {
    type: DataTypes.JSON, // Array of image URLs
    allowNull: false,
    defaultValue: []
  },
  location: {
    type: DataTypes.JSON, // Contains lat and lng
    allowNull: false,
    defaultValue: {}
  },
  bestTimeToVisit: {
    type: DataTypes.STRING,
    allowNull: false
  },
  travelTips: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = Destination;
